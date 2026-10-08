# 基础设施、组合与 provider 约束

## 实现前先选择公开能力接口

实现或使用能力时，导入对应的契约包，再在 Profile 或 preset 组合中挂载恰好一个 provider。本组稳定的能力接口包括 `AttachmentStore`、`CredentialProvider`、`AuthorizationService`、`FileSystem`、`LspService`、`McpResourceRuntime`、`PtcRuntime`、`SandboxProvider`、`SandboxPolicyService`、`ShellExecutor`、`SpillStore`、`Storage`、`SubprocessRuntime`、`WebServer` 和 `WebhookRuntime`。Local、SSH、sandbox、stdio、SQLite、JSON、Node 或实验性包是 provider 选择，而非可移植契约。

Cordis 通过 effect 管理注册。保留并返回或等待 `register`、`mount`、`watch`、路由注册、Remote binding、webhook 注册或 provider 选择产生的每个清理函数。卸载时必须先停止接收新工作，再取消自身负责的活动工作，最后等待清理。`AbortSignal` 取消指定操作，但不能撤销已交付的外部副作用。

## 包与 bundle 声明

作者使用 `@deepseek-ai/dsh-package-manifest` 中的 `DshPackageManifest` 作为声明结构。可分发的 bundle 声明如下：

```json
{
  "name": "@example/dsh-plugin-demo",
  "version": "1.0.0",
  "engines": { "dsh": "0.2.0-rc.2" },
  "dsh": {
    "manifestVersion": 1,
    "bundle": { "patch": "./cordis.patch.yml" }
  }
}
```

这些声明是静态类型，不负责验证。当前 installer/loader 并非总会强制检查 `engines.dsh`；仍应如实声明版本范围，并针对精确目标版本测试。补丁路径相对于包根目录；数组按顺序作为一个 bundle 层应用。

bundle 补丁是补丁操作列表：添加插件时使用 `- insert:` 和嵌套的 Cordis 条目；顶层裸条目不会插入。每个插入条目都需要稳定的 `id`、可解析的 `name`、完整的 `config`，以及在 `inject` 中列出所有必需服务。缺失注入服务会使 fiber 停留在 `PENDING`。后续补丁替换 `config` 时会替换整个对象，所以必须重新声明仍需使用的每个键。不要复制随附的 `base` 或 `web-app` 组合；应在现有 Profile 上叠加最小 bundle。

## 各能力的具体边界

以下各节区分依赖、资源所有者和失败模式不同的契约。面向任务的精确公开对象见[所选 API surface](api-infra-runtime-surface.md)。

## Attachment 与 credential 所有权

Attachment 应发布持久引用；不要在 Session 事实中发布浏览器 URL、临时 Host 路径或 base64 负载。读取时传递取消信号；对象删除不应绑定某个 Session。Credentials 将密钥值保存在 `CredentialRef` 背后；绝不在插件设置或 Session 日志中持久化明文。Authorization flow 必须可注销并支持取消。

支持文件的 attachment provider 必须覆盖基类中默认不支持的文件方法，以背压处理流，并在读取时验证字节。被拒绝的图片批次不会发布引用，但先前写入的内容寻址对象可能成为不可达对象。Credential provider 负责串行化记录修改，并在写入提交后发送更新；记录列表和描述界面不得泄露值。Authorization flow 的注册清理函数与活动尝试分别管理：人工拒绝的 prompt 会取消尝试，而 prompt 自身的信号只能撤回该 prompt。报告授权完成前应等待 `session.commit`。这些契约详见[provider 结构](api-infra-runtime-surface.md#attachment-持久化与-credential-记录)。

## Filesystem、storage 与 spill

Filesystem 调用方必须限制 `readBytes`、根据 `FsError.code` 分支处理、在比较后写入时使用预期版本，并等待 `watch` 返回的关闭函数。Storage 调用方负责管理和关闭 `Domain` handle。除非插件明确要求某个 provider，否则不要把插件契约绑定到 JSON/SQLite。应持久化 `SpillRef`，而非猜测的 provider 路径名。

命名存储后端同时提供 registry 名称和生命周期服务。关闭 backend 前先移除名称；registry 清理函数不会释放存储介质。每次成功完成的 KV 写入都是持久的，但 unit 不会串行化并发写入，因此直接调用方要负责排序。先关闭已打开的 unit，再关闭 backend；Domain 调用方则等待 `Domain.close()`。参见[后端签名](api-infra-runtime-surface.md#backend-存储与进程-handle)。

## Shell、subprocess 与 sandbox

Subprocess、shell 和 sandbox 调用方要区分请求取消与已确认的进程退出。应等待 provider 的终止或静止契约。不能从 `sandboxMode` 推断隔离已生效；要保留返回的执行与拒绝事实。SSH 是 provider 边界，不是另一种可移植 shell 契约。

对于已发布的 subprocess handle，`done` 观察命令结果，`waitForExit` 观察受管进程范围；若需确认没有存活进程，应在终止后等待后者。调用方负责管道 stream，并为收集式读取维护各自独立的字节偏移。Shell 执行提供前台 `result()` 和后台 `done`/output/kill；非零退出、超时和中止属于前台结果事实，基础设施失败则可能使 `result()` 拒绝。决策时应使用 runner 的 `ConfinedArgv` 证据：先分类 runner 失败，再判断拒绝；隔离失败后绝不能执行原始 argv。公开成员见[handle 与隔离结构](api-infra-runtime-surface.md#backend-存储与进程-handle)。

## LSP、MCP 与 PTC

MCP、LSP 和 PTC 是承载或执行边界。应传递取消信号、限制输入输出，并清理 stream/连接。模型工具之间保持一份规范 JSON 值；承载层文字不是 API。普通插件工具通过常规工具 registry 进入 PTC，无需增加第二套集成。

PTC binding 接受并返回 JSON 值。`run` 后读取 `PtcRunResult.error`：程序异常、超时、中止、worker 退出和 sandbox 不可用是不同的已解析失败事实。边界见 [PTC 请求与结果结构](api-infra-runtime-surface.md#ptc-binding-与隔离证据)。

## Web route 生命周期

`WebServer` 只有一个 fallback 位置，且没有内建 TLS、认证或 origin 策略。Exact/prefix 路由名称在整个部署范围内可能冲突；应清理注册，并将 handler 失败限制在该请求或 socket 内。

## Webhook 生命周期

Webhook 的 `dispatch()` 是触发后即返回。规则清理可以等待，因为它先停止接收新请求，再中止并等待活动 delivery 完成。

## Browser 与 computer provider 选择

Browser/computer-use registry 只能选择一个 provider。实验性 provider 需要明确启用，仍属于实验性功能；取消无法撤销已发出的浏览器或桌面操作。

## Preset 与 Typert Remote

Preset 定义是具有 revision 生命周期的活动 Loader 树。释放其所属 preset 作用域后，不得继续持有服务对象。Typert stream 和生成的 Remote 贡献归 effect 管理；要迭代或清理它们，绝不要手写 wire envelope。

## Host 与 Client 跨端规则

Host 包执行运行时工作。Client 包声明 `dsh.client`、导出 Client 入口，且不能在浏览器中导入 Host 实现。Typert 生成的 `./typert` Host 产物和 `./remote` Client 产物连接两端。持有 Remote stream 的一方必须迭代或清理它。UI、settings 和 session-format 的细节分别归 Client、Settings 或 Session 所有者负责；组合层只负责连接它们。

## 验证

至少要验证包导出和声明编译；在隔离的 `DSH_HOME` 中运行 `dsh plugin --profile <name> add <package>`；检查 `dsh --profile <name> --dump-config`；启动该 Profile，确认每个目标条目都进入活动状态而非停留在 `PENDING`；观察一次能力调用；用 `dsh plugin --profile <name> remove <package>` 移除 bundle，并确认重载或重启后路由、provider、watcher、进程和 stream 都已消失。Host 与 Client 分开构建。对 native、SSH、browser、desktop、MCP 和 Remote provider，还需在实际环境中冒烟并检查真实行为。

## Cordis 插件生命周期与组合

每个 Host 插件都应遵循 [Cordis 生命周期签名](api-infra-runtime-surface.md#cordis-生命周期公开-api)。作者导出函数、类或对象形式的 `apply(ctx, config)` 入口；`inject` 声明必需服务，导出的 Standard Schema `Config` 在启动前验证值。`ctx.plugin(child)` 和 `ctx.inject(deps, callback)` 返回可等待其启用的 fiber。缺失服务的 fiber 是 `PENDING`，并非失败；provider 出现后仍可能启用。配置验证或启动失败产生 `FAILED`；应检查 fiber/Loader 诊断，不能因补丁解析成功就假设插件已启用。

`Service` 子类调用 `super(ctx, key)`，并为 Cordis `Context` 扩展该键。Cordis 将服务注册为 effect；卸载时移除服务，也可能随之卸载依赖它的 fiber。用 `ctx.effect` 包装定时器、进程 handle、远程连接及其他非 Cordis 资源，返回同步或异步清理函数。显式清理、依赖丢失、HMR 或父级卸载时都会执行 effect 清理。同一个 effect 内，清理函数按注册顺序的逆序执行，并等待异步清理；若不同 effect 必须严格排序，使用一个执行并等待该顺序的清理函数。`fiber.dispose()` 是完成边界。仍需将调用方的中止信号传递给自有工作；卸载 fiber 不能撤销已交付的外部操作。

bundle 的 `cordis.patch.yml` 是 `PatchOptions[]`，因此添加插件需要 `- insert:` 和嵌套的 `EntryOptions` 条目。稳定的条目 ID 支持后续覆盖或重载。条目的 `inject` 表示 Loader 依赖，而 `package.json` 中的 `dsh.client.inject` 指定 Client 包；两种声明含义不同。Cordis context 支持父子服务隔离和配置 intercept；仅在 Profile 需要独立 provider 实例或受控的逐插件配置时使用。
