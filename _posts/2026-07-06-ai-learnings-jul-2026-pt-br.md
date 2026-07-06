---
lang: pt-br
layout: post
title: "Aprendizados sobre IA: versão Julho/2026"
date: 2026-07-06
categories: [ai]
tags: [ia, aprendizados, claude-code, kiro]
permalink: /ai/2026/07/06/ai-learnings-jul-2026/
---

Estamos há poucos dias em julho, e ainda há bastante material interessante vindo de junho para compartilhar. Aqui estão os links, ferramentas e conceitos que chamaram minha atenção recentemente.

## Beyond the basics with Claude Code

[Beyond the basics with Claude Code](https://www.youtube.com/watch?v=tuY2ChJIx48) é uma palestra de Daisy Hollman, Member of Technical Staff na Anthropic, que vai além do uso introdutório, ajuda a entender o *porquê* e explora padrões mais avançados. A palestra de Hollman é clara, bem ritmada e fundamentada em detalhes práticos em vez de hype.

## Que tipo de dev você é?

Um ex-colega meu, Lucas Campos, lançou um quiz de personalidade divertido para engenheiros de software navegando na era da IA: [whatkindof.dev](https://whatkindof.dev/). Inspirado no 16Personalities, o quiz faz perguntas sobre *o que você faz agora que o código praticamente se escreve sozinho* — não sobre como você pensa em geral. Ele mapeia você para um dos treze arquétipos (O Perfeccionista, O Detetive, O Capitão, O Cowboy, entre outros, com um mantido em segredo até ser descoberto) e indica sua posição em uma escala de adoção de IA. Sem conta, sem rastreamento, as respostas ficam locais no navegador. Experimente.

## Instabilidade do Claude Code

Se você usa o Claude Code diariamente, provavelmente já sentiu alguma [instabilidade](https://status.claude.com/) em junho. Alguns períodos notáveis de degradação de serviço serviram como lembrete de que estamos construindo fluxos de trabalho sobre uma infraestrutura que ainda está amadurecendo.

## Loop Engineering

Addy Osmani publicou um post sobre [Loop Engineering](https://addyosmani.com/blog/loop-engineering/) que reformula como devemos pensar sobre o trabalho com agentes de código.

A ideia central: em vez de fazer prompts manuais para agentes turno a turno, devemos projetar sistemas que façam prompts para os agentes por conta própria. Como Osmani coloca, "Loop engineering é se substituir como a pessoa que faz os prompts."

O post descreve cinco componentes de um loop bem projetado:
1. **Automações**: tarefas agendadas que surfaceiam trabalho sem supervisão humana constante
2. **Worktrees**: diretórios de trabalho isolados que permitem o trabalho paralelo de agentes sem conflitos de arquivos
3. **Skills**: conhecimento documentado do projeto (armazenado em arquivos `SKILL.md`) codificando convenções e contexto
4. **Plugins & Conectores**: integrações MCP conectando agentes a ferramentas e ambientes reais
5. **Sub-agentes**: agentes separados responsáveis pela verificação, para que criadores não avaliem o próprio trabalho

O aviso essencial é igualmente importante: loop engineering exige [julgamento](https://martinfowler.com/articles/exploring-gen-ai/humans-and-agents.html). Os loops não sabem a diferença entre acelerar um trabalho compreendido e evitar compreendê-lo por completo.

## Documentos de steering: a abordagem do Kiro

Eu estava procurando uma abordagem padrão para definir documentos que apoiem a entrega com IA, e um dos poucos conceitos que encontrei até agora foram os [documentos de steering do Kiro](https://kiro.dev/docs/steering/).

Esses documentos têm um modo de inclusão definido que informa *quando* um documento é carregado. É parecido com as Agent Skills, mas [vale a leitura](https://kiro.dev/docs/steering/#inclusion-modes) porque estende um pouco mais o conceito.

Ainda assim, o que chamou minha atenção foi como eles estruturaram os documentos fundamentais. Três arquivos são gerados automaticamente quando você começa:

- **product.md** — propósito do produto, usuários-alvo, funcionalidades principais e objetivos de negócio
- **tech.md** — frameworks, bibliotecas, ferramentas e restrições técnicas
- **structure.md** — organização de arquivos, convenções de nomenclatura, padrões de importação e decisões arquiteturais

Além da base, os seguintes arquivos de steering comuns são recomendados pelo Kiro:

| Arquivo | O que colocar |
|---|---|
| `api-standards.md` | Convenções REST, formatos de resposta de erro, fluxos de autenticação, estratégias de versionamento |
| `testing-standards.md` | Padrões de testes unitários e de integração, abordagens de mocking, expectativas de cobertura |
| `code-conventions.md` | Padrões de nomenclatura, organização de arquivos, ordenação de imports, decisões arquiteturais |
| `security-policies.md` | Requisitos de autenticação, validação de dados, sanitização de inputs, prevenção de vulnerabilidades |
| `deployment-workflow.md` | Procedimentos de build, configurações de ambiente, etapas de deploy, estratégias de rollback |

Independentemente da IDE com IA que você usa, as categorias que o Kiro nomeia (padrões de API, padrões de teste, convenções de código, políticas de segurança, fluxo de deploy) são uma boa lista de verificação para construir sua própria biblioteca de contexto.
