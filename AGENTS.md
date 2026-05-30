# AGENTS.md

Astro 6 portfolio website for a performer/actress, built on **content/code separation**: editable copy lives in markdown under `src/content/`; everything under `src/components/`, `src/layouts/`, and `src/pages/` renders it.

This project uses **pnpm**.

## Before considering any task done

All three must pass:

```bash
pnpm run astro:check   # Astro, TypeScript, and content-schema validation
pnpm run biome:check   # lint + format check
pnpm run build         # production build
```

There is no automated test suite. The worktree may contain unrelated user changes — do not revert them.

## Where to look

- **Architecture, content collections, key components** — see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **Code style & formatting** — see [docs/CODE_STYLE.md](docs/CODE_STYLE.md)
- **Design system & styling** — see [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md)
- **Deployment** — Netlify adapter in `astro.config.mjs`; pushing to the connected branch triggers an automatic build.
