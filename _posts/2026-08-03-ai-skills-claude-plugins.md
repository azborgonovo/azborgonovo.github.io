---
lang: en
layout: post
title: "ai-skills: My Skills as Claude Plugins"
date: 2026-08-03
categories: [ai]
tags: [ai, claude-code, skills, plugins, agents-md]
---

Over the past few months I have written about individual pieces of this puzzle: [reviewing modularity with a Claude Code plugin](/coding/2026/04/12/modularity-review-claude-code/), [where Claude Code memory actually belongs](/ai/2026/04/13/claude-code-memory-best-practices/), and the steering documents I picked up from Kiro. Those were all fragments of the same underlying effort: building a durable set of skills that genuinely enhances software delivery.

That effort now has a home: [azborgonovo/ai-skills](https://github.com/azborgonovo/ai-skills), published as a Claude Code plugin marketplace.

## Why publish this

The first is that these skills are expensive to build. Getting a skill's prompt right takes many iterations and a lot of tokens spent fine-tuning it against real work. Open-sourcing them means anyone can benefit from the result instead of rebuilding it from scratch.

The second is more selfish: distributing them as Claude Plugins means every one of my own repositories can pull the same skills into a Claude sandbox environment.

## What's inside

Each plugin groups a set of related skills, and every skill carries a maturity and invocation label:

- **Maturity** — *Adopt* (proven on real work), *Trial* (usable, still being validated), or *Draft* (recently authored, not seriously used yet)
- **Invocation** — *Auto* (Claude invokes it automatically when relevant, you can still call it directly) or *Manual* (only triggered with `/skill-name`)

Check the [repo itself](https://github.com/azborgonovo/ai-skills) for the up-to-date list of published plugins. It currently covers BDD, code review, decision records, agent docs, engineering practices, and planning.

A few skills like `/pareto`, `/atlassian-identity-cache`, and a `/team-topologies` knowledge base are still *Draft* and not yet part of any plugin. They can be consumed by cloning the repo and running the symlink-based [`link_skills.py`](https://github.com/azborgonovo/ai-skills/blob/main/scripts/link_skills.py) script instead.

The repo also has a `tools/` folder for scripts that use an AI harness rather than being used by one, like [`ralph_loop.py`](https://github.com/azborgonovo/ai-skills/blob/main/tools/ralph-loop/README.md).

## Try it

If any of this overlaps with problems you run into daily (like writing Gherkin, reviewing PRs, logging decisions, keeping .md files lean) install the matching plugin and see if it earns its *Adopt* label on your own work. Issues and pull requests are welcome on the repo.
