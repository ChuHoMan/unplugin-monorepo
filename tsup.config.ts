import type { Options } from 'tsup';

export default {
  entryPoints: [
    'src/*.ts',
  ],
  clean: true,
  format: ['cjs', 'esm'],
  dts: true,
  cjsInterop: true,
  splitting: true,
  onSuccess: 'npm run build:fix',
  banner: ({ format }) => {
    if (format === 'esm') {
      return {
        js: `import {createRequire as __createRequire} from 'module';var require=__createRequire(import.meta.url);`,
      };
    }
  },
} satisfies Options;
