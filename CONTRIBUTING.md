# Contributing

Thank you for your interest in contributing! This is a personal website, so contributions are mainly expected for bug fixes, typo corrections, or structural improvements.

## Getting Started

### Prerequisites

- Ruby ≥ 3.0
- Bundler

### Local Setup

```bash
# Clone the repository
git clone https://github.com/azborgonovo/azborgonovo.github.io.git
cd azborgonovo.github.io

# Install dependencies
bundle install

# Start the development server
bundle exec jekyll serve

# Open http://localhost:4000 in your browser
```

## Making Changes

### Branch Naming

Use a descriptive branch name:

- `fix/sidebar-post-filter` — for bug fixes
- `feat/add-about-page` — for new features or pages
- `docs/update-readme` — for documentation

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
feat: add about page in EN and PT-BR
fix: filter PT-BR posts from EN sidebar
docs: update CONTRIBUTING with Ruby version requirement
```

## Project Conventions

See [AGENTS.md](AGENTS.md) for a full description of the project structure, bilingual setup rules, and how to add new posts and pages.

### Key rules

- All posts go in the root `_posts/` directory with a `lang: en` or `lang: pt-br` front matter key.
- Every page that exists in English must have a Portuguese counterpart in `pt-br/` (and vice versa).
- Styles go in `assets/css/style.scss` only.

## Submitting a Pull Request

1. Fork the repository and create your branch from `main`.
2. Make your changes and verify with `bundle exec jekyll build` (no build errors).
3. Open a pull request against `main` with a clear description of what changed and why.
