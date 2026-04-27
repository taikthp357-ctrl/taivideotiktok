import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'server'
  // If deploying as static (e.g. GitHub Pages), move /api/resolve to a separate serverless function.
});
