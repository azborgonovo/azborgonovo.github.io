---
lang: en
layout: post
title: "API-First, Test-First: Guardrails for AI-Assisted Development"
date: 2025-10-26
categories: [coding]
tags: [copilot, tdd, grpc, protobuf, speckit, api-first, ai-assisted]
---

I have a gRPC microservice I'm happy with: well-tested, clean contracts defined in proto files, a solid component test suite covering the full stack against a real database. A few weeks ago I had a thought: what if I deleted the entire implementation and asked an AI to rebuild it from scratch?

So I did. Here is what I used, what came out, and what I ran into along the way.

## The setup

The starting point is a .NET 9 gRPC service with several services defined across seven proto files, and a component test suite with around 50 tests running against a real PostgreSQL instance via TestContainers. I deleted all the implementation code, kept the proto files and the tests, and set up GitHub Copilot in VS Code to do the work.

The rules were simple:
- Proto files cannot be modified — they are the API contract
- Test assertions cannot be modified — they are the acceptance criteria
- Everything else is fair game

## Planning with GitHub SpecKit

Before asking Copilot to write a single line of implementation, I used [GitHub SpecKit](https://github.com/github/spec-kit) to structure the planning. SpecKit is a toolkit for Spec-Driven Development — it walks you through four stages: a **constitution** (governing principles), a **specification** (what and why), a **plan** (technical approach), and a **task breakdown**.

Running the full workflow in sequence generated a substantial amount of documentation. It was thorough to the point of feeling like waterfall planning — exhaustive and detailed upfront. This was an experiment, so I didn't read all of it carefully. But the constitution was worth the effort: six principles that gave Copilot a clear north star throughout implementation, including the immutability of the proto files and the Result pattern for error handling.

## The result

It worked. Several services implemented in a matter of days, all tests passing. Copilot produced a correctly layered .NET service — dependency injection, EF Core repositories, Result pattern applied consistently across all business services, gRPC status codes mapped appropriately. The code is clean and coherent.

The two constraints carry most of the weight. An immutable API contract means Copilot can't redesign its way out of a hard problem. Immutable test assertions mean it can't make tests pass by changing what they test. Both constraints force it to solve the actual problem rather than the easier adjacent one.

## The challenges

The biggest friction is a Copilot limitation with terminal output. When running a command, Copilot can't read the result from the terminal directly. The workaround — piping output to `output.txt` and reading from there — helps, but doesn't fully solve it. Copilot still gets stuck, looping through attempts to read the terminal far longer than expected. The fix is to stop it and type `continue`. This happens often enough that "continue" has become a reflex.

The other recurring challenge is Copilot trying to modify the tests. It happened more than once. Each time I had to be firm: the tests are the spec, not an obstacle.

## What I take away from this

API-first and test-first are not just engineering practices. In the context of AI-assisted development, they are constraints that make the model's output useful rather than merely plausible. Without them, Copilot would optimise for the path of least resistance — changing the tests, drifting from the contract. With them, there is nowhere to hide.

SpecKit's value is less about the volume of documentation it produces and more about forcing upfront clarity on principles. The constitution is what matters.

As an experiment: I'd do it again. As a production workflow: not yet. The planning overhead is high, the terminal limitation adds friction at the worst moments, and keeping Copilot away from the test files requires vigilance that shouldn't have to be manual.

But the core lesson stands: constrain the AI well, and it can be genuinely productive. Leave it unconstrained, and it will find the easy way out.
