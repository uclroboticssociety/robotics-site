# Design language - "Studio"

How this site looks, and how to extend it without it drifting. Read this before
adding a page or a component.

The whole language lives in **`src/styles/global.css`**. That file is the single
source of truth for colour, radius and type. If you find yourself writing a hex
value anywhere else, something has gone wrong.

This is a **single light "paper" theme by design**. There is no dark mode and no
theme switcher. Do not add one, and do not add `localStorage`-driven theming.

---

## 1. Tokens

Defined in the `@theme` block at the top of `global.css`. Tailwind generates
utilities from them (`bg-surface`, `text-muted`, `border-rule`, …), and the
component classes reference them directly.

### Surfaces

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#F4F3F1` | Page background (paper) |
| `--color-surface` | `#FFFFFF` | Cards, panels |
| `--color-surface-2` | `#F7F3F9` | Purple-tinted panel / alternating section ground |
| `--color-rule` | `#C9C6C1` | Every 1px border and divider |
| `--color-rule-hover` | `#A9A5A0` | Border on card hover |

### Text

| Token | Value | Use |
|---|---|---|
| `--color-fg` | `#191A1C` | Primary text (ink) |
| `--color-muted` | `#5B5960` | Secondary text, metadata, idle nav |

### Accents

| Token | Value | Use |
|---|---|---|
| `--color-accent` | `#500778` | Primary action, active state, focus ring, links |
| `--color-accent-hover` | `#3A0559` | Primary button hover, deep-purple fills (join band, tag/countdown text) |
| `--color-accent-deep` | `#3A0559` | Darker end of an accent gradient |
| `--color-warn` | `#B3261E` | Form errors only - the one warm tone |

There is a single accent hue - no separate secondary "ice" colour. Every link,
active state and highlight uses `--color-accent` (or `--color-accent-hover` where
a deeper shade reads better against a light tint).

`--color-warn` is deliberately not purple, so "something is wrong" can never be
mistaken for "this is the primary action". It is the only place it appears.

### Accent tints

Composite values in the `:root` block below `@theme` (`--accent-tint-bg`,
`--accent-tint-border`, `--accent-tint-text`, `--status-on-*`). **Use them as
they are - do not derive new tints from `--color-accent`.**

### Image surfaces

`--color-shade-a/b`, `--color-portrait-a/b`, `--color-thumb`, `--color-idle`,
`--color-rule-strong`. Every image container is painted with one of these before
its picture loads, so a missing or slow image reads as a designed panel instead
of a blank box.

### Radii

All `--radius-*` tokens are `0`. This is a sharp-edged, hairline-plate
aesthetic - buttons, cards, tags, thumbnails and images are rectangles, never
rounded. The tokens still exist (rather than every component hardcoding `0`) so
a future, deliberate change to the radius scale only touches one file.

### Two documented exceptions to "no hex outside the tokens"

1. `<meta name="theme-color">` in `Base.astro` - a meta tag cannot read a CSS
   variable.
2. The hero's dark photo-overlay gradient and the join band's white-on-purple
   button overrides in `global.css` (`.hero::after`, `.hero .btn-o`, `.join`,
   `.join .btn`, `.join .btn-o`) - these sit on a photo or a solid accent fill
   rather than the paper background, so they need real white/black values that
   aren't points on the paper-theme scale.

Both are deliberate. Nothing else should carry a raw colour.

---

## 2. Type

Two self-hosted families, configured in `astro.config.mjs` through Astro's Fonts
API and preloaded in `Base.astro`. Nothing is fetched from Google at page load.

- **Archivo** (`--font-disp`) - everything readable.
- **Spline Sans Mono** (`--font-mono`) - machine-ish information *only*.

| Role | Spec |
|---|---|
| `h1` page title | Archivo 800, `clamp(44px,6.2vw,76px)`, `-.035em`, max 13ch |
| `h2` section head | Archivo 700, `clamp(24px,3.2vw,36px)` |
| `h3` card title | 20px; `clamp(28px,3.8vw,44px)` for the featured event |
| Body | Archivo 400, 16.5px, line-height 1.6, `--color-fg` |
| Lede (`.lede`) | Archivo 400, 18.5px, `--color-muted`, max 46ch |
| Metadata (`.mono`) | Spline Sans Mono, 10–11.5px, `.10–.13em`, uppercase |
| Big numbers | Archivo 700, `-.04em`, `tabular-nums`, `--color-accent-hover` |

**Mono is for dates, times, counts, status flags, category labels and section
meta.** Never set a paragraph or a heading in mono.

---

## 3. Layout

- **Container** - `src/components/ui/Container.astro` (`.wrap`): 1200px max,
  30px gutters. Use it; don't set page widths inline. If a page needs a
  narrower measure, put a max-width on the content (e.g. `.prose-body` at
  70ch).
- **Background** - flat paper (`--color-bg`). No decorative gradients or
  textures behind the page; depth comes from hairline borders and the
  occasional tinted panel (`--color-surface-2`), not from a background layer.
- **Section rhythm** - `.section` gives 92px top padding. Nothing else sets its
  own section spacing.
- **Breakpoints** - 1000px is the main one (grids collapse, nav becomes a
  drawer), 900px shrinks the hero, 640px tightens gutters and stacks section
  headers. Test at 320 / 768 / 1000 / 1440.

---

## 4. Components

All in `src/components/ui/` unless noted.

| Component | Use |
|---|---|
| `Container` | The page container. Everything sits in one. |
| `PageHeader` | **Every page that isn't home opens with this.** |
| `SectionHeader` | `h2` left, mono meta or an accent link right. |
| `EventRow` | One line in a chronological list of events. |
| `ProjectCard` | Browsable, image-led card. |
| `MemberTile` / `AdvisorTile` | Portrait tiles with an initials fallback. |
| `NextEvent` | Featured event panel; countdown or recap. |
| `Countdown` | Client-side countdown to a real event. |
| `JoinCTA` | Closing call-to-action band - solid accent fill, white text. |
| `events/EventsLayout` | Sidebar shell shared by events and projects. |

There is no home-only decorative canvas: the hero is a full-bleed photo with a
dark gradient overlay, not an animated illustration.

### Buttons - three variants, no more

- `.btn` - primary. Purple fill, white text.
- `.btn.btn-o` - outline. Transparent fill, ink border and text.
- `.btn.btn-quiet` - text only, `--color-accent`, underline on hover.

On a dark ground (the hero photo, the join band) `.btn`/`.btn-o` are inverted by
a scoped override (`.hero .btn-o`, `.join .btn`, `.join .btn-o`) rather than a
fourth variant - the class name and markup stay the same everywhere.

**Exactly one primary button per view region.** If two purple things compete
for attention on a screen, demote one to outline.

### Status

Status pills never signal by colour alone - the label always carries the
meaning. `.st` is the neutral pill; `.st-on` adds the accent tint for
upcoming/today.

---

## 5. Imagery

Every image gets a light contrast treatment - this is a paper/print aesthetic,
not a moody duotone one. These are already baked into the component classes;
you only need them if you build something new.

| Role | Treatment |
|---|---|
| Featured event / hero / card / row / detail photo | `contrast(1.05)` only |
| Portrait | **None - committee and advisory photos stay in full colour.** |

**Where images live matters.**

- **`src/assets/`** - page images (committee, advisors, mission, sponsors).
  Astro converts these to webp at the sizes actually used. Reference them by
  path relative to `src/assets` and resolve with `asset()` from
  `src/lib/assets.ts`.
- **`src/content/<collection>/<entry>/`** - images belonging to an event or
  project. See `CONTENT_GUIDE.md`.
- **`public/`** - only genuinely static files: favicon, logo. **Anything here is
  served byte-for-byte and never optimised**, so don't put photos in it.

Always give an image container a gradient fallback, set explicit dimensions or
an aspect ratio, and lazy-load anything below the fold.

---

## 6. Motion

- `.rise` with `.d1`-`.d4` - the page-load reveal. **First screen only, four
  elements maximum.** Never on every section.
- Hover: cards lift 3px (tiles 4px); buttons lift 1px. Transitions 0.16-0.22s.
- `prefers-reduced-motion: reduce` disables every animation and transition.
  **This is not optional.**

---

## 7. Extending the language

When the prototype doesn't cover what you're building, follow these rather than
inventing a new pattern.

1. **Every inner page opens with `PageHeader`**, not a hero. The full-bleed
   photo treatment never appears outside the home hero.
2. **Depth comes from borders, not shadows or radius.** Panels are
   `--color-surface` on `--color-bg` with a 1px `--color-rule`, sharp corners.
   Shadows only on hover, and only long, soft, low-opacity blacks.
3. **Nothing is rounded** (see §1). Don't reach for a radius value that isn't
   `0` - if a shape genuinely needs one, that's a deliberate exception to raise,
   not a one-off tweak.
4. **Accent budget:** `--color-accent` for the primary action, active/upcoming
   status and links; `--color-accent-hover` for deep-purple fills (the join
   band, countdown values, tag text). There is no secondary hue.
5. **Any list of things** uses `EventRow` if it is scannable and chronological,
   or the card grid if it is browsable and image-led. **Do not build a third
   list pattern.**
6. **New sections** follow: `.section` (92px) → `SectionHeader` → content →
   optional right-aligned accent link. Nothing else sets its own spacing.
7. **No emoji as iconography.** Categories are identified by mono uppercase
   labels.
8. If a genuinely new component is unavoidable, build it from existing tokens
   and add it to §4 here, so the next committee inherits a documented language
   rather than a pile of exceptions.

---

## 8. Accessibility

Non-negotiables, all currently satisfied:

- Focus is visible everywhere: `outline: 2px solid var(--color-accent)` at
  `outline-offset: 3px`. **Never remove it.**
- `--color-muted` on `--color-bg` is fine for body-sized text. Do not use it
  below 12px for essential information, and never dim it further.
- Everything interactive works from the keyboard: the nav dropdown, the mobile
  drawer (Escape closes, focus is trapped), the sidebar accordions, the
  carousels and the forms.
- Real alt text on content images, `alt=""` on decorative ones.
- One `h1` per page.
