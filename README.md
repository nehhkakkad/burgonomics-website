# Burgonomics Website

Scroll-driven site for BURGONOMICS – The House of Damn Good Burgers.

## Dev

```bash
npm install
npm run dev
```

## Build (GitHub Pages)

```bash
npm run build
npm run preview
```

`dist/` is generated – do not commit it. `node_modules/`, `.swarm/`, `.opencode/` are git-ignored.

Deploy `dist/` to GitHub Pages (project site uses relative `./` base in `vite.config.js`).

## Structure

- `index.html` – scroll image-sequence hero (canvas in `main.js`, frames in `public/frames/`)
- `menu.html`, `locations.html`, `franchise.html`, `about.html` – multi-page entries
- `public/js/` – static JS copied to `dist/js/` (nav, locations, email)
- `public/frames/` – 197 scroll frames
- `public/menu-pages/` – menu JPGs (renamed to `menu-01.jpg` …)
