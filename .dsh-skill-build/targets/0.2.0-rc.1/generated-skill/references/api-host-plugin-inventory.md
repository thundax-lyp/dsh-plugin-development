# Host 插件清单快照

## 适用范围与入口

目标 `dsh-v0.2.0-rc.1`。`@deepseek-ai/dsh-host-plugin-inventory` 导出 `readPluginInventory(ctx)`，逐次读取当前非 group Loader entries；默认 `PluginInventoryGateway` 以 `list()` 暴露同一只读快照。它适合可信 Host 插件显示当前 Profile 的装载状态。完整最小消费见[读取 Host 插件清单](how-to-read-host-plugin-inventory.md)。变更配置属于插件管理服务，不能通过 inventory 写入。

## 公开对象与成员

| 对象                                              | 成员与语义                                                                                                                                                                                      |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `readPluginInventory(ctx)`                        | `Promise<PluginInventorySnapshot>`；要求 Context 已有 Loader，每次直接读取 Loader；没有独立缓存或配置写入。                                                                                     |
| `PluginInventoryGateway`                          | 只读 Remote service，`list()` 调用同一读取函数；目标发布声明未给 Cordis `Context` 增补 `pluginInventory` 字段，Host TypeScript 消费者可用导出函数，或在挂载后以明确服务类型获取。               |
| `PluginInventorySnapshot`                         | `entries` 按 Loader 顺序；可选 `agentPresets` 为已组成 roster 的行；`managementAvailable` 只表示 pluginManager service 存在。                                                                   |
| `PluginInventoryEntry`                            | `entryId` 是 Loader 树身份，`moduleName` 是导入 specifier，`enabled` 含祖先 group 有效状态，`fiberPhase` 为 pending/loading/active/failed/unloading 或 `null`；可选 `meta` 来自本地包显示信息。 |
| `AgentPresetPluginGroup` / `AgentPresetPluginRow` | 预设 composition 与有效启用状态；未挂载的条件表达式可为 `'conditional'`，运行 fiber 不存在时 phase 为 `null`。                                                                                  |
| `pluginEntryId(value)`                            | 给已有 Loader entry ID 加品牌类型；不查找或创建 entry。                                                                                                                                         |

`PluginEntryId` 是 entry ID 品牌，`PluginFiberPhase` 是阶段联合，`PresetPluginEnablement` 包含布尔值和条件状态。`AgentPresetPluginGroup.id` 标识预设组，组内包含插件行；这些类型只描述快照。

## 权限、生命周期与恢复

`list` 是时间点快照，下一次调用可能不同；`fiberPhase` 不是 durable 历史，`enabled` 也不保证服务已就绪。`managementAvailable` 不代表当前请求者有变更权限。通过 Remote/HTTP 向 Client 暴露时，应检查请求者能否查看该 Profile 的插件包和状态；不要把 Gateway 的只读性质误认为无需授权。`PluginInfo` 等管理附加字段由 [插件管理](api-plugin-manager.md)拥有。

Provider 由 Cordis fiber 卸载；调用者不持有内部 Entry/Fiber 对象。`meta` 读取本地包信息，不执行目标插件；缺少可选 `pluginPackages` 或 `agentPresets` 时字段按类型省略。重启后重新调用 `list`，不要以旧 `entryId`/`fiberPhase` 作为持久决策。

## 验证

精确 tag `packages/host/plugin-inventory/src/index.ts` 与 `src/types.ts` 定义实现和类型，`tests/inventory.spec.ts` 组合真实 Loader，覆盖 disabled、metadata、preset 与阶段映射。独立消费应以目标 npm 声明编译并装载 Loader/Gateway，查询一次当前快照；权限和跨重启行为须在具体部署 Profile 测试。
