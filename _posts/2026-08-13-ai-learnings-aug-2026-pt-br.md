---
lang: pt-br
layout: post
title: "Aprendizados sobre IA: versão Ago/2026"
date: 2026-08-13
categories: [ai]
tags: [ia, aprendizados, gestao-do-conhecimento, memoria, wardley-mapping]
permalink: /ai/2026/08/13/ai-learnings-aug-2026/
---

## llm-wiki e o Open Knowledge Format

Meu colega Majid me apresentou duas ideias relacionadas que eu ainda não conhecia: o padrão llm-wiki e o Open Knowledge Format (OKF).

O [llm-wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) é um gist do Andrej Karpathy que descreve um padrão simples: em vez de executar retrieval sobre documentos brutos a cada pergunta, você deixa o LLM manter uma wiki. São três camadas:
- As fontes *brutas*, que nunca são modificadas;
- A *wiki* em si, um conjunto de páginas markdown que o LLM escreve e atualiza;
- E um *documento de schema* (um `CLAUDE.md`, por exemplo) que define as convenções e os fluxos de trabalho.

Dois arquivos têm significado especial: `index.md` cataloga as páginas e `log.md` é um histórico append-only do que aconteceu.

Os fluxos de trabalho são os seguintes:
1. *ingerir* uma nova fonte e atualizar as páginas afetadas
2. *consultar* a wiki e arquivar as boas respostas de volta como novas páginas
3. rodar um *lint* periódico para revelar contradições, afirmações desatualizadas e páginas órfãs

O argumento sobre por que o llm-wiki funciona é que wikis sempre se deterioraram porque mantê-las é tedioso, e um LLM não se entedia.

O [Open Knowledge Format](https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing) (OKF) é a tentativa do Google de formalizar esse padrão em uma especificação aberta e independente de fornecedor. O formato em si é opinativo e mínimo: um diretório de arquivos markdown com frontmatter YAML, mais um pequeno conjunto de convenções. A única exigência é um campo `type` não vazio. Todo o resto é opcional, e vale a leitura da [especificação](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md) justamente por esses campos opcionais, onde estão as decisões de design mais interessantes:

| Família de campos | O que registra |
|---|---|
| `sources` | De onde vieram as afirmações da página, com autor e sinais de uso opcionais |
| `generated` / `verified` | Quem produziu ou verificou a página, e quando |
| `status` | `draft`, `stable` ou `deprecated` |
| `stale_after` | A data a partir da qual o conteúdo deve ser tratado como desatualizado |

Há também uma convenção para identificar atores, que é o que permite a quem consome distinguir conteúdo revisado por humanos de conteúdo gerado por máquina. O formato usa `human:<id>` para pessoas, `<producer>/<version>` para agentes e `process:<id>` para automações.

## Como isso evoluiu minha visão sobre memória de agentes

Em abril escrevi sobre [onde a memória do Claude Code realmente pertence](/ai/2026/04/13/claude-code-memory-best-practices/). A regra que adotei foi: se a regra importa para o projeto, ela vai no `AGENTS.md`; se é uma preferência pessoal sobre como o Claude se comporta com você, seu `CLAUDE.md` pessoal, rules ou auto-memória servem. Continuo achando que a regra está correta.

Ler sobre llm-wiki e OKF deixou claro que existem dois tipos bem diferentes de contexto:

- Documentos de **steering** são imperativos. Dizem ao agente o que fazer: use conventional commits, mantenha este arquivo abaixo de 200 linhas, nunca faça commit na main. São carregados em toda sessão e devem ser pequenos.
- Documentos de **conhecimento** são descritivos. Registram como algo funciona, o que uma métrica significa, o que concluímos na última vez. São consultados quando necessário, em vez de carregados antecipadamente.

Três consequências dessa distinção que eu não havia considerado em abril.

**O limite de 200 linhas é uma regra sobre steering, não sobre memória.**
Eu tratei tamanho como uma restrição geral porque a aderência às instruções cai conforme os arquivos de instrução crescem. Isso é verdade, mas só se aplica a conteúdo carregado incondicionalmente. Uma base de conhecimento acessada por um `index.md` pode ter centenas de páginas e custar quase nada no início de uma sessão. Separar as duas coisas transforma o limite em um orçamento sobre o que você pode *instruir*, e não em um teto sobre o que você pode *lembrar*.

**O conhecimento se deteriora, as regras de steering não.**
Minha regra era binária: uma regra importa para o projeto ou não. Mas uma página que descreve como um serviço funciona era precisa em abril e pode não ser em agosto. Os campos `status` e `stale_after` do OKF tratam disso no momento da escrita, quando o autor de fato sabe a validade do conteúdo, em vez de deixar a descoberta para o momento da leitura.

**A confiança em uma base de conhecimento depende de onde cada página está fundamentada.**
Os comentários no gist do llm-wiki são tão perspicazes quanto o conceito em si. O mais interessante para mim: uma página da wiki nunca deve poder servir de fundamento para outra página da wiki. Sem essa restrição, uma página cita uma página que citou uma alucinação, e em algum momento três documentos concordam entre si. Isso não é preocupação quando você escreve todas as notas. Passa a ser assim que um agente escreve páginas que você não leu, que é exatamente a direção para onde tudo isso está indo.

## Reduzindo a fricção no desenvolvimento assistido por IA

Rahul Garg publicou [Patterns for reducing friction in AI-assisted development](https://martinfowler.com/articles/reduce-friction-ai/) no site do Martin Fowler. Adorei como ele enquadrou o onboarding de agentes de IA como o mesmo problema que enfrentamos ao integrar um novo colega de time.

Os cinco padrões que ele descreve são:

1. **Knowledge Priming**: compartilhar contexto curado do projeto de antemão, como stack, convenções, padrões
2. **Design-First Collaboration**: trabalhar o design antes da implementação
3. **Encoding Team Standards**: tornar o conhecimento tácito explícito e compartilhável
4. **Context Anchoring**: manter documentos vivos que preservam decisões
5. **Feedback Flywheel**: melhorar a própria colaboração por meio de retrospectivas

O que acho mais útil é o ponto sobre medição. Se você avalia a assistência de IA pela velocidade com que o código aparece, você ignora o retrabalho que ela gera. Aceitação de primeira e volume de retrabalho dizem mais sobre se a colaboração está realmente funcionando.

## Uma introdução ao Wardley Mapping

Embora não esteja diretamente relacionado a IA, o Wardley Mapping é um assunto que eu vinha querendo estudar com mais calma, e que se relaciona bem com os temas de conhecimento acima. Assisti à [playlist gratuita sobre Wardley Mapping](https://youtube.com/playlist?list=PLpOPGFYrQ_DuDaqPqcH8bM4VsISWxCHAd) gravada pelo próprio Simon Wardley.

A playlist está no canal AWS Public Sector no YouTube, e as lições estão divididas em quatro:
1. Como e por que mapear seu negócio
2. Como identificar padrões
3. Como antecipar mudanças
4. Como usar doctrine e gameplay

Há bastante material bom disponível online para aprofundar o tema, como o [learnwardleymapping.com](https://learnwardleymapping.com/introduction/). Wardley Maps são uma ferramenta crítica se você quer mapear seu negócio e raciocinar sobre estratégia com um framework sólido e eficaz.
