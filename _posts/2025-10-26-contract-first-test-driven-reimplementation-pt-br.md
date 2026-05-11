---
lang: pt-br
layout: post
title: "Contract-First, Test-Driven: Guardrails para Desenvolvimento Assistido por IA"
date: 2025-10-26
categories: [coding]
tags: [copilot, tdd, grpc, protobuf, speckit, api-first, ai-assistido]
permalink: /coding/2025/10/26/contract-first-test-driven-reimplementation/
---

Tenho um microsserviço gRPC com o qual estou satisfeito: bem testado, contratos definidos em arquivos .proto e uma suite de [testes de componente](https://martinfowler.com/articles/microservice-testing/#testing-component-introduction) sólida cobrindo toda a stack contra um banco de dados. Há algumas semanas tive um pensamento: e se eu deletasse toda a implementação e pedisse para uma IA reconstruí-la do zero?

## A configuração

O ponto de partida é um serviço gRPC em .NET 9 com vários serviços definidos em sete arquivos .proto e uma suite de testes de componente com cerca de 50 testes rodando contra uma instância real do PostgreSQL via [TestContainers](https://testcontainers.com/guides/getting-started-with-testcontainers-for-dotnet/). Deletei todo o código de implementação, mantive os arquivos .proto e os testes, e configurei o GitHub Copilot no VS Code para fazer o trabalho.

As regras eram simples:
- Arquivos .proto não podem ser modificados (são o contrato da API)
- Asserções dos testes não podem ser modificadas (são os critérios de aceitação)

O contrato proto define cada operação com precisão:

```protobuf
service SubjectsService {
  rpc AddSubject(AddSubjectRequest) returns (AddSubjectResponse);
  rpc UpdateSubject(UpdateSubjectRequest) returns (UpdateSubjectResponse);
  rpc GetSubject(GetSubjectRequest) returns (GetSubjectResponse);
}

message AddSubjectRequest {
  string external_id = 1;
  string country = 2;
  map<string, string> properties = 3;
}

message AddSubjectResponse {
  string subject_id = 1;
}
```

Os testes começaram marcados como ignorados, sendo reativados um-a-um conforme cada serviço era implementado:

```csharp
[Fact(Skip = "Not implemented yet")]
public async Task AddSubject_Should_ReturnAValidNewSubjectId()
{
    var request = new AddSubjectRequest { Country = "NL", ExternalId = "user@example.com" };
    var response = await _client.AddSubjectAsync(request, _fixture.AuthenticatedMetadata);

    response.SubjectId.Should().NotBeNullOrWhiteSpace();
}
```

Fazer um teste passar de vermelho para verde é um marco claro. Não há espaço para o Copilot interpretar "pronto" de forma diferente.

## Planejamento com o GitHub SpecKit

Antes de pedir ao Copilot para escrever uma linha de implementação, usei o [GitHub SpecKit](https://github.com/github/spec-kit) para estruturar o planejamento. O SpecKit é um toolkit para Spec-Driven Development que guia por quatro etapas: uma **constituição** (princípios norteadores), uma **especificação** (o quê e por quê), um **plano** (abordagem técnica) e um **detalhamento de tarefas**.

Executar o fluxo completo em sequência gerou uma quantidade substancial de documentação tão detalhada a ponto de parecer um [big-design upfront](https://en.wikipedia.org/wiki/Big_design_up_front) e planejamento *waterfall*. Como era um experimento, não li tudo com cuidado. A parte boa: a constituição forneceu seis princípios que deram ao Copilot uma direção clara ao longo de toda a implementação, incluindo a imutabilidade dos arquivos proto e o padrão Result para tratamento de erros.

## O resultado

Todos os serviços implementados em poucos dias, com todos os testes passando. O Copilot produziu um serviço .NET corretamente estruturado em camadas com injeção de dependências, repositórios com EF Core e status codes gRPC mapeados corretamente. Cada serviço gRPC delega para um serviço de negócio que retorna um `Result` (via [FluentResults](https://github.com/altmann/FluentResults)), e a camada gRPC traduz isso para o status code apropriado:

```csharp
public override async Task<AddSubjectResponse> AddSubject(
    AddSubjectRequest request, ServerCallContext context)
{
    var properties = request.Properties?.ToDictionary(p => p.Key, p => p.Value)
        ?? new Dictionary<string, string>();

    var result = await _businessService.AddSubjectAsync(
        request.ExternalId, request.Country, properties);

    if (result.IsFailed)
        throw new RpcException(new Status(StatusCode.InvalidArgument,
            result.Errors.First().Message));

    return new AddSubjectResponse { SubjectId = result.Value.SubjectId };
}
```

Esse padrão (lógica de negócio retorna `Result`, camada gRPC mapeia falhas para status codes) foi aplicado de forma consistente em todos os serviços sem que eu pedisse explicitamente. O princípio da constituição de usar o padrão Result foi suficiente para o Copilot inferir a estrutura.

## Os desafios

A maior fricção foi uma limitação do Copilot com a saída do terminal. Ao executar um comando, o Copilot ficava travado tentando ler os resultados diretamente do terminal. Esse foi o workaround que documentei no arquivo de instruções do Copilot:

```markdown
## Running commands
1. Whenever you run a command in the terminal, pipe the output to output.txt
2. Read the output.txt file to see the results
3. Overwrite each time to prevent growth
```

Ajudou, mas não resolveu completamente. O Copilot ainda ficava travado em loop tentando ler o terminal por muito mais tempo do que o esperado. A solução era pará-lo e digitar `continue`.

O outro desafio recorrente foi o Copilot tentando modificar os testes. Aconteceu mais de uma vez. Cada vez tive que reafirmar: os testes são a especificação e NÃO devem ser alterados.

## O que aprendi

No contexto do desenvolvimento assistido por IA, design contract-first e test-driven dão ao modelo limites claros e verificáveis.

O valor do SpecKit ainda é algo que estou avaliando. A constituição fez uma diferença real. Antes de configurar os guardrails e executar o SpecKit, tentei uma abordagem ingênua — simplesmente prompting o Copilot sem nenhuma estrutura — e foi um fracasso completo. Os guardrails importam.

A lição central: a IA é surpreendentemente boa e rápida para gerar código. As práticas básicas de engenharia continuam sendo fundamentais.
