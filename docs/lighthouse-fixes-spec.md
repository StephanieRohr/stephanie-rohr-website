# Spec: Lighthouse Remediation (Accessibility, Contrast, CLS)

## Background

A Chrome DevTools Lighthouse audit (mobile) was run against the dev server on every
page. Scores:

| Page       | A11y | Best Prac. | SEO | Agentic | Notes                          |
|------------|------|-----------|-----|---------|--------------------------------|
| `/`        | 100  | 92        | 100 | 100     | clean                          |
| `/about`   | 100  | 96        | 100 | **68**  | font-swap CLS 0.329            |
| `/contact` | 95   | 96        | 100 | 100     | accent-link contrast           |
| `/photos`  | 90   | 96        | 100 | **50**  | gallery buttons unlabeled + contrast |
| `/videos`  | 95   | 92        | 100 | 87      | playlist CLS + heading contrast |

Four real defects were isolated and root-caused. Each is an **independent task**
below (different files, no ordering dependency) so they can be run in parallel by a
workflow. A shared verification task runs once all four are complete.

## Non-goals (do NOT attempt)

- **`errors-in-console` (`504 Outdated Optimize Dep`)** — a Vite dev-server artifact on
  Astro's dev-toolbar entrypoint. It does not exist in a production build. Expected to
  disappear when scores are re-measured on `pnpm run preview`. No code change.
- **`inspector-issues` (YouTube third-party cookies)** — set by the YouTube `/embed/`
  iframes. Switching to `youtube-nocookie.com` is deliberately excluded to avoid
  changing playback/branding behavior unverified. No code change.

## Conventions

- Package manager is **pnpm**.
- Biome: 2-space indent, single quotes, semicolons only as needed. Run
  `pnpm run biome:check:write` for mechanical fixes.
- Do not revert unrelated working-tree changes.

## Verification environment

All **functional** verification runs against a **production build**, not the dev server
(dev numbers are unreliable and inject the Astro dev toolbar). Start it once:

```bash
pnpm run build && pnpm run preview   # note the printed URL, e.g. http://localhost:4321
```

Functional assertions below use the **chrome-devtools MCP** against that preview URL.
Two reusable snippets are referenced by tasks:

- **`lighthouse_audit`** (device: `mobile`, mode: `navigation`) — returns category scores
  and pass/fail per audit.
- **CLS probe** — install before navigation so it captures load-time shifts, then read
  after the page settles:
  ```js
  // initScript for navigate_page:
  window.__cls = 0;
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
  }).observe({ type: 'layout-shift', buffered: true });
  // then, after ~4s settle, evaluate_script: () => window.__cls
  ```

---

## Task 1 — Label photo-gallery images (fixes `button-name` + accessibility tree)

**Problem.** `react-photo-album` renders each thumbnail as a `<button>`. The image
objects built in `ImageGallery.astro` carry only `src/width/height` — no `alt` — so the
buttons have no accessible name. This fails `button-name` (drops `/photos` A11y to 90)
and malforms the accessibility tree (drops Agentic Browsing to 50). The same `images`
array also feeds the lightbox `slides`, so one `alt` per image labels both surfaces.

**Decision (locked).** Generic, auto-humanized alt derived from the directory name +
1-based index, computed build-side in the `.astro`. No authored-alt override hook
(out of scope — there is no authoring source today).

**Files**
- `src/components/organisms/ImageGallery.astro`
- `src/components/molecules/ImageGalleryLightbox.tsx`

**Changes**
1. In `ImageGallery.astro`, add a helper that humanizes the `directory` — split on
   camelCase boundaries, then sentence-case (first letter upper, rest lower), e.g.
   `ActionSportsPhotography` → `Action sports photography`:
   ```ts
   const humanize = (s: string) => {
     const words = s.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase()
     return words.charAt(0).toUpperCase() + words.slice(1)
   }
   const label = humanize(directory)
   ```
   Then add `alt` in the existing `.map(...)`, using the array index for a 1-based
   number: `alt: `${label} — photo ${i + 1}``. (Add the index param to the map callback.)
2. In `ImageGalleryLightbox.tsx`, add `alt: string` to the `GalleryImage` interface
   (lines 14-18) so the prop type-checks. No other component change needed —
   `MasonryPhotoAlbum` and `Lightbox` both read `photo.alt` automatically.

**Acceptance criteria**
- `/photos` Lighthouse: `button-name` passes; Agentic Browsing `agent-accessibility-tree`
  passes; Accessibility ≥ 95.
- Every gallery image and every lightbox slide has a non-empty `alt`.

**Verify**
1. Static:
   ```bash
   pnpm run astro:check && pnpm run biome:check
   ```
2. Source assertion (alt is wired in both files):
   ```bash
   grep -q "alt:" src/components/organisms/ImageGallery.astro && \
   grep -q "alt: string" src/components/molecules/ImageGalleryLightbox.tsx && echo OK
   ```
3. Functional (MCP, against preview): navigate to `/photos`, then `evaluate_script`:
   ```js
   () => {
     const imgs = [...document.querySelectorAll('.react-photo-album img')];
     const unlabeled = imgs.filter((i) => !i.getAttribute('alt')?.trim()).length;
     return { images: imgs.length, unlabeled }; // expect unlabeled === 0
   }
   ```
   Then run `lighthouse_audit` on `/photos` and confirm `button-name` and
   `agent-accessibility-tree` are no longer in the failed list.

---

## Task 2 — Fix accent-color contrast site-wide (fixes `color-contrast`)

**Problem.** `--color-accent: rgb(128 128 128)` (`#808080`) yields only **2.88:1** against
the solid page background `#dcdcdc` (confirmed via computed style, not a Lighthouse
approximation). It fails `color-contrast` wherever accent text sits on the page:
`/contact` (`mailto:` link), `/photos` (Instagram link), `/videos` (section `<h2>`).

**Decision (locked).** Darken the single global token (option A). The accent is a neutral
gray, not a brand hue, so darkening is low-risk and self-documenting. Side effects
(darker contact submit button `bg-accent`, slightly darker borders) are acceptable and
actually improve white-on-accent button text.

**File**
- `src/styles/global.css` (line 8)

**Change**
- `--color-accent: rgb(128 128 128);` → `--color-accent: #595959;`
  - `#595959` ≈ **5.1:1** on `#dcdcdc` (clears the 4.5:1 needed for normal-size link
    text, and the 3:1 needed for the large bold `<h2>`). White-on-`bg-accent` button text
    rises to ≈7:1.

**Acceptance criteria**
- `color-contrast` passes on `/contact`, `/photos`, `/videos`; Accessibility = 100 on
  those pages (modulo Task 1 for `/photos`).
- Visual smoke check: contact submit button and borders still look intentional.

**Verify**
1. Static:
   ```bash
   pnpm run astro:check && pnpm run biome:check
   ```
2. Source assertion (token changed, no stray `128 128 128`):
   ```bash
   grep -q "color-accent: #595959" src/styles/global.css && echo OK
   ```
3. Functional (MCP, against preview): on `/contact`, `evaluate_script` to confirm the
   computed accent color is the darkened value and compute its contrast vs the page bg:
   ```js
   () => {
     const a = document.querySelector('section a[href^="mailto:"]');
     const lum = (rgb) => { const [r,g,b] = rgb.match(/\d+/g).map(Number).map((c) => { c/=255; return c<=0.03928 ? c/12.92 : ((c+0.055)/1.055)**2.4; }); return 0.2126*r+0.7152*g+0.0722*b; };
     const fg = lum(getComputedStyle(a).color), bg = lum(getComputedStyle(document.body).backgroundColor);
     const ratio = (Math.max(fg,bg)+0.05)/(Math.min(fg,bg)+0.05);
     return { ratio: Math.round(ratio*100)/100 }; // expect ≥ 4.5
   }
   ```
   Then `lighthouse_audit` on `/contact`, `/photos`, `/videos` — confirm `color-contrast`
   absent from each failed list.

---

## Task 3 — Load real font weights to fix font-swap CLS (`/about`)

**Problem.** Headings render at weight **700** (`global.css:160`, plus `font-bold` in the
nav/video/contact components and the large `page-title` h1s), but the Astro font config
specifies no weights, so Raleway is fetched at the default **400 only**. The browser
faux-bolds the 400 face, and Astro's CLS-preventing size-adjusted fallback metrics
(computed for 400) don't match the painted bold glyphs. When the real font swaps in, the
large `page-title` reflows → CLS **0.329** under throttled mobile (`/about` Agentic 68).
Reproduces only under throttling; a warm local reload shows 0. Form labels also use
Raleway at 400, so both weights are genuinely used.

**Decision (locked).** Add the real weights and trim unused variants (option A). Keep
`display` at its default `swap` — matched fallback metrics make the swap shift-free.
Re-measure on a production build to confirm.

**File**
- `astro.config.mjs` (the Raleway entry in `fonts`)

**Change**
```js
fonts: [
  {
    name: 'Raleway',
    cssVariable: '--font-heading',
    provider: fontProviders.google(),
    weights: [400, 700],   // 700 = headings/nav/buttons; 400 = form labels
    styles: ['normal'],     // no italics used — trims the download
  },
],
```

**Acceptance criteria**
- On a **production build** (`pnpm run build && pnpm run preview`), `/about` CLS < 0.1
  (target ~0); Agentic Browsing recovers toward 100.
- Headings still render in Raleway bold (no visual regression).

**Verify**
1. Static:
   ```bash
   pnpm run astro:check && pnpm run biome:check && pnpm run build
   ```
2. Build assertion (both weights actually emitted as font files):
   ```bash
   grep -q "weights: \[400, 700\]" astro.config.mjs && echo OK
   # after build, ≥2 Raleway woff2 variants should exist:
   find dist -name '*.woff2' | head
   ```
3. Functional (MCP, against preview): navigate to `/about` with the **CLS probe**
   initScript, wait ~4s, then `evaluate_script: () => window.__cls` → expect **< 0.1**.
   Then `lighthouse_audit` on `/about` and confirm `cumulative-layout-shift` passes and
   Agentic Browsing ≥ 95.

---

## Task 4 — Reserve player height in the playlist loading state (`/videos` CLS)

**Problem.** `PlaylistPlayerInner` (`src/components/organisms/PlaylistPlayer.tsx`) renders
a short loading state (`PlaylistLoadingNotice` inside the
`div.relative.overflow-hidden` wrapper) while `usePlaylistVideos` fetches, then swaps to
the full-height player + sidebar. The wrapper grows when the real player mounts and
shoves the sections + `hr.divider-line` below it down. Measured CLS contribution **~0.31**
(shifting nodes: `DIV.mb-4`, `DIV.relative.overflow-hidden`, `HR.divider-line`).

Note: the player's geometry differs between states — loading is full-width with no
sidebar; loaded is the player (`shrink-0`) beside the sidebar on desktop
(`sm:flex-row`). So the loading placeholder must reserve the *loaded* layout's height,
not just a bare 16/9 box.

**Decision (locked).** Reserve matching height/layout in the loading state (option A) so
the load→loaded swap is shift-free.

**File**
- `src/components/organisms/PlaylistPlayer.tsx` (the `isPending && !videos` branch)
- possibly `src/components/atoms/PlaylistLoadingNotice.tsx`

**Implementation guidance**
- Give the loading branch the same outer structure as the loaded branch: the same
  `flex flex-col gap-3` (and `sm:flex-row` when portrait) container, with a player-sized
  placeholder using the same `aspectRatio` (`getAspectRatio(orientation)`) and, on
  desktop, a sidebar-width placeholder. Reuse `VideoPlayer`'s sizing approach
  (`width:100%; height:auto; aspectRatio`) for the placeholder box so its reserved height
  equals the eventual player's.
- The goal: the wrapper's height must not change between the loading and loaded states.

**Acceptance criteria**
- On a **production build**, `/videos` CLS < 0.1; Agentic Browsing recovers toward 100.
- Loading→loaded transition produces no visible vertical jump of the sections below.
- Aborted/empty-playlist paths still behave (don't break existing handling).

**Verify**
1. Static:
   ```bash
   pnpm run astro:check && pnpm run biome:check
   ```
2. Functional (MCP, against preview): navigate to `/videos` with the **CLS probe**
   initScript, wait ~4s (let the playlist fetch + player mount complete), then
   `evaluate_script: () => window.__cls` → expect **< 0.1** (baseline before fix ≈ 0.34).
   Then `lighthouse_audit` on `/videos` and confirm `cumulative-layout-shift` passes,
   Accessibility = 100, Agentic Browsing ≥ 95.
3. Manual sanity: with network throttled (DevTools "Slow 4G"), reload `/videos` and watch
   that the sections/divider below the first playlist do **not** jump when the player
   replaces the loading notice.

---

## Task 5 — Verification (run after Tasks 1-4)

**Static checks (must all pass):**
```bash
pnpm run astro:check
pnpm run biome:check
pnpm run build
```

**Production-build Lighthouse re-measure** (dev-server numbers are not trustworthy):
```bash
pnpm run build && pnpm run preview   # serves the built site
```
Then, via the chrome-devtools MCP, re-run `lighthouse_audit` (device: mobile,
mode: navigation) against each affected page on the preview URL and confirm:

| Page       | Target                                                        |
|------------|---------------------------------------------------------------|
| `/photos`  | Accessibility ≥ 95, Agentic Browsing ≥ 95 (Tasks 1+2)         |
| `/contact` | Accessibility = 100 (Task 2)                                  |
| `/videos`  | Accessibility = 100, CLS < 0.1 (Tasks 2+4)                    |
| `/about`   | CLS < 0.1, Agentic Browsing ≥ 95 (Task 3)                     |

- `errors-in-console` is expected to be **gone** on the production build (it was the dev
  toolbar). If it persists on `preview`, investigate; otherwise it confirms the non-goal.
- Capture before/after category scores in the PR description.

## Dependency graph

```
Task 1 ─┐
Task 2 ─┤
Task 3 ─┼──► Task 5 (verify)
Task 4 ─┘
```
Tasks 1-4 touch disjoint files and may run fully in parallel. Task 5 depends on all four.

## Suggested workflow shape

Two phases. **Phase 1** fans the four edits out in parallel — each agent edits only its
own disjoint files and runs the *static* checks (`astro:check` + `biome:check`); no agent
builds or starts a server, so they don't contend. A barrier collects them. **Phase 2** is
a single agent that builds once, starts `preview`, and runs every functional MCP check
sequentially (they share one browser, so they can't parallelize anyway).

Because the tasks edit disjoint files and don't commit, a shared working tree is fine —
`isolation: 'worktree'` is **not** needed (and would force a merge-back step). Only add it
if you let agents commit.

```js
export const meta = {
  name: 'lighthouse-remediation',
  description: 'Fix a11y/contrast/CLS issues per docs/lighthouse-fixes-spec.md',
  phases: [
    { title: 'Implement', detail: '4 disjoint fixes in parallel, each lints itself' },
    { title: 'Verify',    detail: 'one prod build + preview, sequential MCP audits' },
  ],
}

const SPEC = 'docs/lighthouse-fixes-spec.md'
const TASKS = [
  {
    id: 1, label: 'alt-text', brief: 'Task 1 — gallery image alt text',
    // Phase-1 (source/static) done conditions:
    accept:
      'ImageGallery.astro must add `alt: `${label} — photo ${i + 1}`` to every mapped ' +
      'image (1-based index); ImageGalleryLightbox.tsx GalleryImage interface must add ' +
      '`alt: string`. astro:check + biome:check must pass with zero errors.',
  },
  {
    id: 2, label: 'accent-contrast', brief: 'Task 2 — darken --color-accent',
    accept:
      'src/styles/global.css must contain exactly `--color-accent: #595959;` (the old ' +
      '`rgb(128 128 128)` must be gone). astro:check + biome:check must pass.',
  },
  {
    id: 3, label: 'font-weights', brief: 'Task 3 — Raleway weights/styles',
    accept:
      'astro.config.mjs Raleway entry must contain `weights: [400, 700]` and ' +
      '`styles: [\'normal\']`. astro:check + biome:check must pass.',
  },
  {
    id: 4, label: 'playlist-cls', brief: 'Task 4 — reserve playlist loading-state height',
    accept:
      'PlaylistPlayer.tsx loading branch (`isPending && !videos`) must render the same ' +
      'outer flex layout + an aspect-ratio-sized player placeholder as the loaded branch, ' +
      'so the wrapper height is identical before/after data loads. astro:check + ' +
      'biome:check must pass. Empty/aborted-playlist handling must remain intact.',
  },
]

phase('Implement')
const RESULT_SCHEMA = {
  type: 'object',
  required: ['task', 'filesChanged', 'staticChecksPass', 'acceptanceMet', 'notes'],
  properties: {
    task: { type: 'number' },
    filesChanged: { type: 'array', items: { type: 'string' } },
    staticChecksPass: { type: 'boolean' },
    acceptanceMet: { type: 'boolean' }, // true ONLY if every `accept` condition holds
    notes: { type: 'string' },
  },
}
const impl = await parallel(TASKS.map((t) => () =>
  agent(
    `Read ${SPEC}. Implement ONLY ${t.brief}. Edit only that task's listed files. ` +
    `Do NOT run "pnpm run build" or start a server. ` +
    `ACCEPTANCE (set acceptanceMet=true only if ALL hold): ${t.accept} ` +
    `Run the static + source assertions in that task's "Verify" block to confirm.`,
    { label: `impl:${t.label}`, phase: 'Implement', schema: RESULT_SCHEMA },
  )
))
const bad = impl.filter(Boolean).filter((r) => !r.staticChecksPass || !r.acceptanceMet)
if (bad.length) log(`⚠ tasks not meeting acceptance: ${bad.map((r) => r.task).join(', ')}`)

phase('Verify')
const VERIFY_SCHEMA = {
  type: 'object',
  required: ['allTargetsMet', 'perPage', 'consoleErrorGone', 'beforeAfter'],
  properties: {
    allTargetsMet: { type: 'boolean' },
    perPage: { type: 'array', items: { type: 'object' } }, // {page, metric, value, target, pass}
    consoleErrorGone: { type: 'boolean' },
    beforeAfter: { type: 'string' }, // markdown score table
  },
}
const verify = await agent(
  `All four fixes in ${SPEC} are applied. Run Task 5 against a PRODUCTION build. ` +
  `1) pnpm run astro:check && pnpm run biome:check && pnpm run build — all must pass. ` +
  `2) Start "pnpm run preview"; note the URL. ` +
  `3) Via chrome-devtools MCP, run each task's functional "Verify" probe + lighthouse_audit ` +
  `(device mobile, mode navigation). Set allTargetsMet=true ONLY if EVERY number below holds:\n` +
  `   • /photos: unlabeled gallery imgs === 0; button-name PASS; agent-accessibility-tree PASS; Accessibility ≥ 95; Agentic Browsing ≥ 95.\n` +
  `   • /contact: mailto-link contrast ratio ≥ 4.5; color-contrast PASS; Accessibility === 100.\n` +
  `   • /videos: window.__cls < 0.1 (baseline ≈ 0.34); color-contrast PASS; cumulative-layout-shift PASS; Accessibility === 100; Agentic Browsing ≥ 95.\n` +
  `   • /about: window.__cls < 0.1; cumulative-layout-shift PASS; Agentic Browsing ≥ 95.\n` +
  `4) Confirm errors-in-console is GONE on the production build (set consoleErrorGone). ` +
  `Return perPage rows {page, metric, value, target, pass} and a before/after score table.`,
  { label: 'verify:prod-audit', phase: 'Verify', schema: VERIFY_SCHEMA },
)
return { impl, verify }
```

Run it with the **Workflow** tool (paste as `script`). Note: the verify agent drives the
chrome-devtools MCP, so the Chrome extension/MCP must be connected in that session.
