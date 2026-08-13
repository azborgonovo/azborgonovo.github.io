---
lang: en
layout: post
title: "AI Learnings: Aug/2026 version"
date: 2026-08-13
categories: [ai]
tags: [ai, learnings, knowledge-management, memory, wardley-mapping]
permalink: /ai/2026/08/13/ai-learnings-aug-2026/
---

August has been mostly about knowledge: how to store it, how to keep it current, and how to make it useful to both people and agents. Here are the concepts that caught my attention this month.

## llm-wiki and the Open Knowledge Format

My colleague Majid introduced me to two related ideas that I had not come across before: the llm-wiki pattern and the Open Knowledge Format.

[llm-wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) is a gist by Andrej Karpathy describing a simple pattern: instead of running retrieval over raw documents every time you have a question, you let the LLM maintain a wiki. There are three layers — the raw sources, which are never modified; the wiki itself, a set of markdown pages the LLM writes and updates; and a schema document (a `CLAUDE.md`, for instance) that defines the conventions and workflows. Two files carry special meaning: `index.md` catalogues the pages, and `log.md` is an append-only history of what happened.

The workflows are equally simple: **ingest** a new source and update the affected pages, **query** the wiki and file good answers back as new pages, and periodically **lint** to surface contradictions, stale claims, and orphaned pages. The argument for why this works now is not technical but economic — wikis have always decayed because maintaining them is tedious, and an LLM does not get bored.

The [Open Knowledge Format](https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing) (OKF) is Google's attempt to formalise that pattern into an open, vendor-neutral specification. The format itself is deliberately minimal: a directory of markdown files with YAML frontmatter, plus a small set of conventions. The only hard requirement is a non-empty `type` field. Everything else is optional, and the [spec](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md) is worth reading for what those optional fields are, because they are where the interesting design decisions live:

| Field family | What it records |
|---|---|
| `sources` | Where a page's claims came from, with optional author and usage signals |
| `generated` / `verified` | Who produced or checked the page, and when |
| `status` | `draft`, `stable`, or `deprecated` |
| `stale_after` | The date on which the content should be treated as stale |

There is also a convention for identifying actors — `human:<id>` for people, `<producer>/<version>` for agents, `process:<id>` for automation — which is what allows a consumer to tell human-reviewed content apart from machine-generated content.

## How this changed my view on memory

Back in April I wrote about [where Claude Code memory actually belongs](/ai/2026/04/13/claude-code-memory-best-practices/). The rule of thumb I landed on was: if a rule matters for the project, it goes in `AGENTS.md`; if it is a personal preference for how Claude behaves with you, auto-memory is fine. I still think that rule is correct. What I now think is that it only covers part of the problem.

That post treated memory as one thing. Reading about llm-wiki and OKF made it clear that there are two very different kinds of content involved, and they have almost nothing in common beyond both being markdown:

- **Steering** is imperative. It tells the agent what to do: use conventional commits, keep this file under 200 lines, never commit to main. It is loaded into every session, which is exactly why it has to stay small.
- **Knowledge** is descriptive. It records how something works, what a metric means, what we concluded last time. It is looked up when relevant, not loaded up front.

Three things follow from that distinction that I had not considered in April.

**The 200-line limit is a rule about steering, not about memory.** I framed size as a general constraint because instruction adherence drops as instruction files grow. That is true, but it only applies to content that is loaded unconditionally. A knowledge base reached through an `index.md` can be hundreds of pages and still cost almost nothing at the start of a session. Separating the two turns the limit into a budget on what you can *instruct*, not a ceiling on what you can *remember*.

**Knowledge decays, and my original model had no vocabulary for it.** My rule of thumb is binary: a rule either matters to the project or it does not. But a page describing how a service works was accurate in April and may not be in August. OKF's `status` and `stale_after` fields handle this at write time, when the author actually knows the shelf life, rather than leaving it to be discovered at read time.

**Provenance matters more than I assumed, and mainly because of agents.** The most useful point I found was not in the gist itself but in its comments: a wiki page should never be allowed to ground another wiki page. Without that constraint, a page cites a page that cited a hallucination, and eventually three documents agree with each other. This is not a concern when you write every note yourself. It becomes one as soon as an agent writes pages you have not read, which is precisely the direction all of this is heading.

Where I have landed, for now, is a three-tier split rather than two:

1. **Steering** — `AGENTS.md` and personal memory. Imperative, always loaded, small.
2. **Knowledge** — an llm-wiki in a repository, retrieved on demand, with every page declaring its sources.
3. **Shared knowledge** — the same wiki, made OKF-conformant, once it leaves my machine.

Two practical notes. Since `type` is OKF's only mandatory field, writing tier 2 as OKF from the start means promoting it to tier 3 costs nothing later. And the pattern needs volume to pay off — the discussion on the gist suggests it works well at around a hundred sources — so a narrow, well-defined domain is a better first attempt than a general-purpose wiki.

## Reducing friction in AI-assisted development

Rahul Garg published [Patterns for reducing friction in AI-assisted development](https://martinfowler.com/articles/reduce-friction-ai/) on Martin Fowler's site. The framing is that we tend to treat coding assistants as tools that need little context, when they behave much more like teammates who need onboarding.

The five patterns he describes are:

1. **Knowledge Priming** — sharing curated project context up front: stack, conventions, patterns
2. **Design-First Collaboration** — working through design before implementation
3. **Encoding Team Standards** — making tacit knowledge explicit and shareable
4. **Context Anchoring** — keeping living documents that preserve decisions
5. **Feedback Flywheel** — improving the collaboration itself through retrospectives

What I find useful is the point about measurement. If you judge AI assistance by how fast code appears, you miss the rework it generates. First-pass acceptance and rework burden say more about whether the collaboration is actually working. The overlap with the previous section is hard to miss: knowledge priming and context anchoring are the same problem the llm-wiki pattern addresses, described from the delivery side rather than the storage side.

## An introduction to Wardley Mapping

Still on the theme of knowledge, but a different kind: [this YouTube playlist](https://youtube.com/playlist?list=PLpOPGFYrQ_DuDaqPqcH8bM4VsISWxCHAd) is an introduction to Wardley Mapping.

A Wardley Map is a way of drawing what your organisation does so that you can reason about strategy. You start from user needs, list the components required to meet them, chain those components by dependency, and then place each one on a horizontal axis of evolution — from genesis, through custom-built and product, to commodity. The vertical axis is visibility to the user.

The value is in the evolution axis. Components move rightwards over time, and how you should treat a component depends entirely on where it sits: something in genesis needs experimentation and tolerance for waste, something approaching commodity should be bought rather than built. Most disagreements about whether to build or buy turn out to be disagreements about where a component actually sits.

I am including it here because the connection to the rest of this post is closer than it looks. Both Wardley Mapping and the llm-wiki pattern are attempts to make knowledge that normally lives in people's heads explicit enough to be reasoned about and shared. One does it for strategy, the other for documentation.
