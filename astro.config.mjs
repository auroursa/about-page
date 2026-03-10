import { defineConfig } from 'astro/config';
import expressiveCode from 'astro-expressive-code';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://cynosura.one',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    expressiveCode({
      styleOverrides: {
        codeFontFamily: '"Overpass Mono", monospace',
      },
    }),
    sitemap()
  ]
});
