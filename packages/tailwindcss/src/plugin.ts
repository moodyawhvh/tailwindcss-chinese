/**
 * ─────────────────────────────────────────────────────────────
 * 中文注释说明：本文档由 [tailwindlabs/tailwindcss](https://github.com/tailwindlabs/tailwindcss)
 * 翻译项目补充中文注释，仅添加说明性注释，未改动任何代码逻辑。英文原版见原项目。
 * ─────────────────────────────────────────────────────────────
 *
 * 文件说明：Tailwind CSS 插件构造器。
 *
 * 该文件定义了 `createPlugin` —— 编写 Tailwind CSS 插件的统一入口。
 * 插件本质上是「处理函数（handler）+ 可选配置（config）」的组合：
 *   - handler：在编译期被调用，通过 PluginAPI（addUtilities、addVariant、
 *     matchUtilities、addBase 等）向编译器注册工具类、变体与基础样式；
 *   - config：插件附带的部分 Tailwind 配置（theme、plugins 等），会与
 *     用户配置合并。
 *
 * 典型用法：
 *   ```js
 *   import plugin from 'tailwindcss/plugin'
 *
 *   // 简单插件
 *   export default plugin(({ addUtilities }) => { ... })
 *
 *   // 支持传参的插件：plugin.withOptions(factory)
 *   export default plugin.withOptions(({ className }) => ({ addUtilities }) => { ... })
 *   ```
 */

import type { PluginUtils } from './compat/config/resolve-config'
import type { ThemeConfig } from './compat/config/types'
import type {
  Config,
  Plugin,
  PluginAPI,
  PluginFn,
  PluginWithConfig,
  PluginWithOptions,
} from './compat/plugin-api'

/** 将处理函数（及可选配置）打包为标准的「带配置插件」对象 */
function createPlugin(handler: PluginFn, config?: Partial<Config>): PluginWithConfig {
  return {
    handler,
    config,
  }
}

/**
 * `createPlugin.withOptions`：构造「可传参插件」工厂。
 *
 * 与直接返回 handler 不同，这里返回的是一个函数：
 * 调用 `myPlugin(options)` 时才会执行 `pluginFunction(options)`
 * 生成真正的 handler，同时可以用 `configFunction(options)`
 * 按需生成配置。`__isOptionsFunction` 标记用于让引擎区分
 * 「普通插件」与「需要先传参调用的插件工厂」。
 */
createPlugin.withOptions = function <T>(
  pluginFunction: (options?: T) => PluginFn,
  configFunction: (options?: T) => Partial<Config> = () => ({}),
): PluginWithOptions<T> {
  // 传入具体选项后，产出实际的 handler + config 组合
  function optionsFunction(options: T): PluginWithConfig {
    return {
      handler: pluginFunction(options),
      config: configFunction(options),
    }
  }

  // 运行时标记：表明这是一个「选项工厂」而非直接的插件处理器
  optionsFunction.__isOptionsFunction = true as const

  return optionsFunction as PluginWithOptions<T>
}

export default createPlugin

// 兼容 v3：这些类型此前通过 `tailwindcss/types/config` 导出，
// 此处原样再导出，保证旧代码的类型导入路径不受影响。
export type {
  Config,
  PluginAPI,
  PluginFn as PluginCreator,
  Plugin as PluginsConfig,
  PluginUtils,
  PluginWithConfig,
  ThemeConfig,
}
