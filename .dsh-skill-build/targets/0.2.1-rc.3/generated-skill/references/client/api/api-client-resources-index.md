# resources：index 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

ctx.resources 通过协议注册 ResourceProvider，source(address) 返回可订阅快照，pin 用 AbortSignal 管理引用。useResource 是 renderer 注入的全局标准 hook，不由组件自行手写跨实例订阅。资源地址与读取行为须由协议 provider 明确，不把地址字符串当成文件访问权限。

## ResourceProtocolMap client

入口 `@deepseek-ai/dsh-client-resources/client`，公开符号 `ResourceProtocolMap`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [ResourceProtocolMap 权威契约](api-client-ui-slots-index.md#resourceprotocolmap-root)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-resources.md#接入-resources) 在真实装载路径检验成功、失败与卸载。
