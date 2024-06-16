import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: [
        resolve(__dirname, 'lib/index.ts'),
        resolve(__dirname, 'lib/bar.tsx'),
      ],
      formats: ['es'],
    },
  },
});
