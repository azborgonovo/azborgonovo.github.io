---
lang: en
layout: post
title: "Reviewing Modularity with Claude Code"
date: 2026-04-12
categories: [coding]
tags: [architecture, modularity, coupling, likec4, claude-code]
---

Last week I ran [vladikk/modularity](https://github.com/vladikk/modularity)'s Claude Code plugin against a few LikeC4 diagrams of a system I was working on.

My goal was to try out the plugin which is grounded in the [Balanced Coupling](https://coupling.dev/) model.

## What the plugin does

The plugin contains two skills:

**`/modularity:design`** — generates a modular architecture from requirements (design systems from scratch)

**`/modularity:review`** — analyzes an existing codebase for coupling imbalances

## How I used it

I first installed the plugin, cloned the repository where the software system [LikeC4](https://likec4.dev/) diagrams are versioned and run the `/modularity:review` command. The  skill then produced a report containing:
- An Executive Summary with an overview of the software system
- A Coupling Overview, listing all Integrations with their respective
  - The respective module and it's integrations
  - Strenght: Intrusive, Model, Functional
  - Distance: Cross-team
  - Volatility: High, Medium
  - Balanced?: Critical, Tolerable

## What came out of it

For each of the listed integrations, a detailed reported describes identified `Knowledge Leakeage`, `Complexity Impact`, `Cascading Changes` and, most importantly, `Recommended Improvements` with *Trade-off* detailing the costs of implementing the improvements that would bring balance to the surfaced coupling.

## Worth trying

If you're already using LikeC4 (or any architecture-as-code tool), run `/modularity:review`, and you get a principled critique in seconds.

It won't replace a deep architecture review, but it surfaces the right questions fast and gives you vocabulary to discuss trade-offs with your team.

For a deep-dive into modularity, check out Vlad Khononov's book: [Balancing Coupling in Software Design: Unviersal Design Principles for Architeting Modular Software Systems](https://www.oreilly.com/library/view/balancing-coupling-in/9780137353514/).