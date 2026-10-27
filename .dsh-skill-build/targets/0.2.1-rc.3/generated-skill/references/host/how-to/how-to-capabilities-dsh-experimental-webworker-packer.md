# 打包可在 Web Worker 中执行的插件代码操作指南

## 打包可在 Web Worker 中执行的插件代码

目标结果：打包可在 Web Worker 中执行的插件代码并观察结果及资源释放。

### 目标与前置

VFS 镜像打包器：把一份随附 profile 的 bundle 和安装提供的 optional bundle 打成浏览器 worker 挂载为文件系统的 gzip 压缩基础 tar，把每个懒加载的页面 chunk 各打成一个归档，并把不透明数据目录变成按序应用的 overlay tar（实验组）。

消费项目使用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。先阅读[使用本包](../api/api-capabilities-dsh-experimental-webworker-packer.md#使用本包)，该处拥有本包的具体配置、调用顺序和产品限制；不要以文件存在或安装成功推定依赖服务已挂载。

### 库打包与仓库 CLI 两条起点

本包是 Node 构建期库，不是 Cordis 插件；不要向 bundle insert 本包、添加 inject，或用 `dsh plugin add` 期待它产出镜像。它不编译、不安装 Profile，也不自动推导任意消费项目的完整 roster。

1. **独立 npm 项目**：调用根 export `packVfsImage(options)`。必填 `profile`、`roster`（包名）、`workspaces`（包名到绝对包目录的 Map）及 `resolveFrom`（依赖解析根）。可选 `installation` 只复制应用 manifest 作为镜像解析锚点，不复制该应用闭包；不能又把 installation.name 放进 roster。`configTrees` 是显式配置树，`homePatch` 是 home 层覆盖；完整 Host 镜像保留默认装配 `entries`，只有纯库测试镜像才显式传空数组。具体签名仍归下方权威 API。
2. 先构建所有代码，检查每个包的 files/exports 指向真实发布文件；roster 含实际 Profile bundle 及 patch 行提到的所有包，目录 Map 和 Node 解析补足依赖闭包。检查 `missing.length === 0`，写入 result.image，并把每个 lazyArchives 按其 name 写在基础镜像旁。overlay 用独立 `packVfsOverlay`，不是重新打包代码。
3. **同版本源码 checkout**：CLI `dsh-pack-vfs-image --out <file> --profile web` 依赖其原始仓库布局与新鲜构建产物；仓库适配器负责扫描标准配置树、模板和 fixtures。这个 CLI 不能作为任意 npm 项目的通用扫描器。运行[完整示例中的 checkout preview 命令](../../infra/examples/example-worker-image.md#完整-web-profile-的-checkout-起点)，不要从外部包复制内部 repository helper。
4. 镜像构建与启动分别验证：[独立 Node 库 smoke](../../infra/examples/example-worker-image.md#独立-npm-库的完整-smoke)核对解压、VFS 与模块运行；随后按[Worker 启动指南](how-to-capabilities-dsh-experimental-webworker-runtime.md#运行并释放-web-worker-插件环境)在浏览器验证完整 Profile。

### 失败与完成判据

本地未构建、缺包、不可解析的自家导入或请求仅有 types 的 export 均须阻断打包；不得把 missing 忽略或只写 tar 存在就宣称可启动。正确结果包含基础镜像、按相对路径保存的 lazy archives 以及所需 overlays；仅观察打包成功不证明浏览器 Worker 已启动。失败时清理自己创建的临时输出，不修改源包，也不卸载其他服务。打包过程无模型调用、Session 或运行中插件资源。

### 权威对象契约

- [api-capabilities-dsh-experimental-webworker-packer](../api/api-capabilities-dsh-experimental-webworker-packer.md)。
