import path from 'node:path';
import fsp from 'node:fs/promises';
import { UnpluginFactory, createUnplugin } from 'unplugin';
import type { ResolvedConfig } from 'vite';
import { Options } from '../types';
import { bareImportRE, findDepPkgJsonPath, getNpmPackageName, isInNodeModules, loadPackageData } from './utils';

export const unpluginFactory: UnpluginFactory<Options | undefined> = (options) => {
  const { packageMetaDefaultValue, packageMetaKey = 'bundler' } = options || {};

  let resolvedConfig: ResolvedConfig;

  return {
    name: 'unplugin-monorepo',
    enforce: 'pre',

    async resolveId(id, importer, options) {
      if (!bareImportRE.test(id) || id === '@vite/client' || id === '@vite/env') {
        return;
      }

      const root = resolvedConfig.root;
      const depPkgPath = await findDepPkgJsonPath(getNpmPackageName(id)!, root) ?? '';
      const depPkgRoot = path.dirname(depPkgPath);
      const symlinksDepPkgPath = await findDepPkgJsonPath(getNpmPackageName(id)!, root, true) ?? '';
      const pkgRootDirStat = await fsp.lstat(path.dirname(symlinksDepPkgPath));
      // pkg root dir is not symlink or real dir in node_modules, we skip it
      if (!pkgRootDirStat.isSymbolicLink() || isInNodeModules(depPkgPath)) {
        return;
      }
      const packageMeta = loadPackageData(depPkgPath!);
      const metaKey = packageMeta[packageMetaKey];

      const { sourceDir } = metaKey || packageMetaDefaultValue || {};

      if (sourceDir) {
        const sourceSrc = path.resolve(depPkgRoot, sourceDir);
        const sourceResolved = await (this as any).resolve(sourceSrc, importer, options);
        return sourceResolved;
      }

      return null;
    },
    vite: {
      configResolved(config) {
        resolvedConfig = config;
      },
    },
  };
};

export const unpluginMonorepo = /* #__PURE__ */ createUnplugin(unpluginFactory);
