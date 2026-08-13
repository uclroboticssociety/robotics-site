# Content Guide

How to add and maintain the site's content - events, workshops, hackathons, challenges, socials and projects - without touching a single `.astro` file. If you know basic HTML, CSS and JavaScript, you know enough.

Setup, deployment, git and pull requests live in [README.md](README.md). Start there if you haven't yet run `npm install` and `npm run dev`.

Using an AI coding agent? [`CLAUDE.md`](CLAUDE.md) in the repo root holds its instructions and is loaded automatically (`AGENTS.md` is a symlink to the same file). Keep it in step with this guide when conventions change.

---

## Contents

1. [TLDR](#tldr)
2. [Repository map](#repository-map)
3. [How Astro's content layer works](#how-astros-content-layer-works)
4. [Add an event, workshop, hackathon or social](#add-an-event-workshop-hackathon-or-social)
5. [Frontmatter reference](#frontmatter-reference)
6. [Body syntax reference (blocks and markers)](#body-syntax-reference-blocks-and-markers)
7. [Add a project](#add-a-project)
8. [Working with images](#working-with-images)
9. [Common site edits](#common-site-edits)
10. [Known gaps](#known-gaps)
11. [Publishing checklist](#publishing-checklist)
12. [Troubleshooting](#troubleshooting)
13. [Handover checklist](#handover-checklist)

---

## TLDR

If you read nothing else in this file, read this page.

> **`main` is the live website**, and code changes need a pull request. Those rules and the git workflow live in [README → Read this first](README.md#read-this-first). This page covers content only.

### Content rules

| ✅ Do | ❌ Don't |
|---|---|
| One folder per event, its photos inside it | Put images in `public/`, or borrow another event's folder |
| Name the folder what you want in the sidebar, matching `title:` | Rename or delete a live folder, the URL dies with it |
| Quote `date:` in ISO form, `"2026-02-14T18:00:00+00:00"` | Leave it unquoted, or write `14/02/2026` |
| Tag every event `workshop`, `hackathon`, `challenge` or `social` | Invent a tag, it lands in no sidebar category |
| Compress photos, zero-pad past 9 (`01.png`) | Commit 8 MB phone photos, or expect `10.png` after `9.png` |

### Adding an event is three steps

```bash
# 1. Make a folder named after the event, and drop your photos in it
mkdir "src/content/events/Line Following Workshop"
cp ~/Pictures/photo1.png "src/content/events/Line Following Workshop/1.png"
```

```markdown
<!-- 2. Create src/content/events/Line Following Workshop/index.md -->
---
title: "Line Following Workshop"
date: "2026-02-14T18:00:00+00:00"
location: "UCL East - Marshgate"
tags: ["workshop"]
---
/!!!
Build a line-following robot from scratch. No experience needed - we supply the kits.
!!!/

/!!!
[picture]"1.png"
!!!/
```

```bash
# 3. Check it, then ship it
npm run dev          # visit http://localhost:4321/events
npm run build        # must pass before you push
git add . && git commit -m "Add line following workshop" && git push   # on dev, not main
```

The page appears automatically at `/events/line-following-workshop`, in the Workshops sidebar, and in "Latest Events" - no code changes, no route to register, no list to update. The rest of this guide explains why that works and what else you can put in the page.

**Stuck?** Jump to [Troubleshooting](#troubleshooting) - it lists every error this setup produces, with the cause and the fix.

---

## Repository map

```
src/
├─ content/                  ← ALL editable content lives here
│  ├─ events/
│  │  └─ Board Games/        ← one folder per event
│  │     ├─ index.md         ← the text + frontmatter
│  │     ├─ 1.png            ← images used by that page
│  │     └─ 3.png
│  └─ projects/
│     └─ VLA1/
│        ├─ index.md
│        ├─ 0.png            ← special: cover image on the /projects cards
│        └─ pdf_images/      ← subfolder used by [scroll_folder]
│
├─ content.config.ts         ← defines the collections + required fields
├─ data/
│  ├─ events.ts              ← the 4 event categories (Workshops/Hackathons/…)
│  ├─ nav.ts                 ← navbar links
│  └─ footer.ts              ← footer links
├─ pages/                    ← one file = one URL
│  ├─ events.astro           ← /events listing page
│  ├─ events/[...slug].astro ← renders every individual event page
│  ├─ projects.astro
│  ├─ projects/[...slug].astro
│  └─ about/…                ← /about/mission, /about/committee, …
├─ components/               ← reusable UI (navbar, footer, events sidebar)
├─ layouts/Base.astro        ← <html> shell: head, navbar, footer
└─ styles/global.css

public/                      ← static files served as-is (logo.png → /logo.png)
scripts/pdf_to_images.py     ← helper: turn a PDF/slide deck into page images
```

**Rule of thumb:** if you are adding *content*, you work in `src/content/`. If you are changing *how content looks*, you work in `src/pages/` or `src/components/`.

---

## How Astro's content layer works

Four ideas. Once these click, everything else is detail.

### 1. A collection is a folder of Markdown, treated as a database table

`src/content.config.ts` declares two collections, `events` and `projects`:

```ts
const events = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/events" }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    location: z.string().optional(),
    signup_url: z.string().url().optional(),
    tags: z.array(z.string()).optional(),
  }),
});
```

- **`loader: glob(...)`** - "every `.md` file anywhere under `src/content/events` is a row in this table." `**/*.md` means *any depth*, so `Board Games/index.md` counts, and so would `Board Games/day-two.md`.
- **`schema`** - the required shape of each row's frontmatter. This is a *contract*, and it's the single most useful thing here: if you typo `titel:` or forget `date:`, the build **fails with a message naming your file**, instead of silently publishing a broken page.

### 2. Frontmatter is the structured data; the body is the prose

Every entry file has two parts:

```markdown
---
title: "Board Games"          ← frontmatter: machine-readable, validated by the schema
date: "2025-10-29T13:00:00+00:00"
tags: ["social"]
---
Everything after the closing --- is the body: the human-readable page content.
```

Frontmatter is what the site can *sort, filter and group by*. The body is what the visitor reads.

### 3. The folder name becomes the URL

Astro turns each entry's path into an **id**, and the id becomes the URL. Spaces and capitals get slugified, and `index` is dropped:

| File | id | Live URL |
|---|---|---|
| `events/Board Games/index.md` | `board-games` | `/events/board-games` |
| `events/PCB Workshop/index.md` | `pcb-workshop` | `/events/pcb-workshop` |
| `events/Film Night - The Iron Giant/index.md` | `film-night---the-iron-giant` | `/events/film-night---the-iron-giant` |
| `projects/VLA1/index.md` | `vla1` | `/projects/vla1` |

Note the triple dash in the third row: ` - ` in a folder name becomes `---`. **Name folders without dashes or punctuation** (`Film Night Iron Giant`) to get clean URLs. The pretty name shown on the page comes from `title:` anyway.

> **Renaming a folder changes the URL and breaks any link already shared on Instagram or Discord.** Prefer getting the name right first time; if you must rename, expect the old link to 404.

### 4. One template renders all of them

`src/pages/events/[...slug].astro` is a **dynamic route**. The `[...slug]` in the filename means "this file handles many URLs". Its `getStaticPaths()` asks the collection for every entry and generates one static HTML page per entry at build time:

```ts
export async function getStaticPaths() {
  const allEvents = await getCollection("events");
  return allEvents.map((event) => ({ params: { slug: event.id } }));
}
```

That's why adding a Markdown file is genuinely all you have to do. The listing page (`events.astro`) uses the same `getCollection("events")` call to build the sidebar and the "Latest Events" cards.

**Where an event shows up, and what controls it:**

| Where | Controlled by |
|---|---|
| Its own page `/events/<slug>` | the folder/file existing at all |
| Sidebar category (Workshops / Hackathons / Challenges / Socials) | `tags:` |
| Label shown in that sidebar list | the **folder name** (not `title:`) |
| Heading on the page itself | `title:` |
| Order within the sidebar, and "Latest Events" | `date:`, newest first |

---

## Add an event, workshop, hackathon or social

Events, workshops, hackathons, challenges and socials are **all the same kind of entry**. The only thing that makes a workshop a workshop is its `tags:` value.

### Step 1 - create the folder

```bash
mkdir "src/content/events/Arduino Bootcamp"
```

Name it in plain words. Avoid dashes, slashes, emoji and `&` (see the URL table above).

### Step 2 - create `index.md`

```markdown
---
title: "Arduino Bootcamp"
date: "2026-03-05T18:00:00+00:00"
location: "UCL East - One Pool Street"
signup_url: "https://forms.gle/abc123"
tags: ["workshop"]
---
/!!!
A two-hour crash course in microcontrollers. Bring a laptop, we bring the boards.
!!!/
```

Pick **one** tag from this list - it decides the sidebar category:

| Tag | Category shown on the site |
|---|---|
| `"workshop"` | Workshops |
| `"hackathon"` | Hackathons |
| `"challenge"` | Challenges |
| `"social"` | Socials |

Any other tag is accepted by the schema but maps to no category, so the event will have a page and appear in "Latest Events" but **won't show in the sidebar**. If you genuinely need a new category, see [Common site edits](#common-site-edits).

### Step 3 - add images

Drop image files **in the same folder as `index.md`** and reference them by bare filename:

```
src/content/events/Arduino Bootcamp/
├─ index.md
├─ 1.png
└─ 2.png
```

```markdown
/!!!
[picture]"1.png"
!!!/
```

### Step 4 - check it locally

```bash
npm run dev     # look at /events and /events/arduino-bootcamp
npm run build   # must finish without errors before you push
```

### Step 5 - publish

```bash
git add .
git commit -m "Add Arduino Bootcamp event"
git push
```

Run through the [Publishing checklist](#publishing-checklist) first.

### Announcing an event before it happens

Same file, future `date:`, and a short body - the codebase convention is literally `coming soon...` (see `src/content/events/CAD Workshop/index.md`). Future-dated events sort to the top of "Latest Events". After the event, come back and replace the body with a write-up and photos.

### Multiple pages for one event

Because the loader pattern is `**/*.md`, a folder can hold more than one page. `Hackathon 2026/index.md` plus `Hackathon 2026/results.md` gives you `/events/hackathon-2026` **and** `/events/hackathon-2026/results`, both sharing the folder's images. Each file needs its own complete frontmatter.

---

## Frontmatter reference

### Events collection (`src/content/events/**/*.md`)

| Field | Required | Type | Notes |
|---|---|---|---|
| `title` | yes | string | Heading on the page and on the "Latest Events" card |
| `date` | yes | string | **ISO 8601, in quotes**: `"2026-03-05T18:00:00+00:00"`. Use `+00:00` in winter, `+01:00` during BST |
| `location` | no | string | Rendered next to a location-pin icon |
| `signup_url` | no | string | Must be a **valid URL** if present, or the build fails. Currently stored but not displayed anywhere - see [Known gaps](#known-gaps) |
| `tags` | no | array of strings | Drives the sidebar category. Use exactly one of the four tags above |

### Projects collection (`src/content/projects/**/*.md`)

| Field | Required | Type | Notes |
|---|---|---|---|
| `title` | yes | string | Card title and page heading |
| `summary` | yes | string | Required by the schema - the build fails without it. Not displayed on the cards today |
| `status` | no | `"active"` \| `"paused"` \| `"completed"` | Defaults to `"active"`. Sorts the cards: active → paused → completed |
| `lead` | no | string | Shown as "Lead: …" on the card |
| `repo` | no | string | Must be a valid URL. Not displayed today |

**Frontmatter rules that trip people up**

- Always **quote strings**, especially dates and anything containing `:` or `#`.
- `tags` is a list, even with one item: `tags: ["social"]`.
- Indentation is meaningful - YAML hates stray tabs. Use spaces.
- The opening and closing `---` must each be alone on their own line, with the opening one on **line 1**.

---

## Body syntax reference (blocks and markers)

> **Important:** the event and project pages do **not** use standard Markdown rendering. They use a small custom parser in `src/pages/events/[...slug].astro` (and its projects twin). It supports a deliberately narrow syntax. Anything not on this page will render as literal text.

### The `/!!! … !!!/` block

Every piece of content sits inside a block:

```markdown
/!!!
This is one block. It renders as one visual group with spacing around it.
!!!/

/!!!
This is a second block.
!!!/
```

Think of a block as a section. Blocks are how the page gets its rhythm and vertical spacing - use several short blocks rather than one giant one. Content outside any block still renders, but you lose that spacing.

### Text formatting supported inside a block

| Syntax | Result |
|---|---|
| `## Heading` | Section heading (h2) |
| `### Heading` | Sub-heading (h3) |
| `- item` | Bullet list (indent 2 spaces for a nested level) |
| `**bold**` | **bold** |
| `---` on its own line | Horizontal rule |
| blank line | Starts a new paragraph |
| emoji | Renders fine, and existing pages use it in headings |

**Not supported - will show as raw characters:** `[text](url)` links, `*italic*`, `# h1`, numbered lists (`1.`), tables, code fences, blockquotes, inline HTML, and standard Markdown images `![]()`. Use `[picture]` for images. If you need a link, ask for it to be added to the renderer rather than pasting HTML.

### `[picture]` - a single image

```markdown
/!!!
[picture]"1.png"
!!!/

/!!!
[picture]"3.png"(50%)      ← optional width, centred
!!!/
```

**Two `[picture]` markers in a row become a side-by-side pair:**

```markdown
/!!!
[picture]"1.png"[picture]"2.png"
!!!/
```

Alt text is generated from the filename (`maze-final-run.png` becomes "maze final run"), so descriptive filenames are better for accessibility than `3.png` - but see the sorting caveat under [Working with images](#working-with-images).

### `[scroll]` - a horizontal photo carousel

Wrap several `[picture]` markers in `[scroll](…)`:

```markdown
/!!!
[scroll]([picture]"1.png"[picture]"2.png"[picture]"3.png")
!!!/
```

Renders a swipeable, snap-scrolling strip. Best for 3+ photos from the same event.

### `[scroll_folder]` - carousel of a whole subfolder

```markdown
/!!!
[scroll_folder]"pdf_images"(80%)
!!!/
```

Every image inside `<entry folder>/pdf_images/` becomes a slide, **sorted alphabetically by filename**. Perfect for slide decks converted to images. The `(80%)` width is optional.

### Text beside media (automatic split layout)

If a `[scroll]` or `[scroll_folder]` is **immediately followed by, or preceded by, a text block**, the two are laid out side by side in a two-column grid:

```markdown
/!!!
[scroll]([picture]"1.png"[picture]"2.png")
The carousel sits on the left, this paragraph on the right.
!!!/

/!!!
This paragraph sits on the left, the carousel on the right.
[scroll]([picture]"3.png"[picture]"4.png")
!!!/
```

Whichever comes first in the file goes on the left.

### `[pdf]` - embed a PDF

```markdown
/!!!
[pdf]"handbook.pdf"(90%)
!!!/
```

Embeds the PDF in an iframe, 70vh tall, from the entry's own folder. Mobile browsers handle embedded PDFs poorly - for slide decks, prefer converting to images and using `[scroll_folder]` (see [Turning a PDF or slide deck into images](#turning-a-pdf-or-slide-deck-into-images)).

### `[space]` - vertical spacing

```markdown
/!!!
[space]"40px"
!!!/
```

Any CSS length works (`40px`, `4rem`, `10vh`).

### A realistic full example

```markdown
---
title: "Maze Robot Challenge"
date: "2026-02-20T14:00:00+00:00"
location: "UCL East - Marshgate"
tags: ["challenge"]
---
/!!!
## The Challenge
Teams had ninety minutes to get an autonomous robot through a maze it had never seen before.
!!!/

/!!!
[scroll]([picture]"1.png"[picture]"2.png"[picture]"3.png")
Six teams entered. Two finished. One caught fire - in a good way.
!!!/

/!!!
## What teams built
- **Wall followers** - simple, reliable, slow
- **Mapping bots** - ambitious, occasionally brilliant
!!!/

/!!!
[picture]"14.png"(70%)
!!!/
```

---

## Add a project

Projects work exactly like events, with a different schema and one extra convention.

```bash
mkdir "src/content/projects/RoboArm"
```

```markdown
---
title: "Robotic Arm Build"
summary: "A 6-DOF arm built from scratch by the hardware team"
status: "active"
lead: "Ada Lovelace"
---
/!!!
What we're building and why.
!!!/

/!!!
[scroll_folder]"build_photos"(80%)
!!!/
```

**The `0.png` convention:** the `/projects` listing page looks for a file named exactly **`0.png`** in the project folder and uses it as the card's cover image. Without it, the card shows a grey `[ project image ]` placeholder. Always add one.

The body syntax is identical to events. The projects sidebar currently has a single hard-coded "VLA" category in `src/pages/projects.astro` and `src/pages/projects/[...slug].astro` - every project is listed under it regardless of content.

---

## Working with images

### Format and size

Content images live in Git, and the repo already carries roughly 56 MB of them. Keep it under control:

- **Resize to max ~1600px wide** before committing. Phone photos are 4000px+ and nobody needs that.
- **Prefer `.webp`** (supported alongside `png/jpg/jpeg/gif/svg`) - typically 30–50% smaller than PNG.
- Compress with [Squoosh](https://squoosh.app/) (browser, no install) or:
  ```bash
  # ImageMagick: resize + compress a whole folder in place
  mogrify -resize '1600x1600>' -quality 82 *.png
  ```
- Photos of members: check they're happy to appear on a public site before publishing.

### Naming and ordering

`[scroll_folder]` sorts filenames **alphabetically, not numerically**. So:

```
1.png, 2.png, … 10.png, 11.png   →  wrong order: 1, 10, 11, 2, 3, …
01.png, 02.png, … 10.png, 11.png →  correct order: 01, 02, … 10, 11
```

**Zero-pad any sequence that reaches double digits.** (For `[scroll]` and `[picture]` you list the files explicitly, so order is whatever you write.)

### Where images can live

Images must sit **in the entry's own folder** (or a subfolder of it, for `[scroll_folder]`). An image in a different event's folder won't resolve - you'll see a dashed *"Image not found: x.png"* box on the page. Site-wide assets such as the logo and favicon go in `public/`, referenced with a leading slash: `/logo.png`.

### Turning a PDF or slide deck into images

`scripts/pdf_to_images.py` converts a PDF into numbered PNGs, ready for `[scroll_folder]`:

```bash
pip install pdf2image        # plus poppler: `brew install poppler` / `sudo dnf install poppler-utils`
```

Open the script, set the three variables at the top, then run it:

```python
PDF_PATH   = "src/content/projects/RoboArm/slides.pdf"
OUT_DIR    = "src/content/projects/RoboArm/slide_images"
OUT_PREFIX = ""          # output is 1.png, 2.png, …
```

```bash
python3 scripts/pdf_to_images.py
```

Then reference the folder: `[scroll_folder]"slide_images"(80%)`. Delete the source PDF afterwards unless you also want it embedded - no need to store both in Git.

---

## Common site edits

These touch `.astro` and `.ts` files rather than content, but they're small and safe.

### Add or edit a navbar link

`src/data/nav.ts` - an array of `{ href, label }`, with optional `children` for a dropdown:

```ts
{ href: "/events", label: "Events" },
{
  href: "/about/mission",
  label: "About",
  children: [
    { href: "/about/mission", label: "Mission" },
    { href: "/about/committee", label: "Committee" },
  ],
},
```

Footer links live in `src/data/footer.ts`.

### Edit the event category descriptions

`src/data/events.ts` holds the four categories - emoji, title and description text used by the sidebar. Changing a `description` or `emoji` here is safe.

### Add a fifth event category

This one touches code. You need to, consistently:

1. Add an entry to `initiatives` in `src/data/events.ts` (new `id` and `tag`, and add both to the union types).
2. Add a `.filter()` and `recentByInitiative` entry in **both** `src/pages/events.astro` and `src/pages/events/[...slug].astro`.
3. Add the tag to `tagLabels` in both files.

The filtering logic is duplicated between those two files - change both, or the sidebar will disagree with itself.

### Add a normal (non-collection) page

Create a `.astro` file under `src/pages/`; `src/pages/alumni.astro` becomes `/alumni`. Copy the structure of `src/pages/about/mission.astro` and wrap your content in `<Base title="…">`. Then add it to `nav.ts`.

---

## Known gaps

Honest list of things declared but not wired up, in case you were counting on them:

- `signup_url` (events) and `repo` (projects) are validated and stored, but **never rendered**. Adding a "Sign up" button to the event page template would be a good first code contribution.
- `summary` (projects) is required but not shown on the project cards.
- `src/pages/contact.astro` still posts to the placeholder endpoint `https://formsubmit.co/your@email.com`, and the `<noscript>` fallback lists `robotics@university.edu`. Both need the society's real addresses before the contact form does anything.

---

## Publishing checklist

Before you push:

- [ ] `npm run build` passes
- [ ] Checked the page in `npm run dev`, including on a narrow window (mobile layout)
- [ ] Images compressed, and zero-padded if numbered past 9
- [ ] Frontmatter `date` is the real event date, in quotes, ISO format
- [ ] `tags:` puts it in the right sidebar category
- [ ] No placeholder text left (`https://forms.gle/xxxx`, `coming soon...`) unless intentional

Branching, PRs and merging: [README → Git workflow](README.md#git-workflow-and-pull-requests).

---

## Troubleshooting

| Symptom | Cause and fix |
|---|---|
| Build fails: `[InvalidContentEntryDataError] events → <slug> data does not match collection schema` followed by `title: Required` | A required frontmatter field is missing or misspelled. The error names the file path and every offending field |
| Same error, but `signup_url: Invalid URL` | `signup_url` or `repo` isn't a full URL - it needs `https://` |
| Dashed box: *"Image not found: 2.png"* | The file isn't in the entry's own folder, the extension is wrong (`.PNG` vs `.png`), or the name is misspelled. Filenames are case-sensitive on the deploy server even if your laptop is forgiving |
| Dashed box: *"PDF not found"* | Same, for `[pdf]` |
| Event page exists but nothing in the sidebar | `tags:` is missing, misspelled, or not one of the four recognised tags |
| Carousel photos in the wrong order | Alphabetical sorting - zero-pad the filenames (`01.png`) |
| `[picture]"1.png"` appears as literal text | It's outside a `/!!! … !!!/` block, or the quotes are curly “smart quotes” from Word or Notion. Use straight `"` quotes |
| A Markdown link or italic renders as raw characters | Not supported by the custom renderer - see [Body syntax](#body-syntax-reference-blocks-and-markers) |
| Sidebar shows a different name than the page heading | Sidebar uses the **folder name**, the heading uses `title:`. Make them match |
| Page works locally but not live | You committed but didn't push, or the Cloudflare build failed - check the Cloudflare Pages dashboard |
| Weird stale behaviour in dev | Stop the server, then `rm -rf .astro dist node_modules/.vite`, `npm install`, `npm run dev` |

**Always run `npm run build` before pushing.** Every schema error above is caught locally in about ten seconds, versus a failed deploy and a broken site.

---

## Handover checklist

When the committee changes over, the outgoing web officer should confirm the incoming one has:

- [ ] GitHub access to `uclroboticssociety/robotics-site` (admin for at least one person)
- [ ] Cloudflare account access (Pages project **and** DNS zone)
- [ ] Namecheap login, plus a note of the **domain renewal date** and who pays for it
- [ ] Access to whoever controls the society Google account (the `forms.gle` sign-up links point there)
- [ ] Walked through adding one real event end to end, together, using this guide
- [ ] Read [Known gaps](#known-gaps) so nothing surprises them
- [ ] Read [README → Git workflow and pull requests](README.md#git-workflow-and-pull-requests) - especially that `main` is the live site, and that milestones are marked with git tags rather than `VX` commit messages
- [ ] Tag the handover commit (`git tag -a v<n> -m "Handover to <name>, <year>"`) so there's a clean before/after point if anything breaks

---

Back to [README.md](README.md) for setup, deployment and infrastructure.
