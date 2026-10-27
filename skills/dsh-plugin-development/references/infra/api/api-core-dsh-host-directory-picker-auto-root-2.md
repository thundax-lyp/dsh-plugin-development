# @deepseek-ai/dsh-host-directory-picker-auto .：公开对象 2

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-host-directory-picker-auto 选型与组合](api-core-dsh-host-directory-picker-auto-root-overview.md)。

`dsh-host-directory-picker-auto` 为每次启动选出正确的目录选择交互：它在启动时一次性判定宿主处境，并把匹配的后端——原生或浏览——连同其 browser 半侧一起，作为真实的 Loader 条目挂进内存根树。判定是一次纯函数的启动时采样：`native` 要求无远程 authority 信任、仅回环绑定、非 SSH 启动与可服务的显示会话；任何含糊情形都判定为处处可用的 `browse`。固定某种交互就是直接组合那个后端。挂载的能力在服务生命周期内保持稳定，符合 seam 的要求。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## inject 公开契约

导入入口：`@deepseek-ai/dsh-host-directory-picker-auto`；公开符号：`inject`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const inject: string[];
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。

## name 公开契约

导入入口：`@deepseek-ai/dsh-host-directory-picker-auto`；公开符号：`name`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const name = "directory-picker-auto";
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。

## resolveDirectoryPickerBackend 公开契约

导入入口：`@deepseek-ai/dsh-host-directory-picker-auto`；公开符号：`resolveDirectoryPickerBackend`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function resolveDirectoryPickerBackend(facts: DirectoryPickerHostFacts): DirectoryPickerBackendKind;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。
