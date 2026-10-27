# ui-tool：插件接入

## 对象关系

工具 UI 读取工具调用与规范结果，仅负责纯展示。工具 execute 的模型结果由 Host 工具契约负责；不要为 UI 另造一份工具 JSON 结果，也不要由组件改变 Session 日志。按运行、已结算等 phase 判别 props 后渲染。

## 选型与使用

- [slots 对象契约](api-client-ui-tool-slots.md)。

完整操作见 [接入 ui-tool](../how-to/how-to-client-ui-tool.md#接入-ui-tool)。
