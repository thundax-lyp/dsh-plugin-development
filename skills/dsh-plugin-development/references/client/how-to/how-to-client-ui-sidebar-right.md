# 交付右侧栏页面与资源查看器

## 接入 ui-sidebar-right

目标结果：自有页面或资源查看器能经类型注册与 keyed Body 在右侧栏被打开和关闭。

### 目标与前置

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。任务是让用户在现有右侧栏打开插件内容，保留 DSH 的分栏、浮窗、会话隔离与关闭路径。依赖 Web framework、ui-sidebar-right、ui-renderer；按 [类型定义](../api/api-client-ui-sidebar-right-tab-registry.md)、[tab 信息与动作](../api/api-client-ui-sidebar-right-slots.md)、[导航控制器](../api/api-client-ui-sidebar-right-service.md)、[参数映射](../api/api-client-ui-sidebar-right-params.md) 和 [occurrence](../api/api-client-ui-sidebar-right-tab-domain.md) 组合。

### 实现步骤

1. 选择页或资源 viewer。页只声明 kind，用户用引导入口或 openTab 打开；资源 viewer 声明 dsh-resource:// 地址模式，经 openResource 进入。完整页实现和外部包构建见 [右侧栏页面示例](../examples/example-client-sidebar-page.md)。
2. Client inject slots、sidebarRightTabs；在 ctx.effect 中注册 `{ id, kind, title, guide?, patterns?, priority?, canOpen?, keepMounted? }`。id 在所有实现中唯一，默认 priority 是 extension；同 kind 可以有一个 builtin 加一个 extension，其他撞名抛错。
3. 用 ctx.slots.inject 等待 sidebar.right.pane.tab 声明，在其中 register；key 必须等于 definition.id。Body 使用 PropsRuntime 推导的 useTabInfo()，读取 tab、panel、sidebar，不能从内部 store 或 DOM 猜当前 Session。
4. 页通过 guide entry 给出可发现入口；也可在自己的用户操作中调用 ctx.sidebarRight.openTab(kind)。资源 viewer 为其协议注册 provider，再按完整 URI 调用 openResource；无人认领、非法 scheme 或未注册 kind 都抛错，应在 owner 的错误边界显示。
5. 请求使用 tab.signal；切换地址时还要比较 navigation.revision。关闭与卸载结束 occurrence，切会话、收起、keepMounted 隐藏与销毁并不相同。页动作通过 tab.actions 绑定到自己的 Session，避免用全局当前会话操作后台 tab。
6. 可选标题在 sidebar.right.pane.tab.title 用同 definition.id 注册；未注册时 chip 用打开时捕获的 title。扩展菜单使用 sidebar.right.tab.menu.item，替换 guide 正文使用 chain 的 sidebar.right.tab.guide，不能修改 dockkit 布局私有状态。

### 验证与完成边界

分别验证类型、factory 构建和 Web 装载。选中一个 Session 从引导入口打开，重复打开、分栏、浮动、关闭；第二 Session 不应覆盖第一 Session 的业务状态。刷新后布局可恢复，但导航参数、内容和活动连接需要 provider 自己恢复；撤销历史仅在内存中。停用插件，静态注册和 Body 一起撤销；重新启用只留一份。资源请求失败显示真实错误，不把布局存在视为请求成功。

相关对象契约：

- [`ExpandButtonProps`](../api/api-client-ui-sidebar-right-expandbutton.md)。
- [`FloatRect`、`PaneId`、`TabId`、`TabRecord`](../api/api-client-ui-sidebar-right-index.md)。
- [`GuideBodyProps`、`GuideInjected`](../api/api-client-ui-sidebar-right-guidebody.md)。
- [`OpenContentIntent`、`SidebarRightState`、`SurfaceState`](../api/api-client-ui-sidebar-right-stores.md)。
- [`RightbarSeatProps`、`SidebarRightInjected`、`SidebarRightPresentation`](../api/api-client-ui-sidebar-right-sidebarright.md)。
- [`SidebarRightKey`](../api/api-client-ui-sidebar-right-locales.md)。
- [`SidebarRightOpenTab`](../api/api-client-ui-sidebar-right-tab-inventory.md)。
- [`SidebarRightTarget`](../api/api-client-ui-sidebar-right-focus.md)。
