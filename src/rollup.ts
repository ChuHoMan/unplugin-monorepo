import { createRollupPlugin } from 'unplugin';
import { unpluginFactory } from '.';

const rollupMonorepo = createRollupPlugin(unpluginFactory);

export {
  rollupMonorepo,
};
