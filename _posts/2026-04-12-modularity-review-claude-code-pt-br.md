---
lang: pt-br
layout: post
title: "Revisando Modularidade com Claude Code"
date: 2026-04-12
categories: [coding]
tags: [arquitetura, modularidade, acoplamento, likec4, claude-code]
permalink: /coding/2026/04/12/modularity-review-claude-code/
---

Na semana passada, testei o plugin [vladikk/modularity](https://github.com/vladikk/modularity) para Claude Code em alguns diagramas LikeC4 de um sistema no qual eu estou trabalhando.

Meu objetivo era experimentar o plugin, que é baseado no modelo [Balanced Coupling](https://coupling.dev/).

## O que o plugin faz

O plugin contém duas skills:

**`/modularity:design`** — gera uma arquitetura modular a partir de requisitos (projeta sistemas do zero)

**`/modularity:review`** — analisa uma base de código existente em busca de desequilíbrios de acoplamento

## Como usei

Primeiro instalei o plugin, clonei o repositório onde os diagramas [LikeC4](https://likec4.dev/) do sistema estão versionados e executei o comando `/modularity:review`. A skill então gerou um relatório contendo:
- Um Resumo Executivo com uma visão geral do sistema
- Uma Visão Geral de Acoplamento listando, para cada integração:
  - Módulo correspondente e suas dependências
  - Força: Intrusive, Model, Functional
  - Distância: Cross-team
  - Volatilidade: Alta, Média
  - Balanceado?: Crítico, Tolerável

## O que resultou

Para cada uma das integrações listadas, um relatório detalhado descreve `Knowledge Leakage`, `Complexity Impact`, `Cascading Changes` identificados e, mais importante, `Recommended Improvements` com *Trade-off* detalhando os custos de implementar as melhorias que trariam equilíbrio ao acoplamento identificado.

## Vale experimentar

Se você já usa LikeC4 (ou qualquer ferramenta de arquitetura-como-código), execute `/modularity:review` e obtenha uma crítica fundamentada em segundos.

Não substitui uma revisão de arquitetura aprofundada, mas levanta as perguntas certas rapidamente e oferece vocabulário para discutir trade-offs com sua equipe.

Para um mergulho mais fundo em modularidade, confira o livro de Vlad Khononov: [Balancing Coupling in Software Design: Universal Design Principles for Architecting Modular Software Systems](https://www.oreilly.com/library/view/balancing-coupling-in/9780137353514/).
