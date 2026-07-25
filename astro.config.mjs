import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

import { remarkMermaidCodeBlocks } from './src/lib/markdown/remark-mermaid-code-blocks.ts';

const resolvePath = (path) => fileURLToPath(new URL(path, import.meta.url));
const siteUrl =
  process.env.PUBLIC_SITE_URL?.trim().replace(/\/$/, '') ||
  process.env.SITE_URL?.trim().replace(/\/$/, '') ||
  'https://personal-tech-platform.pages.dev';

export default defineConfig({
  output: 'static',
  prefetch: {
    defaultStrategy: 'hover',
  },
  site: siteUrl,
  integrations: [mdx()],
  markdown: {
    processor: unified({
      gfm: true,
      smartypants: true,
      remarkPlugins: [remarkMermaidCodeBlocks],
    }),
    syntaxHighlight: 'shiki',
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ['dompurify'],
    },
    resolve: {
      alias: {
        '@': resolvePath('./src'),
        '@assets': resolvePath('./src/assets'),
        '@components': resolvePath('./src/components'),
        '@config': resolvePath('./src/config'),
        '@content': resolvePath('./src/content'),
        '@layouts': resolvePath('./src/layouts'),
        '@lib': resolvePath('./src/lib'),
        '@styles': resolvePath('./src/styles'),
        '@types': resolvePath('./src/types'),
        '@utils': resolvePath('./src/utils'),
      },
    },
  },
});
