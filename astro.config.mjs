import { defineConfig } from 'astro/config';
import expressiveCode from 'astro-expressive-code';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://cynosura.one',
  integrations: [
    expressiveCode(),
    sitemap()
  ]
});
