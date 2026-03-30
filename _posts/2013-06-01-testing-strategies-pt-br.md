---
lang: pt-br
layout: post
title: "Estratégias de Teste"
date: 2013-06-01
categories: [testing]
tags: [testes]
---

Hoje eu estava dando uma olhada em um manual dos ALM Rangers chamado [Better Unit Testing with Microsoft Fakes](http://vsartesttoolingguide.codeplex.com/releases/view/102290) que fala sobre o uso do Microsoft Fakes para testes no Visual Studio 2012.

Logo na página 10 encontrei uma tabela simples e bem interessante que descreve as estratégias de testes e as ferramentas que o Visual Studio oferece para cada uma delas.

Resolvi então fazer uma tradução livre da tabela para facilitar e reforçar nosso entendimento (público brasileiro).

| Estratégia | Descrição | Ferramenta |
|---|---|---|
| Teste Exploratório | O tester tenta pensar em possíveis cenários não cobertos por outros testes ou outras estratégias de teste. Útil quando os usuários são envolvidos no teste e são observados em seu uso (esperado) do sistema. Não há testes pré-definidos. | Testes exploratórios com o Microsoft Test Manager (MTM) |
| Teste de Integração | Testar diferentes componentes da solução que trabalham juntos como um só. | Visual Studio Unit Test features |
| Teste de Carga | Testar um sistema sob carga, em ambiente controlado. | Visual Studio Load Test Agent |
| Teste de Regressão | Testes de regressão garantem que o sistema ainda possui a mesma qualidade antes de mudanças, como correções de bugs. Utiliza uma mistura de testes unitários e de sistema. | Testes automatizados com o MTM |
| Teste de Fumaça | Testes de fumaça são usados para testar novas funcionalidades ou ideias antes de commitar as alterações do código. | — |
| Teste de Sistema | Teste das funcionalidades esperadas e dos requisitos não-funcionais de todo o sistema. | Visual Studio Lab Management |
| Teste de Unidade | Um teste da menor unidade de código (método / classe, e assim por diante) que podem ser testadas de forma isolada a partir de outras unidades. | Visual Studio Test Explorer / Unit Test Frameworks |
| Teste de Aceitação do Usuário | Próximo ao fim de cada ciclo de um produto os usuários são convidados a realizar um teste de aceitação sob um cenário de produção, tipicamente baseado em casos de teste. | Testes automatizados com o MTM |

Espero ter ajudado. Abraço!
