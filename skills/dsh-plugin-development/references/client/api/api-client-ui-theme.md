# ui-theme：插件接入

## 对象关系

ThemeRuntime 由浏览器插件提供，不由消费者直接构造。getTheme 读稳定快照；register 注册主题并返回 disposer，重复 id 与 system id 抛错；移除当前主题回退默认偏好。overrideTokens 按 source 叠加 light/dark 值对，后注册层逐 token 覆盖，旧层 disposer 不会删除同 source 的新层。设置操作通过 Host settings scope 持久化；CSS tokens 本身不产生模型可见事实。

## 选型与使用

- [appearancerow 对象契约](api-client-ui-theme-appearancerow.md)。
- [fontsettingsgroup 对象契约](api-client-ui-theme-fontsettingsgroup.md)。
- [index 对象契约](api-client-ui-theme-index.md)。
- [locales 对象契约](api-client-ui-theme-locales.md)。
- [settings-store 对象契约](api-client-ui-theme-settings-store.md)。
- [theme-settings 对象契约](api-client-ui-theme-theme-settings.md)。

完整操作见 [接入 ui-theme](../how-to/how-to-client-ui-theme.md#接入-ui-theme)。
