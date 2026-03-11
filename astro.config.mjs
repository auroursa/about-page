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
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data: https:",
        "connect-src 'self' https://*.disqus.com https://*.disquscdn.com https://cloudflareinsights.com https://*.cloudflareinsights.com",
        "frame-src https://disqus.com https://*.disqus.com",
      ],
      scriptDirective: {
        resources: ["'self'", "https://*.disqus.com", "https://*.disquscdn.com", "https://static.cloudflareinsights.com"],
      },
      styleDirective: {
        resources: ["'self'", "'unsafe-inline'", "https://*.disquscdn.com"],
      },
    },
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
