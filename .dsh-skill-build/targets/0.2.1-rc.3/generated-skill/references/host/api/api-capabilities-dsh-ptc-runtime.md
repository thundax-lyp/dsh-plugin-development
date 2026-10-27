# @deepseek-ai/dsh-ptc-runtime 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

使用 `dsh-ptc-runtime` 执行调用宿主异步函数的模型程序。请求返回无损 JSON、捕获日志或结构化失败；Promise 拒绝表示调用方误用。提供方隔离不同状态所有者，并声明源码是异步函数体还是 REPL 语句。提供方可以为显式所有者保留内存，直到释放，但不会从 Session 恢复这些内存。语言与隔离描述符标识语法和执行基底，不提供安全保证。

### 使用本包

当你要组合一个执行模型程序的部署、直接消费 `ctx.ptcRuntime`，或构建运行程序的后端时，选择本包。`dsh-tools` 中的 PTC mode 用它执行工具程序，`dsh-workflow-ptc` 用它编排工作流。每个消费方负责返回给模型的内容。

#### 运行一个程序

传入程序和绑定命名空间，依次调用 `resolve(request)` 和 `run(spec)`。解析阶段验证 cwd、超时与沙盒选项，并应用提供方默认值。`programFormat` 选择支持顶层 `await`、`return` 的异步函数体，或支持顶层声明、`await` 和末尾表达式的 REPL 语句。无损 JSON 完成值进入 `result.value`，文本进入 `result.logs`，失败进入 `result.error`。

#### 选择后端

后端以 `language` 与 `isolation` 提供诊断描述符；两者都不授予权限或证明约束。`dsh-ptc-runtime-node` 在全新的受管 Node 进程中按已解析沙箱策略执行可擦除 TypeScript。可选实验性 `dsh-experimental-ptc-runtime-python` 提供方在全新 CPython 子进程中执行 Python，不提供文件约束。`sandboxMode` 声明提供方的部署文件策略模式；不支持该能力时则缺省。

使用可选的Node 内存保留模式时，跨调用传入同一个 `stateOwner` 对象，并在所有者结束时等待 `release(owner)`。不同对象不会共享环境；省略所有者时使用临时环境。无状态提供方忽略所有权。同一保留环境的调用不能重叠。

#### 可移植地命名绑定

binding-global 与 error-class 名称是语言可移植的：必须匹配 `[A-Za-z_][A-Za-z0-9_]*`，避开每个可移植目标语言的保留字，并避开后端拥有的槽位，因此同一份命名空间列表对每个后端都有效。`$tools`、`lambda` 或 `console` 之类的名称会在运行开始前失败；确切的排除集是 seam 约定的一部分。

#### 可能出什么问题

失败以 `result.error` 返回，带正交的 `kind`：`exception`、`timeout`、`abort`、`worker-exit`、`invalid-output`、`output-limit`、`protocol` 或 `sandbox-unavailable`。提供方在成功或失败之外，单独返回适用的 `result.sandbox` 事实。无效或不支持的执行选项在 `resolve` 期间失败；`run` 拒绝调用方误用，例如未解析输入、无效绑定名或资源释放后的调用。

-----

### 已知限制与延期工作

这些限制说明 seam 不能做什么；它们是当前包约束，不是任务积压。

- **`run()` 是一次性的**——`logs` 只有在 `PtcRunResult` resolve 后才能获得；seam 不提供正在运行的程序所产生输出的流式日志或进度接口。
- **保留内存可以丢失**：提供方可以为显式所有者保留状态；重启、释放以及提供方指定的失败会清除状态。程序、绑定调用和结果仍由消费者记录；运行中的对象不会被序列化或回放。
- **提供方的约束能力不同**——已发布 Node 提供方强制执行已解析文件策略，实验性 Python 提供方拒绝显式策略。不提供容器提供方。
- **提供方之间没有统一的绑定字节上限**——各提供方负责自己的传输限制；绑定仍可能在结果到达这些限制前分配内存。

## DUNDER_MEMBER（.）

公开导入：`@deepseek-ai/dsh-ptc-runtime`；公开符号：`DUNDER_MEMBER`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const DUNDER_MEMBER: RegExp;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-ptc-runtime.md)。

## PORTABLE_RESERVED_WORDS（.）

公开导入：`@deepseek-ai/dsh-ptc-runtime`；公开符号：`PORTABLE_RESERVED_WORDS`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const PORTABLE_RESERVED_WORDS: ReadonlySet<string>;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-ptc-runtime.md)。

## PtcBindingErrorClass（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface PtcBindingErrorClass {
    name: string;
    memberNameProperty: string;
}
```

公开导入：`@deepseek-ai/dsh-ptc-runtime`；公开符号：`PtcBindingErrorClass`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`memberNameProperty`、`name`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-ptc-runtime.md)。

## PtcBindingFunction（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type PtcBindingFunction = (args: unknown) => Promise<PtcJsonValue>;
```

公开导入：`@deepseek-ai/dsh-ptc-runtime`；公开符号：`PtcBindingFunction`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-ptc-runtime.md)。

## PtcBindingNamespace（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface PtcBindingNamespace {
    global: string;
    functions: Record<string, PtcBindingFunction>;
    errorClass?: PtcBindingErrorClass;
}
```

公开导入：`@deepseek-ai/dsh-ptc-runtime`；公开符号：`PtcBindingNamespace`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`errorClass`、`functions`、`global`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-ptc-runtime.md)。

## PtcJsonValue（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type PtcJsonValue = null | boolean | number | string | PtcJsonValue[] | {
    [key: string]: PtcJsonValue;
};
```

公开导入：`@deepseek-ai/dsh-ptc-runtime`；公开符号：`PtcJsonValue`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-ptc-runtime.md)。

## PtcRunFailure（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface PtcRunFailure {
    kind: 'exception' | 'timeout' | 'abort' | 'worker-exit' | 'invalid-output' | 'output-limit' | 'protocol' | 'sandbox-unavailable';
    message: string;
}
```

公开导入：`@deepseek-ai/dsh-ptc-runtime`；公开符号：`PtcRunFailure`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`kind`、`message`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-ptc-runtime.md)。

## PtcRunRequest（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface PtcRunRequest {
    program: string;
    stateOwner?: object;
    bindings: PtcBindingNamespace[];
    cwd?: string;
    timeoutMs?: number | null;
    sandboxPolicy?: SandboxExecutionPolicy;
    signal?: AbortSignal;
}
```

公开导入：`@deepseek-ai/dsh-ptc-runtime`；公开符号：`PtcRunRequest`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`bindings`、`cwd`、`program`、`sandboxPolicy`、`signal`、`stateOwner`、`timeoutMs`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-ptc-runtime.md)。

## PtcRunResult（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface PtcRunResult {
    sandbox?: PtcRunSandbox;
    value?: PtcJsonValue;
    logs: string[];
    error?: PtcRunFailure;
}
```

公开导入：`@deepseek-ai/dsh-ptc-runtime`；公开符号：`PtcRunResult`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`error`、`logs`、`sandbox`、`value`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-ptc-runtime.md)。

## PtcRunSandbox（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface PtcRunSandbox {
    mode: SandboxMode;
    denied: boolean;
    enforcement?: SandboxEnforcement;
}
```

公开导入：`@deepseek-ai/dsh-ptc-runtime`；公开符号：`PtcRunSandbox`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`denied`、`enforcement`、`mode`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-ptc-runtime.md)。

## PtcRunSpec（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface PtcRunSpec extends PtcRunRequest {
    cwd: string;
    timeoutMs: number | null;
}
```

公开导入：`@deepseek-ai/dsh-ptc-runtime`；公开符号：`PtcRunSpec`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`bindings`、`cwd`、`program`、`sandboxPolicy`、`signal`、`stateOwner`、`timeoutMs`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-ptc-runtime.md)。

## PtcRuntime（.）

公开导入：`@deepseek-ai/dsh-ptc-runtime`；公开符号：`PtcRuntime`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare abstract class PtcRuntime extends Service {
    abstract readonly language: string;
    abstract readonly isolation: string;
    get programFormat(): 'function-body' | 'repl';
    release(owner: object): Promise<void>;
    get executionInstructions(): string;
    get sandboxMode(): SandboxMode | undefined;
    get timeout(): {
        defaultMs: number;
        maxMs: number;
    } | undefined;
    constructor(ctx: Context);
    abstract resolve(request: PtcRunRequest): PtcRunSpec;
    abstract run(spec: PtcRunSpec): Promise<PtcRunResult>;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这是调用方持有的运行时对象。按上文公开使用路径结束任务；取消和释放不同于业务成功，等待异步清理后才能认定资源已退出。跨进程恢复须读取业务拥有的持久数据，不能序列化此活对象。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-ptc-runtime.md)。

## RESERVED_BINDING_GLOBALS（.）

公开导入：`@deepseek-ai/dsh-ptc-runtime`；公开符号：`RESERVED_BINDING_GLOBALS`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const RESERVED_BINDING_GLOBALS: ReadonlySet<string>;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-ptc-runtime.md)。

## RESERVED_ERROR_MEMBERS（.）

公开导入：`@deepseek-ai/dsh-ptc-runtime`；公开符号：`RESERVED_ERROR_MEMBERS`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const RESERVED_ERROR_MEMBERS: ReadonlySet<string>;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-ptc-runtime.md)。

### PTC 执行、失效与释放

`resolve(request)` 验证 cwd、timeout 与 sandbox，补充 provider 默认值，得到可传给 `run(spec)` 的完整输入；不把未解析请求直接交给 run。`programFormat` 区分 async function body 与 repl statements。语言和 isolation 是诊断描述，不是权限或隔离证明。

`run` 将程序异常、timeout、abort、worker-exit、invalid-output、output-limit、protocol、sandbox-unavailable 放入 `result.error.kind`；错误使用（如无效绑定名、未解析输入、dispose 后调用）则 reject。结果的 `sandbox` 独立说明实际强制事实，不能从成功值推断文件隔离。

bindings 的 global 与 error 名称使用跨语言标识符 `[A-Za-z_][A-Za-z0-9_]*`，避开 exported reserved 集合；`$tools`、`lambda`、`console` 不可用。host async bindings 需要自己实现取消与结果序列化。

支持 retained memory 的 provider 用对象身份 `stateOwner` 隔离状态；同 owner 不得重叠运行，owner 结束必须等待 `release(owner)`。省略 owner 使用临时环境。重启、release 和特定 provider 失败会丢失内存，Session 不恢复这些活对象。消费者负责持久记录模型看到的程序和结果。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。

## Context 声明合并入口

完整公开声明：

```text
interface Context {
    ptcRuntime: PtcRuntime;
}
```


Host 的 Cordis `Context` 由本包声明合并补充以下服务键。先挂载提供者再注入使用；类型可见不代表实际 scope 存在此服务。服务由其提供 fiber 负责撤回，消费者不能自行销毁共享服务。

| 服务键或事件 | 精确公开声明 |
| --- | --- |
| `ptcRuntime` | `ptcRuntime: PtcRuntime` |

与对应服务对象一起按[接入指南](../how-to/how-to-capabilities-dsh-ptc-runtime.md)验证装载和卸载；隔离的 scope 不应消费其他 Agent 的事件或服务。
