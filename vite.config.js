import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// GitHub Pages serves the site from https://<owner>.github.io/<repo>/,
// so production assets must be prefixed with the repo name.
const REPO_BASE = '/brain-shockwave-simulation/';

export default defineConfig(({ command, isPreview }) => ({
  plugins: [react(), tailwindcss()],
  // `vite preview` serves the production build, so it needs the same base as `vite build`.
  base: command === 'build' || isPreview ? REPO_BASE : '/',
  test: {
    include: ['src/**/*.test.{js,jsx}', 'scripts/**/*.test.{js,mjs}'],
    environment: 'node',
  },
}));
