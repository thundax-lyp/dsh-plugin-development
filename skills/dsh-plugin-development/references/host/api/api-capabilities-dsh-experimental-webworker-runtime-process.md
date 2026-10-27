# dsh-experimental-webworker-runtime-process 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 process 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-experimental-webworker-runtime.md)；本页逐项保留对象的参数、字段和判别分支。

## ProcessShim（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ProcessShim {
    readonly env: Record<string, string>;
    readonly argv: string[];
    readonly execArgv: string[];
    readonly execPath: string;
    readonly title: string;
    getBuiltinModule(id: string): unknown;
    readonly platform: string;
    readonly arch: string;
    readonly pid: number;
    readonly version: string;
    readonly versions: Record<string, string>;
    cwd(): string;
    kill(pid: number, signal?: NodeJS.Signals | 0): boolean;
    nextTick(callback: (...args: unknown[]) => void, ...args: unknown[]): void;
    readonly stdout: {
        write(chunk: string): boolean;
    };
    readonly stderr: {
        write(chunk: string): boolean;
    };
    on(): ProcessShim;
    off(): ProcessShim;
    once(): ProcessShim;
    prependListener(): ProcessShim;
    prependOnceListener(): ProcessShim;
    removeListener(): ProcessShim;
    removeAllListeners(): ProcessShim;
    listeners(): unknown[];
    listenerCount(): number;
    setMaxListeners(): ProcessShim;
    emit(): boolean;
    readonly hrtime: {
        bigint(): bigint;
    };
    uptime(): number;
    exit(code?: number): void;
}
```

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`ProcessShim`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`arch`、`argv`、`cwd`、`emit`、`env`、`execArgv`、`execPath`、`exit`、`getBuiltinModule`、`hrtime`、`kill`、`listenerCount`、`listeners`、`nextTick`、`off`、`on`、`once`、`pid`、`platform`、`prependListener`、`prependOnceListener`、`removeAllListeners`、`removeListener`、`setMaxListeners`、`stderr`、`stdout`、`title`、`uptime`、`version`、`versions`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## ProcessShimOptions（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ProcessShimOptions {
    readonly cwd: string;
    readonly env: Readonly<Record<string, string>>;
    readonly argv?: readonly string[];
}
```

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`ProcessShimOptions`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`argv`、`cwd`、`env`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## installProcessGlobal（.）

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`installProcessGlobal`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function installProcessGlobal(options: ProcessShimOptions): ProcessShim;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。
