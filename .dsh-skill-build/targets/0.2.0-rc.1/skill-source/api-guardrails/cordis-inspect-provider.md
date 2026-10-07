# Host Cordis Inspect Provider

## 适用范围与入口

目标 `dsh-v0.2.0-rc.1`。`@deepseek-ai/dsh-cordis-host-runner` 的 `CordisInspectRegistryService` 是 `cordisInspect` Host 服务；第三方 Host 插件可调用 `ctx.cordisInspect.register` 提供模型可查询的只读能力目录。`@deepseek-ai/dsh-tool-cordis` 的 inspect 工具是模型可见入口，须在实际 Profile 中另行装载；注册 provider 本身不安装工具。完整示例见[注册 Host Inspect Provider](how-to-register-cordis-inspect-provider.md)。动态 `define/run/update/stop` 插件执行系统不属于本任务。

## 公开对象与成员

| 对象                                                            | 成员与契约                                                                                                                                                                                                                                                                                       |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `CordisInspectRegistryService` / `ctx.cordisInspect`            | `register(registration)` 注册 Host provider 并返回幂等 disposer；`list()` 返回 Host 与 Client manifest；`query(platform,providerId,methodName,input,agent,signal)` 验证 schema 和取消后执行。`syncClientManifest`、`resolveClientQuery` 是 Client 跨页同步/回执路径，普通 Host provider 不调用。 |
| `HostCordisInspectProviderRegistration`                         | `manifest` 说明 id、description、methods；`query(method,input,{agent,signal})` 执行已声明方法并返回 JSON 值。                                                                                                                                                                                    |
| `CordisInspectProviderManifest` / `CordisInspectMethodManifest` | Provider id 同一平台唯一；方法名同一 provider 唯一；每个方法给非空描述及可支持的输入/输出 JSON Schema。                                                                                                                                                                                          |
| `CordisInspectProviderView`                                     | `list()` 行带 `platform:'host'                                                                                                                                                                                                                                                                   | 'client'`，供模型选择拥有者。 |

`CordisInspectPlatform` 是上述平台联合；manifest 中的 `id`、`description`、`methods` 与方法的 `name`、`inputSchema`、`outputSchema` 都由 Registry 校验。

## 所有权、权限与事实

插件把 `register` 返回的 disposer 交给 Cordis effect；卸载后不再接受新查询。Registry 验证 manifest、输入、输出和信号，但不会替 provider 判断该 Agent 对所查数据的权限；query 必须按 `context.agent` 身份和 scope 做领域授权，在异步读取过程中尊重 `context.signal`。只返回 lossless JSON，避免把凭证或私有资源放进模型可见结果。不要通过 inspect 方法执行写入；更改状态要使用独立的、明确授权的工具或服务。

`list` 是当前进程目录，不是 Session 历史。模型若必须在恢复后记住查询结论，应通过 owning 工具的规范结果写入 Session；Provider 注册和内部动态 runner 的 `DynamicCordisRun*` 状态不能替代日志事实。Client inspect 查询需要 Client manifest 与跨页回执，不可把 Host 的 `register` 误用于 Client。

## 验证

精确 tag `packages/extensions/cordis-host-runner/src/inspect-registry.ts` 定义注册、schema、查询和卸载，`src/types.ts` 定义 wire manifest。隔离消费应编译并观察注册/list/重复 id/注销；真实 Agent 和模型工具查询须在装载 `tool-cordis` 的完整 Profile 中验证权限、取消和 Session 结果。
