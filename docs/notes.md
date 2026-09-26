Summary

Built on a new branch (explore/decap-cms), not dev:

- functions/api/auth.js / functions/api/callback.js — Cloudflare Pages Functions handling the GitHub OAuth handshake for the CMS login, adapted from a verified working reference implementation rather than improvised.
- public/admin/index.html / public/admin/config.yml — the Decap CMS admin UI, configured for both events and projects collections matching this repo's actual schema (including your new countdown/countdown_units fields), with path: '{{slug}}/index' + media_folder: '' so it keeps images inside each entry's own folder like docs/CONTENT_GUIDE.md requires.
- Sidebar label fix in events.astro and events/[...slug].astro — both now read event.data.title instead of deriving the label from the folder name, so entries the CMS creates (which get kebab-case folder names) still show their real title in the sidebar.

Verified: npm run build still passes at 19 pages, no broken images, public/admin correctly lands in dist/admin.

This is not usable yet — three things need to happen outside the repo, which only you can do:
1. Create a GitHub OAuth App and set its callback URL.
2. Add GITHUB_CLIENT_ID/GITHUB_CLIENT_SECRET as environment variables in the Cloudflare Pages project settings.
3. Assign a stable preview domain/alias to this branch in Cloudflare Pages (plain preview URLs change every deploy, which breaks the OAuth callback), then update base_url in public/admin/config.yml to match.

And two honest limitations, so you know what this branch does and doesn't solve: it does not auto-optimize uploaded images (still need to resize/compress before uploading, same discipline as today), and it has no awareness of this site's custom /!!! … !!!/ body syntax — committee members would still hand-type those markers into the markdown editor.