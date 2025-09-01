// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://mirone.me',

  integrations: [
    react(),
    mdx(),
    sitemap(),
  ],

  markdown: {
    shikiConfig: {
      theme: 'nord',
      wrap: true,
    },
  },

  image: {
    // Skip processing large GIF files, copy directly
    remotePatterns: [{ protocol: "https" }],
    domains: [],
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: false, // Disable pixel limit
      },
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-hans'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});