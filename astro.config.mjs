// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://yuntaspublicidad.com',
  integrations: [
    react(), 
    sitemap({
      filter: (page) => 
        !page.includes('/admin/') && 
        !page.includes('/login/') &&
        !page.includes('/products/producto/') &&
        !page.includes('/blogs/blog/') &&
        !page.includes('/dashboard/blogs/')
    }),
  ],

  build: {
    inlineStylesheets: 'auto'
  },

  vite: {
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['astro'],
          }
        }
      }
    }
  }
});