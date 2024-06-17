# unplugin-monorepo

[![npm](https://img.shields.io/npm/v/unplugin-monorepo?color=91B2D4&label=)](https://npmjs.com/package/unplugin-monorepo)

<p align='center'>
<b>English</b> | <a href="https://github.com/ChuHoMan/unplugin-monorepo/blob/main/README.zh-CN.md">简体中文</a>
</p>


Require the least configuration for support bundling of local packages within a monorepo.

> Inspired by [vite-ts-monorepo-rfc](https://github.com/vitejs/vite-ts-monorepo-rfc/blob/main/RFC-v1.md#5-vitebundler-packagejson-configuration)

## Installation

```bash
npm i unplugin-monorepo -D
```

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import { viteMonorepo } from 'unplugin-monorepo/vite';

export default defineConfig({
  plugins: [
    viteMonorepo({ /* options */ }),
  ],
});
```

<br></details>

<details>
<summary>Rollup [🚧Working in process]</summary><br>

<br></details>

<details>
<summary>Webpack [🚧Working in process]</summary><br>

<br></details>

<details>
<summary>Rspack [🚧Working in process]</summary><br>

<br></details>

<details>
<summary>Nuxt</summary><br>

> Currently, only VITE is supported

```ts
// nuxt.config.js
export default defineNuxtConfig({
  modules: [
    ['unplugin-monorepo/nuxt', { /* options */ }],
  ],
});
```

> This module works for both Nuxt 2 and [Nuxt Vite](https://github.com/nuxt/vite)

<br></details>

<details>
<summary>Vue CLI [🚧Working in process]</summary><br>

<br></details>

<details>
<summary>esbuild [🚧Working in process]</summary><br>

<br></details>

## Usage

First, install and import `unplugin-monorepo` as described above.

Next, let's take the simplest `monorepo` as an example. The directory structure is as follows:

```
monorepo
├── app # Application
└── lib # Library
    └── src
        └── index.ts
```

In this structure, app depends on lib.

```json
{
  "name": "app",
  "devDependencies": {
    "lib": "workspace:*"
  }
}
```

### Configuring Sub-Projects

When registering `unplugin-monorepo`, the `bundler` will prioritize reading the file corresponding to the `bundler.sourceDir` field of the sub-project during the bundling process. Therefore, you need to configure the `bundler.sourceDir` field in the package.json file of the sub-project and point to the source file path.

For example, in the following example, when referencing a `lib` package, it will read the `./src/index.ts` file to build:

```json
{
  "name": "lib",
  "bundler": {
    "sourceDir": "src"
  }
}
```

### TypeScript Projects

In TypeScript projects, you need to use TypeScript's `Project Reference` feature, which can help you use source code development in combination with `unplugin-monorepo`.

Project reference provides the following capabilities:

- Allows TypeScript to correctly recognize the types of other sub-projects without needing to build the sub-projects.
- When navigating code in VS Code, VS Code can automatically jump to the source code files of the corresponding modules.

Based on the above example, where app references the lib sub-project, we need to configure `composite` and `references` in app's `tsconfig.json`, pointing to the relative directory of lib:

app/tsconfig.json:

```json
{
  "compilerOptions": {
    "composite": true
  },
  "references": [
    {
      "path": "../lib"
    }
  ]
}
```

Additionally, you need to configure `rootDir` in the lib sub-project:

lib/tsconfig.json:

```json
{
  "compilerOptions": {
    "rootDir": "src"
  }
}
```

After adding the above configuration, the project reference is configured. You can restart VS Code to see the effect of the configuration.

The above is just a simple example. In actual monorepo projects, there may be more complex dependencies, and you need to add complete `references` configurations to make the above features work correctly.

**If the above configuration doesn't solve your problem, feel free to open an ISSUE**

## Options Configuration

```ts
export interface Options {
  /**
   * package.json special meta key
   * @zh 读取 `package.json` 自定义字段，用于配置源代码文件对应的解析字段。
   * @default 'bundler'
   */
  packageMetaKey?: string
  /**
   * package.json special meta default value
   * @zh 读取 `package.json` 自定义字段 `packageMetaKey` 后，解析字段值的默认值。
   * */
  packageMetaDefaultValue?: {
    sourceDir: string
  }
}
```

## Examples

There are examples in the [playgrounds](https://github.com/ChuHoMan/unplugin-monorepo/tree/main/playgrounds) of this repository, which you can refer to.

## Credits

- [vite-ts-monorepo-rfc](https://github.com/vitejs/vite-ts-monorepo-rfc) is the main inspiration for this project. Before implementing this solution, I only used the `conditions` field in `vite.config.ts`, but after recognizing the pain points mentioned in the RFC, I decided to develop this plugin.
- [@rsbuild/plugin-source-build](https://github.com/web-infra-dev/rsbuild/tree/main/packages/plugin-source-build) provided inspiration for configuring TypeScript Project Reference in this project.
- [vite](https://github.com/vitejs/vite) Most of the utility functions are derived from Vite.

## License

Made with 💙

Published under [MIT License](./LICENSE).