# unplugin-monorepo

[![npm](https://img.shields.io/npm/v/unplugin-monorepo?color=91B2D4&label=)](https://npmjs.com/package/unplugin-monorepo)

使用最少的配置来支持在单体仓库中打包本地包。

> 灵感来自于 [vite-ts-monorepo-rfc](https://github.com/vitejs/vite-ts-monorepo-rfc/blob/main/RFC-v1.md#5-vitebundler-packagejson-configuration)

## 安装

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

> 当前只支持 VITE

```ts
// nuxt.config.js
export default defineNuxtConfig({
  modules: [
    ['unplugin-monorepo/nuxt', { /* options */ }],
  ],
});
```

> 此模块适用于 Nuxt 2 和 [Nuxt Vite](https://github.com/nuxt/vite)

<br></details>

<details>
<summary>Vue CLI [🚧Working in process]</summary><br>

<br></details>

<details>
<summary>esbuild [🚧Working in process]</summary><br>

<br></details>

## 使用

首先根据上文安装并引入 `unplugin-monorepo`。

接下来以最简单的 `monorepo` 为例子。目录结构如下：

```
monorepo
├── app # 应用
└── lib # 库
    └── src
        └── index.ts
```

其中 app 依赖了 lib。

```json
{
  "name": "app",
  "devDependencies": {
    "lib": "workspace:*"
  }
}
```

### 配置子项目

当注册 unplugin-monorepo 时，`bundler` 将在打包过程中优先读取子项目中 `bundler.sourceDir` 字段对应的文件。因此，你需要在子项目的 `package.json` 文件中配置 `bundler.sourceDir` 字段，并指向源文件路径。

例如，在以下示例中，当引用一个 `lib` 包时，它将读取 `./src/index.ts` 文件进行构建：

```json
{
  "name": "lib",
  "bundler": {
    "sourceDir": "src"
  }
}
```

### TypeScript 项目

在 TypeScript 项目中，你需要使用 TypeScript 的 `Project Reference` 功能，它可以帮助你结合 `unplugin-monorepo` 使用源码开发。

Project reference 提供了以下能力：

- 使 TypeScript 可以正确识别其他子项目的类型，而无须对子项目进行构建。
- 当你在 VS Code 内进行代码跳转时，VS Code 可以自动跳转到对应模块的源代码文件。

根据上文的例子，app 引用了 lib 子项目，我们需要在 app 的 `tsconfig.json` 内配置 `composite` 和 `references`，并指向 lib 对应的相对目录:

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

此外，还需要在 lib 子项目中配置 `rootDir`:

lib/tsconfig.json: 

```json
{
  "compilerOptions": {
    "rootDir": "src"
  }
}
```

添加以上配置后， project reference 就已经完成配置了，你可以重启 VS Code 查看配置后的效果。

以上只是一个简单的例子，在实际 monorepo 项目中可能存在更复杂的依赖关系，你需要添加完整的 `references` 配置，才能使上述功能正确运作。

**如果以上配置没解决你的问题，欢迎提出 ISSUE**

## 选项配置

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

## 示例

TODO

## 致谢

- [vite-ts-monorepo-rfc](https://github.com/vitejs/vite-ts-monorepo-rfc) 是该项目的主要灵感来源，在该方案实施前，我也只是使用了 `vite.config.ts` 中的 `conditions` 字段，但后来认知了 RFC 中提到的痛点，因此决定开发此插件。
- [@rsbuild/plugin-source-build](https://github.com/web-infra-dev/rsbuild/tree/main/packages/plugin-source-build) 为本项目配置 TypeScript Project Reference 提供了灵感。
- [vite](https://github.com/vitejs/vite) 绝大部分工具函数都来自 vite