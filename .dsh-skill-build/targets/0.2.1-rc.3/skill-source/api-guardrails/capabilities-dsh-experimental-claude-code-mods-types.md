# dsh-experimental-claude-code-mods-types 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 types 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-experimental-claude-code-mods.md)；本页逐项保留对象的参数、字段和判别分支。

## AnyHook（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type AnyHook = ModHook<unknown, unknown>;
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`AnyHook`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## AskOptions（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface AskOptions {
    options?: readonly string[];
    header?: string;
    multiSelect?: true;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`AskOptions`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`header`、`multiSelect`、`options`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## CommandInfo（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface CommandInfo {
    name: string;
    description: string;
    source: 'builtin' | 'plugin' | 'user' | 'mcp';
    plugin?: string;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`CommandInfo`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`description`、`name`、`plugin`、`source`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## CommandRunInput（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface CommandRunInput {
    command: string;
    args: string;
    origin: PromptOrigin;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`CommandRunInput`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`args`、`command`、`origin`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## CommandRunResult（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface CommandRunResult {
    text?: string;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`CommandRunResult`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`text`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## CommandSpec（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface CommandSpec {
    name: string;
    description: string;
    argumentHint?: string;
    immediate?: true;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`CommandSpec`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`argumentHint`、`description`、`immediate`、`name`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## FsEntry（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface FsEntry {
    name: string;
    kind: 'file' | 'dir' | 'other';
    size: number;
    isLink: boolean;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`FsEntry`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`isLink`、`kind`、`name`、`size`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## FsStat（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface FsStat {
    kind: 'file' | 'dir' | 'other';
    size: number;
    mtimeMs: number;
    isLink: boolean;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`FsStat`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`isLink`、`kind`、`mtimeMs`、`size`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## HookBudget（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface HookBudget {
    readonly ms: number;
    readonly remainingMs: number;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`HookBudget`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`ms`、`remainingMs`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## HookFailure（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface HookFailure {
    readonly kind: 'throw' | 'timeout';
    readonly message: string;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`HookFailure`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`kind`、`message`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## HookMatcher（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type HookMatcher = Readonly<Record<string, MatcherValue>>;
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`HookMatcher`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## HookNext（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface HookNext<E, R> {
    (e: E): Promise<R>;
    readonly signal: AbortSignal;
    readonly origin: HookOrigin;
    readonly budget: HookBudget;
    to(e: E, tier: ModTier): Promise<R>;
    readonly error?: HookFailure;
    readonly called?: boolean;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`HookNext`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`budget`、`called`、`error`、`origin`、`signal`、`to`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## HookOrigin（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface HookOrigin {
    readonly plugin: string;
    readonly tier: ModTier;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`HookOrigin`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`plugin`、`tier`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## HookRegistration（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface HookRegistration {
    catch(handler: AnyHook): void;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`HookRegistration`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`catch`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## HttpInit（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface HttpInit {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
    timeoutMs?: number;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`HttpInit`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`body`、`headers`、`method`、`timeoutMs`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## HttpResponse（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface HttpResponse {
    status: number;
    ok: boolean;
    headers: Record<string, string>;
    text: string;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`HttpResponse`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`headers`、`ok`、`status`、`text`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## MatcherValue（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type MatcherValue = string | number | boolean | null | RegExp | readonly (string | number | boolean | null)[];
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`MatcherValue`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## ModDefinition（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ModDefinition {
    readonly name: string;
    readonly version?: string;
    readonly root?: string;
    readonly options?: PluginOptions;
    readonly register: ModRegister;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`ModDefinition`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`name`、`options`、`register`、`root`、`version`。具体类型、可选性和继承关系以上面的精确接口声明为准。

注册在调用方 Cordis scope 中完成。保留返回的 disposer，在插件不再提供该能力时释放；不要让异步任务在 owner 结束后继续写入注册表。服务实现与消费者各自承担其资源，注册回调不是持久化记录。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## ModEvents（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ModEvents {
    'session.start': {
        input: SessionStartInput;
        result: SessionStartResult;
    };
    'session.end': {
        input: SessionEndInput;
        result: SessionEndResult;
    };
    'prompt.submit': {
        input: PromptSubmitInput;
        result: PromptSubmitResult;
    };
    'turn.start': {
        input: TurnStartInput;
        result: TurnStartResult;
    };
    'turn.complete': {
        input: TurnCompleteInput;
        result: TurnCompleteResult;
    };
    'tool.call': {
        input: ToolCallInput;
        result: ToolCallResult;
    };
    'command.run': {
        input: CommandRunInput;
        result: CommandRunResult;
    };
    'ui.render': {
        input: UiRenderInput;
        result: UiRenderResult;
    };
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`ModEvents`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`command.run`、`prompt.submit`、`session.end`、`session.start`、`tool.call`、`turn.complete`、`turn.start`、`ui.render`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## ModHook（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type ModHook<E, R> = ($: ModsApi, e: E, next: HookNext<E, R>) => R | Promise<R>;
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`ModHook`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## ModOn（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ModOn {
    <K extends keyof ModEvents>(event: K, hook: ModHook<ModEvents[K]['input'], ModEvents[K]['result']>): HookRegistration;
    <K extends keyof ModEvents>(event: K, matcher: HookMatcher, hook: ModHook<ModEvents[K]['input'], ModEvents[K]['result']>): HookRegistration;
    (event: string, hook: AnyHook): HookRegistration;
    (event: string, matcher: HookMatcher, hook: AnyHook): HookRegistration;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`ModOn`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## ModRegister（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type ModRegister = (on: ModOn, options: PluginOptions) => unknown;
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`ModRegister`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## ModTier（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type ModTier = 'prepend' | 'user' | 'append' | 'builtin' | 'core';
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`ModTier`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## ModTimer（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ModTimer {
    cancel(): void;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`ModTimer`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`cancel`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这是调用方持有的运行时对象。按上文公开使用路径结束任务；取消和释放不同于业务成功，等待异步清理后才能认定资源已退出。跨进程恢复须读取业务拥有的持久数据，不能序列化此活对象。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## ModsApi（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ModsApi {
    readonly plugin: {
        readonly name: string;
        readonly root: string;
    };
    readonly ui: {
        log(text: string, options?: UiLogOptions): void;
        toast(text: string, options?: ToastOptions): void;
        status(text: string | undefined): void;
        invalidate(event: string): void;
        open(pane: PaneOpenArgs): Promise<PaneOpenResult>;
        close(pane: {
            id: string;
        }): Promise<void>;
        panes(): Promise<never[]>;
        ask(question: string, options?: readonly string[] | AskOptions): Promise<string>;
        resolve(e: UiRenderInput): UiElements;
    };
    readonly command: {
        register(command: CommandSpec): Promise<void>;
        run(input: {
            command: string;
            args?: string;
        }): Promise<CommandRunResult>;
        list(): Promise<CommandInfo[]>;
    };
    readonly tool: {
        register(tool: ToolSpec): Promise<void>;
        call(input: {
            tool: string;
            [argument: string]: unknown;
        }): Promise<ToolCallResult>;
        list(): Promise<ToolInfo[]>;
    };
    readonly prompt: {
        submit(input: PromptSubmitArgs): Promise<{
            text: string;
        }>;
    };
    readonly session: {
        id(): Promise<string>;
        cwd(): Promise<string>;
        root(): Promise<string>;
        model(): Promise<string>;
        turns(): Promise<number>;
        messages(): Promise<SessionMessage[]>;
        usage(): Promise<SessionUsage>;
        version(): Promise<SessionVersion>;
    };
    readonly state: {
        get(ref: StateRef): Promise<{
            value: unknown;
        }>;
        set(ref: StateRef, value: unknown): Promise<void>;
    };
    readonly store: {
        get(key: string): Promise<unknown>;
        set(key: string, value: unknown): Promise<void>;
        delete(key: string): Promise<void>;
        keys(): Promise<string[]>;
    };
    readonly clock: {
        now(): Promise<number>;
        sleep(ms: number): Promise<void>;
        after(ms: number, fn: () => unknown): ModTimer;
        every(ms: number, fn: () => unknown): ModTimer;
    };
    readonly fs: {
        read(path: string): Promise<string>;
        write(path: string, text: string): Promise<void>;
        list(path?: string): Promise<FsEntry[]>;
        exists(path: string): Promise<boolean>;
        stat(path: string): Promise<FsStat>;
    };
    readonly process: {
        run(argv: readonly string[], init?: ProcessRunInit): Promise<ProcessRunResult>;
    };
    readonly http: {
        fetch(url: string, init?: HttpInit): Promise<HttpResponse>;
    };
    readonly env: {
        get(name: string): Promise<string | undefined>;
        set(name: string, value: string | undefined): Promise<void>;
    };
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`ModsApi`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`clock`、`command`、`env`、`fs`、`http`、`plugin`、`process`、`prompt`、`session`、`state`、`store`、`tool`、`ui`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## OpResult（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type OpResult = {
    value: unknown;
    deny?: undefined;
} | {
    deny: string;
    value?: undefined;
};
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`OpResult`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`deny`、`value`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## PaneOpenArgs（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface PaneOpenArgs {
    id: string;
    title?: string;
    focus?: true;
    closeOnEscape?: true;
    holdToasts?: true;
    rows?: number;
    columns?: number;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`PaneOpenArgs`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`closeOnEscape`、`columns`、`focus`、`holdToasts`、`id`、`rows`、`title`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## PaneOpenResult（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface PaneOpenResult {
    id: string;
    isPlaced: boolean;
    reason?: string;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`PaneOpenResult`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`id`、`isPlaced`、`reason`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## PluginOptionValue（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type PluginOptionValue = string | number | boolean | readonly string[];
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`PluginOptionValue`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## PluginOptions（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type PluginOptions = Readonly<Record<string, PluginOptionValue>>;
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`PluginOptions`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## ProcessRunInit（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ProcessRunInit {
    cwd?: string;
    env?: Record<string, string>;
    timeoutMs?: number;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`ProcessRunInit`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`cwd`、`env`、`timeoutMs`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## ProcessRunResult（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ProcessRunResult {
    exitCode: number;
    stdout: string;
    stderr: string;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`ProcessRunResult`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`exitCode`、`stderr`、`stdout`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## PromptOrigin（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type PromptOrigin = {
    kind: 'composer';
} | {
    kind: 'plugin';
    name: string;
};
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`PromptOrigin`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`kind`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## PromptSubmitArgs（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface PromptSubmitArgs {
    text: string;
    asUser?: boolean;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`PromptSubmitArgs`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`asUser`、`text`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## PromptSubmitInput（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface PromptSubmitInput {
    text: string;
    context?: readonly string[];
    turnId?: string;
    wait: boolean;
    origin: PromptOrigin;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`PromptSubmitInput`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`context`、`origin`、`text`、`turnId`、`wait`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## PromptSubmitResult（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type PromptSubmitResult = {
    text: string;
    context?: readonly string[];
    drop?: undefined;
} | {
    drop: string;
    text?: undefined;
    context?: undefined;
};
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`PromptSubmitResult`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`context`、`drop`、`text`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## SerializedElement（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SerializedElement {
    readonly type: 'Box' | 'Text' | 'Button';
    readonly props: Readonly<Record<string, string | number | boolean>>;
    readonly children: readonly SerializedNode[];
    readonly actionId?: string;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`SerializedElement`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`actionId`、`children`、`props`、`type`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## SerializedNode（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type SerializedNode = SerializedElement | string;
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`SerializedNode`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## SessionEndInput（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SessionEndInput {
    reason: 'clear' | 'logout' | 'prompt_input_exit' | 'resume' | 'other';
    sessionId: string;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`SessionEndInput`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`reason`、`sessionId`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## SessionEndResult（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SessionEndResult {
    sessionId: string;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`SessionEndResult`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`sessionId`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## SessionMessage（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SessionMessage {
    role: 'user' | 'assistant';
    text: string;
    toolUses: ToolUseSummary[];
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`SessionMessage`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`role`、`text`、`toolUses`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## SessionStartInput（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SessionStartInput {
    cwd: string;
    surface: string | null;
    isInteractive: boolean;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`SessionStartInput`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`cwd`、`isInteractive`、`surface`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## SessionStartResult（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SessionStartResult {
    cwd: string;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`SessionStartResult`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`cwd`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## SessionUsage（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SessionUsage {
    startedAt: number;
    context: {
        tokens?: number;
        window: number;
        percent?: number;
    };
    rateLimits: never[];
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`SessionUsage`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`context`、`rateLimits`、`startedAt`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## SessionVersion（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SessionVersion {
    version: string;
    engine: 'deepseek-harness';
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`SessionVersion`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`engine`、`version`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## StateRef（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface StateRef {
    plugin: string;
    key: string;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`StateRef`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`key`、`plugin`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## SurfaceSnapshot（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SurfaceSnapshot {
    readonly generation: number;
    readonly tree: readonly SerializedNode[] | null;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`SurfaceSnapshot`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`generation`、`tree`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## ToastOptions（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ToastOptions {
    timeoutMs?: number;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`ToastOptions`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`timeoutMs`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## ToolCallInput（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ToolCallInput {
    tool: string;
    tool_use_id: string;
    agentId?: string;
    [argument: string]: unknown;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`ToolCallInput`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`agentId`、`tool`、`tool_use_id`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## ToolCallResult（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type ToolCallResult = {
    deny: string;
    result?: undefined;
    isError?: undefined;
} | {
    result: unknown;
    isError?: true;
    deny?: undefined;
};
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`ToolCallResult`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`deny`、`isError`、`result`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## ToolInfo（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ToolInfo {
    name: string;
    description: string;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`ToolInfo`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`description`、`name`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## ToolSpec（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ToolSpec {
    name: string;
    description: string;
    inputSchema?: Record<string, unknown>;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`ToolSpec`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`description`、`inputSchema`、`name`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## ToolUseSummary（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ToolUseSummary {
    tool_use_id: string;
    tool: string;
    input: Record<string, unknown>;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`ToolUseSummary`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`input`、`tool`、`tool_use_id`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## TurnCompleteInput（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TurnCompleteInput {
    turnId: string;
    answer: string;
    durationMs: number;
    isAborted: boolean;
    reason: 'answer' | 'aborted' | 'error';
    agentId?: string;
    usage?: TurnUsage;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`TurnCompleteInput`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`agentId`、`answer`、`durationMs`、`isAborted`、`reason`、`turnId`、`usage`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## TurnCompleteResult（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TurnCompleteResult {
    text: string;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`TurnCompleteResult`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`text`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## TurnStartInput（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TurnStartInput {
    text: string;
    turnId: string;
    agentId?: string;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`TurnStartInput`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`agentId`、`text`、`turnId`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## TurnStartResult（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TurnStartResult {
    turnId: string;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`TurnStartResult`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`turnId`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## TurnUsage（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TurnUsage {
    input_tokens: number;
    output_tokens: number;
    cache_read_input_tokens: number;
    cache_creation_input_tokens: number;
    model: string;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`TurnUsage`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`cache_creation_input_tokens`、`cache_read_input_tokens`、`input_tokens`、`model`、`output_tokens`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## UiLogOptions（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface UiLogOptions {
    to?: 'transcript' | 'debug';
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`UiLogOptions`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`to`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## UiRenderInput（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface UiRenderInput {
    component: 'AbovePrompt' | 'Pane';
    surface: string;
    requestId?: string;
    props: Readonly<Record<string, unknown>>;
    viewport: {
        readonly columns: number;
        readonly rows?: number;
    };
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`UiRenderInput`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`component`、`props`、`requestId`、`surface`、`viewport`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## UiRenderResult（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type UiRenderResult = UiNode;
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`UiRenderResult`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。
