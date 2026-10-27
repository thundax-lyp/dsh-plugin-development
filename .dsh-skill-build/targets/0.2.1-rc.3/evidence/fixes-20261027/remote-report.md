# F3 自建 Remote 修复与实测

目标版本为 `0.2.1-rc.3`，事实来自精确 checkout。修改素材仅为 `skill-source/examples/core-remote.md` 与 `skill-source/how-to/core-remote.md`，未读取正式或 generated Skill 作为输入，未修改 checkout 的跟踪文件。

## 资料修复

完整例现在包含两包共十文件：Host 入口、共享错误类型、Host package/tsconfig/tsdown，以及 Client Node入口、Client assembly、Client package/tsconfig/tsdown。给出根 Host/Client aggregate、paths、先生成后消费的顺序、Profile entry与既有基础服务复用、包分发边界、失败回滚和逆序卸载。HOW-TO 在开头区分源码 workspace 自建、消费已有生成包及独立目录生成限制。

从真实运行发现并修复以下契约缺口：

- 此版本 `typertPlugin` 的 package 模式生成全部被发现对象，可能因非 contributor 未导出反射而失败；例使用与根构建一致的 workspace Host face，只生成显式 contributor。
- 单一 `./remote` paths 指向 `.d.ts` 导致 bundler误读声明，指向 `.js` 导致 TS 丢失声明；改用 workspace包链接和 manifest 条件导出。
- 父 assembly 仅注入 `remote`，挂载后直接读取 `remote.localNotes` 被 Cordis 拒绝；改为挂载完成后等待声明依赖的子 `ctx.inject` scope，避免把自己将创建的 namespace写进父 inject造成依赖环。
- 生成 Remote 声明不复制自定义错误详情表；新增共享 `./types` 子路径并在两侧类型导入，Client按 code读取 details.field 经过真实编译。

## 实际执行

执行 `node evidence/fixes-20261027/remote-check.mjs`（从仓库根传完整 target相对路径）。脚本支持 `--example <path>`，验证器可让它从待发布 Markdown提取相同文件。脚本提取十文件，识别五个 Host TypeScript块与一个 Client块；其中两个 Host块是实际被 Node/tsdown执行的构建配置。其余块随各自项目编译，不借手写Remote stub。

脚本将精确 checkout复制至忽略的 `consumer/remote-workspace`，复用本地依赖与构建前置；用本地符号链接实现新workspace包链接，不联网、不运行依赖安装、不修改源checkout。真实运行 Host `tsc -b`、tsdown加原版Typert生成器、Client `tsc -b`、原版 `clientBundle`。生成新LocalNotes的四个反射文件，Client工厂真实内联生成的contribution。

运行部分使用真实 `boot()`/Cordis Loader加载隔离配置，真实 `typert-loader`按新包manifest注册新反射；Client由生产 `ClientModuleSystem`导入刚构建的lazy工厂，再挂入Client Cordis与Gateway。进程内RPC将生成的Client调用送至生产Host Gateway，owner Peer固定在Host创建。测试断言没有自行返回成功布尔值而绕过行为。

最后一次执行退出0，输出五个Host块、一个Client块；十一项断言全部通过：新契约生成、Host Loader、Client lazy factory、contribution挂载、有效回声、错误输入拒绝、业务错误及details、预先取消、执行中取消、Client卸载、Host卸载。结果保存在 `remote-runtime-result.json`。

## 尚未覆盖

此测试不是浏览器WebSocket、非owner授权矩阵或完整浏览器/重连验证。没有执行CLI bundle安装/卸载或发布包registry安装；Profile验证是隔离的真实boot配置树，而不是完整默认Web Profile。新增包链接由测试设施本地建立，未验证生成新pnpm锁文件的install流程。文档说明真实产品须继续验证这些部署路径，且不把它们写成已经完成。

精确代码归属：`packages/typert/generator/src/{workspace,tsdown-plugin,worker,emitter}.ts`、`packages/api/remotes/src/client/index.ts`、`packages/client/tsdown.client.ts`、`packages/typert/loader/src/index.ts`、`packages/api/gateway/src/client/index.ts`、`vendor/cordis/src/{fiber,utils}.ts`。这些路径均指目标checkout。
