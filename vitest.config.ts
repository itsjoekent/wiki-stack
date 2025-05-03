/// <reference types="vitest" />
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.base';

export default defineConfig(() =>
  mergeConfig(viteConfig, {
    test: {
      global: true,
      environment: 'jsdom',
    },
  }),
);
