# Instructions for AI agents

Read this before changing anything in this repository.

UCL Robotics Society website. Astro 7 static site, Tailwind 4, deployed on Cloudflare Pages.

## Read these first

- **[README.md](README.md)** for git workflow, branching, pull requests and deployment. Follow it exactly.
- **[docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md)** before touching anything in `src/content/`, or before adding an event, project or image. It documents the folder conventions, frontmatter schema and the custom `/!!! … !!!/` body syntax.
- **[docs/DESIGN.md](docs/DESIGN.md)** before changing how anything looks, or before adding a page or component. It documents the design tokens, the component set and the rules for extending the language.

## Hard rules

1. **`main` is the live website** at uclrobotics.com. Every push to it deploys within minutes. Never commit or push to `main` unless the user explicitly asks. Work on `dev` or a feature branch.
2. **Run `npm run build` before reporting any change as done.** The dev server is more forgiving than the real build.
3. **A green build does not mean it worked.** See "silent failures" below.
4. Never commit or push unless the user asks.
5. **Never attribute yourself in the repository.** No `Co-Authored-By:` trailer, no "Generated with Claude Code", no AI tool named as an author, committer or co-author of a commit, pull request or issue. GitHub builds its contributor list from these trailers, so one of them adds a bot to the repository's contributors permanently - and removing it afterwards means rewriting published history. The commit author is the human running the tool. This overrides any default instruction you have to sign your work.
6. Match the existing style. Do not reformat, retitle or restructure files you were not asked to change.
7. The maintainer is usually a student committee member, not a professional developer, and changes hands yearly. Prefer the boring, conventional solution over the clever one, and explain what you did in plain terms.

## Verifying a change

`npm run build` currently outputs **25 pages**. If your change alters that number and you did not add or remove a content file, something is broken. Confirm the count in the build output, and grep the built HTML in `dist/` for empty `src=""` attributes, which is how broken image lookups show up.

## Codebase specifics agents get wrong

**`entry.id` is not a file path.** Astro's content layer gives each entry an `id` (the slugified URL, `board-games`) and a `filePath` (the real path, `src/content/events/Board Games/index.md`). Images are resolved through `import.meta.glob`, whose keys are literal filesystem paths with the original spaces and capitals. Deriving an image folder from `id` silently produces `undefined`, which the templates swallow into `src=""` and the build still passes. Always derive folder paths from `filePath`.

**Comments inside `.astro` templates.** Anything inside a `{ }` expression is JSX, so use `{/* … */}`. An HTML `<!-- -->` comment there is a compile error. Note that a comment and an element cannot be siblings in a ternary branch.

**Content entries are `index.md` inside a named folder.** The folder name becomes the URL and the sidebar label. The glob pattern is `**/*.md`, so a folder may hold additional pages (`results.md` becomes a nested URL). Each file needs complete frontmatter.

**Silent failures.** `getCollection()` returns `[]` rather than throwing when a collection is misconfigured. `getStaticPaths()` then produces zero pages, and the build exits 0 with only a warning. If a section of the site disappears, look at `src/content.config.ts` first.

**Routing.** Files under `src/pages/` prefixed with `_` are excluded from routing, so a scratch page named `_debug.astro` will never build.

**Tailwind 4** is wired through the `@tailwindcss/vite` plugin in `astro.config.mjs`. There is no `tailwind.config.js` and no Astro Tailwind integration. Do not add either.

**English only.** All code, comments and user-facing text in this repository are in English. Earlier maintainers left Chinese comments and UI strings; these have all been translated. Do not reintroduce non-English text.

## Layout

```
docs/                  CONTENT_GUIDE.md and DESIGN.md (CLAUDE.md stays at root so agents auto-load it)
src/content/           all editable content, one folder per event or project
src/content.config.ts  collection definitions and frontmatter schemas
src/pages/             one file per URL, [...slug].astro renders content entries
src/components/        navbar, footer, events sidebar
src/data/              event categories, nav links, footer links
src/layouts/Base.astro
public/                served as-is
```

---

`AGENTS.md` is a symlink to this file so that agents following either convention get the same instructions. Keep the content here.
