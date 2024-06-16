import { addVitePlugin, addWebpackPlugin, defineNuxtModule } from '@nuxt/kit';
import { viteMonorepo } from './vite';
import { webpackMonorepo } from './webpack';
import type { Options } from './types';
import '@nuxt/schema';

export type ModuleOptions = Options;

const nuxtMonorepo = defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-unplugin-monorepo',
    configKey: 'unpluginMonorepo',
  },
  defaults: {
    // ...default options
  },
  setup(options, _nuxt) {
    addVitePlugin(() => viteMonorepo(options));
    addWebpackPlugin(() => webpackMonorepo(options));

    // ...
  },
});

export {
  nuxtMonorepo,
};
