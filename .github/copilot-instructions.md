# Copilot Instructions

For the full project reference — structure, bilingual Jekyll/polyglot conventions, build & test commands, CI/CD, and content-authoring rules — see [AGENTS.md](../AGENTS.md).

## Key Rules

- **Run tests after changes**: `npm test` must pass before any task is complete. If tests fail, diagnose and fix.
- **Scope**: Only make changes directly requested. Do not refactor surrounding code or add features beyond what was asked.
- **Bilingual posts**: Every post requires a `lang: en` and `lang: pt-br` pair, both in `_posts/`.
- **Liquid syntax**: Wrap `{{ }}` / `{% %}` patterns in `{% raw %}…{% endraw %}`; add a test case in `tests/liquid-expressions.spec.ts`.
- **Branching**: Work on a feature branch; never commit directly to `main`.
- **Commits**: Follow Conventional Commits (`feat:`, `fix:`, `docs:`, `style:`, `test:`, `chore:`); subject ≤ 72 characters.
