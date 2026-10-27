# @deepseek-ai/dsh-config-editor .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-config-editor 选型与组合](api-core-dsh-config-editor-root-overview.md)。

将插件配置保存到当前 profile 的 patch 并立即应用。写入在改动磁盘前验证完整候选值，并与 profile 更改及 HMR 串行执行。无效值和更高层覆盖不会改动文件。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## ConfigEditor 公开契约

导入入口：`@deepseek-ai/dsh-config-editor`；公开符号：`ConfigEditor`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class ConfigEditor extends Service {
    static inject: string[];
    constructor(ownerContext: Context);
    get documentPath(): string;
    entries(): Entry[];
    configuration(): Array<{
        entry: Entry;
        inherited: Record<string, unknown>;
        override: Record<string, unknown>;
    }>;
    edit(entry: Entry, change: (current: Record<string, unknown>, inherited: Record<string, unknown>) => Record<string, unknown>): Promise<void>;
}
```

成员检索：`configuration`、`documentPath`、`edit`、`entries`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#修改配置表单并保护脱敏字段)。
