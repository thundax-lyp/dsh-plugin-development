# 操作指南：打包、组合与扩展基础设施插件

生命周期和安全边界参见[基础设施契约](api-infra-runtime.md)，所选签名参见[公开对象参考](api-infra-runtime-surface.md)。本文所有命令和路径均针对 `dsh-v0.2.0-rc.2`。Profile 层是**补丁列表**，而 Cordis 源码中的 `cordis.yml` 是条目列表；不要将裸插件条目放在 bundle 补丁的顶层。

## 打包并启用 bundle

最小的独立 Host bundle 包含以下三个文件。此 JavaScript 示例不依赖仓库构建；TypeScript 包必须发布构建后的 JS 和声明文件，并将共享的 Cordis/DSH 包声明为 peer dependencies。

`package.json`:

```json
{
  "name": "dsh-observe-demo",
  "version": "1.0.0",
  "type": "module",
  "main": "index.js",
  "files": ["index.js", "cordis.patch.yml"],
  "engines": { "dsh": "0.2.0-rc.2" },
  "dsh": { "manifestVersion": 1, "bundle": { "patch": "./cordis.patch.yml" } }
}
```

`index.js`:

```js
export const name = 'observe-demo'
export function apply(ctx) {
  console.log('observe-demo active')
  ctx.effect(() => () => console.log('observe-demo disposed'))
}
```

`cordis.patch.yml`:

```yaml
- insert:
    - id: observe-demo
      name: dsh-observe-demo
      config: {}
```

1. 打包此目录，或将其放在 shell 旁。为隔离的消费项目设置临时 `DSH_HOME`，再从其父目录运行 `dsh plugin --profile demo add ./dsh-observe-demo`。CLI 会初始化基于 base 的 Profile、安装包，并把 bundle 名称加入 `dsh.profile.bundles`。没有 `dsh.bundle` 的包只作为依赖安装，不会增加层。
2. 运行 `dsh --profile demo --dump-config`，检查 `dsh-observe-demo` 层和 `observe-demo` 条目。用 `dsh --profile demo` 启动，观察启用日志；若没有日志，检查 Loader fiber。缺少必需的 `inject` 会使条目停留在 `PENDING`；无效的 `Config` 或模块导入可能导致启用失败。bundle 未加载时，检查 `skippedBundles` 或启动器的跳过诊断。
3. 运行 `dsh plugin --profile demo remove dsh-observe-demo`。bundle 成员变更在下次启动 Profile 时生效，所以即使启用了 HMR，移除后仍需停止并重新启动 Profile。观察清理过程，确认条目从配置转储中消失。安装成功不能证明插件已启用。

`dsh plugin` 命令要求 `pnpm` 位于 `PATH`。`dsh.bundle.patch` 可以是按顺序应用的包内相对路径数组。`dsh.profile.bundles` 决定层的顺序，随后依次应用 Profile 补丁、home 补丁及 `--patch` 覆盖。按 `id` 覆盖条目会替换其整个 `config`，因此仍需使用的键必须重新声明。Client 部分需要含 `platform: "web"` 的 `dsh.client`、导出的 `./client` 入口，以及单独的 Client 构建。`dsh.client.inject` 指定模块加载所需的包依赖，并非 Cordis 服务注入。

## 实现或使用基础设施 provider

先识别起点：在目标 DSH checkout 内开发时，下面的 `packages/.../src` 是核查实现和测试的源码路径；在独立消费项目中，安装精确版本的公开契约包后，从它的 `exports.types` 所指向的 `node_modules/@deepseek-ai/<package>/lib/types/*.d.ts` 读取完整抽象方法与嵌套类型。例如 `@deepseek-ai/dsh-credentials` 发布 `lib/types/index.d.ts`，但其发布文件清单不包含 `src/index.ts`。下列摘要只帮助选择 seam，不能代替已安装包的完整声明。若所需声明、具体 provider 或构建入口无法从已发布包解析，就先停止该独立实现路径并报告缺口；不要以 checkout 私有源码冒充消费项目依赖。

1. 选择一个公开能力契约，然后在精确目标版本中检查 provider 声明的服务键和 `static inject`。将 provider 和消费方条目放入 bundle 的 `insert` 列表。消费方通过插件的 `inject` 声明必需的 Cordis 服务；Loader 根据服务可用性而非列表顺序启用插件。每个条目都要有 `id` 和完整的 `config`。
2. 实现目标契约的全部方法和声明的失败类型，或使用已有 provider。具体要求因 provider 而异：`FileSystem` 使用 `FsTarget` 和 `FsError.code`；`Storage` 区分命名 form 与可关闭的 `Domain` handle；`ShellExecutor` 在执行前解析请求；`McpResourceRuntime.register` 返回清理函数。应遵循所链接的各公开类型，不要把示例 bundle 中只打印日志的插件改装成虚假的 DSH provider。
3. 在 Cordis effect 中管理每项注册和存活资源。卸载时先停止接收新工作，再传递取消信号，最后等待 watch、子进程 handle、domain 和连接清理完成。信号中止不等于已确认外部进程退出。持久化 attachment 或 spill 的持久引用而非本地后端路径；持久化 credential 引用而非密钥。
4. 在隔离的 Profile 中确认所有条目均为 `ACTIVE`，调用一次消费方操作，覆盖一个文档规定的错误或取消路径，移除 bundle，并确认没有回调或资源残留。上面的通用 bundle 只能证明包已启用；provider 行为还需选定契约的测试及真实运行环境验证。

### Provider 契约与生命周期检查

对每个能力接口，使用下列契约专属调用和完成检查。抽象服务的实现必须满足其**所有**抽象方法和公开嵌套类型；这里的一行摘要不能代替完整声明。

- **Attachment：**`ctx.attachments.saveImages(inputs)` 返回有序的持久引用；只有支持文件的 provider 覆盖基类的不支持行为后，`saveFile`/`saveFileStream` 才会发布文件引用。读取图片或文件时传递取消信号；流式 provider 应施加背压，并在读取时验证字节。测试超限批次在发布到 Session 前被拒绝、流式文件往返、读取中途取消，以及 Session 移除后已提交的引用。源码：`packages/attachment/attachment/src/index.ts`。
- **Authorization：**注册 flow 时提供 credential key、标签、非空有序方法列表及 `run(session)`；保留 `registerFlow` 清理函数。调用 `begin({ key, method?, interaction, signal? })` 时提供可通知、可提示的 interaction，并在报告成功前等待 `session.commit(record)`。测试人工拒绝、单个 prompt 撤回、整个尝试取消，以及 prompt 待决期间移除 flow。源码：`packages/credentials/authorization/src/index.ts` 和 `src/types.ts`。
- **Credentials：**`ctx.credentials.resolve(ref)` 返回密钥或 `undefined`；`set`/`unset` 管理引用值。完整 provider 还要实现记录读取、元数据与列表、串行化的 `modifyRecord` 和删除；仅在持久化后发布更新通知。设置中只存 `CredentialRef`。测试缺失、设置、解析、不改变记录的修改、不含密钥值的记录列表、删除，以及不打印密钥的提交后观察。源码：`packages/credentials/credentials/src/index.ts`。
- **Filesystem：**`resolve(path, opts?)` 返回 `FsTarget`；`readBytes(target, signal, maxBytes)` 必须设置字节上限；`watch(target, changed, signal)` 返回异步关闭函数。测试目标解析、有上限的读取、预期版本写入冲突、取消及等待 watcher 关闭。源码：`packages/fs/fs/src/index.ts`。
- **LSP：**`registerProvider(provider)` 原子占用 provider ID 和文件扩展名，并返回清理函数；`query(request, signal?)` 按扩展名选择 provider，返回 `locations` 或 `hover` 结果。测试重复扩展名被拒绝、一次零基 UTF-16 查询、取消和释放。源码：`packages/lsp/lsp/src/types.ts` 和 `src/index.ts`。
- **MCP resources：**`register(server, provider)` 返回清理函数；provider 的 `request(request, exec)` 仅处理资源列表、模板列表和读取操作，并返回无损 JSON。测试一次有作用域的 server 读取、重复名称被拒绝，以及清理后工具消失。传输重连由独立的 `dsh-mcp-client` 包负责。源码：`packages/mcp/mcp-resources/src/index.ts`。
- **PTC：**向 `ctx.ptcRuntime.resolve(request)` 提供 `program` 和值为 JSON 的 binding 命名空间，再将返回的 provider 私有 spec 传给同一 provider 的 `run(spec)`。读取 `value`/`logs` 或已解析的 `error` 类型；分别测试程序异常、超时、取消和 sandbox 不可用的结果。普通插件工具无需再向 PTC 单独注册。源码：`packages/ptc-runtime/ptc-runtime/src/index.ts` 和 `src/types.ts`。
- **Sandbox 与策略：**解析 `SandboxExecutionPolicy`，随后只使用 `ctx.sandbox.confine(argv, policy, signal?)` 返回的 `argv`。检查所选后端的 `enforcement`、拒绝签名及 runner 失败规则；先分类 runner 失败，再判断策略拒绝。测试拒绝、runner 不可用，以及隔离失败后没有以未隔离命令重试。源码：`packages/sandbox/sandbox-policy/src/index.ts` 和 `packages/sandbox/sandbox/src/index.ts`。
- **Shell：**先解析请求再调用 `execute(spec)`；前台执行等待 `result()`，后台 handle 使用 `done`、`readOutput()`/`observed` 和 `kill()`。测试非零退出、超时和中止作为结果返回，基础设施失败使 `result()` 拒绝，以及退出后仍可读取输出。进程生命周期可能归 `ctx.subprocess` 管理，所以只重载 shell executor 不一定终止进程。源码：`packages/shell/shell/src/index.ts` 和 `src/types.ts`。
- **Spill：**`ctx.spillStore.saveText(input)` 只在持久化后返回 `SpillRef`。测试成功的定位符和失败的写入；绝不持久化其 provider 私有文件路径。源码：`packages/spill/spill/src/index.ts`。
- **Storage 与 domain：**命名后端通过 `ctx.storage.backend.register(name, backend)` 注册，并单独提供 `storageBackendServiceKey(name)`；清理注册并等待 `backend.close()`。通过 `backend.kv.open(descriptor)` 打开 `KvUnit`，串行化写入，重新打开以确认已完成的写入持久化，再关闭 unit 和 backend。若使用 Domain，挂载其 form，使用带类型的 `table(name)` 操作，并等待 `Domain.close()`。测试重复注册、不支持的 `kv`、版本不符、写入失败、持久性及清理。源码：`packages/storage/storage/src/registry.ts`、`src/backend.ts` 和 `packages/storage/storage-domain/src/domain.ts`。
- **Subprocess：**解析可执行文件，分别调用 `spawn(spec)` 或 `spawnTerminal(spec)`。同步抛错的 `spawn` 不会发布 handle；发布后应管理管道、观察 `done`、调用 `terminate()`，并等待 `waitForExit()` 确认受管进程范围结束。collect 模式从自有字节偏移读取，并检查 `lossy`/`spillPath`。测试可执行文件缺失、启动前中止、退出后收集输出，以及取消后进程范围静止。源码：`packages/subprocess/subprocess/src/index.ts` 和 `src/types.ts`。

以下第一方 provider 是这些能力接口后面分别安装的 Loader 条目。应按消费方实际需要的进程、存储和路径权限选择条目；仅安装能力接口包不会提供具体后端。

### 文件、凭据与语言 provider

| 能力接口     | 可选 provider 与所需组合                                                                                                                 | 失败或清理边界                                                                                                   |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Attachment   | `dsh-attachment-local` 存储于 `DSH_HOME` 下；与 `dsh-attachment` 一起挂载。                                                              | 验证图片/文件完整性；不会自动删除已存对象。                                                                      |
| Credentials  | `dsh-credentials-local` 接受可选的私有记录 `path`；与 `dsh-credentials` 一起挂载。                                                       | 环境变量、已保存文件和 `.env` 有明确优先级；同一 OS 用户不能作为密钥隔离边界。                                   |
| Filesystem   | `dsh-fs-local` 接受 `cwd`；`dsh-fs-sandbox` 还注入 `sandboxPolicy`；`dsh-fs-ssh` 注入 `ssh` 和 `sandboxPolicy`。按目标命名空间选择其一。 | 本地 `cwd` 不限制绝对路径。Sandbox 写入拒绝为 `FS_SANDBOX_DENIED`；SSH 传输中断时写入可能已提交，不可盲目重试。  |
| 文件系统观察 | 可选的 `dsh-fs-observation-policy` 利用 Session 先前的读取和观测版本保护写入/编辑。                                                      | 恢复的 Session 在受保护修改前必须重新读取；文件变化会报 `FS_STALE_VERSION`。这是策略层，不是另一种文件系统后端。 |
| LSP          | `dsh-lsp-stdio` 注入 `fs`、`lsp`、`subprocess`；配置非空的可执行文件、参数和扩展名 server 条目。                                         | 解析失败可能阻止启用；provider 为每个 workspace 延迟创建进程池，并在清理时关闭。                                 |

### 进程与隔离 provider

| 能力接口   | 可选 provider 与所需组合                                                                                                                                                          | 失败或清理边界                                                                                                                     |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| PTC        | `dsh-ptc-runtime-node` 注入 `fs`、`subprocess`、`sandbox`、`sandboxPolicy`；配置执行限制。                                                                                        | 每次运行使用新的 Node；sandbox 不可用时，受限模式失败。                                                                            |
| Sandbox    | `dsh-sandbox-local` 选择本地平台 runner；`dsh-sandbox-ssh` 注入 `ssh` 并在远程 Host 隔离。                                                                                        | 无法强制隔离时，二者都在启动前失败。`dsh-sandbox-windows-acl` 是本地 provider 内部选择的直接 Windows API，不是另一个 Loader 条目。 |
| Shell      | `dsh-bash-local` 或 `dsh-pwsh-local` 使用新的非 login、非 profile 进程注册 `ctx.shell`。任务需要 `sandbox` 和 `sandboxPolicy` 时，改选 `dsh-bash-sandbox` 或 `dsh-pwsh-sandbox`。 | 本地变体使用 Host 权限运行；无法提供要求的隔离时，sandbox 变体必须失败。调用之间不保留 shell 状态。                                |
| Subprocess | `dsh-subprocess-local` 在 Host 上运行；`dsh-subprocess-ssh` 注入 `ssh`，应与 SSH 文件系统/sandbox 共用远程命名空间。                                                              | 本地取消后清理受管进程范围。SSH 传输中断会留下未经确认的启动状态，不得自动重放。                                                   |

### 存储与 spill provider

| 能力接口    | 可选 provider 与所需组合                                                                                                                                                                          | 失败或清理边界                                                                                                    |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Spill       | `dsh-spill-local` 接受可选的 `root` 和 `cleanupPeriodDays`。                                                                                                                                      | 返回的引用限定于 Session；启动清扫尽力而为，清理时等待清扫完成。                                                  |
| 存储 domain | `dsh-storage-json` 注入 `storage`、要求 `root` 并注册 `json` form；`dsh-storage-sqlite` 注入 `storage`、接受数据库 `path` 并注册 `sqlite` form。挂载 `dsh-storage-domain` 并将其路由到所选 form。 | JSON 布局与 SQLite 版本错误仍由各 provider 定义；SQLite `:memory:` 是临时存储。排队写入完成后关闭 domain handle。 |

### SSH provider 组合

选择 SSH provider 时，如果同一任务需要文件系统、子进程和 sandbox，先挂载 `@deepseek-ai/dsh-ssh`，再挂载相应 provider；将本地路径与远程执行混用会破坏任务的路径权限边界。两端都必须运行 Linux 或 macOS。配置已有 OpenSSH alias，启用严格的 known-host 检查和非交互式凭据，再设置远程绝对路径 `node`、`helper`、`workspace` 和小写 SHA-256 `helperHash`。PTC 部署还需成对提供 `bootstrapPath`/`bootstrapHash`。将匹配的 helper/runtime 安装在可写 workspace 和临时根目录之外。验证 `ctx.ssh.ready` 及一次远程操作，再清理连接并确认待处理 stream 已收束。SSH 传输中断会使远程结果不确定；不能仅因连接拒绝就重试可能已经提交的修改或启动。具体 provider 配置与所有权见 `packages/{attachment,credentials,fs,lsp,ptc-runtime,sandbox,spill,storage,subprocess,ssh}/` 中各包目标版本的 README 和 `src/index.ts`。

## 注册 Web 路由与 webhook 规则

1. 需要 HTTP 时，挂载 `@deepseek-ai/dsh-host-webserver` 并明确指定 loopback `host` 和 `port`；需要创建 Session 时，再挂载 `@deepseek-ai/dsh-webhook` 及其必需的 Agent、preset、permission、title 和 workspace 服务。Web server 本身不是 webhook adapter。
2. 路由插件注入 `webServer`；`ctx.webServer.register({ kind: 'exact', path: '/my-hook', handler })` 返回同步清理函数。注册相同键的 exact 或 prefix 路由会抛错。handler 负责 HTTP 响应。对于外部 webhook，必须**先**验证请求的原始字节，再构造 `VerifiedWebhookDelivery` 并交给 `ctx.webhookRuntime.dispatch`。GitHub adapter 是具体示例，并非通用认证器。
3. 用 `ctx.webhookRuntime.register({ id, kind, run })` 注册规则。其 `run(delivery, signal)` 返回 `WebhookSessionRequest` 或 `null`；`dispatch` 为已验证 delivery 建立快照、启动匹配规则，并在回调完成前返回。规则回调失败会被隔离并记录。保留返回的异步清理函数，卸载时等待其完成：它会隐藏规则、中止信号并等待活动回调退出。路由也需清理。测试格式错误或未认证请求、重复路由/规则 ID、成功 delivery，以及卸载期间的慢回调。

`WebServer` 不提供 TLS、认证或 origin 策略。绑定 `0.0.0.0` 会改变暴露范围；应在部署环境或 adapter 中添加所需边界。

## 组合 preset 与 Host 到 Client 的 Remote

这两种组合机制有关联，但各有所有者。普通 Cordis 条目以 `config: { id, plugins }` 挂载 `@deepseek-ai/dsh-agent-preset`；该插件通过 `ctx.agentPresets.register` 注册 `PresetDefinition`。注册会返回异步清理函数，`list()` 对失败或待决条目报告 `broken` 诊断。已选用 preset 的 Agent 在释放前保留该 preset revision，因此移除定义不会立即清理使用中的 revision。验证 preset 时，先注册并在列表中确认没有 `broken`，创建并释放选用它的 Agent，然后卸载条目并确认最后一次释放后旧资源已清理。

Remote API 的 Host 声明、生成的 `./typert` 和 `./remote` 导出、Client 的 `remote` 与 `remote.<namespace>` 注入、失败码和 stream 清理，参见[专门的 Remote 操作指南](how-to-client-web.md)。Host 方法必须使用公开 Typert 协议类型；Client 导入生成的 binding。在编译 Client 前构建生成声明，通过真实连接调用一个 unary 方法及一个取消/失败案例，再清理所有 stream 并卸载两端贡献。Profile bundle 可以包含 Host 条目，但其 YAML 不能代替生成的 Client binding。

## 选择实验性 browser 或 computer provider

`@deepseek-ai/dsh-browser-use` 和 `@deepseek-ai/dsh-computer-use` 提供单例 provider 选择 registry，而非可移植的浏览器或桌面命令 API。其 `register(name)` 返回异步清理函数，并拒绝第二个仍存活的 provider。应在 Profile 中明确挂载选定的 registry 和**一个**目标版本的实验性 provider 包，以及该 provider 自己声明的依赖和配置。测试其工具是否出现在合适的 Session 中，并执行一次脚本化本地调用；然后取消一次调用、卸载 provider，并等待清理完成。取消不能撤销已经交给浏览器或桌面的操作。单独的 registry 不能提供工具；实验性包存在于仓库中也不表示它默认已挂载。例如，browser provider 的 bundle 补丁可将以下条目插入已提供 Agent、工具和系统提示的 Profile：

```yaml
- insert:
    - id: browser-use
      name: '@deepseek-ai/dsh-browser-use'
    - id: browser-provider
      name: '@deepseek-ai/dsh-experimental-browser-use-playwright-mcp'
      config:
        mode: launch
        headless: true
```

provider 会为每个新建或恢复的 Session 启动浏览器连接；重载不会接管已有的活动 Session。选定的实验性包及其锁定的 runtime 必须与 bundle 一起安装。computer provider 则使用 `@deepseek-ai/dsh-computer-use` 加一个 driver 包。例如，`@deepseek-ai/dsh-experimental-computer-use-cua-driver-mcp` 需要已安装的 `cua-driver` 可执行文件和 `config: { command: cua-driver, args: [mcp] }`；桌面权限由该 driver 提供。观察 `browserUse.providerName` 或 `computerUse.providerName`、Session 发现的工具、一次调用结果，以及卸载后 provider 名称消失。仅有非空 provider 名称不能证明外部浏览器或桌面操作成功。

| 明确选择的 provider                                             | 挂载条件与失败边界                                                                                                                                                                                           |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `@deepseek-ai/dsh-experimental-browser-use-chrome-devtools-mcp` | 设置 `mode: launch` 和可选的 `headless`/`executablePath`，或设置 `mode: attach` 与调试 `endpoint`。附加的浏览器由一个存活 Session 独占；占用状态不会在本次启用中重试。卸载会断开连接，但外部浏览器继续运行。 |
| `@deepseek-ai/dsh-experimental-browser-use-playwright-mcp`      | 上述补丁使用 `mode: launch` 和 `headless: true`。安装其锁定的浏览器 runtime，并验证一次脚本化本地浏览器调用；仅完成注册不能证明浏览器已运行。                                                                |
| `@deepseek-ai/dsh-experimental-browser-use-stagehand-native`    | 设置 `mode: launch`、`headless` 和受支持 Stagehand SDK 模型所需的 `model` 凭据。即使只是导航也需要 `model`；第一次工具调用时才启动，Chrome runtime 不可用时会失败。                                          |
| `@deepseek-ai/dsh-experimental-computer-use-cua-driver-mcp`     | 提供外部 `cua-driver` 命令及其 `mcp` 参数；driver 进程负责桌面权限。在获准的本地 Session 中验证工具目录和取消行为。                                                                                          |
| `@deepseek-ai/dsh-experimental-computer-use-cua-driver-native`  | 没有包配置字段。保持可选原生依赖启用，并向启动的 Host 进程授予桌面权限。原生崩溃可能终止该进程；启用失败必须释放 registry 位置和工具。                                                                       |
