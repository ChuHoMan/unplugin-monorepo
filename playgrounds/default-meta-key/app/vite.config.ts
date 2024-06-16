import path from 'node:path';
import { defineConfig } from 'vite';
import Inspect from 'vite-plugin-inspect';
import { viteMonorepo } from '../../../src/vite';

export default defineConfig({
  plugins: [
    Inspect(),
    viteMonorepo({
      packageMetaKey: 'vite',
    }),
  ],
});
