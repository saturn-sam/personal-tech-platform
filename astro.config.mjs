import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

const resolvePath = (path) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  output: 'static',
  integrations: [mdx()],
  markdown: {
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
