import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves the site from https://<owner>.github.io/<repo>/,
// so production assets must be prefixed with the repo name.
const REPO_BASE = '/brain-shockwave-simulation/';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? REPO_BASE : '/',
  test: {
    include: ['src/**/*.test.{js,jsx}', 'scripts/**/*.test.{js,mjs}'],
    environment: 'node',
  },
}));
