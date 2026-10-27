# ui-sidebar-right：插件接入

## 对象关系

新增 tab 分两步：ctx.sidebarRightTabs.register 注册静态定义，再在 sidebar.right.pane.tab 用 definition.id 为 key 注册 Body。kind 表示内容类别，id 表示实现身份，两者不能混用。类型默认 extension，排序为 extension、builtin、fallback，再按匹配模式长度与注册顺序；同 kind 仅允许一个 builtin 加一个 extension。正文通过 useTabInfo 获取 sidebar、panel、tab；tab.signal 在记录消失或插件卸载时中止，切 Session 与收起不销毁它。openResource 需要 dsh-resource:// URI；openTab 按已注册 kind 打开。布局保存 localStorage，导航 params、资源内容与活动连接不在布局中。

## 选型与使用

- [expandbutton 对象契约](api-client-ui-sidebar-right-expandbutton.md)。
- [focus 对象契约](api-client-ui-sidebar-right-focus.md)。
- [guidebody 对象契约](api-client-ui-sidebar-right-guidebody.md)。
- [index 对象契约](api-client-ui-sidebar-right-index.md)。
- [locales 对象契约](api-client-ui-sidebar-right-locales.md)。
- [params 对象契约](api-client-ui-sidebar-right-params.md)。
- [service 对象契约](api-client-ui-sidebar-right-service.md)。
- [sidebarright 对象契约](api-client-ui-sidebar-right-sidebarright.md)。
- [slots 对象契约](api-client-ui-sidebar-right-slots.md)。
- [stores 对象契约](api-client-ui-sidebar-right-stores.md)。
- [tab-domain 对象契约](api-client-ui-sidebar-right-tab-domain.md)。
- [tab-inventory 对象契约](api-client-ui-sidebar-right-tab-inventory.md)。
- [tab-registry 对象契约](api-client-ui-sidebar-right-tab-registry.md)。

完整操作见 [接入 ui-sidebar-right](../how-to/how-to-client-ui-sidebar-right.md#接入-ui-sidebar-right)。
