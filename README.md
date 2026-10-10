# Burgonomics — burgonomics.com

Marketing site for the Burgonomics burger franchise (menu, locations, franchise enquiry, about). Single-page React app served as static files.

## Stack

- React 19 + Vite 8 (JS, no TypeScript)
- react-router-dom 7 — client-side routing (`/`, `/menu`, `/locations`, `/franchise`, `/about`)
- Lenis — smooth scroll, used by the scroll-frame hero animation
- @emailjs/browser — sends the franchise enquiry form straight from the browser. The EmailJS keys in `src/components/Franchise/Franchise.jsx` are the **public** key pair by design; never put a private key or SMTP credential in this repo.

## Requirements

Node **22** (Netlify pins `NODE_VERSION = 22` in `netlify.toml`; Vite 8 itself needs `^20.19.0 || >=22.12.0`). npm is bundled with Node — no other tooling needed.

## Run locally

```bash
npm ci          # clean install from package-lock.json
npm run dev     # dev server with HMR
```

Other scripts:

```bash
npm run build   # production build -> dist/
npm run preview # serve dist/ locally to check the build
npm run lint    # oxlint
```

## Deploy (Netlify)

The site is deployed by connecting this repo to Netlify — **no dashboard configuration is needed**. Everything self-configures from committed files:

- `netlify.toml` — build command (`npm run build`), publish directory (`dist`), and the Node version. It also pins `base = "."` so a stale "base directory" value left over in the Netlify dashboard can never break the build.
- `public/_redirects` — routing rules: `www` -> apex, legacy page redirects, and the SPA fallback (`/*  /index.html  200`) that keeps deep links like `/menu` from 404-ing.
- `public/_headers` — HSTS, plus per-directory cache rules. Only `/assets/*` is `immutable`, because that is the one path Vite content-hashes; `/fonts/*` and `/frames/*` keep fixed names and must stay revalidatable.

Vite copies everything in `public/` (fonts, scroll frames, menu/team images, `_redirects`, `_headers`, `.htaccess`) into `dist/` verbatim on every build, so routing and header rules are versioned with the source.

**Edit routing or headers in `public/_redirects` and `public/_headers`, not in `netlify.toml`.**

## Layout

```
public/            static assets + _redirects + _headers (copied to dist/ as-is)
  frames/          196 JPEG frames for the scroll animation on the home page
  fonts/           MonstroSolid (the BURGONOMICS wordmark font)
  menu_images/     product photos
  team_images/     team photos
src/
  components/      Header, Footer, Home, Menu, Locations, Franchise, About
  App.jsx          route table
scripts/           offline media-processing utilities (frame upscaling/encoding).
                   Not part of the build - nothing in the site imports them.
```

Menu and location content live in `src/components/Menu/menuData.js` and `src/components/Locations/locationsData.js` — plain JS arrays; edit those to change what's displayed.

## Notes for contributors

- Commit only source. Build output (`dist/`), deploy artifacts (`dist-drop/`, `*.zip`), environment files (`.env*`), and retired Vercel-era tooling (`vercel.json`, `deploy-vercel.ps1`, handoff docs) are git-ignored on purpose — keep it that way.
- `public/_redirects` and `public/_headers` must stay LF (see `.gitattributes`); a trailing CR silently breaks every rule on the Netlify build host.
