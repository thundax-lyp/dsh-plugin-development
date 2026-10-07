# Scope 注册表与分层查找

## 适用范围与入口

目标 `dsh-v0.2.0-rc.1` 的 `@deepseek-ai/dsh-scope` 是作用域库。注册表作者可用 `createScope` 的 Cordis Context、`ScopedLayers`、`NamedEntries` 或 `AnonymousEntries` 建立全局与精确 scope 的 effect-owned 贡献，并按 scope 父链读取。它不是单独可装载的业务 service。完整例子见[建立带覆盖关系的标签注册表](how-to-build-scoped-registry.md)。

## 对象类型与成员

| 公开对象                                                      | 成员与语义                                                                                                                                                                                                                                          |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ScopeKey` / `createScope` / `Scope`                          | key 是对象身份；`createScope(ctx,key,{parent?})` 创建继承依赖 API 的 scoped context。`Scope.ctx` 用于注册，`dispose()` 等待 fiber quiescence，`rawDispose` 是精确 Cordis disposer。                                                                 |
| `bindScopeParent` / `scopeParentOf` / `scopeChainOf`          | 父链绑定只允许原始 binding rebind，环与重复绑定抛错；`scopeChainOf` 最近 scope 在前。rebind 只适用于旧 scope 内容不再被保留的组合边界。                                                                                                             |
| `NamedEntries<V>`                                             | `insert(name,value)` 在同一表内拒绝重复，返回幂等 undo；`get/has/keys/entries/values/isEmpty` 读取借用值，保留插入顺序。duplicate error 由调用者构造。                                                                                              |
| `AnonymousEntries<V>`                                         | `append(value)` 为每次追加分配独立身份，返回幂等 undo；同值可重复，`values/isEmpty` 保留顺序。                                                                                                                                                      |
| `ScopedLayers<L extends ScopeLayer>`                          | `global` 是预建全局层；`peek(scope)` 只读现有精确层，`chainLayers(scope)` 从远祖到最近层，`merge(scope,pick)` 在全局后按链覆盖同名项；`effect(ctx,action,{label,notify?})` 将同步 mutation/undo 交给注册 Context 的 fiber，通知版本并在空层时回收。 |
| `ScopeLayer`                                                  | 聚合层必须实现 `isEmpty()`；所有表都空时返回 true，供 `ScopedLayers` 回收精确 scope。                                                                                                                                                               |
| `scopeOf` / `scopeTarget` / `isScopeCarrier` / `carrierKeyOf` | 读取注册 Context 的 tag，并创建事件路由 carrier；unscoped 监听者全局可见，祖先可见后代事件，后代不反向接收祖先。carrier 不暴露原始 subject 字段。                                                                                                   |

## 生命周期、失败与边界

注册与查找都用同一个 scope key 身份；不能按字符串“相等”合并 key。`ScopedLayers.effect` 对 action 抛错会撤销刚建的空层；成功后先拥有 undo，再通知。调用方必须把可变化的注册和资源附着在同一 scoped Context 上；直接写 `NamedEntries.insert` 并遗失 undo 会泄漏贡献。`NamedEntries` 的值是借用引用，不会深克隆或持久化；跨重启所需的业务事实仍需 Session/持久层记录。`merge` 的同名覆盖顺序是 global → 远祖 → 近祖 → 本 scope，只有**同一表**重复名失败。scope.dispose 与单项 undo 都幂等，但不能在还持有旧结果的会话中随意 rebind parent。

## 验证

精确源码 `packages/core/scope/src/{index,store}.ts` 与相应目标测试。隔离 `evidence/tests/scope-registry-consumer/` 用 npm rc.1、TypeScript 6.0.3 编译并通过真实 Cordis Scope 注册/覆盖/重复失败/卸载 smoke；见 `evidence/runtime/scope-registry-review.md`。未运行业务 Agent、Session replay 或 scoped event dispatch。
