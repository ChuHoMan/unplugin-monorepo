import type { Options } from './types';

import { unpluginMonorepo } from '.';

const astroMonorepo = (options: Options) => ({
  name: 'unplugin-monorepo',
  hooks: {
    'astro:config:setup': async (astro: any) => {
      astro.config.vite.plugins ||= [];
      astro.config.vite.plugins.push(unpluginMonorepo.vite(options));
    },
  },
});

export {
  astroMonorepo,
};
