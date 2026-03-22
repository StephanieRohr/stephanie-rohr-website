# AGENTS.md

This file provides guidance to AI agent when working with code in this repository.

## Task Completion Requirements

- All of `bun run astro:check`, `bun run biome:check`, and `bun run build` must pass before considering tasks completed.

## Commands

Requires [Bun](https://bun.sh).

```bash
bun install          # Install dependencies
bun run dev          # Start dev server at http://localhost:4321
bun run build        # Build for production
bun run sync         # Regenerate TS types after adding/renaming content .md files
bun run astro:check  # Validate content collection schemas
bun run astro:check:write  # Auto-fix content collection schema issues
bun run biome:check  # Lint and format check
bun run biome:check:write  # Auto-fix lint/format issues
```

No test suite is configured.

## Architecture

This is an Astro 6 portfolio website for a performer/actress. The key architectural principle is **content/code separation**: all editable site content lives in markdown files under `src/content/`, while `src/components/` and `src/pages/` handle rendering only.

### Content Collections (`src/content.config.ts`)

Four Zod-validated collections control all site content:

- **`main`** — Global site data: name, contact info, nav links, social links
- **`pages`** — Per-page copy (about, contact, photos, videos)
- **`videos`** — Three subsections: Wix-hosted videos (`videoSections`), YouTube videos (`youTubeVideoSections`), and SoundCloud promos (`promosSection`)
- **`contactForm`** — Contact form labels and messages

After editing any `.md` file, run `bun run sync` if TypeScript types are stale.

### Rendering Stack

- **`.astro` files** — Layout and static components; use Astro content collections at build time
- **`.tsx` files** — React islands for interactivity; hydrated with `client:visible` directive
- **`src/layouts/Layout.astro`** — Root shell with Header + Footer wrapping all pages

### Video Player

`src/components/VideoPlayer.tsx` is a polymorphic React component handling three video types:

- **Wix**: Constructs URL from `videoId` → `https://video.wixstatic.com/video/{id}/720p/mp4/file.mp4`
- **YouTube**: Passes URL to `react-player`
- **Hero**: Full-screen YouTube variant used on the home page

### Photos

`src/components/ImageGallery.astro` imports images from `src/images/{directory}/` at build time. `ImageGalleryLightbox.tsx` handles the interactive overlay using `yet-another-react-lightbox`.

To add a new photo gallery: drop images into `src/images/{DirectoryName}/`, then reference it in the photos page content with `<ImageGallery directory="DirectoryName" />`.

### Forms

The contact form uses Netlify Forms (`data-netlify="true"`). No backend required — submissions are handled by Netlify infrastructure.

## Code Style

Biome enforces: 2-space indent, single quotes, no semicolons. Astro files have relaxed linting (unused vars/imports allowed). Run `bun run biome:check:write` to auto-fix.

## Design System

- **Colors**: Dark background `#111`, white text, teal accent `#27d3b4`
- **Fonts**: Raleway (headings), Helvetica Neue (body)
- **Layout**: Max-width 1100px, sticky header 64px
- All styles in `src/styles/global.css`

## Deployment

Netlify adapter configured in `astro.config.mjs`. Pushing to the connected branch triggers an automatic build.
