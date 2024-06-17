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
