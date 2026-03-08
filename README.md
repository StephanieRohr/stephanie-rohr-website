# Stephanie Rohr — Portfolio Website

This is Stephanie Rohr's personal portfolio website. It showcases her work as a video editor, recording engineer, and multimedia creative. The site has five pages: **Home**, **About**, **Videos**, **Photos**, and **Contact**.

---

## Table of Contents

1. [Site Overview](#site-overview)
2. [How It's Organized](#how-its-organized)
3. [Running the Site Locally](#running-the-site-locally)
4. [How to Edit Content](#how-to-edit-content)
   - [Changing Your Name, Bio, or Contact Info](#changing-your-name-bio-or-contact-info)
   - [Editing the About Page](#editing-the-about-page)
   - [Editing the Photos Page](#editing-the-photos-page)
   - [Adding or Editing Videos](#adding-or-editing-videos)
   - [Changing the Hero Video (Home Page)](#changing-the-hero-video-home-page)
   - [Editing the Contact Form](#editing-the-contact-form)
   - [Updating Social Media Links](#updating-social-media-links)
   - [Updating Navigation Links](#updating-navigation-links)
5. [How to Add a New Page](#how-to-add-a-new-page)
6. [Project Structure Reference](#project-structure-reference)

---

## Site Overview

| Page | URL | What's on it |
| --- | --- | --- |
| Home | `/` | Full-screen hero video (YouTube) |
| About | `/about` | Headshot, bio paragraphs |
| Videos | `/videos` | Grouped video sections (Wix-hosted + YouTube + SoundCloud) |
| Photos | `/photos` | Photography description + embedded gallery |
| Contact | `/contact` | Email, phone, and a contact form |

**Design:** Dark background, white text, teal accent color. Headings use the Raleway font. The header is sticky and semi-transparent. The footer shows the copyright year automatically.

---

## How It's Organized

The most important principle: **you almost never need to touch the code files** (`.astro`, `.tsx`, etc.). All the words, links, and video entries that appear on the site live in simple text files under one folder:

```sh
src/content/
```

Think of `src/content/` as the "filing cabinet" for the website. It has three drawers:

- **`site/`** — Global info shared across every page (your name, nav links, social media, video list)
- **`pages/`** — Per-page copy (headings, bio text, descriptions)
- **`components/`** — Copy for specific UI pieces (contact form labels, button text)

Everything else under `src/` is the code that turns those files into the actual website. You shouldn't need to change those files for routine content updates.

---

## Running the Site Locally

You need [Bun](https://bun.sh) installed. Then from a terminal in this folder:

```sh
bun install      # First time only — installs all dependencies
bun dev          # Starts the dev server at http://localhost:4321
```

Open `http://localhost:4321` in your browser and you'll see the site live. Any time you save a content file, the browser will automatically refresh.

To build the final production version:

```sh
bun build        # Output goes to ./dist/
bun preview      # Preview the built site before deploying
```

---

## How to Edit Content

### Changing Your Name, Bio, or Contact Info

Open **`src/content/site/main.md`**.

This file controls global site-wide information:

```yaml
---
name: "Stephanie Rohr"
title: "Stephanie's Portfolio"
description: "Video editor, recording engineer..."
email: "StephanieMarieRohr@gmail.com"
phone: "704-996-1705"
---
```

- **`name`** — Appears in the header logo and site title.
- **`title`** — The browser tab title.
- **`description`** — A short SEO/meta description (shown in Google search results).
- **`email`** — Shown on the Contact page as a clickable email link.
- **`phone`** — Shown on the Contact page as a clickable phone link.

---

### Editing the About Page

Open **`src/content/pages/about.md`**.

The text below the `---` line (called the "body") is your bio. Edit it freely — it supports standard Markdown (paragraphs, **bold**, *italic*, etc.).

The `imageAlt` field at the top controls the accessibility label for your headshot image. The headshot itself is hosted on Wix. To swap it for a different photo, update the Wix CDN URL inside `src/pages/about.astro` (search for `static.wixstatic.com`).

---

### Editing the Photos Page

Open **`src/content/pages/photos.md`**.

The body text describes your photography work and equipment. Edit it freely.

The embedded photo gallery loads from Wix. To swap it for a different gallery, update the `src` URL of the `<iframe>` inside `src/pages/photos.astro`.

---

### Adding or Editing Videos

All video data lives in **`src/content/site/videos.md`**.

There are three types of video sections:

#### 1. Wix-hosted videos (`videoSections`)

These are videos stored on the Wix CDN. Each section has a heading and a list of videos. Each video needs:

- **`title`** — The display name shown below the video
- **`videoId`** — The Wix video ID (the long string from your Wix media manager URL)
- **`orientation`** — Either `landscape` or `portrait`

Example of adding a new section with one video:

```yaml
- heading: "My New Project"
  videos:
    - title: "Project Highlight Reel"
      videoId: "21bb34_abc123def456..."
      orientation: landscape
```

#### 2. YouTube videos (`youTubeVideoSections`)

Same structure as above, but use a full YouTube URL instead of a `videoId`:

```yaml
- heading: "YouTube Work"
  videos:
    - title: "My YouTube Video"
      url: "https://youtu.be/XXXXXXXXXXX"
      orientation: landscape
```

#### 3. Audio/SoundCloud (`promosSection`)

This section embeds a SoundCloud player for your entire SoundCloud profile. To change the linked SoundCloud account, update the iframe `src` URL inside `src/pages/videos.astro` (search for `soundcloud.com`).

The `heading` and `description` for this section are edited inside `src/content/site/videos.md` under the `promosSection` key.

> **Tip:** Video sections appear on the page in the order they are listed in the file. To reorder sections, cut and paste the entire section block up or down in the file.

---

### Changing the Hero Video (Home Page)

The Home page shows a full-screen YouTube video. To change it, open **`src/pages/index.astro`** and find the line with `youtube-hero`. Replace the YouTube URL with your new video's URL:

```astro
<VideoPlayer type="youtube-hero" url="https://youtu.be/YOUR_VIDEO_ID" client:visible />
```

---

### Editing the Contact Form

Open **`src/content/components/contactForm.md`** to change:

- **`formIntro`** — The text shown above the form
- **`labels`** — The field labels (First Name, Last Name, Company, Email, Message)
- **`submitButton.default`** — The button text before clicking
- **`submitButton.sending`** — The button text while the form is submitting
- **`successMessage`** — The message shown after a successful submission

Form submissions are handled by Netlify (the hosting platform) and delivered to the email associated with your Netlify account. No code changes are needed to receive submissions.

---

### Updating Social Media Links

Open **`src/content/site/main.md`** and find the `social` section:

```yaml
social:
  - name: "LinkedIn"
    url: "https://www.linkedin.com/in/stephanie-rohr/"
    icon: linkedin
  - name: "Instagram"
    url: "https://www.instagram.com/stephanierohrphotography/"
    icon: instagram
```

Update the `url` values to point to your current profiles. The `icon` field must be one of: `linkedin`, `soundcloud`, `facebook`, `instagram`.

To add a new social link, add a new entry to the list. To remove one, delete its block entirely.

---

### Updating Navigation Links

Open **`src/content/site/main.md`** and find the `nav` section:

```yaml
nav:
  - label: "HOME"
    href: "/"
  - label: "ABOUT"
    href: "/about"
```

To rename a nav item, change its `label`. To reorder the nav, cut and paste entries up or down. To remove a page from the nav, delete its entry (the page itself will still exist, just not be linked from the header).

---

## How to Add a New Page

Adding a new page requires creating two files:

**Step 1 — Create the content file** at `src/content/pages/yourpage.md`:

```markdown
---
pageHeading: "My New Page"
---

Write your page content here. This is standard Markdown — paragraphs, **bold**, *italic*, [links](https://example.com), etc.
```

**Step 2 — Create the page file** at `src/pages/yourpage.astro`. Copy the structure from an existing simple page like `src/pages/about.astro` and swap in your new content entry name (`yourpage`).

**Step 3 — Add it to the nav** by editing `src/content/site/main.md` (see [Updating Navigation Links](#updating-navigation-links)).

---

## Project Structure Reference

```sh
stephanie-rohr-website/
├── public/               # Static files (favicon, etc.)
├── src/
│   ├── content/          # ← All editable content lives here
│   │   ├── site/
│   │   │   ├── main.md   # Global: name, email, phone, nav, social links
│   │   │   └── videos.md # All video sections and entries
│   │   ├── pages/
│   │   │   ├── about.md  # About page copy and bio
│   │   │   ├── contact.md
│   │   │   ├── photos.md
│   │   │   └── videos.md
│   │   └── components/
│   │       └── contactForm.md  # Contact form labels and messages
│   ├── pages/            # Page templates (code — edit with care)
│   ├── components/       # UI components (code — edit with care)
│   ├── layouts/          # Page shell with header/footer (code)
│   └── styles/
│       └── global.css    # Colors, fonts, spacing
├── package.json
└── biome.json            # Code style rules
```
