# 用统一资源地址连接 provider 与页面

## 接入 resources

目标结果：协议 provider 与资源控件共享同址 snapshot，并在最后 holder 退出后取消读取。

### 目标与前置

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。目标是多个控件共享一个地址的最新资源快照，并在无人持有时中止其读取。使用 [ResourceProtocolMap、ResourceProvider、Resources 与 UseResource](../api/api-client-resources-contract.md)；协议类型目录的权威定义也见 [ui-slots](../api/api-client-resources-index.md)。资源访问权限由实际 provider 与 Host 服务判断，URI 本身不是授权。

### 实现步骤

1. 在自己的 type-only export 中增补 ui-slots.ResourceProtocolMap，明确协议的值类型；协议用全小写名称。地址必须为 dsh-resource://协议/路径，需要 Session/Workspace scope 时写入 path，不读取无关页面的“当前会话”。完整实现与外部包文件见 [本地资源示例](../examples/example-client-resource.md)。
2. Client inject resources，在 ctx.effect 中调用 ctx.resources.register(provider)。每协议一个 provider，重复注册抛错；provider.open 接收完整 address 与 signal，返回 AsyncIterable<RemoteResult<Value>>。
3. 第一个 frame 给当前完整内容，后续成功 frame 替换 value；业务失败用 failure frame，使 snapshot 变为 failed 并保留最后成功 value。流内 throw 是编程错误，框架不替你折叠为业务失败。持续流必须在 signal 中止时结束，并在 finally 释放句柄/订阅。
4. slot 组件使用框架注入的 useResource<协议>(address)；首次订阅或 pin 才打开 provider，getSnapshot 本身不保活。多个读者共享同址 source 与最新值，不由每个组件开独立网络读取。
5. 需要不显示但保活的资源，调用 pin(address,signal)，由自己的 AbortController 释放；已中止的 signal 不创建 pin。最后一个 subscriber 或 pin 离开时中止 open 并丢弃该地址状态。
6. 状态渲染区分 none、loading、live、failed。none 表示协议未注册或不是资源地址，不能当空文件成功；failed 中仍可能有旧 value，必须同时显示失败状态，不用缓存遮盖错误。要在右侧栏打开资源，再按 [查看器注册](how-to-client-ui-sidebar-right.md#接入-ui-sidebar-right) 提供 patterns 与正文。

### 验证与完成边界

让两个组件订阅相同地址，确认只打开一条 provider 流；释放一个仍保持，释放最后一个 signal 中止且资源清除。测试未知协议、初始加载、成功后失败、恢复成功、流正常结束和插件卸载。流结束保留最后状态，最后 holder 退出才清除；状态存在不证明底层连接仍活着。分别验证 Client 类型、独立 factory 装载与页面行为，避免把 URI 解析通过当文件权限或恢复完成。
