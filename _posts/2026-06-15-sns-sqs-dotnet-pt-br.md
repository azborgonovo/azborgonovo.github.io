---
lang: pt-br
layout: post
title: "Publicando no SNS e Consumindo do SQS em .NET"
date: 2026-06-15
categories: [coding]
tags: [aws, dotnet, sns, sqs, opentelemetry, csharp, mensageria]
permalink: /coding/2026/06/15/sns-sqs-dotnet/
---

Anteriormente mostrei como provisionar uma [infraestrutura FIFO SNS/SQS fanout no EKS com Terraform](/coding/2026/05/18/fifo-sns-sqs-eks-terraform/). Neste post, explico como aplicações .NET podem publicar mensagens no SNS e consumi-las do SQS.

## Entrega de mensagem bruta

Por padrão, quando o SNS entrega uma mensagem a uma fila SQS, ela é envolvida em um envelope de notificação SNS — um objeto JSON onde o payload original está embutido como string no campo `Message`, e os atributos da mensagem SNS aparecem dentro desse envelope em vez de como atributos da mensagem SQS.

Para receber o payload diretamente como corpo da mensagem, a assinatura deve habilitar a entrega de mensagem bruta. Adicione `raw_message_delivery = true` à assinatura Terraform do post anterior:

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

Tudo nos dois exemplos abaixo assume que a entrega de mensagem bruta está habilitada.

## Publicando no SNS

### Pacotes

```
AWSSDK.SimpleNotificationService
Amazon.Extensions.NETCore.Setup
OpenTelemetry
OpenTelemetry.Instrumentation.AWS
```

### Registro no DI

O `Amazon.Extensions.NETCore.Setup` fornece dois métodos de extensão que configuram clientes AWS com o container DI nativo:

```csharp
services.AddDefaultAWSOptions(configuration.GetAWSOptions());
services.AddAWSService<IAmazonSimpleNotificationService>();
```

`AddDefaultAWSOptions` lê a seção `AWS` da configuração (para region, profile e credenciais) e registra um singleton `AWSOptions`. `AddAWSService<T>` usa esse singleton para construir o cliente tipado e o registra como singleton no container — sem `new AmazonSimpleNotificationServiceClient(...)` espalhado pelo código. Ao rodar no EKS com Pod Identity, as credenciais são resolvidas automaticamente a partir dos metadados da instância; apenas a region precisa ser explícita:

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

A classe de opções:

```csharp
public class SnsOptions
{
    public const string ConfigurationSectionKey = "Aws:Sns";

    [Required] public required string OrderPlacedTopicArn { get; set; }
}
```

Configure tudo junto:

```csharp
services.AddOptions<SnsOptions>()
    .BindConfiguration(SnsOptions.ConfigurationSectionKey)
    .ValidateDataAnnotations()
    .ValidateOnStart();

services.AddDefaultAWSOptions(configuration.GetAWSOptions());
services.AddAWSService<IAmazonSimpleNotificationService>();
```

### O publicador

O handler recebe um evento de domínio e o publica no SNS. Dois pontos são importantes aqui:

- `MessageGroupId` — obrigatório em todos os tópicos FIFO. Determina o escopo de ordenação: mensagens com o mesmo group ID são entregues na ordem em que foram publicadas. Usar o ID do pedido como group ID mantém os eventos de um mesmo pedido ordenados sem bloquear pedidos não relacionados.
- O atributo `channel` — verificado pela política de filtro da assinatura. Mensagens que não carreguem `channel = "online"` ou `channel = "app"` são descartadas silenciosamente no nível do SNS.

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

### Injeção de contexto de trace

O `OpenTelemetry.Instrumentation.AWS` se integra ao pipeline do AWS SDK e injeta o contexto atual nos atributos da mensagem SNS de saída automaticamente. Basta registrar a instrumentação no tracer provider:

```csharp
services.AddOpenTelemetry()
    .WithTracing(tracing => tracing
        .AddAWSInstrumentation()
        .AddSource(Instrumentation.ActivitySource.Name));
```

Com isso configurado, toda chamada a `PublishAsync` (e `SendMessageAsync`) usa o propagador global para escrever o contexto ativo nos atributos da mensagem usando o formato configurado (W3C TraceContext por padrão — normalmente `traceparent` e `tracestate`). A mensagem SNS de saída acaba carregando atributos como:

```
traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
```

O contexto é adicionado independentemente da decisão de amostragem, então serviços downstream podem tomar decisões consistentes e você não acaba com traces quebrados. É isso que permite ao consumidor reconstruir o trace e vincular seus spans ao trace do publicador, dando uma visibilidade end-to-end entre os serviços.

## Consumindo do SQS

### Pacotes

```
AWSSDK.SQS
Amazon.Extensions.NETCore.Setup
OpenTelemetry
OpenTelemetry.Instrumentation.AWS
```

### Registro no DI

Mesmo padrão do publicador, com `IAmazonSQS` no lugar:

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

A configuração:

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

As classes de opções:

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

### O background service

O loop de recebimento roda como `BackgroundService`. Alguns detalhes importantes:

- `MessageAttributeNames = ["All"]` — o SQS não retorna atributos de mensagem por padrão; sem isso, `message.MessageAttributes` fica vazio e o contexto de trace é perdido.
- O loop captura `OperationCanceledException` explicitamente quando o token é cancelado para encerrar de forma limpa, permitindo que outras instâncias de `IHostedService` e a aplicação finalizem corretamente.
- Em qualquer outra exceção, o loop aguarda um delay configurável antes de tentar novamente — em vez de girar e sobrecarregar o SQS em falhas repetidas.
- Mensagens são deletadas somente após o processamento bem-sucedido. Se `HandleAsync` retornar `false` — ou lançar exceção — a mensagem permanece na fila e é reentregue até `maxReceiveCount` vezes antes de ir para a DLQ.
- `IServiceScopeFactory` é usado para criar um escopo DI por mensagem. `BackgroundService` é registrado como singleton, mas o handler pode depender de serviços com escopo (conexões de banco, repositórios). Criar um escopo por mensagem mantém os ciclos de vida corretos.

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

### Extração de contexto de trace

Ao contrário da injeção, a extração *não* é automática. O `OpenTelemetry.Instrumentation.AWS` cria spans de cliente para as chamadas do SDK (`ReceiveMessage`, `DeleteMessage`), mas não lê o contexto upstream das mensagens recebidas nem parenta seu span de processamento a ele. Essa última etapa é sua: leia os headers de [propagação](https://opentelemetry.io/docs/specs/otel/context/api-propagators/) de volta e inicie a atividade do consumidor com o contexto extraído.

### O message handler

O handler mantém a lógica de negócio separada do loop de recebimento. Retorna `true` para sinalizar que a mensagem deve ser deletada — inclusive em erros irrecuperáveis como payload malformado, já que tentar novamente uma mensagem que nunca vai desserializar só consome o orçamento de `maxReceiveCount` e atrasa o envio para a DLQ.

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

## Conclusão

`Amazon.Extensions.NETCore.Setup` reduz a configuração de clientes AWS a duas linhas por serviço e centraliza a configuração de credenciais e region em um único lugar. `OpenTelemetry.Instrumentation.AWS` conecta traces entre o SNS e o SQS com código mínimo: a injeção na publicação é totalmente automática após o registro da instrumentação, e no consumidor você só precisa extrair o contexto e passá-lo ao iniciar a atividade de processamento.

O lado da infraestrutura (tópico, fila, assinatura, IAM) está coberto no [post anterior](/coding/2026/05/18/fifo-sns-sqs-eks-terraform/).
