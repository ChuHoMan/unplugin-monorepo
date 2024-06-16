import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: [
        resolve(__dirname, 'src/sub/index.ts'),
        resolve(__dirname, 'src/sub/bar.tsx'),
        resolve(__dirname, 'src/sub/foo.ts'),
      ],
      formats: ['es'],
    },
  },
});
