---
lang: en
layout: post
title: "AI Learnings: Aug/2026 version"
date: 2026-08-13
categories: [ai]
tags: [ai, learnings, knowledge-management, memory, wardley-mapping]
permalink: /ai/2026/08/13/ai-learnings-aug-2026/
---

## llm-wiki and the Open Knowledge Format

My colleague Majid introduced me to two related ideas that I had not come across before: the llm-wiki pattern and the Open Knowledge Format (OKF).

[llm-wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) is a gist by Andrej Karpathy describing a simple pattern: instead of running retrieval over raw documents every time you have a question, you let the LLM maintain a wiki. There are three layers:
- The *raw* sources, which are never modified;
- The *wiki* itself, a set of markdown pages the LLM writes and updates;
- And a *schema document* (a `CLAUDE.md`, for instance) that defines the conventions and workflows.

Two files carry special meaning: `index.md` catalogues the pages, and `log.md` is an append-only history of what happened.

The workflows are the following:
1. *ingest* a new source and update the affected pages
2. *query* the wiki and file good answers back as new pages
3. periodically *lint* to surface contradictions, stale claims, and orphaned pages

The argument for why llm-wiki works is that wikis have always decayed because maintaining them is tedious, and an LLM does not get bored.

The [Open Knowledge Format](https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing) (OKF) is Google's attempt to formalise that pattern into an open, vendor-neutral specification. The format itself is opinionated and minimal: a directory of markdown files with YAML frontmatter, plus a small set of conventions. The only hard requirement is a non-empty `type` field. Everything else is optional, and the [spec](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md) is worth reading for what those optional fields are, because they are where the interesting design decisions live:

| Field family | What it records |
|---|---|
| `sources` | Where a page's claims came from, with optional author and usage signals |
| `generated` / `verified` | Who produced or checked the page, and when |
| `status` | `draft`, `stable`, or `deprecated` |
| `stale_after` | The date on which the content should be treated as stale |

There is also a convention for identifying actors, which is what allows a consumer to tell human-reviewed content apart from machine-generated content. The format uses `human:<id>` for people, `<producer>/<version>` for agents, and `process:<id>` for automation.

## How this evolved my view on Agent memory

Back in April I wrote about [where Claude Code memory actually belongs](/ai/2026/04/13/claude-code-memory-best-practices/). The rule of thumb I concluded was: if a rule matters for the project, it goes in `AGENTS.md`; if it is a personal preference for how Claude behaves with you, your personal `CLAUDE.md`, rules, or auto-memory are fine. I still think that rule is correct.

Reading about llm-wiki and OKF made it clear that there are two very different kinds of context:

- **Steering** docs are imperative. They tell the agent what to do: use conventional commits, keep this file under 200 lines, never commit to main. They load into every session and should stay small.
- **Knowledge** docs are descriptive. They record how something works, what a metric means, what we concluded last time. They are looked up when needed, instead of loaded up front.

Three things follow from that distinction that I had not considered in April.

**The 200-line limit is a rule about steering, not about memory.**
I framed size as a general constraint because instruction adherence drops as instruction files grow. That is true, but it only applies to content that is loaded unconditionally. A knowledge base reached through an `index.md` can be hundreds of pages and still cost almost nothing at the start of a session. Separating the two turns the limit into a budget on what you can *instruct*, not a ceiling on what you can *remember*.

**Knowledge decays, and steering rules do not.**
My rule of thumb was binary: a rule either matters to the project or it does not. But a page describing how a service works was accurate in April and may not be in August. OKF's `status` and `stale_after` fields handle this at write time, when the author actually knows the shelf life, rather than leaving it to be discovered at read time.

**Trust in a knowledge base depends on where each page is grounded.**
The comments on the llm-wiki gist are as insightful as the concept itself. The most interesting one for me: a wiki page should never be allowed to ground another wiki page. Without that constraint, a page cites a page that cited a hallucination, and eventually three documents agree with each other. This is not a concern when you write every note yourself. It becomes one as soon as an agent writes pages you have not read, which is precisely the direction all of this is heading.

Where I have landed, for now, is a three-tier split rather than two:

1. **Steering** — `CLAUDE.md`, skills and personal memory. Imperative, always loaded, small.
2. **Knowledge** — an llm-wiki in a repository, retrieved on demand, with every page declaring its sources.
3. **Shared knowledge** — the same wiki, made OKF-conformant, once it leaves my machine.

## Reducing friction in AI-assisted development

Rahul Garg published [Patterns for reducing friction in AI-assisted development](https://martinfowler.com/articles/reduce-friction-ai/) on Martin Fowler's site. I loved how he framed onboarding AI agents as the same problem we face when onboarding a new teammate.

The five patterns he describes are:

1. **Knowledge Priming**: sharing curated project context up front, such as stack, conventions, patterns
2. **Design-First Collaboration**: working through design before implementation
3. **Encoding Team Standards**: making tacit knowledge explicit and shareable
4. **Context Anchoring**: keeping living documents that preserve decisions
5. **Feedback Flywheel**: improving the collaboration itself through retrospectives

What I find useful is the point about measurement. If you judge AI assistance by how fast code appears, you miss the rework it generates. First-pass acceptance and rework burden say more about whether the collaboration is actually working.

## An introduction to Wardley Mapping

Although this is not directly related to AI, Wardley Mapping is something I had been wanting to spend time on, and it relates well to the knowledge topics above. I went through a free [Wardley Mapping playlist](https://youtube.com/playlist?list=PLpOPGFYrQ_DuDaqPqcH8bM4VsISWxCHAd) recorded by Simon Wardley himself.

The playlist is on the AWS Public Sector YouTube channel, and the lessons are split into four:
1. How and why to map your business
2. How to spot patterns
3. How to anticipate change
4. How to use doctrine and gameplay

There are plenty of great materials available online to deepen your knowledge on the topic, like [learnwardleymapping.com](https://learnwardleymapping.com/introduction/). Wardley Maps are a critical tool if you want to map your business and reason about strategy with a solid, effective framework.
