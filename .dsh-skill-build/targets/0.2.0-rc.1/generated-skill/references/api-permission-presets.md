# 执行权限预设

## 适用范围与入口

目标 `dsh-v0.2.0-rc.1` 的 Host 服务 `@deepseek-ai/dsh-permission-presets` 将 sandbox mode 与 approval policy 组合成用户可选择的预设。base bundle 挂载 `ctx.permissionPresets`；Web 选择器另由 web-app bundle 的 Client 行提供。自定义 Profile 必须先挂载有 `sandboxMode` 的 shell executor、`approval`、`sessions`、`sessionProjections`。此入口不管理外部服务凭证，见 [凭证入口](api-credentials.md)。

## 契约与运行语义

`PermissionPresetService.Config` 的 `presets: Record<string, PresetSpec>` 默认包含 `workspace-write` (`workspace-write` + `ask`) 与 `danger-full-access` (`danger-full-access` + `never`)；`defaultPreset: Volatile<string | undefined>` 缺省时按组合的 sandbox/approval 默认值推导。`custom` 是无法匹配的派生值，`auto` 保留给单次审查集成，不能作为配置表键。服务创建时校验保留名、shell 的 confining 能力和默认项；失败会阻止插件装载。

`set(session, name)` 先记录 `permission/preset` 再通过规范 setter 记录实际改变的 `sandbox/mode`、`approval/policy`。同名有效预设再选一次不追加事件。执行仍由 sandbox 与 approval 的各自状态控制，`permission/preset` 仅保存用户选择意图。`current(session)` 从 `permissions` Session projection 读取有效选择，不匹配则返回 `custom`。`names` 列出可选项；`catalog()` 为进程级快照，`permission-presets/catalog-changed` 发生后应重新读取。`resolve(name)` 返回 bundle，`optionOf(name)` 给界面名称与说明。`defaultPreset` 是新 Session 的默认选择。

`registerAuto(admit)` 是固定 `auto` 集成钩子，返回异步 disposer；`admit` 同步执行，在选用/恢复 Auto 之前决定是否允许。普通插件不能通过它注册任意新预设。`/permission` 命令是已装载 command registry 时的实际写入路径；`catalog` 的 Remote 与当前 Session 的 `permissions` projection 共同支持 Web 展示。

## 对象类型与成员

| 对象或方法                                 | 类型与语义                                                                                                                                                                   |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PermissionPresetService`                  | `names` 给注册名，`resolve(name)` 得完整 sandbox/approval 规格，`optionOf(name)` 给展示选项，`catalog()` 给当前可选目录；`set` 持久选择，`registerAuto` 归属可用性自动判定。 |
| `PresetSpec`                               | 必需 `sandbox: SandboxMode`、`approval: ApprovalPolicy`；可选 `name?: string`、`description?: string`，仅展示用途。                                                          |
| `Config`                                   | `presets: Record<string, PresetSpec>`，`defaultPreset: Volatile<string \| undefined>`。                                                                                      |
| `PermissionCatalog`                        | `options: PresetOption[]` 当前可选，`defaultOptions: PresetOption[]` 未来 Session 可默认选项，`defaultPreset: string`。                                                      |
| `PresetOption`                             | `value: string`、`name: string`、`description?: string`；`custom` 可展示但不可切换。                                                                                         |
| `PermissionSelection`                      | `currentValue: string`，`permissions` Session projection 的线视图。                                                                                                          |
| `set(session, name): void`                 | 未知项抛错；写入 Session 事件。                                                                                                                                              |
| `registerAuto(admit): () => Promise<void>` | 调用者拥有 disposer；重复注册失败。                                                                                                                                          |

## 生命周期与状态

新 Session 创建时服务固定初始选择与两个 knob；恢复已有 Session 时补全缺失事实，保留原有效设置。`permission/preset` 与两个 knob 事件进入 Session 日志，重启后由 projection 重放。Auto 选择恢复必须有仍活跃的集成并经过 admit。目录变化只发无 payload 事件，不修改 Session 序号。

## 失败、权限与边界

预设只是两个执行控制的组合，不能绕过工具自身的最终 guard，也不代表外部授权。单独改动一个 knob 可让当前值变成 `custom`。`set` 对未知项抛错；未挂载投影、无约束 shell、保留名或默认项无效均失败。更宽权限的切换是否需人工审批由实际配置和调用路径决定，不应在插件里自行写 Session 事件模拟选择。

## 验证

源码及测试：`packages/interaction/permission-presets/src/{index,types}.ts`、`tests/{permission-presets,projection,invariant}.spec.ts`。在真实 Profile 验证 catalog、`/permission`、Session 事件、重启恢复与拒绝路径；Web 还需浏览器选择器实测。这些 end-to-end 路径尚未运行。

## Web Client 组合

`@deepseek-ai/dsh-client-ui-permission-presets` 的 Host 根入口是空插件，浏览器实现在 `./client:apply`；目标 Web bundle 用裸包名 Loader 行装载它。该 Client 插件同时提供 General 页的未来新 Session 默认选择和当前 Session 的选择器：前者经 Settings revision 更新 `permission.defaultPreset`，后者调用当前 Session 的 `/permission` 命令并等待投影确认。Client catalog 读取按 Connection generation 围挡，重连和 Host 通知后重新获取；`custom` 是现有 knob 组合的派生展示状态，不能当成可写预设。完整配置和验收路径见[权限预设 UI 组合](how-to-compose-permission-preset-ui.md)。本次尚未运行真实浏览器保存与切换。
