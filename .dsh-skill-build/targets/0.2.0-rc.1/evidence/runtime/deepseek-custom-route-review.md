# rc.1 DeepSeek 自有 Messages route 隔离验证

精确源码：`dsh-v0.2.0-rc.1` / `4878cdabd87d4041bdaff61d04c966883b9fd07a`。`packages/llm/llm-deepseek/src/index.ts` 公开 `registerDeepSeekProvider`、`Config`/`deepSeekConfigFields`、`plainOptions`、`resolveAdapterOptions`、`catalogModelInfo`；`src/host.ts` 的 helper 以 `ctx.llm.registerAdapter` 注册指定 route，将 Settings、附件、FS、请求扩展、匿名用户 id 注入 DeepSeekAdapter，并在 volatile retry policy 变化时 replace。`src/adapter.ts:47-125` 在每次 stream 获取 connection，合并 consumer 与调用者 signal；`request` 在 auth 前和 auth 后的网络路径检查 signal。`packages/credentials/credentials/src/index.ts:25-46` 提供 `credentialRef`，`resolve` 必须接受品牌引用。

## 隔离 consumer

`evidence/tests/deepseek-route-consumer/` 是完整 npm 包：`package.json`、锁文件、`tsconfig.json`、`cordis.patch.yml`、`src/index.ts` 与 `smoke.mjs`。它只使用已发布 `@deepseek-ai/*@0.2.0-rc.1`、`@deepseek-ai/cordis@4.0.4`、`@deepseek-ai/cordis-plugin-loader@1.0.5`、`@deepseek-ai/schemastery@3.18.4`、`typescript@6.0.3`。`src/index.ts` 不是通过目标 checkout 相对导入；安装时以 `--legacy-peer-deps` 处理已发布包的 workspace peer 声明。本包附带 DeepSeek 根包的运行 peer，使 Node 能加载其发布 bundle。

实际执行并观察：

1. `npm install --ignore-scripts --legacy-peer-deps --no-audit --no-fund`：成功。
2. `npm run build`：TypeScript 6.0.3 Host 编译成功；首次编译发现原始 string 不能传给 `credentials.resolve(CredentialRef)`，按公开 `credentialRef` 修复后通过。
3. `node smoke.mjs`：真实 Cordis `ctx.plugin(LlmRuntime)` 与自有插件装载成功；`listProviders()` 有 `example-messages`、`listModels()` 返回其目录；预先取消得到 `finish.reason.kind='aborted'`；缺少 Credential service 时得到 `MISSING_CREDENTIAL`，替换的 `globalThis.fetch` 计数为 0；`fiber.dispose()` 后目录为空。成功输出 `registered, listed, pre-cancelled without network, disposed`。
4. `npm pack --dry-run --json`：成功，包包含 `cordis.patch.yml`、`lib/index.js`、`lib/index.d.ts`、`package.json`。
5. 新 HOW-TO 与 LLM reference 的 Prettier、JSON code fence、行尾空白检查通过。链接使用生成后的 `references/` 文件名；新的 HOW-TO 输出仍需主任务登记 manifest 并经完整构建检查。

## 验证界限

这是无网络安全路径。没有提供真实 secret，也没有发起成功的 Messages 请求；Files API 上传、附件图像、真实 gateway、重试、活动请求中途取消与 Profile Loader 热更新未运行。`resolveAuth` 回调没有 signal 参数，Credential provider 的在途读取不由本插件取消；adapter 在它返回后检查取消再进入后续请求。`registerDeepSeekProvider` 的设置目录并非自动为此 route 生成 Client 卡片，本例只注册运行 route 与模型目录。

## 相关包的 package 级裁决

| 包 | 裁决与 owner / section | 完整任务路径 |
| --- | --- | --- |
| `@deepseek-ai/dsh-llm-pi-ai` | `include` → `references/api-llm-providers.md` 的 `契约与运行语义`，以及 `references/api-llm-builtins-retry-meter.md` 的 `对象类型与成员`。`src/index.ts` 公开 `name/inject/apply`、`Config.providers` 和可选自声明 gateway；一次插件实例可管理多个 route，动态配置与重注册由其本身拥有。 | 已补 `references/how-to-configure-pi-ai-and-inventory.md`，独立 npm consumer 编译、route/目录/缺凭证/卸载 smoke 通过；真实 Profile 与成功网络请求仍未运行。 |
| `@deepseek-ai/dsh-plugin-package-inventory-deepseek` | `include` → `references/api-llm-builtins-retry-meter.md` 的 `对象类型与成员`；其自定义字段 seam 链接 `references/api-deepseek-request-extensions.md`。`src/index.ts:192-203` 在 `Config.enabled !== false` 时向 `ctx.deepseekLlmApiExtensions.register('dsh_plugin_packages', ...)`，仅贡献官方 Messages 请求的活跃 Loader 包清单。 | 同一 HOW-TO 已补装载行；真实 Cordis/extension registry 在空 Loader stub 上验证 enabled 开关、空字段值及卸载。非空活动清单、Agent preset 与真实请求 wire 未运行。 |
