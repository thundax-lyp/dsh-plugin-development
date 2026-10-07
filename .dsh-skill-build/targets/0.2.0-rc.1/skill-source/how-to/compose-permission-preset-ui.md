# 如何把权限预设接入 Web 选择器

## 目标与前置

在 `dsh-v0.2.0-rc.1` 的 Web Profile 中让用户看到两条不同路径：General 设置页选择**以后新 Session 的默认预设**，当前 Session 的 composer 与 `/permission` 菜单选择**这一条 Session 的预设**。Host 配置、`set/current/catalog` 和 Session 事件以 [权限预设服务](api-permission-presets.md) 为准；Client 设置卡片的 Host describe/写入边界见 [Client 表单](api-client-settings-forms.md)。本教程使用目标版本已经发布的 `@deepseek-ai/dsh-client-ui-permission-presets`，不是要求插件重新实现其 picker。

所需 Host 组合：有 confinement 的 shell executor、`approval`、`sessions`/`sessionProjections`、`@deepseek-ai/dsh-permission-presets`、Remote Gateway 与 settings。所需 Web Client 组合：session controller、Connection、locale、commands、conversation、api-remotes、ui-settings、General 设置页及 `@deepseek-ai/dsh-client-ui-permission-presets`。正式 base/web bundle 已提供这些行；自定义 Profile 需要逐项确保。该 Client 包根入口只有空 Host `apply`，浏览器功能在 `./client`；Loader 必须用**裸包名**挂载 row 且构建好的 `lib/client.js` 可供 client-modules 加载。

## 实现步骤

1. 在 Profile 的 Host 部分给 permission 行提供配置，并保证 shell 与 approval 默认值能对应一个 preset，或明确给 `defaultPreset`。目标 base bundle 的一个有效配置是：

```yaml
- id: permission
  name: '@deepseek-ai/dsh-permission-presets'
  config:
    presets:
      read-only:
        sandbox: read-only
        approval: ask
      workspace-write:
        sandbox: workspace-write
        approval: ask
      danger-full-access:
        sandbox: danger-full-access
        approval: never
```

`custom` 是不匹配预设时的派生显示状态；`auto` 是由活动集成 `registerAuto` 提供的固定选择，两者不能写作普通配置表键。加入更宽权限的条目必须核对实际 sandbox 与 approval 策略，不能只加 UI 文案。

2. 在 Web Profile 装载 `@deepseek-ai/dsh-client-ui-permission-presets` 的裸包名 row：

```yaml
- id: ui-permission
  name: '@deepseek-ai/dsh-client-ui-permission-presets'
```

它的 `dsh.client.inject` 声明了相邻 Client 包。host row 只使 `./client` 可被扫描，实际浏览器组合还要有上述服务。Client `apply` 在 `settings.general.item` 注册 id `permission` 的默认预设行，在 `conversation.input.permission` 注册当前 Session 选择器，并装饰既有 `/permission` 命令。它没有注册新的 Host 权限策略。General 行通过共享 Settings describe 镜像读 `permission` namespace，`select` 只对 `defaultPreset` 做有 revision fence 的 `settings.mutate`；当前 Session 选择通过 `live.command('/permission <preset>')`，由 Host 命令调用权限服务，规范 Session projection 才确认结果。不要从本地按钮选中态推断已持久切换。

3. 运行时打开 General 设置检查新 Session 默认值，修改并确认 Host Profile patch 与下一条 Session 的初始 `permission/preset`、`sandbox/mode`、`approval/policy`。打开现有 Session，使用 composer 菜单或 `/permission <preset>`；检查该 Session 的 `permissions` projection 与三种事件，确认设置页默认值没有被这一操作改动。`danger-full-access` 和活动 `auto` 在已发布 UI 中需要显式风险确认；自定义 Client 不能跳过相应产品交互而直接写事件。

## 验证与完成边界

代码证据：`packages/bundle/base/cordis.patch.yml` 的 permission 行、`packages/bundle/web-app/cordis.patch.yml` 的 `ui-permission`/settings 行、`packages/client/ui-permission-presets/src/{index,client/index,client/catalog,client/settings-store,client/PermissionRow,client/PermissionSelect}.ts*`。目标版行为测试包括 `packages/client/ui-permission-presets/tests/{browser-plugin,settings-store,permission-presets-row,permission-select,catalog}.client.spec.*` 和 Host `packages/interaction/permission-presets/tests`。本次只核查源码与测试断言，尚未运行真实 Web Profile/浏览器。隔离配置检查与限制记录在创建工作区 `evidence/runtime/settings-ui-review.md`。

验收时分别观察：默认值更改只影响新 Session；当前 Session 选择写 Session 日志；catalog 通知或 Connection generation 更替后菜单重读；Host 不提供 permission namespace 时 General 行隐藏；Host 不提供 Session permission projection 时当前选择器隐藏；只读/非 loopback 设置不允许写入。真实浏览器还应确认确认弹窗、键盘与无障碍文案。
