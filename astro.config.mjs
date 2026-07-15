import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

import { remarkMermaidCodeBlocks } from './src/lib/markdown/remark-mermaid-code-blocks.ts';

const resolvePath = (path) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  output: 'static',
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
