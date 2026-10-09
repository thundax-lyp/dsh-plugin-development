# 扩展候选复核：给主 agent 的交接

范围仅为目标 `dsh-v0.2.0-rc.2` checkout；逐 ID 机器建议在 `extended-audit.json`。`included` 表示有公开插件任务，`ownerGroup` 指建议的唯一权威组，并不表示已写入分发正文。

| 入口 | 建议归属 | 插件作者任务与核实的边界 | 目标证据 |
| --- | --- | --- | --- |
| `@deepseek-ai/dsh-credentials` | Host | 解析、写入和查询机密引用；插件可按 `<scope>/<id>` 存储自身凭据记录。`describe`/列表不返回秘密值；不能用普通 profile Config 保存 token。 | `packages/credentials/credentials/src/index.ts`、`README.zh.md` |
| `@deepseek-ai/dsh-authorization` | Host | 注册授权 flow、与人交互并提交凭据记录；未提交而正常返回会拒绝，取消是独立结果。 | `packages/credentials/authorization/src/index.ts`、`README.zh.md` |
| `@deepseek-ai/dsh-host-directory-picker` | Host/Client 交界 | `DirectoryPickerCapabilities` 可声明合并，Host 后端提供能力，Client 的目录交互选择对应 UI。原生、浏览和自动后端只是不同组合，不能把其中一个写成所有环境默认。 | `packages/host/directory-picker/src/index.ts`、`README.zh.md` |
| `@deepseek-ai/dsh-session-persistence` | Host | 实现或调用 Session 日志后端；与 `ctx.storageDomain` 的非 Session 记录完全不同。JSONL 是随附 provider，不是抽象契约本身。 | `packages/session/session-persistence/src/index.ts`、`README.zh.md` |
| `@deepseek-ai/dsh-host-plugin-inventory` | Client/Remote | 供 Client 展示当前 Loader 与 preset 状态的只读 Remote 快照；无同进程 `Context` 服务、不能启停插件，不能拿它替代 PluginManager。 | `packages/host/plugin-inventory/src/index.ts`、`README.zh.md` |
| `@deepseek-ai/dsh-host-frontend-static` | Infra/Web | 随附 Web 壳占用唯一 fallback 席位；可作为 `WebServer.registerFallback` 的具体组合与失败证据，不建议变成通用文件服务 API。 | `packages/host/frontend-static/src/index.ts`、`README.zh.md` |

此外 `dsh-subprocess`、`dsh-permission-presets`、`dsh-user-approval` 与 `dsh-cordis-host-runner` 是公开 Host 契约，需 Host 组核对是否已有任务 owner；本组不复制它们的方法正文。`dsh-host-open-in-app` 是固定产品路由与应用目录，没有发现第三方注册目录项的公开扩展接口，故不因包公开而纳入通用插件形态。`dsh-plugin-package-inventory-deepseek` 只向官方 DeepSeek 请求贡献包元数据，无法代表动态插件全集，故不把它当作插件开发者的清单 API。

`@deepseek-ai/dsh-package-manifest` 在候选中只有根类型入口；其 `package.json` 的 `./src/*` 导出是通配源码路径。`dsh-plugin-manager` 的 `./operations` 对应用壳有公开包操作任务，不能和生成的 `./remote`/`./typert`、纯类型 `./types` 或辅助 `./registry` 按相同规则处置。以上区分见 `recommendations.json.entryDispositions`。
