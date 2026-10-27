# resources：插件接入

## 对象关系

ctx.resources 通过协议注册 ResourceProvider，source(address) 返回可订阅快照，pin 用 AbortSignal 管理引用。useResource 是 renderer 注入的全局标准 hook，不由组件自行手写跨实例订阅。资源地址与读取行为须由协议 provider 明确，不把地址字符串当成文件访问权限。

## 选型与使用

- [contract 对象契约](api-client-resources-contract.md)。
- [index 对象契约](api-client-resources-index.md)。

完整操作见 [接入 resources](../how-to/how-to-client-resources.md#接入-resources)。
