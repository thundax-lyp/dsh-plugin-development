# @deepseek-ai/dsh-api-terminal-controller .：公开对象 2

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-terminal-controller 选型与组合](api-core-dsh-api-terminal-controller-root-overview.md)。

从 Web 侧栏在 Session 当前工作目录打开执行环境的默认 shell。重新连接已有进程，并关闭 provider 管理的完整进程范围。终端输出不进入 Agent 对话记录。保留终端会占用进程和有界屏幕缓存。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## WebTerminalId 公开契约

导入入口：`@deepseek-ai/dsh-api-terminal-controller`；公开符号：`WebTerminalId`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type WebTerminalId = Branded<'WebTerminalId'>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## WebTerminalInfo 公开契约

导入入口：`@deepseek-ai/dsh-api-terminal-controller`；公开符号：`WebTerminalInfo`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface WebTerminalInfo {
    readonly id: WebTerminalId;
    readonly title: string;
    readonly shell: TerminalShell;
    readonly cwd: string;
    readonly cols: number;
    readonly rows: number;
    readonly state: 'running' | 'exited' | 'failed';
    readonly exitCode: number | null;
    readonly error?: string;
}
```

成员检索：`cols`、`cwd`、`error`、`exitCode`、`id`、`rows`、`shell`、`state`、`title`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
