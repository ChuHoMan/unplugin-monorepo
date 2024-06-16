import { createRspackPlugin } from 'unplugin';
import { unpluginFactory } from '.';

const rspackMonorepo = createRspackPlugin(unpluginFactory);

export {
  rspackMonorepo,
};
