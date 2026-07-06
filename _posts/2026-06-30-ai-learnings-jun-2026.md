---
lang: en
layout: post
title: "AI Learnings: Jun/2026 version"
date: 2026-06-30
categories: [ai]
tags: [ai, learnings, claude-code, kiro]
---

June wraps up with no shortage of interesting material to share. Here are the links, tools, and concepts that caught my attention this month.

## Beyond the basics with Claude Code

[Beyond the basics with Claude Code](https://www.youtube.com/watch?v=tuY2ChJIx48) is a video that goes past introductory usage and into more advanced patterns — the kind of content that becomes useful once you've moved past the "it works" phase and want to understand *why* certain approaches work better than others.

## What kind of dev are you?

A former colleague of mine, Lucas Campos, released a fun personality quiz for software engineers navigating the AI era: [whatkindof.dev](https://whatkindof.dev/). Inspired by 16Personalities, the quiz asks questions about *what you do now that the code mostly writes itself* — not about how you think in general. It maps you to one of thirteen archetypes (The Perfectionist, The Detective, The Captain, The Cowboy, and more, with one hidden until discovered) plus your position on an AI-adoption ladder. No account, no tracking, answers stay local in your browser. Give it a try.

## Claude Code instability

If you use Claude Code daily you've likely experienced the some [instability](https://status.claude.com/) in June. A few notable periods of service degradation served as a reminder that we're building workflows on infrastructure that is still maturing.

## Loop Engineering

Addy Osmani published a post about [Loop Engineering](https://addyosmani.com/blog/loop-engineering/) that reframes how we should think about working with coding agents.

The core idea: rather than manually prompting agents turn-by-turn, we should design systems that prompt agents themselves. As Osmani puts it, "Loop engineering is replacing yourself as the person who prompts."

The post describes five components of a well-designed loop:
1. **Automations**: scheduled tasks that surface work without constant human oversight
2. **Worktrees**: isolated working directories enabling parallel agent work without file collisions
3. **Skills**: documented project knowledge (stored in `SKILL.md` files) encoding conventions and context
4. **Plugins & Connectors**: MCP integrations connecting agents to real tools and environments
5. **Sub-agents**: separate agents handling verification so creators don't grade their own work

The essential warning is equally important: loop engineering demands [judgment](https://martinfowler.com/articles/exploring-gen-ai/humans-and-agents.html). Loops don't know the difference between accelerating understood work and avoiding understanding altogether.

## Steering documents: the Kiro approach

I was looking for a standard approach to define documents that support AI-augmented delivery and one of the only concepts I encountered so far is [Kiro's steering documents](https://kiro.dev/docs/steering/).

These documents have a defined inclusion mode that tells *when* a document is loaded. It's similar to Agent Skills, but it's [worth a read](https://kiro.dev/docs/steering/#inclusion-modes) because it extends the capabilities a bit further.

Nevertheless, what caught my attention was how they have structured their foundational documents. Three files are auto-generated when you get started:

- **product.md** — product purpose, target users, key features, and business objectives
- **tech.md** — frameworks, libraries, tools, and technical constraints
- **structure.md** — file organization, naming conventions, import patterns, and architectural decisions

Beyond the foundation, the following common steering files are recommended by Kiro:

| File | What to put in it |
|---|---|
| `api-standards.md` | REST conventions, error response formats, authentication flows, versioning strategies |
| `testing-standards.md` | Unit test patterns, integration test strategies, mocking approaches, coverage expectations |
| `code-conventions.md` | Naming patterns, file organization, import ordering, architectural decisions |
| `security-policies.md` | Authentication requirements, data validation, input sanitization, vulnerability prevention |
| `deployment-workflow.md` | Build procedures, environment configurations, deployment steps, rollback strategies |


Regardless of which AI IDE, the categories Kiro names (API standards, testing standards, code conventions, security policies, deployment workflow) are a solid checklist for building any custom context library.