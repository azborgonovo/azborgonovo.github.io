---
lang: pt-br
layout: post
title: "Como Refatorar Recursos Terraform Sem Downtime"
date: 2026-06-04
categories: [coding]
tags: [aws, terraform, infraestrutura, eks, iam]
permalink: /coding/2026/06/04/terraform-moved-blocks-no-downtime/
---

Enquanto adicionava permissões de publicação no SNS para a `checkout-api` [como parte de uma configuração de fanout SNS/SQS FIFO](/coding/2026/06/04/fifo-sns-sqs-eks-terraform/), aproveitei para organizar o Terraform. A IAM role havia sido criada condicionalmente usando `count` — um padrão que fazia sentido quando o acesso ao S3 era opcional, mas como a role agora é sempre necessária, a condição deixou de fazer sentido.

Remover o `count` é uma mudança simples no HCL. Mas o Terraform rastreia recursos pelo endereço no state, e remover o `count` muda esse endereço de `aws_iam_role.checkout_api[0]` para `aws_iam_role.checkout_api`. Sem informar o Terraform sobre essa mudança, ele planeja destruir a role existente e criar uma nova. Isso significa downtime e pods quebrados em produção.

A solução é usar a keyword `moved`.

## O Código Original

A role só era criada quando o bucket S3 estava configurado:

```hcl
locals {
  checkout_api_s3_enabled = contains(keys(var.s3_origins), "checkout-api-files")
}

resource "aws_iam_role" "checkout_api" {
  count              = local.checkout_api_s3_enabled ? 1 : 0
  name               = "${var.env}-checkout-api"
  assume_role_policy = data.aws_iam_policy_document.checkout_api_assume.json
}

resource "aws_iam_role_policy" "checkout_api" {
  count  = local.checkout_api_s3_enabled ? 1 : 0
  name   = "${var.env}-checkout-api-s3-readwrite"
  role   = aws_iam_role.checkout_api[0].id
  policy = data.aws_iam_policy_document.checkout_api_s3[0].json
}

resource "aws_eks_pod_identity_association" "checkout_api" {
  count           = local.checkout_api_s3_enabled ? 1 : 0
  cluster_name    = module.eks.cluster_name
  namespace       = "backend"
  service_account = "checkout-api-sa"
  role_arn        = aws_iam_role.checkout_api[0].arn
}
```

## O Código Refatorado

Removendo o `count` — e renomeando o recurso de policy de `checkout_api` para `checkout_api_s3` para deixar seu escopo explícito, já que a role passará a ter múltiplas políticas inline:

```hcl
resource "aws_iam_role" "checkout_api" {
  name               = "${var.env}-checkout-api"
  assume_role_policy = data.aws_iam_policy_document.checkout_api_assume.json
}

resource "aws_iam_role_policy" "checkout_api_s3" {
  name   = "${var.env}-checkout-api-s3-readwrite"
  role   = aws_iam_role.checkout_api.id
  policy = data.aws_iam_policy_document.checkout_api_s3.json
}

resource "aws_eks_pod_identity_association" "checkout_api" {
  cluster_name    = module.eks.cluster_name
  namespace       = "backend"
  service_account = "checkout-api-sa"
  role_arn        = aws_iam_role.checkout_api.arn
}
```

Três endereços no state mudaram:

| Antes | Depois |
|---|---|
| `aws_iam_role.checkout_api[0]` | `aws_iam_role.checkout_api` |
| `aws_eks_pod_identity_association.checkout_api[0]` | `aws_eks_pod_identity_association.checkout_api` |
| `aws_iam_role_policy.checkout_api[0]` | `aws_iam_role_policy.checkout_api_s3` |

Sem os blocos `moved`, o `terraform plan` mostraria três destruições e três criações.

## Os Blocos `moved`

```hcl
# Temporário — remover após aplicar até prod.

moved {
  from = aws_iam_role.checkout_api[0]
  to   = aws_iam_role.checkout_api
}

moved {
  from = aws_eks_pod_identity_association.checkout_api[0]
  to   = aws_eks_pod_identity_association.checkout_api
}

moved {
  from = aws_iam_role_policy.checkout_api[0]
  to   = aws_iam_role_policy.checkout_api_s3
}
```

Com esses blocos no lugar, o `terraform plan` não mostra nenhuma destruição — apenas movimentações de state. O terceiro bloco é o mais instrutivo: ele lida com a remoção do `count` e com o renome em um único passo.

## O Fluxo de Dois Commits

Os blocos `moved` são temporários por natureza. Uma vez aplicados em todos os ambientes, devem ser removidos — mantê-los permanentemente gera confusão e pode interferir em refatorações futuras.

**Commit 1** — adicionar o código refatorado e os blocos `moved` juntos. O comentário deixa explícito o caráter temporário. Aplicar esse commit em todos os ambientes (dev → staging → prod).

**Commit 2** — deletar os blocos `moved`. Nenhuma outra mudança.

Isso mantém o histórico do git limpo: o commit 1 mostra a intenção, o commit 2 é uma limpeza inequívoca sem ruído.

## Por Que Não Usar `terraform state mv`?

A alternativa é executar `terraform state mv` manualmente para cada mudança de endereço. Funciona, mas tem dois problemas: mutação direta do state remoto sem deixar rastro para revisão de código, e execução obrigatória uma vez por ambiente. Os blocos `moved` são declarativos, revisáveis e aplicados automaticamente como parte do ciclo normal de plan/apply.
