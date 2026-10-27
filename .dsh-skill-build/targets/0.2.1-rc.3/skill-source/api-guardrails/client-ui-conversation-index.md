# ui-conversation：index 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

会话内容、输入与呈现分别由注册表和标准 source 装配；SlotMap 的 owner props 只描述父级提供的数据，不等于可任意构造的运行时对象。读取 Session 投影与已持久结果后展示；不要在组件 render 期间提交消息或创建连接。自定义节点、视图、分组与输入命令须挂入各自的 definition registry，随插件清理。

## TodoItem client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `TodoItem`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [TodoItem 权威契约](../../infra/api/api-runtime-dsh-tool-todo.md#todoitem-契约)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `content` | `content: string;` | [TodoItem 权威声明](../../infra/api/api-runtime-dsh-tool-todo.md#todoitem-契约) |
| `status` | `status: 'pending' \| 'in_progress' \| 'completed';` | [TodoItem 权威声明](../../infra/api/api-runtime-dsh-tool-todo.md#todoitem-契约) |

## UserTextDataMap client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `UserTextDataMap`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

同名接口还包含声明合并：以下后续声明分别来自 `@deepseek-ai/dsh-client-ui-conversation`、`@deepseek-ai/dsh-client-ui-goal`。只有消费编译面实际导入相应包声明时，这些字段才加入类型；运行时还须由相应包声明 slot 或提供业务数据。不能由类型合并推定这些能力已在当前 Profile 挂载。

```text
export interface UserTextDataMap {
    text: {
        readonly text: string;
        readonly display?: string;
    };
}

interface UserTextDataMap {
    session: {
        readonly label: string;
    };
}

interface UserTextDataMap {
    command: {
        readonly name: string;
    };
}
```

| 成员 | 公开声明 |
| --- | --- |
| `text` | `text: { readonly text: string; readonly display?: string; };` |
| `session` | `session: { readonly label: string; };` |
| `command` | `command: { readonly name: string; };` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## UserTextFacts client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `UserTextFacts`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

同名接口还包含声明合并：以下后续声明分别来自 `@deepseek-ai/dsh-client-ui-conversation`、`@deepseek-ai/dsh-client-ui-goal`。只有消费编译面实际导入相应包声明时，这些字段才加入类型；运行时还须由相应包声明 slot 或提供业务数据。不能由类型合并推定这些能力已在当前 Profile 挂载。

```text
export interface UserTextFacts {
    readonly collapseWhitespace: boolean;
    readonly trimWhitespace: boolean;
}

interface UserTextFacts {
    sessionLabels: readonly string[];
}

interface UserTextFacts {
    readonly commands: readonly {
        readonly start: number;
        readonly end: number;
        readonly name: string;
    }[];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `collapseWhitespace` | `readonly collapseWhitespace: boolean;` |
| `trimWhitespace` | `readonly trimWhitespace: boolean;` |
| `sessionLabels` | `sessionLabels: readonly string[];` |
| `commands` | `readonly commands: readonly { readonly start: number; readonly end: number; readonly name: string; }[];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## Config root

入口 `@deepseek-ai/dsh-client-ui-conversation`，公开符号 `Config`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface Config {
    busyEnter: Volatile<BusyEnterBehavior>;
}

export declare const Config: z<Schemastery.ObjectS<NoInfer<{
    busyEnter: z<"queue" | "steer", "queue" | "steer", "volatile-defined">;
}>>, Schemastery.ObjectT<NoInfer<{
    busyEnter: z<"queue" | "steer", "queue" | "steer", "volatile-defined">;
}>>, "plain">;
```

| 成员 | 公开声明 |
| --- | --- |
| `busyEnter` | `busyEnter: Volatile<BusyEnterBehavior>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。
