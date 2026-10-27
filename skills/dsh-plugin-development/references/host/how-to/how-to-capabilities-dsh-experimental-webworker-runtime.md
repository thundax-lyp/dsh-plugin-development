# 运行并释放 Web Worker 插件环境操作指南

## 运行并释放 Web Worker 插件环境

目标结果：运行并释放 Web Worker 插件环境并观察结果及资源释放。

### 目标与前置

浏览器 worker 宿主：整棵 harness 插件树跑在一个 dedicated Web Worker 里，用于预览部署与打包回归（实验组）。

消费项目使用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。先阅读[使用本包](../api/api-capabilities-dsh-experimental-webworker-runtime.md#使用本包)，该处拥有本包的具体配置、调用顺序和产品限制；不要以文件存在或安装成功推定依赖服务已挂载。

### 实现与启动

本包是浏览器 Worker 运行库，不是向 `cordis.patch.yml` insert 的 Host 插件；不能用 `dsh plugin add` 安装此库来启动 Worker。页面创建 Worker 并拥有其生命周期，Worker 从基础 VFS 镜像启动自己的 Host 插件树；真正的业务插件须先构建，再进入镜像 roster/依赖闭包与所选 Profile 的 bundle 配置，两者不可缺一。

1. 阅读[独立库镜像与真实预览入口示例](../../infra/examples/example-worker-image.md)。独立 Node 项目先用 packer 库参数生成镜像；示例的小型库镜像只验证发布视图、转换与 VFS 装载，不具备完整 DSH 启动依赖，不能拿它冒充可启动 Web Profile。
2. 需要完整可运行页面时，使用目标版本完整且已构建 checkout 的 preview 构建路径；它由仓库适配器从 Web 模板、optional bundles、配置树与 CLI 安装清单构造 roster，不要求外部消费者猜这些内部配置。独立消费者若自行组装完整镜像，须显式提供所有 bundle、patch 行依赖、配置树与 installation，并保留默认装配 entries；不能设置 `entries: []` 后声称完整 Host 可启动。
3. 页面先创建 `new Worker(构建后的workerURL)`，再 `await connectWorkerHost(worker, { image, overlays })`，握手与 index injections 完成后才启动 Web shell。`./worker` 是预构建 Worker 入口；`?worker` 是 Vite 导入约定，不能原样作为 Node/npm export 使用。完整页面代码与构建命令见示例。
4. 每个请求拥有 AbortController；停止时先取消自己拥有的请求/流并停止 UI，再 `worker.terminate()`。连接返回 `{ worker, tunnel, loadBundle }`，没有公开 `close()`/`dispose()`；terminate 不等待 Host fiber 优雅 dispose，也不承诺未完成写入已落盘。页面 connector 还安装共享 transport 全局，示例用页面导航/重载回收整页，不承诺同页重复连接的透明恢复。

### 失败与完成判据

镜像 HTTP 失败、缺包或握手失败应显示启动失败，并终止已创建 Worker；不能继续运行依赖 transport 的 shell。启动成功时验证真实页面、一次本地动作与数据变化，失败/取消时验证无晚到 UI；关闭页后 Worker 不再运行。内存 VFS 随 Worker 丢失，不构成跨重启持久化保证；overlay 是启动输入并按给定顺序覆盖，仅限 home/workspace 数据区域。

### 权威对象契约

- [api-capabilities-dsh-experimental-webworker-runtime-active](../api/api-capabilities-dsh-experimental-webworker-runtime-active.md)。
- [api-capabilities-dsh-experimental-webworker-runtime-als-runtime](../api/api-capabilities-dsh-experimental-webworker-runtime-als-runtime.md)。
- [api-capabilities-dsh-experimental-webworker-runtime-client](../api/api-capabilities-dsh-experimental-webworker-runtime-client.md)。
- [api-capabilities-dsh-experimental-webworker-runtime-fixture-manifest](../api/api-capabilities-dsh-experimental-webworker-runtime-fixture-manifest.md)。
- [api-capabilities-dsh-experimental-webworker-runtime-frames](../api/api-capabilities-dsh-experimental-webworker-runtime-frames.md)。
- [api-capabilities-dsh-experimental-webworker-runtime-image-gzip](../api/api-capabilities-dsh-experimental-webworker-runtime-image-gzip.md)。
- [api-capabilities-dsh-experimental-webworker-runtime-image-layout](../api/api-capabilities-dsh-experimental-webworker-runtime-image-layout.md)。
- [api-capabilities-dsh-experimental-webworker-runtime-image-manifest](../api/api-capabilities-dsh-experimental-webworker-runtime-image-manifest.md)。
- [api-capabilities-dsh-experimental-webworker-runtime-index-dcdbb](../api/api-capabilities-dsh-experimental-webworker-runtime-index-dcdbb.md)。
- [api-capabilities-dsh-experimental-webworker-runtime-memory](../api/api-capabilities-dsh-experimental-webworker-runtime-memory.md)。
- [api-capabilities-dsh-experimental-webworker-runtime-module-loader](../api/api-capabilities-dsh-experimental-webworker-runtime-module-loader.md)。
- [api-capabilities-dsh-experimental-webworker-runtime-module-proxies](../api/api-capabilities-dsh-experimental-webworker-runtime-module-proxies.md)。
- [api-capabilities-dsh-experimental-webworker-runtime-posix-path](../api/api-capabilities-dsh-experimental-webworker-runtime-posix-path.md)。
- [api-capabilities-dsh-experimental-webworker-runtime-process](../api/api-capabilities-dsh-experimental-webworker-runtime-process.md)。
- [api-capabilities-dsh-experimental-webworker-runtime-replaced-externals](../api/api-capabilities-dsh-experimental-webworker-runtime-replaced-externals.md)。
- [api-capabilities-dsh-experimental-webworker-runtime-synthetic-http](../api/api-capabilities-dsh-experimental-webworker-runtime-synthetic-http.md)。
- [api-capabilities-dsh-experimental-webworker-runtime-tar](../api/api-capabilities-dsh-experimental-webworker-runtime-tar.md)。
- [api-capabilities-dsh-experimental-webworker-runtime-transform](../api/api-capabilities-dsh-experimental-webworker-runtime-transform.md)。
- [api-capabilities-dsh-experimental-webworker-runtime-types](../api/api-capabilities-dsh-experimental-webworker-runtime-types.md)。
- [api-capabilities-dsh-experimental-webworker-runtime-worker-host](../api/api-capabilities-dsh-experimental-webworker-runtime-worker-host.md)。
- [api-capabilities-dsh-experimental-webworker-runtime](../api/api-capabilities-dsh-experimental-webworker-runtime.md)。
