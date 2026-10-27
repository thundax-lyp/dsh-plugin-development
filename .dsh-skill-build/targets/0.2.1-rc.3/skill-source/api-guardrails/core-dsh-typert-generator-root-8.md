# @deepseek-ai/dsh-typert-generator .：公开对象 8

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-typert-generator 选型与组合](api-core-dsh-typert-generator-root-overview.md)。

`dsh-typert-generator` 让维护者把公开的 TypeScript 类型转换为构建产物和与编译器无关的模型。包通过 `./typert` 和可选的 `./client/typert` 导出选择加入；如果声明、发布清单、Remote 导出或 Zod 投影无法被正确表示，生成过程就会失败。仓库构建会生成可执行 schema factory 与配套声明，工具也可以调用 `WorkspaceAnalyzer` 完成检查或目录生成而不发布产物。生成过程只在构建时运行，绝不会进入实时 agent（智能体）会话。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## WorkspaceAnalyzer 公开契约

导入入口：`@deepseek-ai/dsh-typert-generator`；公开符号：`WorkspaceAnalyzer`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class WorkspaceAnalyzer {
    constructor(options: WorkspaceAnalyzerOptions);
    analyze(): WorkspaceModel;
    analyzeInBatches(batchSize?: number): WorkspaceModel;
    discoverPackages(includeManifest?: (manifest: Readonly<Record<string, unknown>>) => boolean): DiscoveredTypertPackage[];
    indexSourceDeclarations(): SourceDeclarationModel[];
}
```

成员检索：`analyze`、`analyzeInBatches`、`discoverPackages`、`indexSourceDeclarations`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## WorkspaceAnalyzerOptions 公开契约

导入入口：`@deepseek-ai/dsh-typert-generator`；公开符号：`WorkspaceAnalyzerOptions`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface WorkspaceAnalyzerOptions {
    readonly root: string;
    readonly hostConfig?: string;
    readonly clientConfig?: string;
    readonly packages?: readonly string[];
    readonly faces?: readonly TypertFace[];
    readonly checkDiagnostics?: boolean;
    readonly mode?: AnalysisMode;
    readonly caches?: WorkspaceCaches;
    readonly rejectBuildOutputs?: boolean;
}
```

成员检索：`caches`、`checkDiagnostics`、`clientConfig`、`faces`、`hostConfig`、`mode`、`packages`、`rejectBuildOutputs`、`root`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## WorkspaceEmitResult 公开契约

导入入口：`@deepseek-ai/dsh-typert-generator`；公开符号：`WorkspaceEmitResult`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface WorkspaceEmitResult extends ModelEmitResult {
    readonly packageRoot: string;
}
```

成员检索：`packageRoot`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## WorkspaceModel 公开契约

导入入口：`@deepseek-ai/dsh-typert-generator`；公开符号：`WorkspaceModel`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface WorkspaceModel {
    readonly faces: readonly FaceModel[];
    readonly crossFaceLinks: readonly CrossFaceLink[];
}
```

成员检索：`crossFaceLinks`、`faces`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## WorkspaceTypertGenerator 公开契约

导入入口：`@deepseek-ai/dsh-typert-generator`；公开符号：`WorkspaceTypertGenerator`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class WorkspaceTypertGenerator {
    constructor(root: string, options?: WorkspaceTypertGeneratorOptions);
    discover(faces?: readonly TypertFace[], includeManifest?: (manifest: Readonly<Record<string, unknown>>) => boolean): DiscoveredTypertPackage[];
    generate(packages?: readonly string[], faces?: readonly TypertFace[]): WorkspaceEmitResult[];
    generateContributors(faces?: readonly TypertFace[]): WorkspaceEmitResult[];
}
```

成员检索：`discover`、`generate`、`generateContributors`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## WorkspaceTypertGeneratorOptions 公开契约

导入入口：`@deepseek-ai/dsh-typert-generator`；公开符号：`WorkspaceTypertGeneratorOptions`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface WorkspaceTypertGeneratorOptions {
    readonly checkDiagnostics?: boolean;
    readonly rejectBuildOutputs?: boolean;
}
```

成员检索：`checkDiagnostics`、`rejectBuildOutputs`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。
