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

A former colleague of mine, Lucas Campos, released a fun personality quiz for software engineers navigating the AI era: [whatkindof.dev](https://whatkindof.dev/). Inspired by 16Personalities, the quiz asks questions about *what you do now that the code mostly writes itself* — not about how you think in general. It maps you to one of thirteen archetypes (The Perfectionist, The Detective, The Captain, The Cowboy, and more, with one hidden until discovered) plus your position on an AI-adoption ladder. No account, no tracking, answers stay local in your browser. It's lighthearted but surprisingly accurate. Give it a try.

## Claude Code instability

If you use Claude Code daily, you've likely had [status.claude.com](https://status.claude.com/) bookmarked by now. June included a few notable periods of service degradation — incidents that served as a reminder that we're building workflows on infrastructure that is still maturing. Worth keeping the status page handy and having a fallback plan for the moments when the service isn't responsive.

## Loop Engineering

Addy Osmani published [Loop Engineering](https://addyosmani.com/blog/loop-engineering/) — a post that reframes how we should think about working with coding agents. The core idea: rather than manually prompting agents turn-by-turn, we should design systems that prompt agents themselves. As Osmani puts it, "Loop engineering is replacing yourself as the person who prompts."

The post describes five components of a well-designed loop:
1. **Automations** — scheduled tasks that surface work without constant human oversight
2. **Worktrees** — isolated working directories enabling parallel agent work without file collisions
3. **Skills** — documented project knowledge (stored in `SKILL.md` files) encoding conventions and context
4. **Plugins & Connectors** — MCP integrations connecting agents to real tools and environments
5. **Sub-agents** — separate agents handling verification so creators don't grade their own work

The essential warning is equally important: loop engineering demands judgment. Loops don't know the difference between accelerating understood work and avoiding understanding altogether. You do.

## Steering documents: the Kiro approach

One of the most interesting concepts I encountered this month is [Kiro's steering documents](https://kiro.dev/docs/steering/). Kiro is a new AI IDE that introduces *steering* as its mechanism for giving the AI persistent, structured knowledge about a workspace — the equivalent of what `CLAUDE.md` and `AGENTS.md` do for Claude Code.

Steering files live in `.kiro/steering/` and are markdown files with a small frontmatter block that controls when they're loaded. Kiro auto-generates three foundational files to get you started:

- **product.md** — product purpose, target users, key features, and business objectives
- **tech.md** — frameworks, libraries, tools, and technical constraints
- **structure.md** — file organization, naming conventions, import patterns, and architectural decisions

Beyond the foundation, here are the common steering files Kiro recommends:

| File | What to put in it |
|---|---|
| `api-standards.md` | REST conventions, error response formats, authentication flows, versioning strategies |
| `testing-standards.md` | Unit test patterns, integration test strategies, mocking approaches, coverage expectations |
| `code-conventions.md` | Naming patterns, file organization, import ordering, architectural decisions |
| `security-policies.md` | Authentication requirements, data validation, input sanitization, vulnerability prevention |
| `deployment-workflow.md` | Build procedures, environment configurations, deployment steps, rollback strategies |

### Inclusion modes

What makes steering particularly interesting is how it handles *when* a document is loaded — and this will feel immediately familiar to anyone who has used Claude Code skills:

- **Always** — loaded into every interaction; ideal for core conventions and security policies
- **fileMatch** — loaded only when working with files matching a glob pattern (e.g., only load `testing-standards.md` when editing `**/*.test.*` files)
- **Manual** — referenced explicitly via `#steering-file-name` in chat; appears as a slash command
- **Auto** — Kiro matches the file's description against the user's request to decide whether to include it; also accessible as a slash command

If you've used Claude Code skills, the parallel is hard to miss. Skills also control *when* they activate, through trigger descriptions that the model matches against the user's intent. The difference is mostly in the tooling: Kiro exposes this as a first-class IDE concept with frontmatter, while Claude Code skills are markdown files with invocation instructions. The underlying insight is the same — AI tools work best when given the right context at the right time, and that context management shouldn't be left to chance or manual repetition every session.

Regardless of which AI IDE you use, the categories Kiro names (API standards, testing standards, code conventions, security policies, deployment workflow) are a solid checklist for building your own context library.
