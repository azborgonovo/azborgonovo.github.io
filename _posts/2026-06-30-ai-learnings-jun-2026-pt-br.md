---
lang: pt-br
layout: post
title: "Aprendizados sobre IA: versão Jun/2026"
date: 2026-06-30
categories: [ai]
tags: [ia, aprendizados, claude-code, kiro]
permalink: /ai/2026/06/30/ai-learnings-jun-2026/
---

Junho chega ao fim com bastante material interessante para compartilhar. Aqui estão os links, ferramentas e conceitos que chamaram minha atenção este mês.

## Beyond the basics with Claude Code

[Beyond the basics with Claude Code](https://www.youtube.com/watch?v=tuY2ChJIx48) é um vídeo que vai além do uso introdutório do Claude Code e explora padrões mais avançados — o tipo de conteúdo que se torna útil depois que você já passou da fase "funciona" e quer entender *por que* certas abordagens funcionam melhor que outras.

## Que tipo de dev você é?

Um ex-colega meu, Lucas Campos, lançou um quiz de personalidade divertido para engenheiros de software navegando na era da IA: [whatkindof.dev](https://whatkindof.dev/). Inspirado no 16Personalities, o quiz faz perguntas sobre *o que você faz agora que o código praticamente se escreve sozinho* — não sobre como você pensa em geral. Ele mapeia você para um dos treze arquétipos (O Perfeccionista, O Detetive, O Capitão, O Cowboy, entre outros, com um mantido em segredo até ser descoberto) e indica sua posição em uma escala de adoção de IA. Sem conta, sem rastreamento, as respostas ficam locais no navegador. É descontraído mas surpreendentemente preciso. Experimente.

## Instabilidade do Claude Code

Se você usa o Claude Code diariamente, provavelmente já tem [status.claude.com](https://status.claude.com/) nos favoritos. Junho incluiu alguns períodos notáveis de degradação de serviço — incidentes que serviram como lembrete de que estamos construindo fluxos de trabalho sobre uma infraestrutura que ainda está amadurecendo. Vale manter a página de status à mão e ter um plano alternativo para os momentos em que o serviço não está responsivo.

## Loop Engineering

Addy Osmani publicou [Loop Engineering](https://addyosmani.com/blog/loop-engineering/) — um post que reformula como devemos pensar sobre o trabalho com agentes de código. A ideia central: em vez de fazer prompts manuais para agentes turno a turno, devemos projetar sistemas que façam prompts para agentes por conta própria. Como Osmani coloca, "Loop engineering é se substituir como a pessoa que faz os prompts."

O post descreve cinco componentes de um loop bem projetado:
1. **Automações** — tarefas agendadas que surfaceiam trabalho sem supervisão humana constante
2. **Worktrees** — diretórios de trabalho isolados que permitem o trabalho paralelo de agentes sem conflitos de arquivos
3. **Skills** — conhecimento documentado do projeto (armazenado em arquivos `SKILL.md`) codificando convenções e contexto
4. **Plugins & Conectores** — integrações MCP conectando agentes a ferramentas e ambientes reais
5. **Sub-agentes** — agentes separados responsáveis pela verificação, para que criadores não avaliem o próprio trabalho

O aviso essencial é igualmente importante: loop engineering exige julgamento. Os loops não sabem a diferença entre acelerar um trabalho compreendido e evitar compreendê-lo. Você sabe.

## Documentos de steering: a abordagem do Kiro

Um dos conceitos mais interessantes que encontrei este mês são os [documentos de steering do Kiro](https://kiro.dev/docs/steering/). Kiro é uma nova IDE com IA que introduz o *steering* como mecanismo para fornecer conhecimento persistente e estruturado ao agente sobre o workspace — o equivalente ao que `CLAUDE.md` e `AGENTS.md` fazem para o Claude Code.

Os arquivos de steering ficam em `.kiro/steering/` e são arquivos markdown com um pequeno bloco de frontmatter que controla quando são carregados. O Kiro gera automaticamente três arquivos fundamentais:

- **product.md** — propósito do produto, usuários-alvo, funcionalidades principais e objetivos de negócio
- **tech.md** — frameworks, bibliotecas, ferramentas e restrições técnicas
- **structure.md** — organização de arquivos, convenções de nomenclatura, padrões de importação e decisões arquiteturais

Além da base, aqui estão os arquivos de steering comuns recomendados pelo Kiro:

| Arquivo | O que colocar |
|---|---|
| `api-standards.md` | Convenções REST, formatos de resposta de erro, fluxos de autenticação, estratégias de versionamento |
| `testing-standards.md` | Padrões de testes unitários e de integração, abordagens de mocking, expectativas de cobertura |
| `code-conventions.md` | Padrões de nomenclatura, organização de arquivos, ordenação de imports, decisões arquiteturais |
| `security-policies.md` | Requisitos de autenticação, validação de dados, sanitização de inputs, prevenção de vulnerabilidades |
| `deployment-workflow.md` | Procedimentos de build, configurações de ambiente, etapas de deploy, estratégias de rollback |

### Modos de inclusão

O que torna o steering particularmente interessante é como ele controla *quando* um documento é carregado — e isso vai soar familiar para quem já usou skills do Claude Code:

- **Always** — carregado em toda interação; ideal para convenções centrais e políticas de segurança
- **fileMatch** — carregado apenas ao trabalhar com arquivos que correspondem a um padrão glob (ex.: só carregar `testing-standards.md` ao editar arquivos `**/*.test.*`)
- **Manual** — referenciado explicitamente via `#nome-do-arquivo` no chat; aparece como slash command
- **Auto** — o Kiro compara a descrição do arquivo com o pedido do usuário para decidir se deve incluí-lo; também acessível como slash command

Se você já usou skills do Claude Code, o paralelo é difícil de ignorar. As skills também controlam *quando* são ativadas, por meio de descrições de gatilho que o modelo compara com a intenção do usuário. A diferença é principalmente na implementação: o Kiro expõe isso como um conceito de primeira classe na IDE com frontmatter, enquanto as skills do Claude Code são arquivos markdown com instruções de invocação. O insight subjacente é o mesmo — ferramentas de IA funcionam melhor quando recebem o contexto certo no momento certo, e esse gerenciamento de contexto não deve ser deixado ao acaso ou à repetição manual a cada sessão.

Independentemente da IDE com IA que você usa, as categorias que o Kiro nomeia (padrões de API, padrões de teste, convenções de código, políticas de segurança, fluxo de deploy) são uma boa lista de verificação para construir sua própria biblioteca de contexto.
