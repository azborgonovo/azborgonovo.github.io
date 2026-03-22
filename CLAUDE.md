# CLAUDE.md

Guidelines for Claude when working in this repository. See [AGENTS.md](./AGENTS.md) for the full project reference (structure, conventions, build commands, CI/CD, and content authoring rules) — all of it applies here.

## Quick Reference

| Task | Command |
|------|---------|
| Install deps | `bundle install && npm install && npx playwright install` |
| Build site | `bundle exec jekyll build` |
| Dev server | `bundle exec jekyll serve` → http://localhost:4000 |
| Run tests | `npm test` |

## Working on This Repo

### Always run tests before finishing

After any change to layouts, includes, styles, posts, or configuration, run `npm test`. All Playwright tests must pass — the CI pipeline gates deployment on them.

### Bilingual content is mandatory for posts

Every post needs a pair: one `lang: en` file and one `lang: pt-br` file. Both live in `_posts/`, with the PT-BR slug ending in `-pt-br`. When writing content, keep the meaning consistent across both versions.

### Do not break the polyglot setup

The `parallel_localization: false` setting in `_config.yml` must not be changed. Likewise, do not move posts into `pt-br/_posts/`. See AGENTS.md → *Bilingual Setup* for the reasons.

### Liquid syntax in post content

Code examples that contain `{{ }}` or `{% %}` must be wrapped in `{% raw %}…{% endraw %}`. Forgetting this causes the variable to silently render as an empty string. Add a corresponding test case in `tests/liquid-expressions.spec.ts`.

### Styles

Edit `assets/css/style.scss` only. Do not add `<style>` blocks to layout files or inline styles to page content unless it is a genuine one-off override that cannot reasonably live in the stylesheet.

### Commit style

Follow Conventional Commits: `feat:`, `fix:`, `docs:`, `style:`, `test:`, `chore:`. Keep the subject line under 72 characters.
