# CLAUDE.md

@AGENTS.md

## Claude-Specific Rules

### Run tests conditionally

Run `npm test` **only when changes affect functionality that tests verify**.

**ALWAYS run tests** when changing:
- `_layouts/*` or `_includes/*` — layouts/includes directly control tested HTML
- `assets/css/*` — styles affect layout validation
- `_config.yml` — site configuration affects routing/language
- Test files (`tests/*`)
- Posts with Liquid-syntax expressions that must render literally

**SKIP tests** for:
- Instruction files (`CLAUDE.md`, `AGENTS.md`, copilot-instructions.md)
- Documentation (`README.md`, `CONTRIBUTING.md`)
- Post body text (prose only, not front matter)
- Static assets, comments, metadata

If tests fail after changes that *should* run them, diagnose and fix — do not skip the failure.

### Scope

Only make changes directly requested. Do not refactor surrounding code, add unrequested features, or create new files unless strictly necessary.

### Liquid syntax in post content

When adding a post with Liquid-syntax code examples (wrapped in `{% raw %}…{% endraw %}`), add a corresponding test case in `tests/liquid-expressions.spec.ts` to guard against regressions. Tests must run to validate the Liquid wrapping.
