# Burgonomics

Marketing site for **burgonomics.com**: a client-rendered single-page app for the
Burgonomics burger brand, covering the menu, store locations, franchise enquiry
and about pages.

Routes: `/`, `/menu`, `/locations`, `/franchise`, `/about`.

## Stack

- React 19 + Vite 8
- `react-router-dom` 7 for client-side routing
- Lenis for smooth scrolling
- `@emailjs/browser` for the franchise enquiry form
- oxlint for linting

## Requirements

Node `^20.19.0 || >=22.12.0` (Vite 8's engine range). Netlify pins Node 22 in
`netlify.toml`.

## Run locally

```bash
npm ci
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | dev server with HMR |
| `npm run lint` | run oxlint |
| `npm run build` | production build into `dist/` |
| `npm run preview` | serve the `dist/` build locally |

## Build

```bash
npm run build
```

Output goes to `dist/`. Nothing in `dist/` is committed; it is build output.

## Deploy

`netlify.toml` at the repo root pins the base directory, the build command
(`npm run build`), the publish directory (`dist`) and the Node version. Because
those are committed, **no Netlify dashboard settings are needed** - connecting the
site to this repository is enough for it to build and publish correctly.

Routing and response headers are deliberately not declared in `netlify.toml`.
They live in files Vite copies from `public/` into `dist/` on every build:

- `public/_redirects` - www to apex, legacy page redirects, SPA fallback
- `public/_headers` - HSTS and cache-control rules

Edit those two files to change routing or caching. `.gitattributes` forces LF on
`_redirects`, `_headers` and `*.toml`, because a trailing CR silently breaks
Netlify's rule parsing when the repo is worked on from Windows.

## Layout

```
public/        static assets, fonts, images, _redirects, _headers
src/           React components and routes
scripts/       one-off media processing scripts (Python)
netlify.toml   build, publish directory and Node version
vite.config.js Vite + React plugin config
```
