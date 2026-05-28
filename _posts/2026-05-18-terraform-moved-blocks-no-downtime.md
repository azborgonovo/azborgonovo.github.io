---
lang: en
layout: post
title: "How to Refactor Terraform Resources Without Downtime"
date: 2026-05-18
categories: [coding]
tags: [aws, terraform, infrastructure, eks, iam]
---

While adding SNS publish permissions to the `checkout-api` [as part of a FIFO SNS/SQS fanout setup](/coding/2026/05/18/fifo-sns-sqs-eks-terraform/), I cleaned up its Terraform resource definition along the way. The IAM role had been created conditionally using `count` — an old pattern that made sense when S3 access was optional, but now that the role is always needed, the condition was no longer applicable.

Removing `count` is a one-line change in HCL. But Terraform tracks resources by their state address, and removing `count` changes that address from `aws_iam_role.checkout_api[0]` to `aws_iam_role.checkout_api`. Without telling Terraform about this, it plans to destroy the existing role and create a new one. This means downtime and broken pods in production.

The fix is `moved` blocks.

## The Original Code

The role was only created when the S3 bucket was configured:

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

## The Refactored Code

Removing `count` — and renaming the policy resource from `checkout_api` to `checkout_api_s3` to make its scope explicit now that the role will have multiple inline policies:

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

Three state addresses changed:

| Old | New |
|---|---|
| `aws_iam_role.checkout_api[0]` | `aws_iam_role.checkout_api` |
| `aws_eks_pod_identity_association.checkout_api[0]` | `aws_eks_pod_identity_association.checkout_api` |
| `aws_iam_role_policy.checkout_api[0]` | `aws_iam_role_policy.checkout_api_s3` |

Without `moved` blocks, `terraform plan` shows three destroys and three creates.

## The `moved` Blocks

```hcl
# Temporary — remove after this is applied up to prod.

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

With these in place, `terraform plan` shows no destroys — just state moves. The third block is the most instructive: it handles both a `count` removal and a rename in a single step.

## The Two-Commit Workflow

`moved` blocks are temporary by nature. Once applied across all environments they must be removed — leaving them in permanently creates confusion and can interfere with future refactors.

**Commit 1** — add the refactored code and the `moved` blocks together. The comment makes the temporary nature explicit. Apply this across all environments (dev → staging → prod).

**Commit 2** — delete the `moved` blocks. Nothing else changes.

This keeps the git history clean: commit 1 shows the intent, commit 2 is an unambiguous cleanup with no noise.

## Why Not `terraform state mv`?

The alternative is running `terraform state mv` manually for each address change. It works, but has two problems: it mutates remote state directly without leaving a code review trail, and it must be run once per environment. `moved` blocks are declarative, reviewable, and applied automatically as part of the normal plan/apply cycle.
