# CLAUDE.md

@AGENTS.md

## Claude-Specific Rules

### Always run tests before finishing

Run `npm test` after any change to layouts, includes, styles, posts, or configuration. If tests fail, diagnose and fix — do not consider the task done with failing tests.

### Scope

Only make changes directly requested. Do not refactor surrounding code, add unrequested features, or create new files unless strictly necessary.

### Liquid syntax in post content

When adding a post with Liquid-syntax code examples (wrapped in `{% raw %}…{% endraw %}`), add a corresponding test case in `tests/liquid-expressions.spec.ts` to guard against regressions.
