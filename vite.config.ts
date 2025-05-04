import { defineConfig, mergeConfig } from 'vite';
import { cloudflare } from '@cloudflare/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import viteConfig from './vite.base';

export default defineConfig(() =>
  mergeConfig(viteConfig, {
    plugins: [
      cloudflare(),
      tailwindcss(),
    ],
  }),
);
