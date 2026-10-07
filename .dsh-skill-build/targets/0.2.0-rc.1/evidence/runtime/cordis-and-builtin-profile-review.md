# Cordis 与内置 Profile 裁决批次

目标：`dsh-v0.2.0-rc.1`，commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。

## 本批核对

- `vendor/cordis/package.json` 与 `src/index.ts`：根入口导出 Context、registry、fiber、service、events；`./src/*` 是附加源码路径，不能将其中未重导出的实现自动当作常规根 API。
- `vendor/cordis/src/context.ts`、`registry.ts`、`reflect.ts`、`service.ts`、`fiber.ts`、`events.ts`：核对 `Context` 代理、插件形态与注入、服务提供与 isolation、effect 逆序清理、Fiber await/update/dispose、事件监听和派发。`docs/cordis-api` 仅用于二次定位。
- `packages/boot/app-boot/src/profile.ts`：核对 `acp`、`web`、`headless`、`sdk` 使用 base 加自身层；`sdk-minimal` 只有自身层。
- `packages/bundle/{acp-app,headless,sdk-app,sdk-minimal,web-app}/package.json` 及各自 `cordis.patch.yml`：核对 bundle patch 声明与关键挂载差异。`web-app/package.json` 另列有序 preset patch。

## 账本结果

- `package:@deepseek-ai/cordis` 进入 `cordis-core`，由独立的 API reference 承接；当前已从公开对象和成员底账裁决 Context、Plugin、Inject、Service、Fiber、EventOptions、ValidationError 中与本任务直接相关的部分，其余成员与根导出符号继续保持 pending，不将此批次误报为完整 API 审核。
- 五份内置 bundle 的六个 composition manifest 候选合并到 DSH Profile 入口，逐项记录层顺序与特殊前置。此处裁决是配置及装载路径归属，不声称已逐个启动这些 Profile。
- 目标教程的“第一个插件/编写插件”标题作为已验证工具插件任务的发现线索；目前工具插件的独立 Profile 装载已在 `evidence/tests/greet-consumer-verification.md` 记录。通用服务插件、事件及更新路径尚未进行独立消费验证。

## 后续核查

继续展开 Cordis 根入口余下符号、直接成员与声明合并。专门核查事件与服务生命周期在消费项目中的行为，再扩展 Loader、Client 和 Remote 等侧的插件路径。生成产物仍未冻结或替换。
