# tailwindcss 中文文档

[![原项目](https://img.shields.io/badge/原项目-tailwindlabs--tailwindcss-blue?style=flat-square&logo=github)](https://github.com/tailwindlabs/tailwindcss)
[![微信联系](https://img.shields.io/badge/微信-uaycar-brightgreen?style=flat-square&logo=wechat)](#)

> 本文是 [tailwindlabs/tailwindcss](https://github.com/tailwindlabs/tailwindcss) 官方 README 的中文翻译与整理版本,并补充了安装与上手说明。完整源代码与最新版本请访问原项目:https://github.com/tailwindlabs/tailwindcss

---

## 📖 项目简介

Tailwind CSS 是一个用于快速构建自定义用户界面的**功能优先(Utility-First)CSS 框架**。

与 Bootstrap、Element UI 这类"组件优先"框架不同,Tailwind 不直接给你成品组件,而是提供成千上万个细粒度的工具类(utility classes)。你需要在 HTML 里像搭积木一样组合这些类:

```html
<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  按钮
</button>
```

这样写的好处是:

- **不离开 HTML 就能完成样式调整**,开发节奏极快;
- **不用为 class 命名发愁**,不再有 `.button-primary-new-v2` 这种痛苦;
- **样式即结构**,改动一个界面不会意外影响其他页面;
- **产物极小**,配合按需生成,最终 CSS 通常只有几 KB 到几十 KB。

---

## ✨ 核心特性

### 1. 功能优先(Utility-First)

框架内置了颜色、间距、字号、圆角、阴影、弹性布局、网格等全方位的工具类。所有工具类都遵循一致的命名规则,记住规则就能举一反三:

- `mt-4` —— margin-top 间距 4
- `flex items-center justify-between` —— 弹性布局、垂直居中、两端对齐
- `text-lg font-semibold text-gray-800` —— 字号、字重、文字颜色

### 2. 响应式设计

每个工具类都可以加断点前缀,针对不同屏幕尺寸生效,默认断点从小到大为 `sm`、`md`、`lg`、`xl`、`2xl`:

```html
<img class="w-16 md:w-32 lg:w-48" src="...">
```

上面这段表示:小屏宽 16,中屏宽 32,大屏宽 48,无需写任何媒体查询。

### 3. 状态前缀

悬停、聚焦、激活、禁用等交互状态同样通过前缀表达:

```html
<button class="bg-sky-500 hover:bg-sky-700 focus:ring-2 disabled:opacity-50">
  提交
</button>
```

### 4. 暗色模式

通过 `dark:` 前缀为深色主题单独指定样式,支持跟随系统或手动切换:

```html
<div class="bg-white dark:bg-gray-800 text-black dark:text-white">
  自动适配明暗主题的内容
</div>
```

### 5. 按需生成与性能

Tailwind 采用即时编译策略,扫描你的源码,只为实际用到的类生成 CSS,未使用的样式不会进入产物。配合压缩,生产环境样式体积极小。

---

## 🚀 安装与快速开始

> 详细安装文档以官方为准:https://tailwindcss.com/docs/installation

### 方式一:配合 PostCSS(推荐,Vite / Webpack 等)

```bash
# 1. 安装依赖
npm install tailwindcss @tailwindcss/postcss
```

```js
// 2. 注册 PostCSS 插件(postcss.config.mjs)
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
}
```

```css
/* 3. 在主样式文件中引入 */
@import "tailwindcss";
```

```html
<!-- 4. 开始使用工具类 -->
<h1 class="text-3xl font-bold underline">
  Hello world!
</h1>
```

```bash
# 5. 启动开发或执行构建
npm run dev
npm run build
```

### 方式二:官方 CLI(适合简单项目)

```bash
npm install tailwindcss @tailwindcss/cli
npx @tailwindcss/cli -i ./src/input.css -o ./src/output.css --watch
```

在 HTML 中引入生成的 `output.css` 即可。

---

## 📚 文档

完整官方文档请访问 [tailwindcss.com](https://tailwindcss.com)。

核心主题索引:

| 主题 | 链接 |
|:-----|:-----|
| 安装 | https://tailwindcss.com/docs/installation |
| 核心概念(Utility-First) | https://tailwindcss.com/docs/utility-first |
| 响应式设计 | https://tailwindcss.com/docs/responsive-design |
| 悬停 / 焦点等状态 | https://tailwindcss.com/docs/hover-focus-and-other-states |
| 暗色模式 | https://tailwindcss.com/docs/dark-mode |
| 主题定制 | https://tailwindcss.com/docs/theme |

---

## 👥 社区

如需寻求帮助、讨论最佳实践或提出功能想法:

👉 [在 GitHub Discussions 中讨论 Tailwind CSS](https://github.com/tailwindlabs/tailwindcss/discussions)

---

## 🤝 参与贡献

如果你有兴趣为 Tailwind CSS 贡献代码,请在提交 Pull Request 之前先阅读官方[贡献指南](https://github.com/tailwindlabs/tailwindcss/blob/main/.github/CONTRIBUTING.md)。

---

## ⚖️ 版权与说明

- 本文档是 [tailwindlabs/tailwindcss](https://github.com/tailwindlabs/tailwindcss) 的中文翻译版本,仅供学习交流使用;
- 所有代码与原始文档的版权归 Tailwind Labs 及原项目作者所有,项目遵循其原始许可证(MIT License);
- 如需获取源代码、发行版本或最新文档,请访问原项目仓库:https://github.com/tailwindlabs/tailwindcss

**代部署 / 定制服务 / 技术咨询 请添加微信:uaycar**

**如果觉得有用,请给原项目点个 Star!** ⭐
