# locale：插件接入

## 对象关系

LocaleRuntime 管理字典与语言偏好。插件把自己的中英字典注册到唯一 namespace，并通过 bind 得到翻译函数；组件以 locale 声明让 renderer 注入 t，不能依赖 primitives 读取应用语言。字典注册返回清理入口，必须随插件退出释放。

## 选型与使用

- [index 对象契约](api-client-locale-index.md)。
- [languagerow 对象契约](api-client-locale-languagerow.md)。
- [locale-settings 对象契约](api-client-locale-locale-settings.md)。
- [settings-store 对象契约](api-client-locale-settings-store.md)。
- [zh 对象契约](api-client-locale-zh.md)。

完整操作见 [接入 locale](../how-to/how-to-client-locale.md#接入-locale)。
