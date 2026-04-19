# AGENTS.md

This file provides guidance to AI agents when working in this repository.

## Task Completion Requirements

- All of `pnpm run astro:check`, `pnpm run biome:check`, and `pnpm run build` must pass before considering tasks completed.
- No automated test suite is configured.
- The worktree may contain user changes. Do not revert unrelated edits.

## Commands

Use [pnpm](https://pnpm.io/). This repository currently has a `pnpm-lock.yaml`.

```bash
pnpm install          # Install dependencies
pnpm run dev          # Start dev server at http://localhost:4321
pnpm run build        # Build for production
pnpm run sync         # Regenerate Astro content types
pnpm run astro:check  # Validate Astro, TypeScript, and content schemas
pnpm run astro:check:write  # Auto-fix Astro/content issues when possible
pnpm run biome:check  # Lint and format check
pnpm run biome:check:write  # Auto-fix lint/format issues
```

## Architecture

This is an Astro 6 portfolio website for a performer/actress. The key architectural principle is **content/code separation**: editable site content lives in markdown files under `src/content/`, while `src/components/`, `src/layouts/`, and `src/pages/` handle rendering.

### Rendering Stack

- **Astro pages/layouts**: `src/pages/*.astro` and `src/layouts/Layout.astro` compose static routes and load content collections at build time.
- **Astro components**: static and server-rendered UI lives under `src/components/**`.
- **React islands**: interactive `.tsx` components are hydrated with directives such as `client:visible`.
- **Component organization**: components are grouped as `atoms`, `molecules`, and `organisms`.
- **Root shell**: `src/layouts/Layout.astro` imports `src/styles/global.css`, sets metadata/fonts, enables `ClientRouter`, and wraps pages with `Header` and `Footer`.

### Content Collections (`src/content.config.ts`)

Four Zod-validated collections control site content:

- **`main`**: global site data such as name, title, description, contact details, navigation links, and social links.
- **`pages`**: per-page copy for about, contact, photos, and videos.
- **`videos`**: video page sections for Wix-hosted videos (`videoSections`) and YouTube videos (`youTubeVideoSections`).
- **`contactForm`**: contact form copy, labels, button states, and success message.

After adding, renaming, or removing content files, run `pnpm run sync` if Astro content types are stale.

### Video Player

`src/components/atoms/VideoPlayer.tsx` is a polymorphic React component with three variants:

- **`wix`**: builds a direct Wix MP4 URL from `videoId`, using `https://video.wixstatic.com/video/{id}/720p/mp4/file.mp4`.
- **`youtube`**: passes a YouTube URL to `react-player`.
- **`youtube-hero`**: full-width home page hero player.

Video item and section types live in `src/types/video.types.ts`.

### Photos

`src/components/organisms/ImageGallery.astro` imports image metadata from `src/images/{DirectoryName}/` at build time and passes it to `src/components/molecules/ImageGalleryLightbox.tsx`, which uses `react-photo-album` and `yet-another-react-lightbox`.

Supported gallery directories are defined by the `ImageDirectory` union in `ImageGallery.astro`. To add a gallery, add images under `src/images/{DirectoryName}/`, update the union if the directory is new, and reference it in page content with:

```astro
<ImageGallery directory="DirectoryName" />
```

### Forms

`src/components/organisms/ContactForm.tsx` uses Netlify Forms (`data-netlify="true"`) and submits URL-encoded form data to `/`. Netlify handles submissions; no custom backend is required.

## Code Style

- Biome enforces 2-space indentation, LF line endings, single quotes in JavaScript/TypeScript, and semicolons only as needed.
- Biome organizes imports via assist actions.
- Astro files have relaxed linting for unused variables/imports and selected style rules.
- Prefer `pnpm run biome:check:write` for mechanical lint/format fixes.

## Design System

- Styling uses Tailwind CSS v4 plus custom theme tokens/utilities in `src/styles/global.css`.
- Theme tokens define the white/black/gray palette, muted text, line color, accent colors, heading font utility, site container width, and nav spacing.
- Raleway is loaded through Astro fonts as `--font-heading`; body text uses Helvetica Neue/Arial via `--font-sans`.
- Layout convention: max site width is `--container-site` (`1100px`), with reusable utilities such as `section-wrapper`, `page-title`, and gradient/divider utilities.

## Deployment

Netlify adapter is configured in `astro.config.mjs`. Pushing to the connected branch triggers an automatic Netlify build.
