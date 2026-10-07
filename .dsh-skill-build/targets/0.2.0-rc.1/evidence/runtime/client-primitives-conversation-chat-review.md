# UI primitives / Conversation / Chat 公开面裁决

目标 `dsh-v0.2.0-rc.1`，commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。机器可读矩阵 `client-primitives-conversation-chat-matrix.json` 完整列出三个包的 5 个公开 entry、627 个对象和 944 个成员的当前 ledger 状态与建议决定、owner、section、插件任务。它不是共享 `api-surface.json` 修改；`included` 建议仅给对应 section 明确解释的插件作者面。

## 源码裁决

- `packages/client/ui-primitives/src/index.ts` 是无 Cordis 服务的 React 组件与帮助函数汇总，含大量图标。其可执行插件任务是在已授权 slot 中用 `Button`、`MarkdownText` 呈现信息；新增 `skill-source/api-guardrails/client-ui-primitives.md` 与 `how-to/render-markdown-slot.md`。`SettingsFormModel` 及六个公开成员属于既有 `client-settings-forms.md`，本轮补齐其对象表。其它图标、菜单、代码块、表单辅助等合并为展示工具箱，不因导出而各立一个注册入口。
- `packages/client/ui-conversation/src/index.ts` 只安装固定 Host conversation 设置，其根 entry 已排除；`src/client/index.ts` 的 `UiConversation.events/views` 和 registry 是真实第三方 node/target 注册面。已有 `conversation-nodes.md` 与 `how-to/add-conversation-node.md` 完整覆盖事件定义和 Chat keyed renderer，本轮在对象表补 `UiConversation`、`ConversationEventRegistry`、`ConversationViewRegistry` 的精确成员。其 composer 内部控制器、内置节点类型、请求视图和状态投影合并到这个任务，不逐一标 included。
- `packages/client/ui-chat/src/index.ts` 仅配置固定 Chat 偏好，根 entry 已排除；`src/client/index.ts` 公开 `ChatNodeDataMap` 声明合并与 `ChatNode`/`ChatNodeViewProps` keyed renderer 约束。既有 Conversation reference 对 `ChatNode` 六个可见字段补明。其它内置 Turn/Tool/消息渲染类型不产生第二个业务注册服务。

## 独立编译与限制

`how-to/render-markdown-slot.md` 的 TSX 块原样抽到 `evidence/tests/client-primitives-consumer/src/client.tsx`。该隔离包通过 npm 安装精确 `0.2.0-rc.1` 的 primitives、renderer、conversation、slots 和 Cordis，`npm run build` 退出 0。既有 Conversation node HOW-TO 的发布声明编译及 Chrome 节点 smoke 记录在各自 evidence；本轮未重跑，也未观察新增 Markdown Help 控件的浏览器渲染。矩阵的 `merged` 不宣称每个 icon/helper 在正文逐成员覆盖；只表示这些公开符号不构成独立 Cordis 注册任务。任何从 merged 晋升 included 的对象仍须在精确 section 中解释自身和所含成员并配独立消费例子。
