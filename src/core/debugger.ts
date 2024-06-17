import process from 'node:process';
import debug from 'debug';

export type MonorepoDebugScope = `unplugin-monorepo`;

interface DebuggerOptions {
  onlyWhenFocused?: boolean | string
}

const filter = process.env.UNPLUGIN_MONOREPO_DEBUG_FILTER;

const DEBUG = process.env.DEBUG;

export function createDebugger(
  namespace: MonorepoDebugScope,
  options: DebuggerOptions = {},
): debug.Debugger['log'] {
  const log = debug(namespace);
  const { onlyWhenFocused } = options;
  const focus
    = typeof onlyWhenFocused === 'string' ? onlyWhenFocused : namespace;
  return (msg: string, ...args: unknown[]) => {
    if (filter && !msg.includes(filter)) {
      return;
    }
    if (onlyWhenFocused && !DEBUG?.includes(focus)) {
      return;
    }
    log(msg, ...args);
  };
}
