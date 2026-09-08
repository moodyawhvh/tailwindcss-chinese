> 🌐 本文档由 [tailwindlabs/tailwindcss](https://github.com/tailwindlabs/tailwindcss) 翻译，英文原版见原项目。

# 贡献指南

## 环境要求

开始之前，请确保你的系统已具备以下工具：

- [Node.js](https://nodejs.org/)
- [Rustup](https://rustup.rs/)
- [pnpm](https://pnpm.io/)

## 快速上手

```sh
# 安装依赖
pnpm install

# 安装 Rust 工具链及 WASM 目标
rustup default stable
rustup target add wasm32-wasip1-threads

# 构建项目
pnpm build
```

## 开发流程

开发过程中，你可以以 watch 模式持续运行测试：

```sh
pnpm tdd
```

`playgrounds` 目录包含若干示例项目，可用于验证你的改动。启动 Vite playground 的命令如下：

```sh
pnpm build && pnpm vite
```

## 修复 Bug

如果你发现 Tailwind 中的 Bug 并想修复它，请[提交 Pull Request](https://github.com/tailwindlabs/tailwindcss/pulls) 并附上你的改动。请提供一段清晰的问题描述，说明你的改动如何解决该问题，并补充测试用例，以便我们验证修复是否达到预期效果。

## 新功能

如果你希望 Tailwind 增加某个新功能，请先在我们的讨论区[分享你的想法](https://github.com/tailwindlabs/tailwindcss/discussions/new?category=ideas)，让我们将其纳入未来版本的考虑范围，然后再动手实现。

**请注意，我们通常不接受新功能类的 Pull Request。** 为 Tailwind 增加新功能需要我们亲自通盘思考整个问题，确保我们认可所提议的 API 设计，这意味着该功能必须排在我们自己的高优先级清单上，我们才有精力投入足够的关注。

如果你为新功能发起了 Pull Request，我们大概率会将其关闭——不是因为你的想法不好，而是因为我们尚未准备好优先推进该功能，也不希望这个 PR 一挂就是几个月甚至几年。

## 编码规范

代码格式化规则定义在 [package.json](https://github.com/tailwindlabs/tailwindcss/blob/main/package.json) 的 `"prettier"` 配置段中。你可以运行以下命令检查代码是否符合规范：

```sh
pnpm run lint
```

如需自动修复代码中的格式问题，可以运行：

```sh
pnpm run format
```

## 运行测试

你可以使用以下命令运行 TypeScript 和 Rust 测试套件：

```sh
pnpm test
```

运行集成测试，请使用：

```sh
pnpm build && pnpm test:integrations
```

此外，部分功能需要在浏览器中进行测试（例如确保 CSS 变量解析行为符合预期），可通过以下命令运行：

```sh
pnpm build && pnpm test:ui
```

提交 Pull Request 时，请确保所有测试通过。如果你为 Tailwind CSS 新增了功能，务必附带测试用例。

构建成功后，你还可以使用 `dist/` 目录中生成的 npm 包 tarball，将本地构建产物安装到其他项目中验证。

## Pull Request 流程

提交 Pull Request 时：

- 请确保 PR 标题和描述清晰说明你做了哪些改动以及为什么这么做。
- 请附上「测试计划」小节，说明你如何测试这些改动。没有测试的贡献我们不予接受。
- 确保所有测试通过。你可以在 PR 描述中添加 `[ci-all]` 标签，以便在所有平台上运行完整测试套件。

Pull Request 创建后，Tailwind CSS 的维护者会自动收到通知。

## 沟通渠道

- **GitHub discussions**：用于功能构想和一般性提问
- **GitHub issues**：用于提交 Bug 报告
- **GitHub pull requests**：用于提交代码贡献
