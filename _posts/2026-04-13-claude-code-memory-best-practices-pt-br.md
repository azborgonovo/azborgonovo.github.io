---
lang: pt-br
layout: post
title: "Memória do Claude Code: Onde as Regras Realmente Pertencem"
date: 2026-04-13
categories: [ai]
tags: [claude-code, memória, claude-md, agents-md, boas-práticas]
permalink: /ai/2026/04/13/claude-code-memory-best-practices/
---

Faz algum tempo que uso o Claude Code, e me deparei recentemente com a seguinte dúvida: quando o Claude salva algo na sua auto-memória, devo commitar isso no git?

Resposta curta: não — e você não deveria precisar fazer isso.

## Como funciona a memória do Claude Code

O Claude Code tem duas camadas de memória distintas:

**Auto-memória** (`~/.claude/projects/<repo>/memory/`) — o Claude escreve anotações para si mesmo enquanto trabalha: coisas que aprendeu sobre o seu projeto, convenções que identificou, correções que você fez. Fica na sua máquina, fora do repositório. Nunca é commitado no git.

**Memória de projeto** (`CLAUDE.md` / `AGENTS.md`) — instruções que você escreve explicitamente para o Claude (e outras ferramentas de IA). Ficam dentro do repositório, são versionadas com o git e carregadas no início de cada sessão.

## A regra geral

> Se uma regra importa para o projeto, coloque no `AGENTS.md`. Se é uma preferência pessoal de como o Claude deve se comportar *com você*, a auto-memória está bem.

A distinção é: *outro desenvolvedor ou agente de IA precisaria dessa regra?* Se sim, ela pertence ao repositório.

## Um exemplo concreto

Ontem pedi ao Claude para salvar uma regra de sempre gerar um campo `permalink` no front matter ao criar novos posts comigo. O Claude salvou isso na auto-memória.

Mas depois de questionar se era o lugar certo, concluímos que é uma regra de projeto — afeta qualquer pessoa (ou IA) trabalhando neste repositório. Então eu a movi para o `AGENTS.md` e deletei a entrada de memória. Agora está versionada, visível em code review e disponível para todas as ferramentas.

## Outras coisas úteis de saber

- Mantenha o `AGENTS.md` com menos de 200 linhas — a [documentação oficial](https://code.claude.com/docs/en/best-practices) avisa que arquivos mais longos consomem mais contexto e a aderência às instruções cai de forma mensurável.
- Você pode desabilitar a auto-memória com `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1` se preferir gerenciar tudo manualmente.
- Se o seu repositório usa `AGENTS.md`, você pode fazer o `CLAUDE.md` importá-lo para que ambas as ferramentas leiam as mesmas instruções sem duplicação.

## Referências

- [Como o Claude lembra do seu projeto](https://code.claude.com/docs/en/memory)
- [Boas práticas para o Claude Code](https://code.claude.com/docs/en/best-practices)
