/**
 * ─────────────────────────────────────────────────────────────
 * 中文注释说明：本文档由 [tailwindlabs/tailwindcss](https://github.com/tailwindlabs/tailwindcss)
 * 翻译项目补充中文注释，仅添加说明性注释，未改动任何代码逻辑。英文原版见原项目。
 * ─────────────────────────────────────────────────────────────
 *
 * 文件说明：通用 AST（抽象语法树）遍历器。
 *
 * Tailwind 编译过程中，CSS 会被解析成一棵带有 `nodes` 子节点数组的树。
 * 该文件提供的 `walk(ast, hooks)` 以显式栈（非递归）的方式深度优先遍历这棵树，
 * 并允许访问者在「进入（enter）」和「离开（exit）」两个时机对节点进行检查、
 * 跳过、替换甚至提前终止遍历。
 *
 * 遍历动作（WalkAction）一览：
 *   - Continue：继续正常流程（深入子节点 / 前进到下一个兄弟节点）
 *   - Skip：    跳过该节点的子节点（不深入）；仅 enter 阶段允许
 *   - Stop：    立即终止整棵树的遍历
 *   - Replace(nodes)：用给定节点（单个或数组）原地替换当前节点，
 *     并从替换结果的开头重新处理（enter 阶段）/ 继续前进（exit 阶段）
 *   - ReplaceSkip(nodes)：替换后跳过替换产物，直接前进到下一个兄弟
 *   - ReplaceStop(nodes)：替换后立即终止遍历
 */

/** 内部枚举：区分六种遍历动作的 kind 标识 */
const enum WalkKind {
  Continue,
  Skip,
  Stop,
  Replace,
  ReplaceSkip,
  ReplaceStop,
}

/** 对外暴露的遍历动作构造器集合 */
export const WalkAction = {
  Continue: { kind: WalkKind.Continue } as const,
  Skip: { kind: WalkKind.Skip } as const,
  Stop: { kind: WalkKind.Stop } as const,
  Replace: <T>(nodes: T | T[]) =>
    ({ kind: WalkKind.Replace, nodes: Array.isArray(nodes) ? nodes : [nodes] }) as const,
  ReplaceSkip: <T>(nodes: T | T[]) =>
    ({ kind: WalkKind.ReplaceSkip, nodes: Array.isArray(nodes) ? nodes : [nodes] }) as const,
  ReplaceStop: <T>(nodes: T | T[]) =>
    ({ kind: WalkKind.ReplaceStop, nodes: Array.isArray(nodes) ? nodes : [nodes] }) as const,
} as const

type WalkAction = typeof WalkAction
/** 遍历回调允许返回的动作类型合集 */
type WalkResult<T> =
  | WalkAction['Continue']
  | WalkAction['Skip']
  | WalkAction['Stop']
  | ReturnType<typeof WalkAction.Replace<T>>
  | ReturnType<typeof WalkAction.ReplaceSkip<T>>
  | ReturnType<typeof WalkAction.ReplaceStop<T>>

/** enter 阶段可以使用全部动作 */
type EnterResult<T> = WalkResult<T>
/** exit 阶段不允许 Skip —— 此时子树已经遍历完毕，跳过没有意义 */
type ExitResult<T> = Exclude<WalkResult<T>, { kind: WalkKind.Skip }>

/** 带 `nodes` 子节点数组的父节点类型 */
type Parent<T> = T & { nodes: T[] }

/** 访问上下文：告知回调当前节点的位置信息 */
export interface VisitContext<T> {
  /** 父节点；根层节点为 null */
  parent: Parent<T> | null
  /** 当前嵌套深度（根为 0） */
  depth: number
  /** 当前节点在兄弟节点中的下标 */
  index: number
  /** 兄弟节点数组（含当前节点本身） */
  siblings: T[]
  /** 返回从根到当前节点的完整路径 */
  path: () => T[]
}

/**
 * 遍历入口。hooks 既可以是单个函数（等价于只提供 enter 的旧 API），
 * 也可以是 `{ enter, exit }` 对象形式的新 API。
 */
export function walk<T extends object>(
  ast: T[],
  hooks:
    | ((node: T, ctx: VisitContext<T>) => EnterResult<T> | void) // 旧版 API：仅 enter 阶段
    | {
        enter?: (node: T, ctx: VisitContext<T>) => EnterResult<T> | void
        exit?: (node: T, ctx: VisitContext<T>) => ExitResult<T> | void
      },
): void {
  if (typeof hooks === 'function') walkImplementation(ast, hooks)
  else walkImplementation(ast, hooks.enter, hooks.exit)
}

/** 手写链式栈节点：比数组 push/pop 略省一次下标访问 */
interface Stack<T> {
  value: T
  prev: Stack<T> | null
}

/**
 * 实际的遍历实现。
 *
 * 栈帧技巧：`StackFrame` 记录「节点数组 + 当前下标 + 父节点」。
 * offset 为非负数时表示 enter 阶段；处理完一个节点后执行 `~offset`
 * （按位取反），将其变为负数以标记「该节点进入 exit 阶段」；
 * exit 阶段再用 `~offset` 还原出原始下标 —— 用一个字段同时编码
 * 两个阶段，避免额外的状态变量。
 */
function walkImplementation<T extends { nodes?: T[] }>(
  ast: T[],
  enter: (node: T, ctx: VisitContext<T>) => EnterResult<T> | void = () => WalkAction.Continue,
  exit: (node: T, ctx: VisitContext<T>) => ExitResult<T> | void = () => WalkAction.Continue,
) {
  // 栈帧：[当前层的节点数组, 游标 offset, 父节点]
  type StackFrame = [nodes: T[], offset: number, parent: Parent<T> | null]
  let stack: Stack<StackFrame> | null = { value: [ast, 0, null], prev: null }

  // 复用的上下文对象，每轮循环就地更新字段，避免反复分配
  let ctx: VisitContext<T> = {
    parent: null,
    depth: 0,
    index: 0,
    siblings: ast,
    path() {
      // 沿栈从当前帧向上回溯父节点，最后反转得到根→叶顺序
      let path: T[] = []

      let frames: Stack<StackFrame> | null = stack

      while (frames) {
        let parent = frames.value[2]
        if (parent) path.push(parent)
        frames = frames.prev
      }

      path.reverse()

      return path
    },
  }

  while (stack !== null) {
    let frame = stack.value
    let nodes = frame[0]
    let offset = frame[1]
    let parent = frame[2]

    // 当前层已耗尽，弹栈回到上一层
    if (offset >= nodes.length) {
      stack = stack.prev
      ctx.depth -= 1
      continue
    }

    ctx.parent = parent
    ctx.siblings = nodes

    // enter 阶段（offset 为正数或 0）
    if (offset >= 0) {
      ctx.index = offset

      let node = nodes[offset]
      let result = enter(node, ctx) ?? WalkAction.Continue

      switch (result.kind) {
        case WalkKind.Continue: {
          // 有子节点则压栈深入；随后把 offset 取反，为 exit 阶段做准备
          if (node.nodes && node.nodes.length > 0) {
            ctx.depth += 1
            stack = {
              value: [node.nodes, 0, node as Parent<T>],
              prev: stack,
            }
          }

          frame[1] = ~offset // 准备进入 exit 阶段，下标不变
          continue
        }

        case WalkKind.Stop:
          return // 立即终止遍历

        case WalkKind.Skip: {
          // 跳过子节点：同样取反 offset，exit 阶段仍会执行
          frame[1] = ~offset // 准备进入 exit 阶段，下标不变
          continue
        }

        case WalkKind.Replace: {
          // 原地替换，并保持 offset 不动，使替换产物的第一个节点被重新处理
          nodes.splice(offset, 1, ...result.nodes)
          continue // 在同一 offset 上重新处理
        }

        case WalkKind.ReplaceStop: {
          nodes.splice(offset, 1, ...result.nodes)
          return // 立即终止遍历
        }

        case WalkKind.ReplaceSkip: {
          // 替换后跳过全部替换产物，直接前进到下一个兄弟
          nodes.splice(offset, 1, ...result.nodes)
          frame[1] += result.nodes.length // 跳过替换产物，前进到下一个兄弟
          continue
        }

        default: {
          result satisfies never
          throw new Error(
            // @ts-expect-error enterResult.kind may be invalid
            `Invalid \`WalkAction.${WalkKind[result.kind] ?? `Unknown(${result.kind})`}\` in enter.`,
          )
        }
      }
    }

    // exit 阶段：处理 nodes[~offset]
    let index = ~offset // 按位取反还原出原始下标
    ctx.index = index
    let node = nodes[index]

    let result = exit(node, ctx) ?? WalkAction.Continue

    switch (result.kind) {
      case WalkKind.Continue:
        frame[1] = index + 1 // 前进到下一个兄弟
        continue

      case WalkKind.Stop:
        return // 立即终止遍历

      case WalkKind.Replace: {
        // 替换后前进越过全部替换产物（exit 阶段不重新处理替换结果）
        nodes.splice(index, 1, ...result.nodes)
        frame[1] = index + result.nodes.length // 跳过替换产物，前进到下一个兄弟
        continue
      }

      case WalkKind.ReplaceStop: {
        nodes.splice(index, 1, ...result.nodes)
        return // 立即终止遍历
      }

      case WalkKind.ReplaceSkip: {
        nodes.splice(index, 1, ...result.nodes)
        frame[1] = index + result.nodes.length // 跳过替换产物，前进到下一个兄弟
        continue
      }

      default: {
        result satisfies never
        throw new Error(
          // @ts-expect-error `result.kind` could still be filled with an invalid value
          `Invalid \`WalkAction.${WalkKind[result.kind] ?? `Unknown(${result.kind})`}\` in exit.`,
        )
      }
    }
  }
}
