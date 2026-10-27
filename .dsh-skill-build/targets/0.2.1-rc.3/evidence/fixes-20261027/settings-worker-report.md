# F4 / F5 修复与验证

版本 `0.2.1-rc.3`，精确 checkout `dsh-v0.2.1-rc.3`。只使用 skill-source 与 checkout，未读正式目录或 generated-skill 作为输入，未改共享账本或 runtime。

## 修复内容

- F4：`client-ui-settings.md` 与 `client-ui-settings-plugins.md` 增补自己的 volatile Config 与 companion namespace 两种起点，区分 `settings.plugins.tab` 和真正的 `plugins.item`；`whileServed` disposer 用 ctx.effect 归属，scope 为共享服务所有，页面只释放 form/slot。明确首次 edit/reset baseline revision、原子 mutate、失败保留草稿、discard 后重新建立 baseline、保存中禁止编辑及卸载无晚到 UI。新增完整 `client-settings.md` 包、schema、TypeScript/TSX、factory 构建、patch、装载步骤和验证判据。
- F5：两份 Worker HOW-TO 移除套用 MCP/bundle install 的流程，区分构建期 packer 库、依赖完整 checkout 的 CLI、Worker 与页面连接。新增 `worker-image.md` 独立根 API 完整库 smoke、公开 VFS module 执行和 overlay、完整 Web preview 命令、Vite Worker 引入、connect 后 shell 启动与 terminate/重载边界。纯库 smoke entries=[] 明确不冒充完整 Host 镜像；完整启动保留默认 assembly entries 并依赖标准 roster/配置/installation。

## 实际验证

1. `node evidence/fixes-20261027/settings-worker-check.mjs`：PASS。脚本从修改后的实际 Markdown 提取 package、tsconfig、Host/Client、build 与 pack 内容；独立 consumer 链接精确 checkout 构建的包，真实 tsc 声明编译、esbuild lazy factory、Node 根公开 packer/runtime 镜像构建/解压/模块返回42/overlay字节断言全部通过。输出 hostBlocks=1，clientBlocks=1。无网络、模型或安装依赖行为。
2. `node --import ./checkout/node_modules/tsx/dist/esm/index.mjs evidence/fixes-20261027/settings-model-check.mjs`：PASS。直接运行目标版本生产 SettingsFormModel 实现；断言 edit baseline10 后镜像revision11，save仍用10；false冲突后草稿仍4；discard再edit以11为baseline；dispose移除订阅；迟到save成功不再向UI store发布。
3. 在 checkout 执行 `pnpm exec vitest run packages/client/ui-primitives/tests/settings-form-model.client.spec.ts packages/client/ui-settings/tests/while-served.client.spec.ts packages/client/ui-settings/tests/config-form.client.spec.ts packages/experimental/webworker-packer/tests/exports.spec.ts packages/experimental/webworker-packer/tests/profile-image.spec.ts packages/experimental/webworker-packer/tests/image-loadable.spec.ts`：6 files / 77 tests PASS，16.44s。

## 未覆盖

尚未执行本设置包的真实浏览器 Plugins页面、双窗口冲突或完整 Worker Web preview；生产模型和configForms行为测试、独立包编译与库镜像smoke不替代这些浏览器结果。Worker terminate不保证Host fiber优雅卸载，内存VFS不保证跨重启保存，文档已明确为目标产品边界。
