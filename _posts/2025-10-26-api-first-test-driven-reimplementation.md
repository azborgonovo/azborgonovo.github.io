---
lang: en
layout: post
title: "Contract-First, Test-Driven: Guardrails for AI-Assisted Development"
date: 2025-10-26
categories: [coding]
tags: [copilot, tdd, grpc, protobuf, speckit, api-first, ai-assisted]
---

I have a gRPC microservice I'm happy with: well-tested, clean contracts defined in proto files, a solid [component test](https://martinfowler.com/articles/microservice-testing/#testing-component-introduction) suite covering the full stack against a real database. A few weeks ago I had a thought: what if I deleted the entire implementation and asked an AI to rebuild it from scratch?

So I did. Here is what I used, what came out, and what I ran into along the way.

## The setup

The starting point is a .NET 9 gRPC service with several services defined across seven proto files, and a component test suite with around 50 tests running against a real PostgreSQL instance via [TestContainers](https://testcontainers.com/guides/getting-started-with-testcontainers-for-dotnet/). I deleted all the implementation code, kept the proto files and the tests, and set up GitHub Copilot in VS Code to do the work.

The rules were simple:
- Proto files cannot be modified (they are the API contract)
- Test assertions cannot be modified (they are the acceptance criteria)

The proto contract defines each operation precisely:

```protobuf
service SubjectsService {
  rpc AddSubject(AddSubjectRequest) returns (AddSubjectResponse);
  rpc UpdateSubject(UpdateSubjectRequest) returns (UpdateSubjectResponse);
  rpc GetSubject(GetSubjectRequest) returns (GetSubjectResponse);
}

message AddSubjectRequest {
  string external_id = 1;
  string country = 2;
  map<string, string> properties = 3;
}

message AddSubjectResponse {
  string subject_id = 1;
}
```

The tests started their life skipped, unskipped one-by-one as each service got implemented:

```csharp
[Fact(Skip = "Not implemented yet")]
public async Task AddSubject_Should_ReturnAValidNewSubjectId()
{
    var request = new AddSubjectRequest { Country = "NL", ExternalId = "user@example.com" };
    var response = await _client.AddSubjectAsync(request, _fixture.AuthenticatedMetadata);

    response.SubjectId.Should().NotBeNullOrWhiteSpace();
}
```

Turning a test from red to green is a clear, unambiguous milestone. There is no room for Copilot to interpret "done" differently.

## Planning with GitHub SpecKit

Before asking Copilot to write a single line of implementation, I used [GitHub SpecKit](https://github.com/github/spec-kit) to structure the planning. SpecKit is a toolkit for Spec-Driven Development that walks you through four stages: a **constitution** (governing principles), a **specification** (what and why), a **plan** (technical approach), and a **task breakdown**.

Running the full workflow in sequence generated a substantial amount of documentation to the point of feeling like [big-design upfront](https://en.wikipedia.org/wiki/Big_design_up_front) and *waterfall* planning. This was an experiment, so I didn't read all of it carefully. The good part: the constitution provided six principles that gave Copilot a clear north star throughout implementation, including the immutability of the proto files and the Result pattern for error handling.

## The result

All services implemented in a matter of days, all tests passing. Copilot produced a correctly layered .NET service with dependency injection, EF Core repositories, and gRPC status codes that were mapped appropriately. Each gRPC service delegates to a business service that returns a `Result` (via [FluentResults](https://github.com/altmann/FluentResults)), and the gRPC layer translates that into the appropriate status code:

```csharp
public override async Task<AddSubjectResponse> AddSubject(
    AddSubjectRequest request, ServerCallContext context)
{
    var properties = request.Properties?.ToDictionary(p => p.Key, p => p.Value)
        ?? new Dictionary<string, string>();

    var result = await _businessService.AddSubjectAsync(
        request.ExternalId, request.Country, properties);

    if (result.IsFailed)
        throw new RpcException(new Status(StatusCode.InvalidArgument,
            result.Errors.First().Message));

    return new AddSubjectResponse { SubjectId = result.Value.SubjectId };
}
```

This pattern (business logic returns `Result`, gRPC layer maps failures to status codes) was applied consistently across all services without me asking for it explicitly. The constitution's principle of using the Result pattern was enough for Copilot to infer the structure.

## The challenges

The biggest friction was a Copilot limitation with terminal output. When running a command, Copilot often got stuck trying to read results from the terminal directly. The workaround I documented in the Copilot instructions file:

```markdown
## Running commands
1. Whenever you run a command in the terminal, pipe the output to output.txt
2. Read the output.txt file to see the results
3. Overwrite each time to prevent growth
```

It helped, but did not fully solve it. Copilot still got stuck, looping through attempts to read the terminal far longer than expected. The fix was to stop it and type `continue`.

The other recurring challenge is Copilot trying to modify the tests. It happened more than once. Each time I had to reaffirm: the tests are the spec and SHALL not be changed.

## My takeaways

In the context of AI-assisted development, contract-first and test-driven design (TDD) give AI models clear and verifiable boundaries.

SpecKit's value is something I'm still working out. The constitution made a real difference. Before setting up the constraints and running SpecKit, I tried a naive approach to just prompt Copilot with no structure and it was a complete failure. The guardrails matter.

The core lesson: AI is surprisingly good and fast at generating code. The basic engineering practices remain fundamental.