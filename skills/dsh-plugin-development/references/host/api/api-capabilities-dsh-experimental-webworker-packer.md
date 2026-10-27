# @deepseek-ai/dsh-experimental-webworker-packer 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

VFS 镜像打包器：把一份随附 profile 的 bundle 和安装提供的 optional bundle 打成浏览器 worker 挂载为文件系统的 gzip 压缩基础 tar，把每个懒加载的页面 chunk 各打成一个归档，并把不透明数据目录变成按序应用的 overlay tar（实验组）。不做任何源码编译——基础镜像携带仓库真实构建产物，预览部署调试的正是 served 部署交付的字节。打包预览镜像或排查镜像内容时，请阅读本页。

### 使用本包

公开 npm 包通过库入口导出 `packVfsImage` 和 `packVfsOverlay`。调用方提供 profile 名称、包 roster、安装 manifest、包目录和解析根目录；本包不安装 profile 层，也不打包合成配置——worker 在启动时合成各 bundle 层。可选的 `homePatch` 写入 `home/cordis.patch.yml`，即镜像中 app-boot 读取的 home 层。运行时的库入口提供打包所用的模块代理表与替换表。

打包器在 `src/repository.ts` 中拥有内部 `dsh.configTrees` 声明、校验和源目录解析。该字段不属于公共插件 manifest API。

打包是三层标准栈：

1. **Roster**——随附 profile 模板的 bundle 和 app-boot `OPTIONAL_BUNDLES` 中的每个 bundle（各自按启动器的方式从 CLI manifest 解析），加上它们 patch 文件点名的每个包（含 insert 列表与分组行），再加上 CLI（命令行界面）在 `package.json` `dsh.configTrees` 里声明的每棵配置树的行，按 Node 式依赖闭包物化。外部 peer 边绝不会绑定到 worker，workspace peer 保留在链上。CLI manifest 本身单独进入镜像，位于 `node_modules/@deepseek-ai/dsh/package.json`，作为 worker 解析 bundle 的锚点；manifest 记录它的名称和 profile。
2. **发布视图**——每个 workspace 或 vendored 包贡献其构建后的 npm 切片（`files` 走 picomatch），不带源码和 workspace `dist/`。外部包的 `main` 或 `exports` 可能指向 `src/` 或 `dist/`，因此两处发布 JavaScript 都会保留，只应用通用的测试、map、声明与归档排除规则。
3. **可达性 sweep**——用运行时加载器自己的解析, 从全部不含通配符的 workspace 运行时导出加 worker 装配种子 (`IMAGE_ENTRY_SEEDS`) 出发, 打包时把每个可达模块转换为符合包装层约定的形式. 仅含类型声明的条件树不作为扫描入口; 运行时代码请求这些导出仍会失败. 该转换会报告名称可静态确定的 import、re-export 与动态 import、经 `require` 发起的调用, 以及通过 `node:module` 或 `module` 具名导入 (含导入别名) 在模块作用域直接发起的 `createRequire(import.meta.url)('pkg')` 调用. 页面资产 (`./client` 导出背后的 `lib/client.js`) 原样直发; 自家代码的不可解析请求会让打包失败, 第三方不可解析请求则允许延后到 require 时明确失败.
4. **懒加载 chunk**——页面资产以字面量 `require.async("./client.<name>.js")`（动态 Client 构建产出的唯一形式）请求的每个页面 chunk，除非被 `./client` 导出点名，否则移出基础镜像。每个 chunk 成为基础镜像旁的一个独立确定性归档，命名为 `lazy/<归档的 sha256>.tar.gz`；manifest 为 worker 的懒加载文件系统登记其路径、大小和归档。请求包未发布的 chunk 会让打包失败。

`repository.ts` 拥有仓库形态输入（`vendor/`、`packages/`、`native/system/packages/` 与 `apps/` 的 workspace 扫描；经 app-boot 的随附模板、optional bundle 列表和 bundle patch 读取器得出 profile roster；以 CLI manifest 作为安装清单；home patch 在模板各 bundle 层合成出的行配置之上设置运行时 `PLATFORM_ENTRY_CONFIG` 字段）；`pack.ts` 一概不拥有，同一库换参即可打另一棵树。Native 扫描使 Landlock 入口包成为普通发布视图依赖，其可执行文件仍由 Worker 平台实现。CLI 为 `dsh-pack-vfs-image --out <file> [--profile web]`；它把懒加载归档写在基础镜像旁，`apps/web` 的 `build:preview` 在预览壳构建后运行它。

仓库适配器还声明 `webworker-runtime/tests/fixtures/` 下仅用于 preview 的 fixture（测试前置数据） tree。CLI 会把每套具名 fixture 打成一份独立的确定性 overlay 归档，并写出浏览器可读的 manifest（元数据清单）。Overlay 文件绕过 npm 发布视图和模块可达性排除规则，因此点目录与示例源码会完整保留；其挂载位置仅限 `home/` 与 `workspace/`。`packVfsOverlay` 将所有文件视为不透明字节。

`packPreviewFixture` 在 Node 中通过 Session 格式目录准备每个 fixture 目录里最新的规范原始 Session 代际。它从同一 fixture 根目录收集直属子 Session 的发现证据，再补全历史父目录。它严格恢复源文件、编码并严格校验当前后继文件，然后将后继文件与未改变的源文件一同打包。如果选中的代际格式错误、不受支持或属于未来版本，构建会拒绝，不回退。临时后继文件在打包后删除。浏览器以写模式打开时即可使用当前数据，无需调用 Node 的迁移校验 Worker。投影缓存仍由其所属包校验；较早代际不能提供当前折叠检查点。

-----

### 已知限制与延期工作

- **规则表依赖人工判断**（`rules.ts`：exclude glob、页面资产模式、入口种子），由 `tests/` 钉住；worker 需要触达的新资产类别应加表行，而不是改扫描器。
- **可达性只推断精确请求形式**——计算得到的 `import` 与 `require` 参数、保存下来的 `createRequire` 结果、经 CommonJS 获取的 `createRequire`，以及基准不是 `import.meta.url` 的调用只在运行时解析；若目标已被裁掉就会显式失败。只能通过这些形式触达的目标需要显式镜像入口种子。
- **vendored 包源码（`src/*.ts`）被排除**——运行时无人解析它们；未来若有 worker 内源码巡检功能需要专门的 include 规则。
- **打包器假定构建产物 `lib/` 是新鲜的**：它从不编译，工作区构建陈旧就会打包陈旧字节。先跑仓库构建。
- **CLI 必须位于原有仓库位置**：`dsh-pack-vfs-image` 相对于自身安装文件定位检出目录，并从中读取源码 CLI、配置树和预览 fixture。npm 安装支持参数化的库 API；CLI 和仓库辅助函数需要完整且已构建的 DeepSeek Harness 检出目录。
- **Preview Session 输入使用原始 JSONL** — `packPreviewFixture` 拒绝压缩文件与不规范的 Session 代际文件名。通用 overlay 仍逐字节保留输入。

## ConfigTree（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ConfigTree extends ImageTree {
    readonly scanRoster?: boolean;
}
```

公开导入：`@deepseek-ai/dsh-experimental-webworker-packer`；公开符号：`ConfigTree`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`directory`、`mount`、`scanRoster`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-packer.md)。

## DEFAULT_ROOT（.）

公开导入：`@deepseek-ai/dsh-experimental-webworker-packer`；公开符号：`DEFAULT_ROOT`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const DEFAULT_ROOT = "/dsh";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-packer.md)。

## ImageFiles（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type ImageFiles = Record<string, Uint8Array>;
```

公开导入：`@deepseek-ai/dsh-experimental-webworker-packer`；公开符号：`ImageFiles`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-packer.md)。

## ImageInstallation（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ImageInstallation {
    readonly name: string;
    readonly manifest: string;
}
```

公开导入：`@deepseek-ai/dsh-experimental-webworker-packer`；公开符号：`ImageInstallation`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`manifest`、`name`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-packer.md)。

## ImageTree（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ImageTree {
    readonly mount: string;
    readonly directory: string;
}
```

公开导入：`@deepseek-ai/dsh-experimental-webworker-packer`；公开符号：`ImageTree`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`directory`、`mount`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-packer.md)。

## MANIFEST_PATH（.）

公开导入：`@deepseek-ai/dsh-experimental-webworker-packer`；公开符号：`MANIFEST_PATH`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const MANIFEST_PATH: string;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-packer.md)。

## PackOptions（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface PackOptions {
    readonly profile: string;
    readonly roster: readonly string[];
    readonly installation?: ImageInstallation;
    readonly root?: string;
    readonly workspaces: ReadonlyMap<string, string>;
    readonly resolveFrom: string;
    readonly configTrees?: readonly ConfigTree[];
    readonly emptyDirectories?: readonly string[];
    readonly homePatch?: readonly PatchOptions[];
    readonly entries?: readonly string[];
}
```

公开导入：`@deepseek-ai/dsh-experimental-webworker-packer`；公开符号：`PackOptions`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`configTrees`、`emptyDirectories`、`entries`、`homePatch`、`installation`、`profile`、`resolveFrom`、`root`、`roster`、`workspaces`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-packer.md)。

## PackOverlayResult（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface PackOverlayResult {
    readonly image: Uint8Array;
    readonly files: ImageFiles;
}
```

公开导入：`@deepseek-ai/dsh-experimental-webworker-packer`；公开符号：`PackOverlayResult`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`files`、`image`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-packer.md)。

## PackResult（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface PackResult {
    readonly image: Uint8Array;
    readonly files: ImageFiles;
    readonly lazyArchives: readonly PackedLazyArchive[];
    readonly packages: ReadonlyMap<string, number>;
    readonly workspacePackages: number;
    readonly roster: readonly string[];
    readonly missing: readonly string[];
    readonly executables: readonly string[];
    readonly pageBundles: readonly string[];
    readonly javascriptEntries: number;
    readonly droppedJavascriptEntries: number;
    readonly unresolvedExternalRequests: readonly string[];
    readonly transform: TransformOutcome;
    readonly contract: string;
}
```

公开导入：`@deepseek-ai/dsh-experimental-webworker-packer`；公开符号：`PackResult`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`contract`、`droppedJavascriptEntries`、`executables`、`files`、`image`、`javascriptEntries`、`lazyArchives`、`missing`、`packages`、`pageBundles`、`roster`、`transform`、`unresolvedExternalRequests`、`workspacePackages`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-packer.md)。

## PackedLazyArchive（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface PackedLazyArchive {
    readonly name: string;
    readonly image: Uint8Array;
    readonly files: readonly string[];
}
```

公开导入：`@deepseek-ai/dsh-experimental-webworker-packer`；公开符号：`PackedLazyArchive`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`files`、`image`、`name`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-packer.md)。

## PreviewFixture（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface PreviewFixture {
    readonly id: string;
    readonly label: string;
    readonly description: string;
    readonly trees: readonly ImageTree[];
}
```

公开导入：`@deepseek-ai/dsh-experimental-webworker-packer`；公开符号：`PreviewFixture`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`description`、`id`、`label`、`trees`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-packer.md)。

## ProfileRoster（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ProfileRoster {
    readonly bundles: readonly string[];
    readonly roster: readonly string[];
}
```

公开导入：`@deepseek-ai/dsh-experimental-webworker-packer`；公开符号：`ProfileRoster`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`bundles`、`roster`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-packer.md)。

## TransformOutcome（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TransformOutcome {
    readonly visited: number;
    readonly rewritten: number;
}
```

公开导入：`@deepseek-ai/dsh-experimental-webworker-packer`；公开符号：`TransformOutcome`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`rewritten`、`visited`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-packer.md)。

## WRAPPER_CONTRACT（.）

公开导入：`@deepseek-ai/dsh-experimental-webworker-packer`；公开符号：`WRAPPER_CONTRACT`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const WRAPPER_CONTRACT: string;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-packer.md)。

## collectModuleNames（.）

公开导入：`@deepseek-ai/dsh-experimental-webworker-packer`；公开符号：`collectModuleNames`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function collectModuleNames(rows: unknown, names: Set<string>): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-packer.md)。

## configTrees（.）

公开导入：`@deepseek-ai/dsh-experimental-webworker-packer`；公开符号：`configTrees`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function configTrees(repoRoot: string): ConfigTree[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-packer.md)。

## describePack（.）

公开导入：`@deepseek-ai/dsh-experimental-webworker-packer`；公开符号：`describePack`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function describePack(result: PackResult, repoRoot: string, outputFile: string): string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-packer.md)。

## indexWorkspacePackages（.）

公开导入：`@deepseek-ai/dsh-experimental-webworker-packer`；公开符号：`indexWorkspacePackages`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function indexWorkspacePackages(repoRoot: string): Map<string, string>;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-packer.md)。

## installationManifest（.）

公开导入：`@deepseek-ai/dsh-experimental-webworker-packer`；公开符号：`installationManifest`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function installationManifest(repoRoot: string): ImageInstallation;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-packer.md)。

## packPreviewFixture（.）

公开导入：`@deepseek-ai/dsh-experimental-webworker-packer`；公开符号：`packPreviewFixture`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function packPreviewFixture(trees: readonly ImageTree[]): PackOverlayResult;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-packer.md)。

## packRepositoryImage（.）

公开导入：`@deepseek-ai/dsh-experimental-webworker-packer`；公开符号：`packRepositoryImage`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function packRepositoryImage(repoRoot: string, profile: string, root?: string): PackResult;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-packer.md)。

## packVfsImage（.）

公开导入：`@deepseek-ai/dsh-experimental-webworker-packer`；公开符号：`packVfsImage`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function packVfsImage(options: PackOptions): PackResult;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-packer.md)。

## packVfsOverlay（.）

公开导入：`@deepseek-ai/dsh-experimental-webworker-packer`；公开符号：`packVfsOverlay`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function packVfsOverlay(trees: readonly ImageTree[]): PackOverlayResult;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-packer.md)。

## previewFixtures（.）

公开导入：`@deepseek-ai/dsh-experimental-webworker-packer`；公开符号：`previewFixtures`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function previewFixtures(repoRoot: string): PreviewFixture[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-packer.md)。

## profileRoster（.）

公开导入：`@deepseek-ai/dsh-experimental-webworker-packer`；公开符号：`profileRoster`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function profileRoster(repoRoot: string, profile: string): ProfileRoster;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-packer.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
