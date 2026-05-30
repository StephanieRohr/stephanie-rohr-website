# Architecture

Astro 6 portfolio site. Core principle: **content/code separation** — editable site content is markdown under `src/content/`; rendering lives in `src/components/`, `src/layouts/`, and `src/pages/`.

## Rendering stack

- **Pages/layouts**: `src/pages/*.astro` and `src/layouts/Layout.astro` compose static routes and load content collections at build time.
- **Astro components**: static / server-rendered UI under `src/components/**`, grouped as `atoms`, `molecules`, `organisms`.
- **React islands**: interactive `.tsx` components, hydrated with directives like `client:visible`.
- **Root shell**: `Layout.astro` imports global styles, sets metadata/fonts, enables `ClientRouter`, and wraps pages with `Header` and `Footer`.

## Content collections

Defined and Zod-validated in `src/content.config.ts`; registered in its `collections` export. Loaders glob markdown from `src/content/<name>/`. Four collections:

- **`main`** — global site data: `name`, `title`, `description`, `email`, `phone`, `nav[]` (`label`, `href`), `social[]` (`name`, `url`, `icon` enum: linkedin/soundcloud/facebook/instagram).
- **`pages`** — per-page copy: `pageHeading`, plus optional `subheading`, `reachLabel`, `imageAlt`, `soundCloudTitle`.
- **`videos`** — optional `youTubeVideoPlaylists[]`, each `{ heading, description, credits, url, orientation }` where orientation is `landscape | portrait`.
- **`contactForm`** — all optional: `formIntro`, `labels` (firstName/lastName/company/email/message), `requiredIndicator`, `submitButton` (default/sending), `successMessage`, `errorMessage`.

After adding/renaming/removing content files, run `pnpm run sync` if Astro content types go stale.

## Video

- `src/components/atoms/VideoPlayer.tsx` — thin wrapper around `react-player`. Props: `url`, optional `aspectRatio` (default `16 / 9`), optional `boxShadow`. The aspect-ratio sits on a plain `<div>` wrapper, not the iframe, to avoid layout shift.
- `src/components/organisms/PlaylistPlayer.tsx` and `src/components/organisms/VideoSection.astro` build the video sections.
- The `YouTubeVideoPlaylist` type lives in `src/types/video.types.ts`.
- Consumed by `src/pages/videos.astro` and `src/pages/index.astro` (home hero).

## Photos

`src/components/organisms/ImageGallery.astro` globs image metadata from `src/images/**` at build time and hands the matching directory's images to `src/components/molecules/ImageGalleryLightbox.tsx` (`react-photo-album` + `yet-another-react-lightbox`).

Allowed gallery directories are an `ImageDirectory` union inside `ImageGallery.astro`. To add a gallery: drop images in `src/images/{DirectoryName}/`, extend the union if the directory is new, then reference it in page content:

```astro
<ImageGallery directory="DirectoryName" />
```

## Forms

`src/components/organisms/ContactForm.tsx` uses Netlify Forms (`data-netlify="true"`) and posts URL-encoded data to `/`. Netlify handles submissions — no custom backend.
