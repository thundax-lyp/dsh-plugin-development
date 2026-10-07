# rc.1 Scope 注册表作者任务

目标 `dsh-v0.2.0-rc.1` / `4878cdabd87d4041bdaff61d04c966883b9fd07a`。`packages/core/scope/src/index.ts` 公开 `ScopeKey/createScope/scopeOf/scopeTarget/bindScopeParent`，`src/store.ts` 公开 `ScopedLayers/NamedEntries/AnonymousEntries/ScopeLayer`。第三方 Registry 可把 scope 可见性、effect ownership 和层叠查找绑定到一次注册，建议 owner `references/api-scope-registry.md` 的 `对象类型与成员`，完整任务 `references/how-to-build-scoped-registry.md`。`./invariant` 是可选诊断 plugin，非 Registry 注册前置。

隔离 `evidence/tests/scope-registry-consumer/` 从 npm 安装 `@deepseek-ai/dsh-scope@0.2.0-rc.1`、Cordis 4.0.4、TypeScript 6.0.3；`npm install --ignore-scripts --no-audit --no-fund`、`npm run build`、`npm run smoke`、`npm pack --dry-run --json` 通过。真实 Cordis Context 的全局、父、子 scope 同名覆盖分别得到 global/parent/child；子表内重复插入抛错且旧值不丢；双次 undo 只通知一次并回收空 overlay；Scope dispose 后回退父/全局；包干运行 JS/d.ts。

未运行 Session replay、Agent standing preset 或 scoped event carrier dispatch；此例仅是进程内借用值的 Registry，不是持久业务事实源。
