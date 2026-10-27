# ui-chat：conversation-context 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 ui-chat 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## ConversationContext client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `ConversationContext`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConversationContext {
    id: number;
    parentId?: number;
    origin?: ConversationContextOriginKind;
    originSeq?: number;
    createdAt?: number;
    prompt?: ConversationPromptSnapshot;
    nodes: readonly ConversationNode[];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `id` | `id: number;` |
| `parentId` | `parentId?: number;` |
| `origin` | `origin?: ConversationContextOriginKind;` |
| `originSeq` | `originSeq?: number;` |
| `createdAt` | `createdAt?: number;` |
| `prompt` | `prompt?: ConversationPromptSnapshot;` |
| `nodes` | `nodes: readonly ConversationNode[];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type ConversationContextOriginKind = 'compaction' | 'rewind' | 'rewrite'
```

## ConversationContextOriginKind client

入口 `@deepseek-ai/dsh-client-ui-chat/client`，公开符号 `ConversationContextOriginKind`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ConversationContextOriginKind = 'compaction' | 'rewind' | 'rewrite';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-chat.md#接入-ui-chat) 在真实装载路径检验成功、失败与卸载。
