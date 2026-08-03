---
lang: pt-br
layout: post
title: "ai-skills: Minhas Skills como Plugins do Claude"
date: 2026-08-03
categories: [ai]
tags: [ai, claude-code, skills, plugins, agents-md]
permalink: /ai/2026/08/03/ai-skills-claude-plugins/
---

Nos últimos meses, escrevi vários pedaços de um quebra-cabeça: [revisando modularidade com um plugin do Claude Code](/coding/2026/04/12/modularity-review-claude-code/), [onde a memória do Claude Code realmente pertence](/ai/2026/04/13/claude-code-memory-best-practices/), e os steering documents que aprendi com o Kiro. Todos esses foram fragmentos do mesmo esforço: construir um conjunto duradouro de skills que realmente melhora a entrega de software.

Esse esforço agora está público: [azborgonovo/ai-skills](https://github.com/azborgonovo/ai-skills).

## Por que Claude Plugins?

O primeiro motivo é que essas skills são caras de construir. Acertar o prompt de uma skill exige muitas iterações e muitos tokens gastos ajustando-a contra trabalho real. Torná-las open-source significa que qualquer pessoa pode se beneficiar do resultado em vez de reconstruí-lo do zero.

O segundo é mais egoísta: distribuí-las como Claude Plugins significa que todos os meus próprios repositórios podem trazer as mesmas skills para um Claude sandbox environment.

## O que você pode esperar

Cada plugin agrupa um conjunto de skills relacionadas, e cada skill carrega um rótulo de maturidade e de invocação:

- **Maturidade** — *Adopt* (comprovada em trabalho real), *Trial* (usável, ainda sendo validada), ou *Draft* (recém-criada, ainda sem uso sério)
- **Invocação** — *Auto* (o Claude a invoca automaticamente quando relevante, mas você também pode chamá-la diretamente) ou *Manual* (só é acionada com `/skill-name`)

Confira o [repositório](https://github.com/azborgonovo/ai-skills) para a lista atualizada de plugins publicados. Atualmente ela cobre BDD, code review, decision records, agent docs, engineering practices e planning.

Algumas skills como `/pareto`, `/atlassian-identity-cache`, e uma base de conhecimento `/team-topologies` ainda são *Draft* e não fazem parte de nenhum plugin. Elas podem ser consumidas clonando o repositório e rodando o script [`link_skills.py`](https://github.com/azborgonovo/ai-skills/blob/main/scripts/link_skills.py), baseado em symlinks.

O repositório também tem uma pasta `tools/` para scripts que usam um AI harness em vez de serem usados por um, como o [`ralph_loop.py`](https://github.com/azborgonovo/ai-skills/blob/main/tools/ralph-loop/README.md).

## Try it

Se algo disso se sobrepõe a problemas que você enfrenta no dia a dia (como escrever Gherkin, revisar PRs, registrar decisões, manter arquivos `.md` enxutos), instale o plugin correspondente e veja se ele conquista o rótulo *Adopt* no seu próprio trabalho. Issues e pull requests são bem-vindos no repositório.
