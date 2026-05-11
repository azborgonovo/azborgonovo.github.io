---
lang: en
layout: post
title: "API-First, Test-First: Guardrails for AI-Assisted Development"
date: 2025-10-26
categories: [coding]
tags: [copilot, tdd, grpc, protobuf, speckit, api-first, ai-assisted]
---

I have a gRPC microservice I'm happy with: well-tested, clean contracts defined in proto files, a solid [component test](https://martinfowler.com/articles/microservice-testing/#testing-component-introduction) suite covering the full stack against a real database. A few weeks ago I had a thought: what if I deleted the entire implementation and asked an AI to rebuild it from scratch?

So I did. Here is what I used, what came out, and what I ran into along the way.

## The setup

The starting point is a .NET 9 gRPC service with several services defined across seven proto files, and a component test suite with around 50 tests running against a real PostgreSQL instance via TestContainers. I deleted all the implementation code, kept the proto files and the tests, and set up GitHub Copilot in VS Code to do the work.

The rules were simple:
- Proto files cannot be modified - they are the API contract
- Test assertions cannot be modified - they are the acceptance criteria

## Planning with GitHub SpecKit

Before asking Copilot to write a single line of implementation, I used [GitHub SpecKit](https://github.com/github/spec-kit) to structure the planning. SpecKit is a toolkit for Spec-Driven Development — it walks you through four stages: a **constitution** (governing principles), a **specification** (what and why), a **plan** (technical approach), and a **task breakdown**.

Running the full workflow in sequence generated a substantial amount of documentation. It was thorough to the point of feeling like [big-design upfront](https://en.wikipedia.org/wiki/Big_design_up_front) and *waterfall* planning. This was an experiment, so I didn't read all of it carefully. The constitution looked interesting giving Copilot six principles that served as a clear north star throughout implementation, including the immutability of the proto files and the Result pattern for error handling.

## The result

Several services implemented in a matter of days, all tests passing. Copilot produced a correctly layered .NET service with dependency injection, EF Core repositories, Result pattern applied consistently across all business services, gRPC status codes mapped appropriately. The code is clean and coherent.

## The challenges

The biggest friction was a Copilot limitation with terminal output. When running a command, Copilot often got stuck on trying to read results from the terminal directly. The workaround I tried was: piping output to `output.txt` and reading from there. It helped, but did not fully solve it. Copilot still got stuck, looping through attempts to read the terminal far longer than expected. The fix was to stop it and type `continue`.

The other recurring challenge is Copilot trying to modify the tests. It happened more than once. Each time I had to reaffirm: the tests are the spec and SHALL not be changed.

## My take aways

API-first and test-first have been and continue to be good engineering practices. In the context of AI-assisted development, they give solid constraints to give clear feedback to the model's workflow.

I am still unsure about SpecKit's value. It forces upfront clarity on principles and helps guiding GenAI to one-shot features. I force brute a naive approach first and it was a complete failure.

The core lesson: AI is surprisingly good and and fast at generating code. The basic engineering practices remain fundamental.
