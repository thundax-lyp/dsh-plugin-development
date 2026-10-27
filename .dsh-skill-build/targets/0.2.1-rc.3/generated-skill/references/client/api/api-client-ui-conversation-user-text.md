# ui-conversation：user-text 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

会话内容、输入与呈现分别由注册表和标准 source 装配；SlotMap 的 owner props 只描述父级提供的数据，不等于可任意构造的运行时对象。读取 Session 投影与已持久结果后展示；不要在组件 render 期间提交消息或创建连接。自定义节点、视图、分组与输入命令须挂入各自的 definition registry，随插件清理。

## UserTextDocumentInput client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `UserTextDocumentInput`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface UserTextDocumentInput {
    readonly text: string;
    readonly facts: Readonly<Partial<UserTextFacts>>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `text` | `readonly text: string;` |
| `facts` | `readonly facts: Readonly<Partial<UserTextFacts>>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## UserTextEvaluator client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `UserTextEvaluator`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type UserTextEvaluator = (input: UserTextDocumentInput) => readonly UserTextNode[];
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface UserTextDocumentInput {
  readonly text: string
  readonly facts: Readonly<Partial<UserTextFacts>>
}

export type UserTextNode<K extends UserTextId = UserTextId> = {
  [Id in K]: {
    readonly id: Id
    readonly start: number
    readonly end: number
    readonly data: JsonPayload<UserTextDataMap[Id]>
  }
}[K]

export type UserTextId = Extract<keyof UserTextDataMap, string>

type JsonPayload<T> = T extends string | number | boolean | null ? T
  : T extends (...args: never[]) => unknown ? never
    : T extends readonly unknown[] ? { readonly [K in keyof T]: JsonPayload<T[K]> }
      : T extends object ? { readonly [K in keyof T]: JsonPayload<T[K]> }
        : never
```

## UserTextId client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `UserTextId`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type UserTextId = Extract<keyof UserTextDataMap, string>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

## UserTextNode client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `UserTextNode`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type UserTextNode<K extends UserTextId = UserTextId> = {
    [Id in K]: {
        readonly id: Id;
        readonly start: number;
        readonly end: number;
        readonly data: JsonPayload<UserTextDataMap[Id]>;
    };
}[K];
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type UserTextId = Extract<keyof UserTextDataMap, string>

type JsonPayload<T> = T extends string | number | boolean | null ? T
  : T extends (...args: never[]) => unknown ? never
    : T extends readonly unknown[] ? { readonly [K in keyof T]: JsonPayload<T[K]> }
      : T extends object ? { readonly [K in keyof T]: JsonPayload<T[K]> }
        : never
```

## UserTextRule client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `UserTextRule`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface UserTextRule<out Id extends string = string> {
    readonly id: Id;
    readonly order: number;
    match(this: void, text: string, from: number, context: UserTextTransformContext): (UserTextNode & {
        readonly id: Id;
    }) | UserTextNode<'text'> | undefined;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `id` | `readonly id: Id;` |
| `order` | `readonly order: number;` |
| `match` | `match(this: void, text: string, from: number, context: UserTextTransformContext): (UserTextNode & { readonly id: Id; }) \| UserTextNode<'text'> \| undefined;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type UserTextNode<K extends UserTextId = UserTextId> = {
  [Id in K]: {
    readonly id: Id
    readonly start: number
    readonly end: number
    readonly data: JsonPayload<UserTextDataMap[Id]>
  }
}[K]

export interface UserTextTransformContext {

  read<K extends keyof UserTextFacts>(key: K): UserTextFacts[K] | undefined
}

export type UserTextId = Extract<keyof UserTextDataMap, string>

type JsonPayload<T> = T extends string | number | boolean | null ? T
  : T extends (...args: never[]) => unknown ? never
    : T extends readonly unknown[] ? { readonly [K in keyof T]: JsonPayload<T[K]> }
      : T extends object ? { readonly [K in keyof T]: JsonPayload<T[K]> }
        : never
```

## UserTextTransformContext client

入口 `@deepseek-ai/dsh-client-ui-conversation/client`，公开符号 `UserTextTransformContext`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface UserTextTransformContext {
    read<K extends keyof UserTextFacts>(key: K): UserTextFacts[K] | undefined;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `read` | `read<K extends keyof UserTextFacts>(key: K): UserTextFacts[K] \| undefined;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-conversation.md#接入-ui-conversation) 在真实装载路径检验成功、失败与卸载。
