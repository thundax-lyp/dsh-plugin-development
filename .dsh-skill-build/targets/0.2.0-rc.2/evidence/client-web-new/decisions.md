# Client/Web 与 Remote 候选裁决（0.2.0-rc.2）

事实源仅为 `checkout/` 中的 `dsh-v0.2.0-rc.2`，commit `639ed015397290b3745d163aafe02ffee4aa3f84`。下表是本组的合并建议，不代替主 agent 对全集的最终 `coverage.json` 与 `api-surface.json` 裁决。路径均相对目标 checkout。

| 候选 ID | 公开入口与对象 | 证据路径 | 插件任务 ID | 建议与理由 |
| --- | --- | --- | --- | --- |
| `package:@deepseek-ai/dsh-client-modules`、`export:@deepseek-ai/dsh-client-modules:.` | Host `ClientModuleRegistry`；扫描 Loader 行并服务浏览器包 | `packages/client/modules/package.json`; `packages/client/modules/src/index.ts`; `packages/client/modules/tests/` | `client-load-web-half` | included；Web 插件装载的实际桥梁；页面半侧仅附着裸包名行。 |
| `export:@deepseek-ai/dsh-client-modules:./client` | `ClientModuleSystem`、`createClientModuleSystem` | `packages/client/modules/src/client/index.ts`; `packages/client/modules/src/client/manifest.ts` | `client-load-web-half` | merged 到模块装载主题；这是 Shell/Loader 基础设施，不建议插件直接自建系统。 |
| `package:@deepseek-ai/dsh-client-ui-slots`、`export:@deepseek-ai/dsh-client-ui-slots:.` | `SlotMap`、`SlotCore`、`RegisterFactory`、`ComposedProps` | `packages/client/ui-slots/package.json`; `packages/client/ui-slots/src/index.ts`; `packages/client/ui-slots/tests/` | `client-contribute-slot` | included；公开的 slot 类型和注册语义。实际 `ctx.slots` 服务由 renderer 安装。 |
| `export:@deepseek-ai/dsh-client-ui-renderer:./client` | `ctx.slots` 的浏览器服务、slot 注入与 renderer | `packages/client/ui-renderer/package.json`; `packages/client/ui-renderer/src/client/index.ts`; `docs/subsystems/slots.md` | `client-contribute-slot` | included；插件调用 `ctx.slots.inject` 的真实运行侧。 |
| `package:@deepseek-ai/dsh-client-ui-primitives` | 共享控件库 | `packages/client/ui-primitives/package.json`; `packages/client/ui-primitives/README.zh.md` | `client-share-control` | included；可复用 UI 控件，不能运行时 import 另一功能插件的实现。 |
| `package:@deepseek-ai/dsh-client-ui-theme` | 主题样式、`--dsw-*` token | `packages/client/ui-theme/package.json`; `docs/web-styling.md`; `packages/client/ui-theme/README.zh.md` | `client-style-surface` | included；当前 Web 样式契约，CSS Modules 和语义 token 属于任务必需。 |
| `package:@deepseek-ai/dsh-client-ui-settings-web-search` | `./client` 中 `apply`、`inject`、页面贡献 | `packages/client/ui-settings-web-search/package.json`; `packages/client/ui-settings-web-search/src/client/index.ts` | `client-contribute-slot` | merged 为具体组合实例；仅作示例证据，不推广其域服务或 `WEB_SEARCH_NS` 为通用 API。 |
| `composition:packages/bundle/web-app/cordis.patch.yml` | Web Profile 的 Host 与 Client 行 | `packages/bundle/web-app/cordis.patch.yml`; `packages/bundle/web-app/package.json` | `client-load-web-half` | included；可观察的装载组合证据，单有 `./client` 导出不会自动启用。 |
| `export:@deepseek-ai/dsh-api-remotes:./client` | Client `ctx.remote` 装配及类型汇集 | `packages/api/remotes/src/client/index.ts`; `packages/api/remotes/package.json`; `packages/api/gateway/src/client/index.ts` | `client-call-remote` | included；现有 namespace 的调用面；新增 namespace 还须进入 assembly。 |
| `export:@deepseek-ai/dsh-typert-protocol:.` | `TypertRemoteService`、`Remote`、`RemoteError` | `packages/typert/protocol/src/index.ts`; `packages/typert/protocol/src/remote-error.ts` | `host-publish-remote` | included；Host 方法声明和错误契约的公开入口。 |
| `task:docs/cookbook/adding-a-remote-api.md:1` | 新增 Remote API | `docs/cookbook/adding-a-remote-api.zh.md`; `packages/typert/generator/src/workspace.ts` | `host-publish-remote` | included；完整任务需要 owner、生成、assembly、Client 调用和两侧验证。 |
| `task:docs/cookbook/adding-a-settings-card.zh.md:1` | 即时配置表单和 Web 页面 | `docs/cookbook/adding-a-settings-card.zh.md`; `packages/client/ui-settings-web-search/src/client/index.ts` | `client-contribute-slot` | merged；表单契约由 Host 配置主题拥有，本组拥有 Web 贡献步骤。 |

## 特别边界

- `packages/client/tsdown.client.ts` 是目标仓库内共享构建预设，未作为独立 npm 包导出。外部插件不能直接使用其相对路径；要独立发布 Web 半侧需复刻兼容的 lazy-CJS factory 构建链，或先在目标 workspace 内按既有 preset 实施。
- `packages/typert/generator/src/workspace.ts` 对声明 `./typert`、`./remote` 却没有 `@Remote` 方法的包报错。仅声明导出路径不构成可用 Remote 端点。新增 Remote namespace 也不能只发布 owner；必须纳入 Client assembly 和 Profile，并核查生成产物。
- 本组尚未执行独立消费项目真实 Web/Remote 组合。此处的源码与测试定位是契约证据，不应被写成已完成运行验证。
