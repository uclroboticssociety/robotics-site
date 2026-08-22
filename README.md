# UCL Robotics Society Website

[![Deployed on Cloudflare Pages](https://img.shields.io/badge/Deployed%20on-Cloudflare%20Pages-F38020?logo=cloudflare&logoColor=white)](https://uclrobotics.com)
[![Built with Astro](https://img.shields.io/badge/Built%20with-Astro-BC52EE?logo=astro&logoColor=white)](https://astro.build/)
[![Styled with TailwindCSS](https://img.shields.io/badge/Styled%20with-TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

Official website of the **UCL Robotics Society**, built with [Astro](https://astro.build/) and [TailwindCSS](https://tailwindcss.com/).  
Hosted on **Cloudflare Pages** and connected to our custom domain:

**[https://uclrobotics.com](https://uclrobotics.com)**

> **Adding an event, workshop, hackathon, social or project?** See **[docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md)** - the full guide to maintaining the site's content: how Astro's content layer works, frontmatter fields, page syntax, images, and troubleshooting.

---

## Read this first

> ### `main` is the live website.
> Anything merged into `main` is public at [uclrobotics.com](https://uclrobotics.com) within minutes. No staging step, no undo button. Work on `dev` or a feature branch.

| ✅ Do | ❌ Don't |
|---|---|
| Run `npm run build` before every push | Trust `npm run dev` alone, it is more forgiving than the real build |
| **Open a PR for any change to code, layout or config** | Push code straight to `main` |
| Click the PR's Cloudflare preview URL and look at the page | Merge on a green tick alone |
| One commit per logical change, named for what changed | `update`, a bare date, or `V6` |

This table covers git and deployment only. The content rules (folders, frontmatter, images) are in [docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md). Full git detail is [below](#git-workflow-and-pull-requests).

---

## Docs in this repo

| File | For |
|---|---|
| `README.md` | Setup, git workflow, pull requests, deployment, domain |
| [`docs/CONTENT_GUIDE.md`](docs/CONTENT_GUIDE.md) | Adding events, projects, images and page content |
| [`docs/DESIGN.md`](docs/DESIGN.md) | Design tokens, the component set, and rules for extending the look |
| [`CLAUDE.md`](CLAUDE.md) | Instructions for AI coding agents. `AGENTS.md` is a symlink to it |

`CLAUDE.md` stays at the repo root, not in `docs/`, because that's where AI coding agents (Claude Code, Cursor, Copilot) look for it automatically. If you use one, it's picked up without you doing anything, and tells it the conventions and the traps in this codebase. Point the agent at it if your tool reads neither name. **When you change how this repo works, update `CLAUDE.md` too**, otherwise the next person's agent will confidently do the old thing.

---

## Tech Stack

| Category | Technology |
|-----------|-------------|
| Framework | [Astro](https://astro.build/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Hosting | [Cloudflare Pages](https://pages.cloudflare.com/) |
| Version Control | [GitHub](https://github.com/uclroboticssociety/robotics-site) |
| Domain | [Namecheap](https://www.namecheap.com/) + [Cloudflare DNS](https://dash.cloudflare.com/) |

---

## Local Development

Requires **Node.js 20.19+ or 22+** (check with `node -v`).

### 1. Clone this repository
```bash
git clone https://github.com/uclroboticssociety/robotics-site.git
cd robotics-site
```
### 2. Install dependencies 
```bash
npm install
```
### 3. Run locally
```bash
npm run dev
```
Then open http://localhost:4321 to preview the site locally while editing.

### 4. Check the build before you push
```bash
npm run build
```
This is the same build Cloudflare runs. It catches broken content frontmatter in seconds, instead of after a failed deploy. `npm run preview` then serves the built site exactly as Cloudflare will.

---

## Deployment Workflow

Cloudflare Pages rebuilds and publishes the site on every push to `main`, live within a few minutes. There is nothing to run by hand.

> **Do not push to `main` unless it is final.** Work in `dev`.

```bash
git add .
git commit -m "Update homepage or content"
git push
```

That is the shortcut for a typo fix. Anything larger: [Git workflow and pull requests](#git-workflow-and-pull-requests). Content pre-push checks: [Publishing checklist](docs/CONTENT_GUIDE.md#publishing-checklist).

---

## Git workflow and pull requests

Opening a PR with yourself is normal practice. Do it even as the only maintainer: the Cloudflare preview URL lets you see the change on a real page before the public does, and the PR is a record for whoever inherits this repo.

### PR, or push straight?

| Change | Do this |
|---|---|
| Typo, date, location, swapping one photo | Commit to `main` |
| New event or project page | Branch, PR optional |
| Anything in `src/components/`, `src/layouts/`, `src/pages/` | **Branch + PR** |
| `src/content.config.ts`, `package.json`, `astro.config.mjs`, Tailwind config | **Branch + PR** |
| Navbar or footer links, new page, redesign | **Branch + PR** |

A bad content edit breaks one page. A bad code edit can take the whole site down, publicly, until you notice. When in doubt, branch.

### The flow

```bash
git checkout main && git pull          # start from the latest main
git checkout -b fix-nav-dropdown       # one branch per change
npm run build                          # must pass before you push
git commit -am "Fix nav dropdown closing before the cursor reaches it"
git push -u origin fix-nav-dropdown    # -u only on a branch's first push
```

On GitHub: **Compare & pull request** → wait for the Cloudflare check → **click the preview URL and look at the page** → merge → delete the branch.

### Naming

Say what changed. Present tense, no version numbers. GitHub numbers PRs itself.

```
Add March robotics workshop event
Fix nav dropdown closing before the cursor reaches it
Update committee photos for 2026/27
```

### Tags, not version numbers

The old `VX` convention (`V4 31/1/2026`, `V4.1`, `V5`) is retired: it duplicated the commit date, and `V4.1` was used twice. Mark milestones with tags instead, a handful a year (start of term, redesign, handover).

```bash
git tag -a v6 -m "Site as deployed for Welcome Week 2026"
git push origin v6
```

### Commit frequency

One commit per finished thing: a page, a fix, a translated file. Several per session is normal, not clutter. Avoid the opposite, one commit holding five unrelated changes that can't be reverted separately. Push at the end of a session, or sooner to trigger a preview build.

### Squash merging

Which merge type to use depends on the branch, and getting this wrong causes real pain:

| Branch | Merge with | Why |
|---|---|---|
| Short-lived feature branch, deleted after merging | **Squash and merge** | Collapses `wip` / `fix typo` commits into one tidy entry |
| Long-lived `dev` into `main` | **Create a merge commit** | Squashing here makes a commit with no shared ancestry, so `dev` keeps its originals and the next merge hits phantom conflicts |

Pick the type from the dropdown on the green merge button. Changing the repo default needs admin rights, which the web officer may not have, so check the dropdown every time.

Do not squash a branch whose commits are each worth keeping. If one of them may need reverting on its own later, a merge commit preserves that.

**Never delete `dev`.** It is permanent. Delete feature branches after merging; `dev` stays, and you resync it with `git checkout dev && git merge main && git push`.

---

## Collaboration

Add committee members under **Settings → Collaborators → Add person**. They clone and work the same way.

When the committee changes over, work through the [Handover checklist](docs/CONTENT_GUIDE.md#handover-checklist).

---

## Manual Deployment (if needed)

If you ever need to manually trigger a new deployment:

1. Go to Cloudflare Pages Dashboard
2. Open project robotics-site
3. Go to Deployments
4. Click “Trigger Deploy” → “Retry Last Deploy”

---

## Domain & DNS Setup (for reference)
| Provider | Purpose |
|---|---|
| Namecheap | Domain purchase (uclrobotics.com) |
| Cloudflare | DNS management & HTTPS |
| GitHub | Source code repository |
| Cloudflare Pages | Hosting & deployment automation |

Nameservers (as configured on Namecheap):
```bash
gail.ns.cloudflare.com
quincy.ns.cloudflare.com
```

---

Built with ❤️ by UCL Robotics Society · 2026 | Empowering the next generation of roboticists at UCL
