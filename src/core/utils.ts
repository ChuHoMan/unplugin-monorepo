/* eslint-disable import/no-mutable-exports */
import os from 'node:os';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import process from 'node:process';
import path from 'node:path';
import { exec } from 'node:child_process';
import { createRequire } from 'node:module';

let pnp: any;
if (process.versions.pnp) {
  try {
    pnp = createRequire(import.meta.url)('pnpapi');
  } catch {}
}

export const isWindows = os.platform() === 'win32';

// `fs.realpathSync.native` resolves differently in Windows network drive,
// causing file read errors. skip for now.
// https://github.com/nodejs/node/issues/37737
export let safeRealpathSync = isWindows
  ? windowsSafeRealPathSync
  : fs.realpathSync.native;

// Based on https://github.com/larrybahr/windows-network-drive
// MIT License, Copyright (c) 2017 Larry Bahr
const windowsNetworkMap = new Map();
function windowsMappedRealpathSync(path: string) {
  const realPath = fs.realpathSync.native(path);
  if (realPath.startsWith('\\\\')) {
    for (const [network, volume] of windowsNetworkMap) {
      if (realPath.startsWith(network)) {
        return realPath.replace(network, volume);
      }
    }
  }
  return realPath;
}
const parseNetUseRE = /^(\w+)? +(\w:) +([^ ]+)\s/;
let firstSafeRealPathSyncRun = false;

function windowsSafeRealPathSync(path: string): string {
  if (!firstSafeRealPathSyncRun) {
    optimizeSafeRealPathSync();
    firstSafeRealPathSyncRun = true;
  }
  return fs.realpathSync(path);
}

function optimizeSafeRealPathSync() {
  // Skip if using Node <16.18 due to MAX_PATH issue: https://github.com/vitejs/vite/issues/12931
  const nodeVersion = process.versions.node.split('.').map(Number);
  if (nodeVersion[0] < 16 || (nodeVersion[0] === 16 && nodeVersion[1] < 18)) {
    safeRealpathSync = fs.realpathSync;
    return;
  }
  // Check the availability `fs.realpathSync.native`
  // in Windows virtual and RAM disks that bypass the Volume Mount Manager, in programs such as imDisk
  // get the error EISDIR: illegal operation on a directory
  try {
    fs.realpathSync.native(path.resolve('./'));
  } catch (error: any) {
    if (error.message.includes('EISDIR: illegal operation on a directory')) {
      safeRealpathSync = fs.realpathSync;
      return;
    }
  }
  exec('net use', (error: any, stdout: any) => {
    if (error) {
      return;
    }
    const lines = stdout.split('\n');
    // OK           Y:        \\NETWORKA\Foo         Microsoft Windows Network
    // OK           Z:        \\NETWORKA\Bar         Microsoft Windows Network
    for (const line of lines) {
      const m = line.match(parseNetUseRE);
      if (m) {
        windowsNetworkMap.set(m[3], m[2]);
      }
    }
    if (windowsNetworkMap.size === 0) {
      safeRealpathSync = fs.realpathSync.native;
    } else {
      safeRealpathSync = windowsMappedRealpathSync;
    }
  });
}

export function loadPackageData(pkgPath: string): Record<string, any> {
  const data = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

  return data;
}

export async function findDepPkgJsonPath(dep: string, parent: string, preserveSymlinks = false) {
  if (pnp) {
    try {
      const depRoot = pnp.resolveToUnqualified(dep, parent);
      if (!depRoot) {
        return undefined;
      }
      return path.join(depRoot, 'package.json');
    } catch {
      return undefined;
    }
  }

  let root = parent;
  while (root) {
    const pkg = path.join(root, 'node_modules', dep, 'package.json');
    try {
      await fsp.access(pkg);
      // use 'node:fs' version to match 'vite:resolve' and avoid realpath.native quirk
      // https://github.com/sveltejs/vite-plugin-svelte/issues/525#issuecomment-1355551264
      return preserveSymlinks ? pkg : fs.realpathSync(pkg);
    } catch {}
    const nextRoot = path.dirname(root);
    if (nextRoot === root) {
      break;
    }
    root = nextRoot;
  }
  return undefined;
}

export const bareImportRE = /^(?![a-zA-Z]:)[\w@](?!.*:\/\/)/;
export const deepImportRE = /^([^@][^/]*)\/|^(@[^/]+\/[^/]+)\//;

export function getNpmPackageName(importPath: string): string | null {
  const parts = importPath.split('/');
  if (parts[0][0] === '@') {
    if (!parts[1]) {
      return null;
    }
    return `${parts[0]}/${parts[1]}`;
  } else {
    return parts[0];
  }
}

export function isInNodeModules(id: string): boolean {
  return id.includes('node_modules');
}
