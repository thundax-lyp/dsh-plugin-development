# ui-input-trigger：index 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

输入触发器区分检测、候选、选择和提交。匹配源、选中值与文本插入在 controller 中仲裁；检测不应发送业务请求。候选加载失败、输入变化和取消需要使用各调用给定的 signal/结果分支，不能让陈旧菜单结果提交到新输入。

## ArbitrateKey client

入口 `@deepseek-ai/dsh-client-ui-input-trigger/client`，公开符号 `ArbitrateKey`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [ArbitrateKey 权威契约](api-client-ui-conversation-draft-editor.md#arbitratekey-client)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-input-trigger.md#接入-ui-input-trigger) 在真实装载路径检验成功、失败与卸载。

## ArbitrateOutcome client

入口 `@deepseek-ai/dsh-client-ui-input-trigger/client`，公开符号 `ArbitrateOutcome`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [ArbitrateOutcome 权威契约](api-client-ui-conversation-draft-editor.md#arbitrateoutcome-client)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-input-trigger.md#接入-ui-input-trigger) 在真实装载路径检验成功、失败与卸载。

## BeginCommandRequest client

入口 `@deepseek-ai/dsh-client-ui-input-trigger/client`，公开符号 `BeginCommandRequest`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [BeginCommandRequest 权威契约](api-client-ui-conversation-input.md#begincommandrequest-client)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-input-trigger.md#接入-ui-input-trigger) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `claim` | `readonly claim: CommandClaim;` | [BeginCommandRequest 权威声明](api-client-ui-conversation-input.md#begincommandrequest-client) |
| `span` | `readonly span: TokenSpan;` | [BeginCommandRequest 权威声明](api-client-ui-conversation-input.md#begincommandrequest-client) |

## CommandClaim client

入口 `@deepseek-ai/dsh-client-ui-input-trigger/client`，公开符号 `CommandClaim`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [CommandClaim 权威契约](api-client-ui-conversation-input.md#commandclaim-client)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-input-trigger.md#接入-ui-input-trigger) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `attachments` | `readonly attachments?: boolean;` | [CommandClaim 权威声明](api-client-ui-conversation-input.md#commandclaim-client) |
| `hint` | `readonly hint?: string;` | [CommandClaim 权威声明](api-client-ui-conversation-input.md#commandclaim-client) |
| `name` | `readonly name: string;` | [CommandClaim 权威声明](api-client-ui-conversation-input.md#commandclaim-client) |
| `submit` | `submit(args: string, actx: Context, attachments: readonly SubmitAttachment[]): Promise<SubmitOutcome>;` | [CommandClaim 权威声明](api-client-ui-conversation-input.md#commandclaim-client) |
| `token` | `readonly token: string;` | [CommandClaim 权威声明](api-client-ui-conversation-input.md#commandclaim-client) |

## ConsumeTokenRequest client

入口 `@deepseek-ai/dsh-client-ui-input-trigger/client`，公开符号 `ConsumeTokenRequest`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [ConsumeTokenRequest 权威契约](api-client-ui-conversation-input.md#consumetokenrequest-client)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-input-trigger.md#接入-ui-input-trigger) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `guard` | `readonly guard: { readonly kind: 'span'; readonly span: TokenSpan; } \| { readonly kind: 'bare-token'; readonly token: string; };` | [ConsumeTokenRequest 权威声明](api-client-ui-conversation-input.md#consumetokenrequest-client) |

## InsertReferenceRequest client

入口 `@deepseek-ai/dsh-client-ui-input-trigger/client`，公开符号 `InsertReferenceRequest`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [InsertReferenceRequest 权威契约](api-client-ui-conversation-input.md#insertreferencerequest-client)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-input-trigger.md#接入-ui-input-trigger) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `span` | `readonly span: TokenSpan;` | [InsertReferenceRequest 权威声明](api-client-ui-conversation-input.md#insertreferencerequest-client) |

## PickOutcome client

入口 `@deepseek-ai/dsh-client-ui-input-trigger/client`，公开符号 `PickOutcome`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [PickOutcome 权威契约](api-client-ui-conversation-input.md#pickoutcome-client)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-input-trigger.md#接入-ui-input-trigger) 在真实装载路径检验成功、失败与卸载。

## ReferenceInsert client

入口 `@deepseek-ai/dsh-client-ui-input-trigger/client`，公开符号 `ReferenceInsert`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [ReferenceInsert 权威契约](api-client-ui-conversation-draft-editor.md#referenceinsert-client)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-input-trigger.md#接入-ui-input-trigger) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `appearance` | `readonly appearance?: 'session' \| 'file' \| 'folder';` | [ReferenceInsert 权威声明](api-client-ui-conversation-draft-editor.md#referenceinsert-client) |
| `clipboardText` | `readonly clipboardText: string;` | [ReferenceInsert 权威声明](api-client-ui-conversation-draft-editor.md#referenceinsert-client) |
| `label` | `readonly label: string;` | [ReferenceInsert 权威声明](api-client-ui-conversation-draft-editor.md#referenceinsert-client) |
| `source` | `readonly source: string;` | [ReferenceInsert 权威声明](api-client-ui-conversation-draft-editor.md#referenceinsert-client) |

## SubmitAttachment client

入口 `@deepseek-ai/dsh-client-ui-input-trigger/client`，公开符号 `SubmitAttachment`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [SubmitAttachment 权威契约](api-client-ui-conversation-input.md#submitattachment-client)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-input-trigger.md#接入-ui-input-trigger) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `type` | `readonly type: 'image';` | [SubmitAttachment 权威声明](api-client-ui-conversation-input.md#submitattachment-client) |
| `type` | `readonly type: 'file';` | [SubmitAttachment 权威声明](api-client-ui-conversation-input.md#submitattachment-client) |

## SubmitOutcome client

入口 `@deepseek-ai/dsh-client-ui-input-trigger/client`，公开符号 `SubmitOutcome`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [SubmitOutcome 权威契约](api-client-ui-conversation-input.md#submitoutcome-client)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-input-trigger.md#接入-ui-input-trigger) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `kind` | `readonly kind: 'success' \| 'error';` | [SubmitOutcome 权威声明](api-client-ui-conversation-input.md#submitoutcome-client) |
| `text` | `readonly text?: string;` | [SubmitOutcome 权威声明](api-client-ui-conversation-input.md#submitoutcome-client) |

## TokenSpan client

入口 `@deepseek-ai/dsh-client-ui-input-trigger/client`，公开符号 `TokenSpan`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [TokenSpan 权威契约](api-client-ui-conversation-draft-editor.md#tokenspan-client)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-input-trigger.md#接入-ui-input-trigger) 在真实装载路径检验成功、失败与卸载。



继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `draftRev` | `readonly draftRev: number;` | [TokenSpan 权威声明](api-client-ui-conversation-draft-editor.md#tokenspan-client) |
| `end` | `readonly end: number;` | [TokenSpan 权威声明](api-client-ui-conversation-draft-editor.md#tokenspan-client) |
| `start` | `readonly start: number;` | [TokenSpan 权威声明](api-client-ui-conversation-draft-editor.md#tokenspan-client) |
