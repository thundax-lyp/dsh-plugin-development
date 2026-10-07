# `dsh-v0.2.0-rc.1` Remote API 裁决

目标 commit：`4878cdabd87d4041bdaff61d04c966883b9fd07a`。

## 公开入口与权属

- `packages/typert/protocol/package.json` 与 `src/index.ts`：`TypertRemoteService`、`bindTypertRemote`、`Remote`、`RemoteScope`、`RemoteError`、`RemoteResult`、`RemoteStream` 和相关类型是 Host 声明/共享协议入口。`src/remote-error.ts` 证实错误以 code/details 识别，`cause` 只在同进程保留。
- `packages/api/gateway/package.json`：根入口是 Host，`./client` 是 Client；`src/index.ts` 和 `src/client/index.ts` 分别拥有 dispatcher 与具体 `ctx.remote` 方法挂载。Connection 承担 RPC 载体。
- `packages/api/remotes/src/client/index.ts`：Web 应用显式导入固定的 `/remote` 生成贡献并挂载；这不是运行时自动扫描任意外部业务包。`src/index.ts` 是 Host 转发事件 assembly。
- `packages/typert/generator/src/workspace.ts`、`emitter.ts`：Host 生成 `./typert` 和 `./remote` 的描述符、codec 与声明，校验包导出及发布文件清单。根 `package.json` 的 `build:lib` 先 Host 后 Client。

## 语义边界

- `docs/api-gateway.md` 和 `docs/cookbook/adding-a-remote-api.md` 给出任务线索；与代码交叉核对后保留的条件是：方法需公开非静态实例实现、参数不可用 optional/default/rest/destructuring、取消 signal 在尾部、复杂 Host 对象需 lookup；Client 必须显式挂载生成贡献。
- Client Remote 的业务失败是 `RemoteResult` 错误分支；未装配方法等错误仍可 reject。`RemoteErrorDetailsMap` 由抛错 owner 声明合并。普通通知不保证重放。
- 目标 checkout 无依赖，未运行它的完整 `build:lib`。隔离消费工程的限定验证如下；仍不能把 TypeScript 与 descriptor 存在当作真实 Gateway 调用。

## 隔离生成与编译

工程：`evidence/tests/remote-notes-consumer/`。安装发布的 `@deepseek-ai/cordis@4.0.4`、`@deepseek-ai/dsh-typert-protocol@0.2.0-rc.1`、`@deepseek-ai/dsh-typert-generator@0.2.0-rc.1`、`@deepseek-ai/dsh-api-gateway@0.2.0-rc.1` 与 TypeScript 6。`packages/notes/` 模拟目标仓库可被 Host 聚合 tsconfig 发现的包，不修改目标 checkout。

1. 最初 HOW-TO 的单文件 Host 骨架用发布类型通过 `tsc`，但生成器先报告 `publishes Remote artifacts but has no Remote methods`：外部工程的已安装协议声明不在生成器的 workspace 注册表内，decorator identity 无法识别。目标生成器测试夹具也用显式协议类型 shim 解决这一隔离条件；复制该**目标 tag 自带的测试 shim**到本工程并在生成工程 tsconfig 指向它后，生成器识别 `@Remote`。
2. 接着生成器报告 `Remote boundary type NoteRow must be exported from a public non-root type subpath`。这是真正的 HOW-TO 缺陷；把 `NoteRow` 移到 `src/types.ts` 并添加 `./types` 出口后解决。HOW-TO 已同步修正。
3. `node generate.mjs` 输出 `@fixture/notes-controller` 的 Host artifact 和 Remote contribution。`packages/notes/lib/typert.remote-client.d.ts` 包含 `notes.list(): Promise<RemoteResult<NoteRow[]>>`；模块运行时导入输出 descriptor `@fixture/notes-controller#notes/list`。
4. `tsc -p tsconfig.json` 对修正后的 Host 代码使用**发布协议声明**，退出码 0；`tsc -p packages/notes/tsconfig.emit.json` 产出公开类型子路径声明，退出码 0；`tsc -p tsconfig.client.json` 对生成贡献的 value/type import、`ctx.remote.$mount` 的异步 disposer 和 `ctx.remote.notes.list()` 调用使用发布 Gateway/协议声明，退出码 0。

主代理把调用片段拆成独立 `client-consumer.ts`，显式类型导入同工程的 `client-assembly.ts`；再次运行 `tsc -p tsconfig.client.json` 退出码 0。这验证 HOW-TO 的调用方声明选择，而不是只依赖 assembly 文件自带的类型上下文。

这些验证覆盖 Host 形状、生成器门禁、生成声明与 Client 类型装配。隔离生成时使用的测试 shim 不等于发布协议的完整生产编译面；Client 未加载真实 Web 模块，也未启动 Gateway 或调用 `/api/notes/list`。目标 checkout 的 `build:lib` 需要依赖安装及实际包纳入其 `packages/` 和 Host tsconfig；没有在目标 checkout 改动或运行。因此真实装载、权限、网络失败、取消、卸载和浏览器结果仍是待验证边界。
