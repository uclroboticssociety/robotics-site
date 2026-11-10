# Design language - "Network"

How this site looks, and how to extend it without it drifting. Read this before
adding a page or a component.

The idea in one line: **the logo is a small neural network drawn as a robot**
(dark nodes in white rings, joined by thin links), so the site is built from
that same node-and-link motif on a light, soft, violet ground.

The whole language lives in **`src/styles/global.css`**. That file is the single
source of truth for colour, radius, shadow and type. If you find yourself
writing a hex value anywhere else, something has gone wrong.

This is a **single light theme by design**. There is no dark mode and no theme
switcher. Do not add one, and do not add `localStorage`-driven theming.

---

## 0. How global.css is organised

Read this first, it will save you time.

1. **Tokens** (`@theme` and `:root` at the top) - every colour, radius, shadow,
   font and easing value.
2. **Components** - one section per component (`---- nav ----`,
   `---- event rows ----`, …). These set **structure**: layout, grid columns,
   spacing, sizes.
3. **The "Network" layer** (the block headed `"Network" layer`, near the end) -
   sets **appearance** on top of the components: radii, shadows, fonts, hover
   motion, the floating navbar, the spine. Because it comes later, it wins when
   the two disagree.
4. **Breakpoints**, then the Network layer's own responsive rules, then the
   **reduced-motion** block, which must stay last.

So: to change how something **looks**, look in the Network layer first. To
change how it is **laid out**, look in its component section.

---

## 1. Tokens

### Colour

Built from the logo's three colours: the lilac fill, the deep violet of the
nodes, and white. There is no black anywhere on the site - the darkest colour
is the logo's deep violet.

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#FBFAFF` | Page background (cool white) |
| `--color-surface` | `#FFFFFF` | Cards, panels, the navbar |
| `--color-surface-2` | `#F1EAFD` | Lilac mist: tinted panels, hover backgrounds |
| `--color-rule` | `#E4DCF2` | Quiet dividers (row separators, the footer edge) |
| `--color-rule-hover` | `#C9B8EC` | Outline button border |
| `--color-fg` | `#290050` | All primary text - the logo's deep violet |
| `--color-muted` | `#5F5177` | Secondary text, metadata, idle nav |
| `--color-lilac` | `#DEC5FB` | The logo's fill. Decoration only (the spine, selection) |
| `--color-accent` | `#6F32E6` | Electric violet: primary button, links, active states, focus ring |
| `--color-accent-hover` | `#5A21C9` | Primary button hover |
| `--color-accent-deep` | `#290050` | Dark end of the join band's gradient |
| `--color-warn` | `#B3261E` | Form errors only - the one warm tone |

**Violet only, no second hue.** `--color-warn` is deliberately not purple, so
"something is wrong" never reads as "this is the primary action".

The `:root` block below `@theme` holds composite values (`--accent-tint-*`,
`--status-on-*`, the two shadows, `--ease-out`). Use them as they are - do not
derive new tints from `--color-accent`.

`--color-shade-*`, `--color-portrait-*` and `--color-thumb` paint every image
container before its picture loads, so a slow or missing image reads as a
designed panel instead of a blank box.

### Radius

Everything is rounded. Anything you can press is a full pill.

| Token | Value | Use |
|---|---|---|
| `--radius-btn`, `--radius-pill` | `999px` | Buttons, nav links, tags, status pills |
| `--radius-sm` | `10px` | Small hover backgrounds inside panels |
| `--radius-thumb` | `12px` | Event row thumbnails |
| `--radius-chip` | `16px` | Countdown cells, inputs, small panels |
| `--radius-card`, `--radius-member` | `24px` | Cards, member tiles, the event list |
| `--radius-panel` | `32px` | Big panels: featured event, photo frames, join band |

Round controls (`.socials a`, `.hero-scroll`, the LinkedIn badge) are circles.

### Shadow

Depth comes from **two violet-tinted shadows, not from borders**. Panels have
no outline at all.

- `--shadow-1` - resting: cards, tiles, the event list, the navbar.
- `--shadow-2` - raised: hover state, the featured event, big photo frames,
  dropdowns, the join band.

Never use a grey or black shadow, and never invent a third level.

---

## 2. Type

The Red Hat family, self-hosted at build time through Astro's Fonts API
(`astro.config.mjs`) and preloaded in `Base.astro`. Nothing is fetched from
Google at page load.

- **Red Hat Display** (`--font-head`) - headings, member names, event titles,
  the brand name.
- **Red Hat Text** (`--font-disp`) - everything readable: body, buttons, nav.
- **Red Hat Mono** (`--font-mono`) - machine-ish information *only*: dates,
  times, counts, status flags, category labels, section meta.

| Role | Spec |
|---|---|
| Home hero title | Display 900, `clamp(32px,4.4vw,64px)`, max `10.5em` (see below) |
| `h1` page title | Display 900, `clamp(44px,6.2vw,76px)`, `-.025em` |
| `h2` section head | Display 800, `clamp(28px,3.4vw,40px)` |
| Headings generally | Display 800, `-.015em`, `word-spacing: .05em` |
| Body | Text 400, 16.5px, line-height 1.6 |
| Lede (`.lede`) | Text 400, 19px, `--color-muted` |
| Metadata (`.mono`) | Mono, 10–12.5px, `.1em`, uppercase |

Red Hat Display is already tight at heavy weights, so headings get only a
little negative tracking and slightly wider word gaps. Don't push the tracking
tighter - words start to run together.

**The hero title's line break is measured, not luck.** It must always break as
"Experience the heart / of UCL innovation". `max-width: 10.5em` sits between
the width of "Experience the heart" (9.9em) and "heart of UCL innovation"
(11em), and the `.nb` span keeps "of UCL innovation" together. If the title text
or font changes, re-measure in the browser and update the comment in
`global.css`. The `.hl` span colours "UCL innovation" violet; neither span
changes the words.

**Mono never sets a paragraph or a heading.**

---

## 3. Layout

- **Container** - `src/components/ui/Container.astro` (`.wrap`): 1200px max,
  30px gutters (20px under 640px). Use it; don't set page widths inline.
- **Width** - everything sits in the 1200px container, except the navbar and
  home hero, which use `wrap-wide` (full width with a 20-56px gutter).
- **Floating navbar** - a white rounded bar, inset 12px from the top and sides
  (8px on phones), sticky. Its inner gutter is reduced by the inset so the logo
  still lines up with the page content below. The home hero slides up
  underneath it (`margin-top: -76px`) so the hero's background reaches the top
  of the screen; the hero's top padding makes up the difference.
- **Section rhythm** - `.section` gives 92px top padding (64px on phones).
  Nothing else sets its own section spacing.
- **Breakpoints** - 1320px (the spine appears), 1000px (grids collapse, nav
  becomes a drawer, the hero stacks), 640px (gutters tighten, section headers
  stack). Test at 320 / 390 / 768 / 1000 / 1440 / 1920.

---

## 4. Components

All in `src/components/ui/` unless noted.

| Component | Use |
|---|---|
| `Container` | The page container. Everything sits in one. |
| `PageHeader` | **Every page that isn't home opens with this.** |
| `SectionHeader` | `h2` left, mono meta or an accent link right. Its arrow slides forward on hover. |
| `HeroNetwork` | The animated network behind the home hero. Home only. See §6. |
| `EventRow` | One line in a chronological list. A group of rows is one white rounded panel. |
| `ProjectCard` | Browsable, image-led card. |
| `MemberTile` / `AdvisorTile` | Portrait tiles with an initials fallback. |
| `NextEvent` | Featured event panel; countdown or recap. |
| `Countdown` | Client-side countdown to a real event. |
| `Carousel` | Horizontal photo strip for `[scroll]`/`[scroll_folder]` bodies. |
| `JoinCTA` | Closing call-to-action band - deep violet with an electric-violet glow. |
| `events/EventsLayout` | Sidebar shell shared by events and projects. |

Sponsor logos on `/about/sponsors` are the one deliberate exception to "cards
or rows": a logo is a mark, not something to browse, so they sit straight on
the page in the **sponsor plate** (`.sponsor-plate`): two logos to a row, no
panels around them, just a short thin tick between each pair (horizontal once
they stack on phones), and each sponsor's web address in mono underneath
(accent on hover). Each logo's height is scaled by 1/√(aspect ratio) so wide
and compact logos carry the same visual weight.

### The node motif

The logo's node - **a dark dot in a white ring with a thin violet outline** - is
the one recurring decoration. It appears as:

- the nodes of `HeroNetwork`;
- **photo frames**: the hero photo and the "Our story" photo get a 7px white
  border plus a 1.5px `--color-fg` outline (5px on phones) - a node at a much
  larger size;
- **the spine**: on screens 1320px and wider, a thin lilac line runs down the
  left margin and every `SectionHeader` sits on it as a small node, so the
  hero's network seems to continue down the page. The node is hollow until its
  section scrolls into view. Only sections that open with a `SectionHeader`
  get it - a line with no node reads as a stray border.
- the status pill's live dot in the hero.

Use the white-ring frame for a hero-level photo only. Ordinary content images
get `--shadow-1` and a radius, no ring.

### Buttons - three variants, no more

- `.btn` - primary. Violet pill, white text. Shadow on hover.
- `.btn.btn-o` - outline. White fill, lilac border; turns violet on hover.
- `.btn.btn-quiet` - text only, `--color-accent`.

On the join band, `.btn`/`.btn-o` are inverted by a scoped override
(`.join .btn`, `.join .btn-o`) rather than a fourth variant.

**Exactly one primary button per view region.** If two violet pills compete for
attention, demote one to outline.

Icon-only controls (`.nav-toggle`, `.socials a`, `.carousel-nav`,
`.hero-scroll`) are fixed squares or circles with a `currentColor` glyph, never
filled violet. `.carousel-nav` sits on a photo with no plate; its glyph carries a
drop shadow for contrast. The LinkedIn badge on member tiles is a small blurred
glass circle, because member photos are numerous and their contrast is
uncontrolled.

### Status

Status pills never signal by colour alone - the label always carries the
meaning. `.st` is the neutral pill; `.st-on` adds the accent tint for
upcoming/today.

---

## 5. Imagery

| Role | Treatment |
|---|---|
| Event / card / row / detail photo | `contrast(1.05)`, rounded, `--shadow-1` |
| Hero and "Our story" photos | White ring frame (see "The node motif") |
| Portrait | **None - committee and advisory photos stay in full colour.** |

Photos inside cards and tiles zoom very slightly (`scale: 1.04-1.05`) when the
card is hovered.

**Where images live matters.**

- **`src/assets/`** - page images (committee, advisors, mission, sponsors).
  Astro converts these to webp at the sizes used. Resolve them with `asset()`
  from `src/lib/assets.ts`.
- **`src/content/<collection>/<entry>/`** - images belonging to an event or
  project. See `CONTENT_GUIDE.md`.
- **`public/`** - only genuinely static files: favicon, logo. Anything here is
  served byte-for-byte and never optimised, so don't put photos in it.

Always give an image container a gradient fallback, set explicit dimensions or
an aspect ratio, and lazy-load anything below the fold. The hero photo is the
one exception to lazy loading.

---

## 6. Motion

One easing for everything: `--ease-out` (fast start, long soft landing).
Hand-written CSS and vanilla JS only - **no animation library**.

### The signature: `HeroNetwork.astro`

The network behind the home hero. It is decoration only (`aria-hidden`).

- **Layout.** 1, 2, 5, 2, 5, 2, 1 nodes per column - the logo's own pattern
  (antenna, shoulders, row of five, eyes), then mirrored. Each node is placed
  by hand as a fraction of the hero's width and height, in the `layout` list
  at the top of the file, so that nodes stay clear of the text, the buttons
  and the photo at every screen size. **If you move a node, check it at 1000,
  1440 and 1920px.** Only the thin links may pass behind text.
- **On load** the links draw in and the nodes pop in, column by column (CSS).
- **Then** the nodes drift slowly, and nodes near the pointer grow and turn
  violet (script).
- **Pulses only run when a visitor sets them off.** Hovering over a node, or
  clicking or tapping one, sends a pulse out from it in each direction along
  the links, and each node a pulse passes flashes a ring. Nothing runs on its
  own: constant pulses were removed as too much visual noise, especially on
  phones. Do not bring them back.
- **Below 1000px** the hero stacks and the network becomes a band around the
  photo.
- The script **stops while the hero is off screen**, and never starts under
  `prefers-reduced-motion` - it checks that itself and listens for the setting
  changing. Without JavaScript the network is simply a still drawing.

### Reveals

- `.rise` with `.d1`-`.d4` - the page-load reveal. **First screen only, four
  elements maximum.** All four are spent on the home hero.
- `data-reveal` - scroll-triggered reveal of a whole section, once. The observer
  is in `Base.astro`.
- `data-reveal-stagger` - put it on a **group** (a grid or list) instead. Each
  child is watched separately, and children that arrive together (one row of a
  grid) rise one after another, 90ms apart. Used on the home committee grid and
  event list.
- Neither ever gives an element an `opacity: 0` resting state. Content is
  visible until the script adds `data-shown`, so if the script never runs the
  reader loses the animation, not the content.
- Don't put `data-reveal` on an element that is on screen at load, and don't
  nest the two attributes.

### Hover

Cards and tiles lift (5-6px) and move to `--shadow-2`; photos inside them zoom
slightly; event titles slide right; section links' arrows slide forward;
buttons press in slightly on click. Transitions 0.3-0.5s on `--ease-out`.

### Page transitions

`@view-transition { navigation: auto; }` cross-fades between pages in browsers
that support it, and does nothing elsewhere. Do **not** switch to Astro's
`ClientRouter`: it would stop the nav, countdown, carousel and network scripts
from re-running on each page.

### Reduced motion

`prefers-reduced-motion: reduce` disables every animation and transition. **This
is not optional.** The block at the foot of `global.css` covers CSS. It does not
stop JavaScript: **any script that moves something must check
`matchMedia("(prefers-reduced-motion: reduce)")` itself and listen for its
`change` event.** `Carousel.astro` and `HeroNetwork.astro` are the reference
implementations.

If you ever genuinely need sequenced timelines, scroll-scrubbed motion or
springs, add a small library **for that one component** only - Astro bundles a
component's script only into the pages that use it.

---

## 7. Extending the language

1. **Every inner page opens with `PageHeader`**, not a hero. `HeroNetwork` and
   the ringed hero photo never appear outside the home page.
2. **Depth comes from the two shadows, not from borders.** A new panel is
   `--color-surface` with `--shadow-1` and `--radius-card`, no outline. It
   moves to `--shadow-2` only if it is raised (hovered, featured, floating).
3. **Everything is rounded**, using the radius tokens. Never hardcode a radius.
4. **Accent budget:** `--color-accent` for the primary action, active/upcoming
   status, links and focus. There is no secondary hue.
5. **Any list of things** uses `EventRow` if it is scannable and chronological,
   or the card grid if it is browsable and image-led. **Do not build a third
   list pattern.**
6. **New sections** follow: `.section` → `SectionHeader` → content. Using
   `SectionHeader` also puts the section on the spine for free.
7. **No emoji as iconography.** Categories are identified by mono labels.
8. **Capability queries** (`@media (hover: hover)`) are allowed where a control
   genuinely depends on the input device. Visible is the base state; hiding is
   the enhancement.
9. If a genuinely new component is unavoidable, build it from existing tokens
   and add it to §4 here.

---

## 8. Accessibility

Non-negotiables, all currently satisfied:

- Focus is visible everywhere: `outline: 2px solid var(--color-accent)` at
  `outline-offset: 3px`. **Never remove it.**
- `--color-muted` on `--color-bg` is fine for body-sized text. Do not use it
  below 12px for essential information, and never dim it further.
- Everything interactive works from the keyboard: the nav dropdown, the mobile
  menu (Escape closes, focus is trapped), the sidebar accordions, the carousels
  and the forms.
- The carousel frame carries **no `tabindex`**; browsers give a scrollable
  region its own tab stop, which is what makes arrow-key scrolling work. Do not
  "fix" it with `tabindex="-1"`.
- Real alt text on content images, `alt=""` on decorative ones. `HeroNetwork`
  and the hero decorations are `aria-hidden`.
- One `h1` per page.
- **Anything that moves on its own for more than 5s needs a way to stop it**
  (WCAG 2.2.2). The carousel pauses on hover, focus, interaction and when off
  screen. The hero network is pure decoration, stops off screen, and is still
  under reduced motion.
- **A control overlaid on photography carries its own contrast** (a plate, a
  scrim or a glyph shadow). Check it against the palest image on the page.
- **Hover-revealed controls must be visible on touch.** Hide them inside
  `@media (hover: hover)` with `opacity` plus `pointer-events: none`, never in
  the base rule.
