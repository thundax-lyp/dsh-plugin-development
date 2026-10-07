# rc.1 pi-ai route 与 DeepSeek 包清单 Profile 验证

精确 checkout：`dsh-v0.2.0-rc.1` / `4878cdabd87d4041bdaff61d04c966883b9fd07a`。两个目标都是**可装载的现成 Host plugin**。`packages/llm/llm-pi-ai/src/{index,config,auth}.ts` 公开 `name/inject/Config/apply`，`Config.providers` 是 Volatile 字典；自声明 route 必须给 `api`、`baseURL`、非空 `models`，`apiKeyEnv` 一旦声明就按每请求凭证引用解析，缺失不能回退环境发现。`packages/llm/plugin-package-inventory-deepseek/src/index.ts:192-203` 公开 `name/inject/Config/apply`，enabled=true 时注册 `dsh_plugin_packages` 扩展；`collectActivePluginPackages` 仅读活动 Loader entry，可选合入请求 Agent 的 standing preset。

## 隔离 npm consumer

新目录 `evidence/tests/pi-ai-inventory-consumer/` 使用已发布 rc.1 DSH 包、Cordis 4.0.4、Loader 1.0.5、Schemastery 3.18.4、TypeScript 6.0.3。`src/config.ts` 用公开 `Options`、`Config` 类型与 schema 编译自声明 `example-gateway`；两个 YAML patch 给 Profile 装载行。命令与观察：

- `npm install --ignore-scripts --no-audit --no-fund`：成功，安装发布包及运行 peer。
- `npm run build`：成功，严格 Host TypeScript 编译。
- `node smoke-pi-ai.mjs`：真实 Cordis 装载 LlmRuntime + pi-ai；自声明 route 与 `example-model` 目录可见；无 Credential service 的请求以 `MISSING_CREDENTIAL` 结束且替换的 `fetch` 未调用；卸载后 route 消失。
- `node smoke-inventory.mjs`：真实 Cordis 装载 extension registry 与 inventory，`agents`/`loader` 用最小 fake service；disabled 不注册字段，enabled 时 `prepare` 返回 `{version:1,packages:[]}`，卸载后字段消失。空 Loader 使包清单为空，这是故意的受控边界。

## 处置与边界

`dsh-llm-pi-ai` **include**：owner `references/api-llm-providers.md` 的配置/生命周期。`dsh-plugin-package-inventory-deepseek` **include**：owner `references/api-llm-builtins-retry-meter.md` 的对象表，字段 seam 归 `api-deepseek-request-extensions.md`。两个装载任务的完整例子共用 `references/how-to-configure-pi-ai-and-inventory.md`。两者不应被看作注册任意协议的通用 Provider API。

未运行真实 Profile Loader 启动、带凭证的成功网络请求、非空活动 Loader package manifest、Agent standing preset 合并、真实 DeepSeek Messages wire payload、Settings 卡片及 Web UI。pi-ai 的无凭证失败只证明本例 declared credential 不回退和没有联网；inventory smoke 只证明注册/prepare 空 Loader/卸载，不证明实际包收集正确。源码和目标测试分别支持更深行为，但不替代这些未运行的集成面。
