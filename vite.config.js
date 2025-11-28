import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',           // Your source folder
  publicDir: 'public',   // Static assets
  build: {
    outDir: '../dist',   // Output folder
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    open: true,
  },
});
