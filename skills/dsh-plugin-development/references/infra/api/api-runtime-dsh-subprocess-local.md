# @deepseek-ai/dsh-subprocess-local：受管理子进程与原始输出

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在受管理子进程与原始输出任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[受管理子进程与原始输出](api-runtime-subprocess-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-subprocess.md)。

## LocalSubprocessRuntime 契约

从 `@deepseek-ai/dsh-subprocess-local` 导入 `LocalSubprocessRuntime`。`LocalSubprocessRuntime` 是受管理子进程与原始输出的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class LocalSubprocessRuntime extends SubprocessRuntime {
    internals: SpawnInternals;
    terminalInspector: ProcessInspector | undefined;
    constructor(ctx: Context);
    resolveExecutable(command: string, env?: Readonly<Record<string, string>>, signal?: AbortSignal): Promise<string>;
    spawn(spec: SubprocessSpawnSpec): SubprocessHandle;
    terminalEnvironment(signal?: AbortSignal): Promise<SubprocessTerminalEnvironment>;
    spawnTerminal(spec: SubprocessTerminalSpawnSpec): Promise<SubprocessTerminalHandle>;
}
```

成员检索：`internals`、`resolveExecutable`、`spawn`、`spawnTerminal`、`terminalEnvironment`、`terminalInspector`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。
