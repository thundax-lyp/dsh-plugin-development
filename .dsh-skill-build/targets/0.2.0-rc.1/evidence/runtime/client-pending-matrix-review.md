# Pending Client entry/object/member 裁决矩阵

目标 `dsh-v0.2.0-rc.1`，commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。机器可读文件为 `client-pending-entry-object-member-matrix.json`；它是**待合并建议**，未修改 `coverage.json`、`api-surface.json`、manifest、route 或 source-map。每条记录含 package、精确 export subpath、目标 package.json、推荐决定、owner、section、插件任务和理由；其 `objects` 列出仍 pending 的公开 symbol 和 member，逐级标记建议。矩阵包含 59 个相关 package 的 111 个 pending subpath、610 个 pending object、900 个 pending member；其中有固定 UI Loader 根入口和 generated Remote subpath，因此数量多于“41 个剩余 Client 功能包”。

## 主要结论

- `packages/client/ui-commands/src/client/{index,service,contract}.ts` 的 `ctx.commandUi.register/decorate/dismiss` 是此前 broad triage 漏掉的真实第三方 Client 注册面。新增 `api-guardrails/client-command-ui.md` 和 `how-to/add-client-command.md`，最小 `demo_help` 示例从 HOW-TO 原样抽出，在隔离消费包 `evidence/tests/client-command-consumer/` 用 npm `0.2.0-rc.1` 声明编译通过。未运行真实 slash 菜单浏览器 smoke。
- `packages/client/connection/src/client` 的 `ConnectionHandle`/generation 状态和 `packages/client/ui-slots/src/index.ts` 的核心声明已在各自 reference 描述，矩阵对这些精确对象给 `included` 建议。其余大量 type helper/public class 虽然公开，先 `merged` 到同任务，避免把未逐成员解释的符号误报为 included。
- `ui-commands`、`ui-session` 等多数 `src/index.ts` 是空 Host Loader `apply()`；普通插件不从它们获得 Host 服务。`./client` 固定业务视图通常是 shared slot/Session/Remote 服务的消费者，其调用 `ctx.slots.register()` 不意味着该包提供另一个业务注册 API。其公开组件类型仍保留在矩阵的对象清单里。
- `client-product-analytics` 的事件集合、Desktop 启用策略和生成 Remote 是产品固定面，无通用 provider 注册；建议排除普通插件任务。`client-web` 的 boot/injections 是应用引导解释器，外部 Client 扩展仍走包元数据与 Loader。`host-frontend-static` 则并入 Web ingress/Profile 部署任务。

## 核查与限制

矩阵从当前 `api-surface.json` 仅抽取 `pending` 的 Client/host-frontend-static entry/object/member，再以精确 checkout 的 package.json 和源码判定插件任务。对每条非排除记录检查目标 owner 文件存在及其 section 标题存在；若旧建议标题与实际不符，使用该文件首个稳定 `##` 标题，因此 owner/section 表示**可路由建议**，不是逐对象正文已覆盖证明。合并者仍须在标为 `included` 前检查目标 section 中的 symbol 和所有 included member，并核实其任务例子。`ui-session/client` 暂标 `merged`，因为其 `UiSession`/source/pending 类型尚无自包含逐成员页；不得从矩阵推断 Session UI 扩展已经验证。

隔离命令 UI 包首次误在仓库根执行 `npm install`，npm 依赖求解退出 1，未得到构建结果；随后在正确的 `evidence/tests/client-command-consumer/` 目录执行安装与 `npm run build`，两者退出 0。此 TypeScript 检查不验证 Client Loader、浏览器交互、Host 命令 catalog 碰撞和卸载。此前 Client slot、resource、settings、theme、input-trigger 等单项运行证据保持各自边界，不由矩阵自动扩大。
