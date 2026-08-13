---
lang: pt-br
layout: post
title: "Aprendizados sobre IA: versão Ago/2026"
date: 2026-08-13
categories: [ai]
tags: [ia, aprendizados, gestao-do-conhecimento, memoria, wardley-mapping]
permalink: /ai/2026/08/13/ai-learnings-aug-2026/
---

Agosto foi principalmente sobre conhecimento: como armazená-lo, como mantê-lo atualizado e como torná-lo útil tanto para pessoas quanto para agentes. Aqui estão os conceitos que chamaram minha atenção este mês.

## llm-wiki e o Open Knowledge Format

Meu colega Majid me apresentou duas ideias relacionadas que eu ainda não conhecia: o padrão llm-wiki e o Open Knowledge Format.

O [llm-wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) é um gist do Andrej Karpathy que descreve um padrão simples: em vez de executar retrieval sobre documentos brutos a cada pergunta, você deixa o LLM manter uma wiki. São três camadas — as fontes brutas, que nunca são modificadas; a wiki em si, um conjunto de páginas markdown que o LLM escreve e atualiza; e um documento de schema (um `CLAUDE.md`, por exemplo) que define as convenções e os fluxos de trabalho. Dois arquivos têm significado especial: `index.md` cataloga as páginas e `log.md` é um histórico append-only do que aconteceu.

Os fluxos de trabalho são igualmente simples: **ingestão** de uma nova fonte com atualização das páginas afetadas, **consulta** à wiki com as boas respostas sendo arquivadas de volta como novas páginas, e um **lint** periódico para revelar contradições, afirmações desatualizadas e páginas órfãs. O argumento sobre por que isso funciona agora não é técnico, mas econômico — wikis sempre se deterioraram porque mantê-las é tedioso, e um LLM não se entedia.

O [Open Knowledge Format](https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing) (OKF) é a tentativa do Google de formalizar esse padrão em uma especificação aberta e independente de fornecedor. O formato em si é deliberadamente mínimo: um diretório de arquivos markdown com frontmatter YAML, mais um pequeno conjunto de convenções. A única exigência é um campo `type` não vazio. Todo o resto é opcional, e vale a leitura da [especificação](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md) justamente por esses campos opcionais, onde estão as decisões de design mais interessantes:

| Família de campos | O que registra |
|---|---|
| `sources` | De onde vieram as afirmações da página, com autor e sinais de uso opcionais |
| `generated` / `verified` | Quem produziu ou verificou a página, e quando |
| `status` | `draft`, `stable` ou `deprecated` |
| `stale_after` | A data a partir da qual o conteúdo deve ser tratado como desatualizado |

Há também uma convenção para identificar atores — `human:<id>` para pessoas, `<producer>/<version>` para agentes, `process:<id>` para automações — que é o que permite a quem consome distinguir conteúdo revisado por humanos de conteúdo gerado por máquina.

## Como isso mudou minha visão sobre memória

Em abril escrevi sobre [onde a memória do Claude Code realmente pertence](/ai/2026/04/13/claude-code-memory-best-practices/). A regra que adotei foi: se a regra importa para o projeto, ela vai no `AGENTS.md`; se é uma preferência pessoal sobre como o Claude se comporta com você, a auto-memória serve. Continuo achando que a regra está correta. O que penso agora é que ela cobre apenas parte do problema.

Aquele post tratava memória como uma coisa só. Ler sobre llm-wiki e OKF deixou claro que existem dois tipos bem diferentes de conteúdo envolvidos, e eles têm quase nada em comum além de serem markdown:

- **Steering** é imperativo. Diz ao agente o que fazer: use conventional commits, mantenha este arquivo abaixo de 200 linhas, nunca faça commit na main. É carregado em toda sessão, e é exatamente por isso que precisa ser pequeno.
- **Conhecimento** é descritivo. Registra como algo funciona, o que uma métrica significa, o que concluímos na última vez. É consultado quando relevante, não carregado antecipadamente.

Três consequências dessa distinção que eu não havia considerado em abril.

**O limite de 200 linhas é uma regra sobre steering, não sobre memória.** Eu tratei tamanho como uma restrição geral porque a aderência às instruções cai conforme os arquivos de instrução crescem. Isso é verdade, mas só se aplica a conteúdo carregado incondicionalmente. Uma base de conhecimento acessada por um `index.md` pode ter centenas de páginas e custar quase nada no início de uma sessão. Separar as duas coisas transforma o limite em um orçamento sobre o que você pode *instruir*, e não em um teto sobre o que você pode *lembrar*.

**O conhecimento se deteriora, e meu modelo original não tinha vocabulário para isso.** Minha regra é binária: uma regra importa para o projeto ou não. Mas uma página que descreve como um serviço funciona era precisa em abril e pode não ser em agosto. Os campos `status` e `stale_after` do OKF tratam disso no momento da escrita, quando o autor de fato sabe a validade do conteúdo, em vez de deixar a descoberta para o momento da leitura.

**Procedência importa mais do que eu supunha, e principalmente por causa dos agentes.** O ponto mais útil que encontrei não estava no gist em si, mas nos comentários: uma página da wiki nunca deve poder servir de fundamento para outra página da wiki. Sem essa restrição, uma página cita uma página que citou uma alucinação, e em algum momento três documentos concordam entre si. Isso não é preocupação quando você escreve todas as notas. Passa a ser assim que um agente escreve páginas que você não leu, que é exatamente a direção para onde tudo isso está indo.

Onde cheguei, por ora, é uma divisão em três níveis em vez de dois:

1. **Steering** — `AGENTS.md` e memória pessoal. Imperativo, sempre carregado, pequeno.
2. **Conhecimento** — uma llm-wiki em um repositório, consultada sob demanda, com cada página declarando suas fontes.
3. **Conhecimento compartilhado** — a mesma wiki, tornada conformante com o OKF, quando ela sai da minha máquina.

Duas notas práticas. Como `type` é o único campo obrigatório do OKF, escrever o nível 2 já como OKF significa que promovê-lo ao nível 3 não custa nada depois. E o padrão precisa de volume para valer a pena — a discussão no gist sugere que funciona bem em torno de cem fontes — então um domínio restrito e bem definido é uma primeira tentativa melhor do que uma wiki de propósito geral.

## Reduzindo a fricção no desenvolvimento assistido por IA

Rahul Garg publicou [Patterns for reducing friction in AI-assisted development](https://martinfowler.com/articles/reduce-friction-ai/) no site do Martin Fowler. A ideia central é que tendemos a tratar assistentes de código como ferramentas que precisam de pouco contexto, quando eles se comportam muito mais como colegas que precisam de onboarding.

Os cinco padrões que ele descreve são:

1. **Knowledge Priming** — compartilhar contexto curado do projeto de antemão: stack, convenções, padrões
2. **Design-First Collaboration** — trabalhar o design antes da implementação
3. **Encoding Team Standards** — tornar o conhecimento tácito explícito e compartilhável
4. **Context Anchoring** — manter documentos vivos que preservam decisões
5. **Feedback Flywheel** — melhorar a própria colaboração por meio de retrospectivas

O que acho mais útil é o ponto sobre medição. Se você avalia a assistência de IA pela velocidade com que o código aparece, você ignora o retrabalho que ela gera. Aceitação de primeira e volume de retrabalho dizem mais sobre se a colaboração está realmente funcionando. A sobreposição com a seção anterior é difícil de ignorar: knowledge priming e context anchoring são o mesmo problema que o padrão llm-wiki endereça, descrito pelo lado da entrega em vez do lado do armazenamento.

## Uma introdução ao Wardley Mapping

Ainda no tema de conhecimento, mas de outro tipo: [esta playlist no YouTube](https://youtube.com/playlist?list=PLpOPGFYrQ_DuDaqPqcH8bM4VsISWxCHAd) é uma introdução ao Wardley Mapping.

Um Wardley Map é uma forma de desenhar o que sua organização faz para poder raciocinar sobre estratégia. Você parte das necessidades dos usuários, lista os componentes necessários para atendê-las, encadeia esses componentes por dependência e então posiciona cada um em um eixo horizontal de evolução — de genesis, passando por custom-built e product, até commodity. O eixo vertical é a visibilidade para o usuário.

O valor está no eixo de evolução. Componentes se movem para a direita com o tempo, e como você deve tratar um componente depende inteiramente de onde ele está: algo em genesis precisa de experimentação e tolerância ao desperdício, algo próximo de commodity deve ser comprado em vez de construído. A maioria das discussões sobre construir ou comprar acaba sendo uma discussão sobre onde o componente realmente está.

Incluí o tema aqui porque a conexão com o resto do post é mais próxima do que parece. Tanto o Wardley Mapping quanto o padrão llm-wiki são tentativas de tornar explícito, o suficiente para ser discutido e compartilhado, um conhecimento que normalmente vive na cabeça das pessoas. Um faz isso para estratégia, o outro para documentação.
