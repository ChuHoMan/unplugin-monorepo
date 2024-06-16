import { createVitePlugin } from 'unplugin';
import { unpluginFactory } from '.';

const viteMonorepo = createVitePlugin(unpluginFactory);

export {
  viteMonorepo,
};
