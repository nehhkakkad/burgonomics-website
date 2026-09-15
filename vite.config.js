import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url));

// GitHub Pages project sites serve from /<repo>/, so use relative base.
// Multi-page app: every top-level HTML must be an entry or it won't land in dist/.
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        menu: resolve(__dirname, 'menu.html'),
        locations: resolve(__dirname, 'locations.html'),
        franchise: resolve(__dirname, 'franchise.html'),
        about: resolve(__dirname, 'about.html'),
      },
    },
  },
})
