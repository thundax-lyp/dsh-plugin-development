# Client Conversation Nodes and Chat Renderers

## 适用范围与入口

本页只描述 `dsh-v0.2.0-rc.1` 的 Web Client。插件可用 `@deepseek-ai/dsh-client-ui-conversation/client` 的 `ctx.uiConversation.events.register`，把已装载的 Session 事件投影成业务 Context 和 view node；用 `@deepseek-ai/dsh-client-ui-renderer/client` 的 `ctx.slots`，为 Chat 的 `conversation.chat.node` keyed slot 注册同 `kind` 的 React renderer。Chat 的目标与类型来自 `@deepseek-ai/dsh-client-ui-chat/client`。这些操作发生在 Client 半边，Host 半边和 Web Profile 的装载见 [构建并装载 Web Client 插件](how-to-build-and-load-web-client-plugin.md)。完整任务顺序见 [增加对话节点](how-to-add-conversation-node.md)。

## 最小完整 Client 示例

下面只重建已有 `turn/start` Session 事实，不产生新的业务事件。生产插件应为自己的持久 Session 事件设计稳定 ID；新事实先由 Host 写入 Session，再由 Client 读取和投影。`turn/start` 的 `data.turn`、`seq` 均来自当前版本的公开事件类型。

```tsx
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-chat/client'
import type { ConversationNodeDefinition } from '@deepseek-ai/dsh-client-ui-conversation/client'
import type { ChatNodeViewProps } from '@deepseek-ai/dsh-client-ui-chat/client'

interface TurnMarkerState {
  readonly turn: number
  readonly seq: number
}

declare module '@deepseek-ai/dsh-client-ui-chat/client' {
  interface ChatNodeDataMap {
    'example-turn-marker': { readonly turn: number }
  }
}

const marker: ConversationNodeDefinition<TurnMarkerState> = {
  kind: 'example-turn-marker',
  target: 'chat',
  match: event => event.type === 'turn/start'
    ? { id: String(event.data.turn), role: 'start' }
    : null,
  start: (_context, match) => {
    if (match.event.type !== 'turn/start') throw new Error('expected turn/start')
    return { turn: match.event.data.turn, seq: match.event.seq }
  },
  update: context => context.state,
  buildViewNode: context => context.state === undefined ? null : ({
    key: context.key,
    kind: 'example-turn-marker',
    id: context.id,
    target: 'chat',
    anchorSeq: context.state.seq,
    location: context.start?.location ?? { kind: 'unresolved' },
    visibility: 'visible',
    data: { turn: context.state.turn },
  }),
}

function TurnMarker({ node }: ChatNodeViewProps<'example-turn-marker'>) {
  return <span>Turn {node.data.turn} opened</span>
}

export const inject = ['uiConversation', 'slots']

export function apply(ctx: Context): void {
  ctx.uiConversation.events.register(marker)
  ctx.slots.inject('conversation.chat.node', () => ctx.slots.register({
    name: 'conversation.chat.node',
    key: 'example-turn-marker',
    locale: 'chat',
  }, TurnMarker))
}
```

`ctx.uiConversation.events.register` 和 `ctx.slots.inject` 将注册归当前 Cordis fiber 的 effect 所有；卸载插件会移除定义和 renderer。`inject` 等待 Chat 父 slot 声明，撤销父声明时会释放内部注册，重建时重新注册。示例的 `update` 保留状态，因为它只接受起始事件；若 `match` 也接受后续事件，必须从当前 state 和该事件返回新状态。组件只渲染传入的 `node.data`，不在渲染期间写 Session。

`ChatNodeViewProps` 包含 Chat 的 `t` 本地化注入；即使组件不读取 `t`，注册同类型 renderer 时也要声明 `locale: 'chat'`，让 slot 类型与运行时注入一致。

## 对象与成员

| 公开对象/成员                                                      | 来源                          | 契约                                                                                                                                                                                                                                                                                                                     |
| ------------------------------------------------------------------ | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ConversationNodeDefinition<State>`                                | `ui-conversation/client`      | `kind` 唯一；`match(event)` 返回 `{id, role}` 或 `null`；`start(context, match, reader)` 初始化；`update(context, match)` 返回新状态。`target` 与 `buildViewNode` 必须同时存在或同时省略。可选 `publication` 选择 `none`、`animation-frame`、`immediate`；默认 immediate。可选 `buildLocationData` 发布 Turn/Step 数据。 |
| `ConversationNodeContext<State>`                                   | 同上                          | 只读 `key`, `kind`, `id`, `matches`, `start`, `state`, `current`。`key` 由 engine 为 `kind` 和 ID 构造；`start` 可能不存在。                                                                                                                                                                                             |
| `ConversationContextReader.previous(kind)`                         | 同上                          | 在 `start` 中只查当前起始事件之前、同窗口里的最近业务 Context；不提供任意历史读取。                                                                                                                                                                                                                                      |
| `ConversationViewNode`                                             | 同上                          | 基础形状 `key`, `kind`, `id`, `target`, `data`；Chat 目标还要求 `anchorSeq`, `location`, `visibility`。                                                                                                                                                                                                                  |
| `UiConversation`                                                   | `ui-conversation/client` 服务 | `events` 和 `views` 分别拥有公开的事件/目标定义 registry；`binding` 按 Session 取已绑定视图。图像 URL 缓存、prompt 检查器与 group 控制是该 UI 服务的其他职责，不是添加 Chat node 的注册入口。                                                                                                                            |
| `ConversationEventRegistry` / `ConversationViewRegistry`           | 同上                          | 前者 `register(definition)` 和 `registerFallback(definition)`；后者 `register(definition)`。注册归调用 fiber 所有，重复 kind/target 拒绝。`fallbackEntry` 是当前唯一 fallback 的只读观察值。                                                                                                                             |
| `uiConversation.events.register(definition)`                       | `ui-conversation/client` 服务 | 返回幂等 disposer；重复 `kind` 抛错；服务会因注册变化重建已绑定 Session 的投影。`registerFallback` 是唯一的 unmatched-event fallback，必须指定 target。                                                                                                                                                                  |
| `uiConversation.views.register(definition)`                        | 同上服务                      | 为新的目标注册唯一 `target` 与 Session builder；向现有 Chat 加 node 时使用 Chat 已注册的 target，不另注册 view。                                                                                                                                                                                                         |
| `ChatNodeDataMap`、`ChatNode<'kind'>`、`ChatNodeViewProps<'kind'>` | `ui-chat/client`              | 声明合并 payload，约束 keyed renderer 的 `node`。Chat node 有 `kind`、`target`、`data`、`anchorSeq`、`location`、`visibility`；renderer key 应等于 view node `kind`。                                                                                                                                                    |
| `ctx.slots.inject('conversation.chat.node', callback)`             | `ui-renderer/client` 服务     | 等 Chat 所有者声明 session 作用域 keyed slot 后注册；callback 返回 `ctx.slots.register` 的 disposer。                                                                                                                                                                                                                    |

`uiConversation.binding` 按 Session 提供视图；只有消费目标的组件绑定后才需要投影该目标。Chat 已提供 `target: 'chat'` 和 keyed slot；没有装载 Chat 的 Profile 不会显示本例。Chat 会按 `node.kind` 找 renderer，缺少 renderer 时显示 JSON fallback。Chat 的 Turn process 展示策略可能折叠自定义节点；一个已生成的 node 不保证在所有呈现模式下始终展开。

## 失败、取消、权限与清理

注册时的重复 `kind`、重复 Chat keyed cell、缺失服务或 `target`/`buildViewNode` 不成对会使插件装载失败。不能用 slot 注册来取得 Host 或 Session 写权限。新业务事实必须由拥有者写入 Session，使重载、恢复、模型和 UI 都读到同一证据；只在 React state 里累积的事实不可重建。`match` 和投影函数应纯且能重放；异步 I/O 放到拥有生命周期的服务中，不放进 renderer。Client 会在 Session 切换和插件卸载时撤销订阅与贡献；注册函数返回的 disposer 可提前取消，若不提前取消则由 fiber effect 清理。

## 验证边界

本例已在精确 rc.1 发布声明上通过独立 Client TypeScript 编译，并在隔离 Web Profile 的 Chrome 中由一次 `turn/start` 显示 `Turn 1 opened`；在线移除插件后节点和 keyed wrapper 消失。模型请求因未配置凭证返回 `MISSING_CREDENTIAL`，不影响这次 Client 观察。没有验证自定义 Host 事件写入、多事件 `update`、fallback、其他目标 builder 或跨浏览器显示。
