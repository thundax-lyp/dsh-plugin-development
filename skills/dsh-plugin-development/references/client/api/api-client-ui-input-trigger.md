# ui-input-trigger：插件接入

## 对象关系

输入触发器区分检测、候选、选择和提交。匹配源、选中值与文本插入在 controller 中仲裁；检测不应发送业务请求。候选加载失败、输入变化和取消需要使用各调用给定的 signal/结果分支，不能让陈旧菜单结果提交到新输入。

## 选型与使用

- [contract 对象契约](api-client-ui-input-trigger-contract.md)。
- [controller 对象契约](api-client-ui-input-trigger-controller.md)。
- [index 对象契约](api-client-ui-input-trigger-index.md)。
- [locales 对象契约](api-client-ui-input-trigger-locales.md)。
- [menuview 对象契约](api-client-ui-input-trigger-menuview.md)。
- [service 对象契约](api-client-ui-input-trigger-service.md)。
- [slots 对象契约](api-client-ui-input-trigger-slots.md)。
- [types 对象契约](api-client-ui-input-trigger-types.md)。

完整操作见 [接入 ui-input-trigger](../how-to/how-to-client-ui-input-trigger.md#接入-ui-input-trigger)。
