---
lang: en
layout: post
title: "Claude Code Memory: Where Rules Actually Belong"
date: 2026-04-13
categories: [ai]
tags: [claude-code, memory, claude-md, agents-md, best-practices]
---

While learning Claude Code, I ran into a question that isn't immediately obvious: when Claude saves something to its auto-memory, should you commit that to git?

Short answer: no — and you shouldn't need to.

## How Claude Code memory works

Claude Code has two distinct memory layers:

**Auto-memory** (`~/.claude/projects/<repo>/memory/`) — Claude writes notes to itself as it works: things it learned about your project, conventions it picked up, corrections you gave it. This lives on your machine, outside the repository. It is never committed to git.

**Project memory** (`CLAUDE.md` / `AGENTS.md`) — instructions you write explicitly for Claude (and other AI tools). These live inside the repo, are versioned with git, and are loaded at the start of every session.

## The rule of thumb

> If a rule matters for the project, put it in `CLAUDE.md`. If it's a personal preference for how Claude behaves with *you*, auto-memory is fine.

The distinction is: *would another developer or AI agent need this rule?* If yes, it belongs in the repo.

## A concrete example

Today Claude correctly noted that PT-BR post variants in this blog require a `permalink` front matter field so jekyll-polyglot can pair language versions for the language toggle. Claude saved that to auto-memory.

But that's a project rule — it affects anyone (or any AI) working on this repo. So I moved it to `AGENTS.md` and deleted the memory entry. Now it's versioned, visible in code review, and available to every tool.

## A few other things worth knowing

- `CLAUDE.md` counts against your context window every session — keep it concise (50–200 lines is the practical guidance).
- Auto-memory has a 200-line / 25 KB cap on what gets loaded at session start.
- You can disable auto-memory entirely with `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1` if you prefer to manage everything manually.
- If your repo uses `AGENTS.md` (the OpenAI Codex convention), you can have `CLAUDE.md` import it so both tools read the same instructions without duplication.

The takeaway: use auto-memory for ephemeral, personal context. Use `CLAUDE.md` for anything that should outlive your current machine or onboard the next contributor.
