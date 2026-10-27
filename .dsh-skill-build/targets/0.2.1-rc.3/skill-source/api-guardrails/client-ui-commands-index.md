# ui-commands：index 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 ui-commands 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## CommandDescriptor client

入口 `@deepseek-ai/dsh-client-ui-commands/client`，公开符号 `CommandDescriptor`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [CommandDescriptor 权威契约](../../host/api/api-capabilities-dsh-commands.md#commanddescriptor)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-commands.md#接入-ui-commands) 在真实装载路径检验成功、失败与卸载。



继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `definitionId` | `readonly definitionId?: CommandDefinitionId;` | [CommandDescriptor 权威声明](../../host/api/api-capabilities-dsh-commands.md#commanddescriptor) |
| `description` | `readonly description: string;` | [CommandDescriptor 权威声明](../../host/api/api-capabilities-dsh-commands.md#commanddescriptor) |
| `input` | `readonly input?: CommandInputDescriptor;` | [CommandDescriptor 权威声明](../../host/api/api-capabilities-dsh-commands.md#commanddescriptor) |
| `name` | `readonly name: string;` | [CommandDescriptor 权威声明](../../host/api/api-capabilities-dsh-commands.md#commanddescriptor) |
