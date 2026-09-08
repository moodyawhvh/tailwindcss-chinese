<div align="center">

# tailwindcss 中文翻译版

**[中文版] tailwindcss — 一个功能优先(Utility-First)的 CSS 框架,通过组合小型工具类快速构建现代化自定义用户界面**

[![原项目](https://img.shields.io/badge/原项目-tailwindlabs--tailwindcss-blue?style=flat-square&logo=github)](https://github.com/tailwindlabs/tailwindcss)
[![中文文档](https://img.shields.io/badge/中文文档-README.zh--CN.md-orange?style=flat-square)](README.zh-CN.md)
[![GitHub Stars](https://img.shields.io/github/stars/tailwindlabs/tailwindcss?style=flat-square&label=原项目Stars)](https://github.com/tailwindlabs/tailwindcss/stargazers)
[![微信联系](https://img.shields.io/badge/微信-uaycar-brightgreen?style=flat-square&logo=wechat)](#)

</div>

---

> 这是 [tailwindlabs/tailwindcss](https://github.com/tailwindlabs/tailwindcss) 的中文翻译版本。
> 完整源代码请访问原项目:https://github.com/tailwindlabs/tailwindcss

**代部署 / 定制服务 / 技术咨询 请添加微信:uaycar**

---

## 📖 项目简介

Tailwind CSS 是一款"功能优先"(Utility-First)的 CSS 框架。它不提供现成的组件,而是把样式拆成大量细粒度的工具类(如 `flex`、`pt-4`、`text-center`),让你直接在 HTML 中组合它们,快速搭出完全自定义的界面,而无需离开 HTML 或反复命名 class。借助 JIT 引擎,样式按需即时生成,开发体验接近"边写边看",最终产物体积也极小。它是目前 GitHub 上最受欢迎的前端样式方案之一,被大量生产环境项目采用。

## ✨ 主要特性

- **功能优先(Utility-First)**:用原子化工具类直接在标记中构建任何设计,无需手写 CSS。
- **高度可定制**:通过配置文件或 CSS 变量调整主题、颜色、间距、断点等设计令牌。
- **响应式设计内置**:使用 `sm:`、`md:`、`lg:` 等前缀即可针对不同屏幕尺寸调整样式。
- **悬停 / 焦点等状态前缀**:`hover:`、`focus:` 等修饰符让交互态样式一目了然。
- **暗色模式支持**:通过 `dark:` 前缀轻松适配深色主题。
- **按需生成(JIT)**:只产出你实际用到的样式,产物小、速度快。
- **组件友好**:可与 React、Vue、Svelte 等任意框架配合,提取组件复用样式。
- **生态成熟**:官方插件、IDE 集成(IntelliSense)、图表与表单插件一应俱全。

## 📁 文件说明

| 文件 | 说明 |
|:-----|:-----|
| README.md | 本文件(中文简介) |
| README.zh-CN.md | 详细中文文档(完整汉化) |

## 🚀 快速开始

**1. 安装 Tailwind CSS**

以 Vite/Webpack 等构建工具 + PostCSS 的方式使用(v4):

```bash
npm install tailwindcss @tailwindcss/postcss
```

**2. 在 PostCSS 配置中注册插件**

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
}
```

**3. 在主 CSS 文件中引入 Tailwind**

```css
@import "tailwindcss";
```

**4. 直接在 HTML 中使用工具类**

```html
<h1 class="text-3xl font-bold underline">
  Hello world!
</h1>
```

**5. 运行构建**

```bash
npm run dev
# 或生产构建
npm run build
```

也可以使用官方 CLI(无需自有构建链):

```bash
npx @tailwindcss/cli -i input.css -o output.css --watch
```

完整源代码与最新版本请访问原项目:https://github.com/tailwindlabs/tailwindcss

## 📞 联系方式

**代部署 / 定制服务 / 技术咨询 请添加微信:uaycar**

---

本项目为 [tailwindlabs/tailwindcss](https://github.com/tailwindlabs/tailwindcss) 的中文翻译版本,所有代码版权归原项目作者所有,遵循其原始许可证。

**如果觉得有用,请给原项目点个 Star!** ⭐
