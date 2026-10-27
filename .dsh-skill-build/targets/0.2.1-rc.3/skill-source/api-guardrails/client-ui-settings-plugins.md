# ui-settings-plugins：插件接入

## 对象关系

插件配置页由 Host 公开的 schema 与配置作用域驱动。自定义页使用 ConfigPageForm 的 state/mutate，不自行写 profile 文件。对其它插件页面的附加内容注册 plugins.detail.actions、plugins.detail.badge 或 plugins.detail.section，并按 subject.kind 的 bundle、row、item 分支处理；不相关 subject 返回 null。

## 选型与使用

- [pluginssettingssection 对象契约](api-client-ui-settings-plugins-pluginssettingssection.md)。

完整操作见 [接入 ui-settings-plugins](../how-to/how-to-client-ui-settings-plugins.md#接入-ui-settings-plugins)。
