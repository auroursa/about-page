import { defineConfig, fontProviders } from 'astro/config';
import expressiveCode from 'astro-expressive-code';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://cynosura.one',
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Overpass',
      cssVariable: '--font-overpass',
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/Overpass-Regular.woff2'],
            weight: 400,
            style: 'normal',
          },
          {
            src: ['./src/assets/fonts/Overpass-Bold.woff2'],
            weight: 700,
            style: 'normal',
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Overpass Mono',
      cssVariable: '--font-overpass-mono',
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/OverpassMono-Regular.woff2'],
            weight: 400,
            style: 'normal',
          },
        ],
      },
    },
  ],
  integrations: [
    expressiveCode({
      styleOverrides: {
        codeFontFamily: '"Overpass Mono", monospace',
      },
    }),
    sitemap()
  ]
});
