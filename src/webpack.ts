import { createWebpackPlugin } from 'unplugin';
import { unpluginFactory } from '.';

const webpackMonorepo = createWebpackPlugin(unpluginFactory);

export {
  webpackMonorepo,
};
