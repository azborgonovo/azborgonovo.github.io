---
lang: pt-br
layout: post
title: "Memória do Claude Code: Onde as Regras Realmente Pertencem"
date: 2026-04-13
categories: [ai]
tags: [claude-code, memória, claude-md, agents-md, boas-práticas]
permalink: /ai/2026/04/12/claude-code-memory-best-practices/
---

Enquanto aprendia a usar o Claude Code, me deparei com uma dúvida que não é imediatamente óbvia: quando o Claude salva algo na sua auto-memória, devo commitar isso no git?

Resposta curta: não — e você não deveria precisar fazer isso.

## Como funciona a memória do Claude Code

O Claude Code tem duas camadas de memória distintas:

**Auto-memória** (`~/.claude/projects/<repo>/memory/`) — o Claude escreve anotações para si mesmo enquanto trabalha: coisas que aprendeu sobre o seu projeto, convenções que identificou, correções que você fez. Fica na sua máquina, fora do repositório. Nunca é commitado no git.

**Memória de projeto** (`CLAUDE.md` / `AGENTS.md`) — instruções que você escreve explicitamente para o Claude (e outras ferramentas de IA). Ficam dentro do repositório, são versionadas com o git e carregadas no início de cada sessão.

## A regra geral

> Se uma regra importa para o projeto, coloque no `CLAUDE.md`. Se é uma preferência pessoal de como o Claude deve se comportar *com você*, a auto-memória está bem.

A distinção é: *outro desenvolvedor ou agente de IA precisaria dessa regra?* Se sim, ela pertence ao repositório.

## Um exemplo concreto

Hoje o Claude identificou corretamente que posts em PT-BR neste blog precisam de um campo `permalink` no front matter para que o jekyll-polyglot consiga parear as versões de idioma no toggle de linguagem. O Claude salvou isso na auto-memória.

Mas essa é uma regra de projeto — afeta qualquer pessoa (ou IA) trabalhando neste repositório. Então eu a movi para o `AGENTS.md` e deletei a entrada de memória. Agora está versionada, visível em code review e disponível para todas as ferramentas.

## Outras coisas úteis de saber

- O `CLAUDE.md` conta contra sua janela de contexto a cada sessão — mantenha-o conciso (50–200 linhas é a orientação prática).
- A auto-memória tem um limite de 200 linhas / 25 KB no que é carregado no início da sessão.
- Você pode desabilitar a auto-memória com `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1` se preferir gerenciar tudo manualmente.
- Se o seu repositório usa `AGENTS.md` (a convenção do OpenAI Codex), você pode fazer o `CLAUDE.md` importá-lo para que ambas as ferramentas leiam as mesmas instruções sem duplicação.

A conclusão: use a auto-memória para contexto efêmero e pessoal. Use o `CLAUDE.md` para qualquer coisa que deva sobreviver à sua máquina atual ou facilitar o onboarding do próximo colaborador.
