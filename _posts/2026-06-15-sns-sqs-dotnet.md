---
lang: en
layout: post
title: "Publishing to SNS and Consuming from SQS in .NET"
date: 2026-06-15
categories: [coding]
tags: [aws, dotnet, sns, sqs, opentelemetry, csharp, messaging]
---

Previously I covered provisioning a [FIFO SNS/SQS fanout infrastructure on EKS with Terraform](/coding/2026/05/18/fifo-sns-sqs-eks-terraform/). In this post, I share how .NET applications can publish messages to SNS, and how to consume them from SQS.

## Raw message delivery

By default, when SNS delivers a message to an SQS queue, it wraps it in an SNS notification envelope — a JSON object where the original payload is embedded as a string in the `Message` field, and the SNS message attributes appear inside that envelope rather than as SQS message attributes.

To receive the payload directly as the message body the subscription must enable raw message delivery. Add `raw_message_delivery = true` to the Terraform subscription from the previous post:

```hcl
resource "aws_sns_topic_subscription" "fulfillment_order_placed" {
  topic_arn             = aws_sns_topic.order_placed.arn
  protocol              = "sqs"
  endpoint              = aws_sqs_queue.fulfillment_order_placed.arn
  raw_message_delivery  = true
  filter_policy_scope   = "MessageAttributes"
  filter_policy = jsonencode({
    channel = ["online", "app"]
  })
}
```

Everything in both examples below assumes raw message delivery is enabled.

## Publishing to SNS

### Packages

```
AWSSDK.SimpleNotificationService
Amazon.Extensions.NETCore.Setup
OpenTelemetry
OpenTelemetry.Instrumentation.AWS
```

### DI registration

`Amazon.Extensions.NETCore.Setup` provides two extension methods that wire up AWS clients with the built-in DI container:

```csharp
services.AddDefaultAWSOptions(configuration.GetAWSOptions());
services.AddAWSService<IAmazonSimpleNotificationService>();
```

`AddDefaultAWSOptions` reads the `AWS` section of the configuration (for region, profile, and credentials) and registers an `AWSOptions` singleton. `AddAWSService<T>` uses that singleton to construct the typed client and registers it as a singleton in the container — no `new AmazonSimpleNotificationServiceClient(...)` scattered around. When running on EKS with Pod Identity, credentials are resolved automatically from the instance metadata; only the region needs to be explicit:

```json
{
  "AWS": {
    "Region": "eu-west-1"
  },
  "Aws": {
    "Sns": {
      "OrderPlacedTopicArn": "arn:aws:sns:eu-west-1:123456789012:prod-order-placed-v1.fifo"
    }
  }
}
```

The options class:

```csharp
public class SnsOptions
{
    public const string ConfigurationSectionKey = "Aws:Sns";

    [Required] public required string OrderPlacedTopicArn { get; set; }
}
```

Wire them up together:

```csharp
services.AddOptions<SnsOptions>()
    .BindConfiguration(SnsOptions.ConfigurationSectionKey)
    .ValidateDataAnnotations()
    .ValidateOnStart();

services.AddDefaultAWSOptions(configuration.GetAWSOptions());
services.AddAWSService<IAmazonSimpleNotificationService>();
```

### The publisher

The handler receives a domain event and publishes it to SNS. Two things matter here:

- `MessageGroupId` — required by all FIFO topics. It determines ordering scope: messages with the same group ID are delivered in published order. Using the order ID as the group ID keeps per-order events ordered without blocking unrelated orders.
- The `channel` attribute — matched by the subscription filter policy. Messages that don't carry `channel = "online"` or `channel = "app"` are silently discarded at the SNS level.

```csharp
public class PublishOrderPlacedToSnsHandler(
    IAmazonSimpleNotificationService snsClient,
    IOptions<SnsOptions> snsOptions,
    ILogger<PublishOrderPlacedToSnsHandler> logger) : INotificationHandler<OrderPlacedEvent>
{
    private const string Source = "checkout-api";
    private readonly string _topicArn = snsOptions.Value.OrderPlacedTopicArn;

    public async Task Handle(OrderPlacedEvent notification, CancellationToken cancellationToken)
    {
        try
        {
            var message = new OrderPlaced
            {
                OrderId = notification.OrderId,
                CustomerId = notification.CustomerId,
                Items = notification.Items,
            };
            var serializedMessage = JsonSerializer.Serialize(message);

            var messageAttributes = new Dictionary<string, MessageAttributeValue>
            {
                ["source"]  = new() { DataType = "String", StringValue = Source },
                ["channel"] = new() { DataType = "String", StringValue = notification.Channel }
            };

            var request = new PublishRequest
            {
                TopicArn        = _topicArn,
                Message         = serializedMessage,
                MessageGroupId  = notification.OrderId,
                MessageAttributes = messageAttributes
            };

            var response = await snsClient.PublishAsync(request, cancellationToken);
            logger.LogInformation("Published OrderPlaced to SNS [messageId={MessageId}, orderId={OrderId}]",
                response.MessageId, notification.OrderId);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to publish OrderPlaced to SNS for order {OrderId}", notification.OrderId);
        }
    }
}
```

### Trace context injection

The `OpenTelemetry.Instrumentation.AWS` hooks into the AWS SDK pipeline and injects the current context into the outgoing SNS message attributes for you. All it takes is registering the instrumentation on the tracer provider:

```csharp
services.AddOpenTelemetry()
    .WithTracing(tracing => tracing
        .AddAWSInstrumentation()
        .AddSource(Instrumentation.ActivitySource.Name));
```

With that in place, every `PublishAsync` (and `SendMessageAsync`) call uses the global propagator to write the active context into the message attributes using whatever format is configured (W3C TraceContext by default — typically `traceparent` and `tracestate`). The outgoing SNS message ends up carrying attributes like:

```
traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
```

The context is added regardless of the sampling decision, so downstream services can make consistent decisions and you don't end up with broken traces. This is what lets the consumer reconstruct the trace and link its spans back to the publisher's trace, giving you an end-to-end trace across the service boundary.

## Consuming from SQS

### Packages

```
AWSSDK.SQS
Amazon.Extensions.NETCore.Setup
OpenTelemetry
OpenTelemetry.Instrumentation.AWS
```

### DI registration

Same pattern as the publisher, with `IAmazonSQS` instead:

```csharp
services.AddOptions<SqsOptions>()
    .Bind(configuration.GetSection(SqsOptions.ConfigSectionKey))
    .ValidateDataAnnotations()
    .ValidateOnStart();

services.AddDefaultAWSOptions(configuration.GetAWSOptions());
services.AddAWSService<IAmazonSQS>();
services.AddScoped<OrderPlacedMessageHandler>();
services.AddHostedService<SqsOrderPlacedBackgroundService>();
```

The configuration:

```json
{
  "AWS": {
    "Region": "eu-west-1"
  },
  "Aws": {
    "Sqs": {
      "OrderPlacedQueue": {
        "Url": "https://sqs.eu-west-1.amazonaws.com/123456789012/prod-fulfillment-order-placed-v1.fifo",
        "MaxNumberOfMessages": 5,
        "WaitTimeSeconds": 20,
        "BackoffDelaySeconds": 20
      }
    }
  }
}
```

The options classes:

```csharp
public sealed class SqsOptions
{
    public const string ConfigSectionKey = "Aws:Sqs";

    [Required]
    public required SqsQueueOptions OrderPlacedQueue { get; init; }
}

public sealed class SqsQueueOptions
{
    [Required]
    public required string Url { get; init; }

    [Required, Range(1, 10)]
    public required int MaxNumberOfMessages { get; init; }

    [Required, Range(0, 20)]
    public required int WaitTimeSeconds { get; init; }

    [Required, Range(0, int.MaxValue)]
    public required int BackoffDelaySeconds { get; init; }
}
```

### The background service

The receive loop runs as a `BackgroundService`. A few details worth noting:

- `MessageAttributeNames = ["All"]` — SQS does not return message attributes by default; without this, `message.MessageAttributes` is empty and the trace context is lost.
- The loop catches `OperationCanceledException` explicitly when the token is cancelled so it exits cleanly, letting other `IHostedService` instances and the application shut down gracefully.
- On any other exception, the loop backs off for a configurable delay before retrying — rather than spinning and hammering SQS on repeated failures.
- Messages are deleted only after successful processing. If `HandleAsync` returns `false` — or throws — the message stays in the queue and is redelivered up to `maxReceiveCount` times before landing in the DLQ.
- `IServiceScopeFactory` is used to create a per-message DI scope. `BackgroundService` is registered as a singleton, but the message handler may depend on scoped services (database connections, repositories). Creating a scope per message keeps lifetimes correct.

```csharp
public class SqsOrderPlacedBackgroundService(
    IAmazonSQS sqs,
    IOptions<SqsOptions> options,
    IServiceScopeFactory scopeFactory,
    ILogger<SqsOrderPlacedBackgroundService> logger) : BackgroundService
{
    private readonly SqsQueueOptions _queueOptions = options.Value.OrderPlacedQueue;
    private readonly TimeSpan _backoffDelay = TimeSpan.FromSeconds(options.Value.OrderPlacedQueue.BackoffDelaySeconds);

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                var response = await sqs.ReceiveMessageAsync(new ReceiveMessageRequest
                {
                    QueueUrl              = _queueOptions.Url,
                    MaxNumberOfMessages   = _queueOptions.MaxNumberOfMessages,
                    WaitTimeSeconds       = _queueOptions.WaitTimeSeconds,
                    MessageAttributeNames = ["All"]
                }, stoppingToken);

                foreach (var msg in response.Messages ?? [])
                {
                    if (stoppingToken.IsCancellationRequested) break;
                    await ProcessOneAsync(msg, stoppingToken);
                }
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                break;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "SQS receive loop failed; backing off for {TotalSeconds}s",
                    _backoffDelay.TotalSeconds);
                await Task.Delay(_backoffDelay, stoppingToken);
            }
        }
    }

    private async Task ProcessOneAsync(Message message, CancellationToken ct)
    {
        try
        {
            var propagationContext = ExtractPropagationContext(message.MessageAttributes);

            using var activity = Instrumentation.ActivitySource.StartActivity(
                "fulfillment-service.order-placed.receive",
                ActivityKind.Consumer,
                propagationContext.ActivityContext);

            using var scope = scopeFactory.CreateScope();
            var handler = scope.ServiceProvider.GetRequiredService<OrderPlacedMessageHandler>();

            var handled = await handler.HandleAsync(message, ct);
            if (handled)
            {
                await sqs.DeleteMessageAsync(new DeleteMessageRequest
                {
                    QueueUrl      = _queueOptions.Url,
                    ReceiptHandle = message.ReceiptHandle
                }, ct);
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error processing SQS message {MessageId}", message.MessageId);
        }
    }

    private static PropagationContext ExtractPropagationContext(
        Dictionary<string, MessageAttributeValue> messageAttributes)
    {
        return Propagators.DefaultTextMapPropagator.Extract(
            default,
            messageAttributes,
            static (carrier, key) =>
                carrier.TryGetValue(key, out var attribute) && attribute.StringValue is { } value
                    ? [value]
                    : []);
    }
}
```

### Trace context extraction

Unlike injection, extraction is *not* automatic. `OpenTelemetry.Instrumentation.AWS` creates client spans for the SDK calls (`ReceiveMessage`, `DeleteMessage`), but it does not read the upstream context out of the received messages or parent your processing span to it. That last step is on you: read the [propagation](https://opentelemetry.io/docs/specs/otel/context/api-propagators/) headers back and start the consumer activity with the extracted context.

### The message handler

The handler keeps business logic separate from the receive loop. It returns `true` to signal the message should be deleted — including on unrecoverable errors like a malformed payload, since retrying a message that will never deserialize only burns through the `maxReceiveCount` budget and delays sending it to the DLQ.

```csharp
public class OrderPlacedMessageHandler(
    IFulfillmentService fulfillmentService,
    ILogger<OrderPlacedMessageHandler> logger)
{
    public async Task<bool> HandleAsync(Message message, CancellationToken cancellationToken)
    {
        OrderPlaced? order;
        try
        {
            order = JsonSerializer.Deserialize<OrderPlaced>(message.Body);
        }
        catch (JsonException ex)
        {
            logger.LogError(ex, "Failed to deserialize SQS message {MessageId}", message.MessageId);
            return true;
        }

        if (order is null)
        {
            logger.LogError("SQS message {MessageId} body deserialized to null", message.MessageId);
            return true;
        }

        await fulfillmentService.ProcessOrderAsync(order, cancellationToken);
        return true;
    }
}
```

## Wrapping up

`Amazon.Extensions.NETCore.Setup` reduces AWS client setup to two lines per service and keeps credential and region configuration in one place. `OpenTelemetry.Instrumentation.AWS` connects traces across the SNS/SQS boundary with minimal code: injection on publish is fully automatic once the instrumentation is registered, and on the consumer side you only need to extract the context and pass it when starting the processing activity.

The infrastructure side (topic, queue, subscription, IAM) is covered in the [previous post](/coding/2026/05/18/fifo-sns-sqs-eks-terraform/).