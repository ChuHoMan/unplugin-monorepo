import { createEsbuildPlugin } from 'unplugin';
import { unpluginFactory } from '.';

const esbuildMonorepo = createEsbuildPlugin(unpluginFactory);

export {
  esbuildMonorepo,
};
