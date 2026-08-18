# Design language — "Studio"

How this site looks, and how to extend it without it drifting. Read this before
adding a page or a component.

The whole language lives in **`src/styles/global.css`**. That file is the single
source of truth for colour, radius and type. If you find yourself writing a hex
value anywhere else, something has gone wrong.

This is a **single dark theme by design**. There is no light mode and no theme
switcher. Do not add one, and do not add `localStorage`-driven theming.

---

## 1. Tokens

Defined in the `@theme` block at the top of `global.css`. Tailwind generates
utilities from them (`bg-surface`, `text-muted`, `border-rule`, …), and the
component classes reference them directly.

### Surfaces

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#0C0F12` | Page background |
| `--color-surface` | `#14181C` | Cards, panels |
| `--color-surface-2` | `#1A2027` | Raised / gradient panel start |
| `--color-rule` | `#232A31` | Every 1px border and divider |
| `--color-rule-hover` | `#334252` | Border on card hover |

### Text

| Token | Value | Use |
|---|---|---|
| `--color-fg` | `#EDF0F2` | Primary text |
| `--color-muted` | `#8A97A3` | Secondary text, metadata, idle nav |

### Accents

| Token | Value | Use |
|---|---|---|
| `--color-blue` | `#3E7BFA` | Primary action, active state, focus ring |
| `--color-blue-hover` | `#5590FF` | Primary button hover |
| `--color-blue-deep` | `#2B5BD0` | Darker end of a blue gradient |
| `--color-ice` | `#8FD3E8` | Secondary links, highlights, motion trace |
| `--color-warn` | `#F0876A` | Form errors only — the one warm tone |

`--color-warn` is deliberately not blue, so "something is wrong" can never be
mistaken for "this is the primary action". It is the only place it appears.

### Accent tints

Composite rgba values in the `:root` block below `@theme` (`--blue-tint-bg`,
`--blue-tint-border`, `--blue-tint-text`, `--status-on-*`). **Use them as they
are — do not derive new tints from `--color-blue`.**

### Image surfaces

`--color-shade-a/b`, `--color-portrait-a/b`, `--color-thumb`, `--color-idle`,
`--color-rule-strong`. Every image container is painted with one of these before
its picture loads, so a missing or slow image reads as a designed panel instead
of a blank box.

### Radii

`--radius-sm: 6px`, `--radius-btn: 10px`, `--radius-thumb: 8px`,
`--radius-chip: 12px`, `--radius-card: 18px`, `--radius-panel: 22px`,
`--radius-member: 16px`, `--radius-pill: 100px`.

Radii scale with element size: 6–10px for controls, 12–18px for cards, 22px for
full-width panels. **Never nest two radii more than one step apart.**

### Two documented exceptions to "no hex outside the tokens"

1. `<meta name="theme-color">` in `Base.astro` — a meta tag cannot read a CSS
   variable.
2. The fallbacks in `ArmCanvas.astro`'s `token()` calls — canvas needs real
   colour strings, and these are only reached if a token is missing.

Both are deliberate. Nothing else should carry a raw colour.

---

## 2. Type

Two self-hosted families, configured in `astro.config.mjs` through Astro's Fonts
API and preloaded in `Base.astro`. Nothing is fetched from Google at page load.

- **Archivo** (`--font-disp`) — everything readable.
- **Spline Sans Mono** (`--font-mono`) — machine-ish information *only*.

| Role | Spec |
|---|---|
| `h1` page title | Archivo 800, `clamp(44px,6.2vw,76px)`, `-.035em`, max 13ch |
| `h2` section head | Archivo 700, `clamp(24px,3.2vw,36px)` |
| `h3` card title | 20px; `clamp(28px,3.8vw,44px)` for the featured event |
| Body | Archivo 400, 16.5px, line-height 1.6, `--color-fg` |
| Lede (`.lede`) | Archivo 400, 18.5px, `--color-muted`, max 46ch |
| Metadata (`.mono`) | Spline Sans Mono, 10–11.5px, `.10–.13em`, uppercase |
| Big numbers | Archivo 700, `-.04em`, `tabular-nums` |

**Mono is for dates, times, counts, status flags, category labels and section
meta.** Never set a paragraph or a heading in mono.

**Gradient text** (`.grad`) is reserved for one emphasised phrase in the home
`h1` and nothing else. It has a solid-colour fallback for browsers without
`background-clip: text`.

---

## 3. Layout

- **Container** — `src/components/ui/Container.astro` (`.wrap`): 1200px max,
  30px gutters, `z-index: 2` so content clears the fixed background. Use it;
  don't set page widths inline. If a page needs a narrower measure, put a
  max-width on the content (e.g. `.prose-body` at 70ch).
- **Background** — a fixed `body::before` layer carrying three stacked
  gradients. It applies to every page automatically. Never add a second animated
  or full-page background anywhere.
- **Section rhythm** — `.section` gives 92px top padding. Nothing else sets its
  own section spacing.
- **Breakpoints** — 1000px is the main one (grids collapse, nav becomes a
  drawer), 900px hides the arm canvas, 640px tightens gutters and stacks section
  headers. Test at 320 / 768 / 1000 / 1440.

---

## 4. Components

All in `src/components/ui/` unless noted.

| Component | Use |
|---|---|
| `Container` | The page container. Everything sits in one. |
| `PageHeader` | **Every page that isn't home opens with this.** |
| `SectionHeader` | `h2` left, mono meta or an `--ice` link right. |
| `EventRow` | One line in a chronological list of events. |
| `ProjectCard` | Browsable, image-led card. |
| `MemberTile` / `AdvisorTile` | Portrait tiles with an initials fallback. |
| `NextEvent` | Featured event panel; countdown or recap. |
| `Countdown` | Client-side countdown to a real event. |
| `JoinCTA` | Closing call-to-action band. |
| `ArmCanvas` | The hero manipulator. **Home only.** |
| `events/EventsLayout` | Sidebar shell shared by events and projects. |

### Buttons — three variants, no more

- `.btn` — primary. Blue fill, white text.
- `.btn.btn-o` — outline. Faint fill, `--color-rule` border.
- `.btn.btn-quiet` — text only, `--color-ice`, underline on hover.

**Exactly one primary button per view region.** If two blue things compete for
attention on a screen, demote one to outline.

### Status

Status pills never signal by colour alone — the label always carries the
meaning. `.st` is the neutral pill; `.st-on` adds the blue tint for
upcoming/today.

---

## 5. Imagery

Every image gets a treatment, chosen by role. These are already baked into the
component classes; you only need them if you build something new.

| Role | Treatment |
|---|---|
| Featured event photo | `saturate(.7) contrast(1.1) brightness(.75)` + edge-fade overlay |
| Duotone feature (`.duo`) | `grayscale(1) contrast(1.15) brightness(.8)` + blue/ice `mix-blend-mode: color` |
| Card thumbnail | `saturate(.8) brightness(.88)` |
| Row thumbnail | `grayscale(.6) brightness(.85)`, 70×46 |
| Portrait | **None — committee and advisory photos stay in full colour.** |

**Where images live matters.**

- **`src/assets/`** — page images (committee, advisors, mission, sponsors).
  Astro converts these to webp at the sizes actually used. Reference them by
  path relative to `src/assets` and resolve with `asset()` from
  `src/lib/assets.ts`.
- **`src/content/<collection>/<entry>/`** — images belonging to an event or
  project. See `CONTENT_GUIDE.md`.
- **`public/`** — only genuinely static files: favicon, logo. **Anything here is
  served byte-for-byte and never optimised**, so don't put photos in it.

Always give an image container a gradient fallback, set explicit dimensions or
an aspect ratio, and lazy-load anything below the fold.

---

## 6. Motion

- `.rise` with `.d1`–`.d4` — the page-load reveal. **First screen only, four
  elements maximum.** Never on every section.
- Hover: cards lift 3px (tiles 4px) and their border goes to
  `--color-rule-hover`; buttons lift 1px. Transitions 0.16–0.22s.
- `prefers-reduced-motion: reduce` disables every animation and transition, and
  the arm canvas draws a single static frame. **This is not optional.**

---

## 7. Extending the language

When the prototype doesn't cover what you're building, follow these rather than
inventing a new pattern.

1. **Every inner page opens with `PageHeader`**, not a hero. The animated arm
   never appears outside the home hero.
2. **Depth comes from borders, not shadows.** Panels are `--color-surface` on
   `--color-bg` with a 1px `--color-rule`. Shadows only on hover, and only long,
   soft, low-opacity blacks.
3. **Radii scale with element size** (see §1).
4. **Accent budget:** `--color-blue` for the primary action and active/upcoming
   status only; `--color-ice` for secondary links and the motion trace.
5. **Any list of things** uses `EventRow` if it is scannable and chronological,
   or the card grid if it is browsable and image-led. **Do not build a third
   list pattern.**
6. **New sections** follow: `.section` (92px) → `SectionHeader` → content →
   optional right-aligned `--ice` link. Nothing else sets its own spacing.
7. **No emoji as iconography.** Categories are identified by mono uppercase
   labels.
8. If a genuinely new component is unavoidable, build it from existing tokens
   and add it to §4 here, so the next committee inherits a documented language
   rather than a pile of exceptions.

---

## 8. Accessibility

Non-negotiables, all currently satisfied:

- Focus is visible everywhere: `outline: 2px solid var(--color-blue)` at
  `outline-offset: 3px`. **Never remove it.**
- `--color-muted` on `--color-bg` is fine for body-sized text. Do not use it
  below 12px for essential information, and never dim it further.
- Everything interactive works from the keyboard: the nav dropdown, the mobile
  drawer (Escape closes, focus is trapped), the sidebar accordions, the
  carousels and the forms.
- Real alt text on content images, `alt=""` on decorative ones, `aria-hidden` on
  the canvas.
- One `h1` per page.
