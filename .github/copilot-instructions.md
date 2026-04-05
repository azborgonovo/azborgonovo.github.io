# Copilot Instructions

For the full project reference — structure, bilingual Jekyll/polyglot conventions, build & test commands, CI/CD, and content-authoring rules — see [AGENTS.md](../AGENTS.md).

## Key Rules

- **Run tests after changes**: `npm test` must pass when changes affect verifiable functionality (see [When to run tests](#when-to-run-tests) below). If tests fail, diagnose and fix.
- **Scope**: Only make changes directly requested. Do not refactor surrounding code or add features beyond what was asked.
- **Bilingual posts**: Every post requires a `lang: en` and `lang: pt-br` pair, both in `_posts/`.
- **Liquid syntax**: Wrap `{{ }}` / `{% %}` patterns in `{% raw %}…{% endraw %}`; add a test case in `tests/liquid-expressions.spec.ts`.
- **Branching**: Work on a feature branch; never commit directly to `main`.
- **Commits**: Follow Conventional Commits (`feat:`, `fix:`, `docs:`, `style:`, `test:`, `chore:`); subject ≤ 72 characters.

## When to run tests

**Run `npm test`** when changes affect:
- `_layouts/` — layout files control what tests validate
- `_includes/` — include files affect navigation, header, footer
- `assets/css/` — style changes can break layout assumptions
- `_config.yml` — site configuration affects routing and language handling
- `_posts/` — **only** if: (1) changing Liquid-syntax code blocks (wrap in `{% raw %}`); (2) adding/updating post front matter that affects categories/tags/language filtering; or (3) modifying anything beyond post body text
- `tests/` — test file changes must pass

**Do NOT run tests** when changes are only:
- Documentation files (`README.md`, `CONTRIBUTING.md`, instruction files)
- Post body text (prose/content without layout/front-matter changes)
- Image assets or static files (`assets/images/`, `assets/files/`)
- Comments or metadata in code
- CI/CD workflow files (`.github/workflows/`)
