# Repo Split Migration Runbook

This repo is prepared for a five-repo split:

- `micr-dev/micr.dev`
- `micr-dev/about`
- `micr-dev/quarzite`
- `micr-dev/microkeebs`
- `micr-dev/anonq`

`tree` and `wip` stay inside `micr.dev`.

## Current local implementation status

- `microkeebs` is now self-contained under `microkeebs/`, including its Netlify functions and deploy config.
- `anonq` is configured for host-root deployment instead of `/anonq`.
- `about` and `quarzite` have subdomain-ready metadata, `robots.txt`, `sitemap.xml`, and Netlify configs.
- The root `netlify.toml` is prepared for final redirect-based cutover.
- `WIP/` has been normalized to `wip/`.

## External blockers

- GitHub org and repo creation may need to be completed outside this repo if local GitHub CLI access is unavailable.
- Netlify site creation and custom-domain attachment were not performed from this repo.
- DNS changes were not performed from this repo.

## Required GitHub repos

Create these repositories under the `micr-dev` org:

- `micr.dev`
- `about`
- `quarzite`
- `microkeebs`
- `anonq`

## Local split commands

Run from this repo after authenticating GitHub and before any cleanup push:

```bash
node scripts/create-split-branches.mjs
```

That creates these local branches:

- `split/about`
- `split/quarzite`
- `split/anonq`
- `split/microkeebs`

Push each branch to its target repo using a fresh remote or a temporary bare clone workflow.

## Recommended cutover order

1. `about`
2. `quarzite`
3. `anonq`
4. `microkeebs`
5. root `micr.dev`

Do not cut over root redirects until the destination site is healthy on its custom domain.

## Netlify target state

### `micr.dev`

- root homepage
- `/tree`
- `/wip`
- root shortlinks and `/dialogue`
- `301` redirects for `/about`, `/quarzite`, `/microkeebs`, `/anonq`

### `about`

- static deploy from repo root
- custom domain `about.micr.dev`

### `quarzite`

- static deploy from repo root
- custom domain `quarzite.micr.dev`
- keep `/jspaint`

### `anonq`

- Next.js deploy from repo root
- custom domain `anonq.micr.dev`

### `microkeebs`

- Vite publish dir `dist`
- Netlify functions from `netlify/functions`
- custom domain `microkeebs.micr.dev`

## Environment inventory

### `micr.dev`

- no app-specific secrets expected

### `about`

- no secrets expected

### `quarzite`

- no secrets expected

### `anonq`

- `AUTH0_SECRET`
- `AUTH0_DOMAIN`
- `AUTH0_CLIENT_ID`
- `AUTH0_CLIENT_SECRET`
- `APP_BASE_URL=https://anonq.micr.dev`
- `NEXT_PUBLIC_SITE_URL=https://anonq.micr.dev`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ALLOWED_ADMIN_EMAILS`
- `OPENAI_API_KEY` if used
- `NTFY_URL` or `NEXT_PUBLIC_NTFY_URL` if used

### `microkeebs`

- `ADMIN_PASSWORD_HASH`
- `JWT_SECRET`
- `GITHUB_TOKEN`
- `GITHUB_REPO=micr-dev/microkeebs`
- `NETLIFY_BUILD_HOOK` pointing to the new `microkeebs` site

## Validation checklist

### Before DNS cutover

- `about`: load homepage, images, fonts, Quarzite outbound link
- `quarzite`: desktop homepage, mobile redirect, `/jspaint`
- `anonq`: `npm run build`, homepage, admin login flow, API routes
- `microkeebs`: `npm run lint`, `npm run build`, gallery, build detail hash route, admin auth, commissions submit
- `micr.dev`: root homepage, Spline load, `/tree`, `/wip`, `/dialogue`, shortlinks

### At DNS cutover

- `curl -I` old path URL returns `301`
- `curl -I` new subdomain returns `200`
- canonical tag matches new host
- manifest and favicon paths resolve
- `micr.dev/microkeebs/#/builds/...` lands correctly on `microkeebs.micr.dev/#/builds/...`

### After cutover

- check Netlify deploy logs
- check function logs for `microkeebs`
- re-run smoke tests after 1 hour
- re-run smoke tests after 24 hours

## Rollback

- rollback one property at a time
- remove the root `301` redirect for the failed property
- keep serving the old path from the legacy monorepo deployment until the new property is fixed
- do not delete `legacy-monorepo` until all sites have been stable for 7 days
