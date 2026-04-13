---
lang: en
layout: post
title: "Claude Code Memory: Where Rules Actually Belong"
date: 2026-04-13
categories: [ai]
tags: [claude-code, memory, claude-md, agents-md, best-practices]
---

I have been using Claude Code for a while now, and I have run into the following question recently: when Claude saves something to its auto-memory, should you commit that to git?

The short answer is: no - and you shouldn't need to.

## How Claude Code memory works

Claude Code has two distinct memory layers:

**Auto-memory** (`~/.claude/projects/<repo>/memory/`) is where Claude writes notes to itself as it works: things it learned about your project, conventions, corrections you gave it. This lives on your machine, outside the repository. It is never committed to git.

**Project memory** (`CLAUDE.md` / `AGENTS.md`) are instructions you write explicitly for Claude (and other AI tools). These live inside the repo, are versioned with git, and are loaded at the start of every session.

## The rule of thumb

> If a rule matters for the project, put it in `AGENTS.md`. If it's a personal preference for how Claude behaves with *you*, auto-memory is fine.

The distinction is: *would another developer or AI agent need this rule?* If yes, it belongs in the repo.

## A concrete example

Yesterday I asked Claude to save a rule to always generate a `permalink` front matter field when creating new posts together with me. Claude saved that to auto-memory.

But after questioning whether that was the right place, we concluded it's a project rule — it affects anyone (or any AI) working on this repo. So we moved it to `AGENTS.md` and deleted the memory entry. Now it's versioned, visible in code review, and available to every tool.

## A few other things to pay attention to

- Keep `AGENTS.md` under 200 lines — the [official docs](https://code.claude.com/docs/en/best-practices) warn that longer files consume more context and instruction adherence measurably drops.
- You can disable auto-memory entirely with `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1` if you prefer to manage everything manually.
- If your repo uses `AGENTS.md`, you can have `CLAUDE.md` import it so both tools read the same instructions without duplication.

## References

- [How Claude remembers your project](https://code.claude.com/docs/en/memory) 
- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices)