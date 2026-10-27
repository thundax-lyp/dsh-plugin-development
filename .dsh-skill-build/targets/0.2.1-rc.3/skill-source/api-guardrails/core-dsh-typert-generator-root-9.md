# @deepseek-ai/dsh-typert-generator .：公开对象 9

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-typert-generator 选型与组合](api-core-dsh-typert-generator-root-overview.md)。

`dsh-typert-generator` 让维护者把公开的 TypeScript 类型转换为构建产物和与编译器无关的模型。包通过 `./typert` 和可选的 `./client/typert` 导出选择加入；如果声明、发布清单、Remote 导出或 Zod 投影无法被正确表示，生成过程就会失败。仓库构建会生成可执行 schema factory 与配套声明，工具也可以调用 `WorkspaceAnalyzer` 完成检查或目录生成而不发布产物。生成过程只在构建时运行，绝不会进入实时 agent（智能体）会话。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## findWorkspaceRoot 公开契约

导入入口：`@deepseek-ai/dsh-typert-generator`；公开符号：`findWorkspaceRoot`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function findWorkspaceRoot(start: string): string;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## writePackageArtifacts 公开契约

导入入口：`@deepseek-ai/dsh-typert-generator`；公开符号：`writePackageArtifacts`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function writePackageArtifacts(packageDir: string, artifacts: readonly WorkspaceEmitResult[]): void;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## writeWorkspaceArtifacts 公开契约

导入入口：`@deepseek-ai/dsh-typert-generator`；公开符号：`writeWorkspaceArtifacts`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function writeWorkspaceArtifacts(root: string, artifacts: readonly WorkspaceEmitResult[]): void;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。
