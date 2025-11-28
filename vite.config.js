import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',
  publicDir: 'public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        movie: resolve(__dirname, 'src/movie/index.html'),
        search: resolve(__dirname, 'src/search/index.html'),
        watchlist: resolve(__dirname, 'src/watchlist/index.html'),
      }
    }
  },
  server: {
    port: 3000,
    open: true,
    headers: {}
  },
  envDir: resolve(__dirname, '.'),
  base: './',
});