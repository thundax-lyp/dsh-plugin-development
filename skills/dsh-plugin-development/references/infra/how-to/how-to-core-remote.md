# 声明 Remote 并生成两侧契约

## 发布带取消与失败码的 Remote

相关对象：

- [Remote](../api/api-core-dsh-typert-protocol-root-1.md#remote-公开契约)。
- [RemoteError](../api/api-core-dsh-typert-protocol-root-2.md#remoteerror-公开契约)。
- [RemoteResult](../api/api-core-dsh-typert-protocol-root-3.md#remoteresult-公开契约)。
- [TypertRemoteService](../api/api-core-dsh-typert-protocol-root-10.md#typertremoteservice-公开契约)。

起点分三种：本指南的自建路径要求精确版本源码 workspace；普通消费项目只使用已经生成并分发完整 `./remote` 的包；只有 package.json 的独立目录不能直接套用生成器。先按[双侧完整 LocalNotes 包](../examples/example-core-remote.md)准备生成、模块装配和 Profile。

目标：Client 经 `ctx.remote.<namespace>.<method>` 调用 Host Service，输入经生成 codec 校验，取消能到达业务方法，失败保留稳定 code 和 details。适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

1. 先查 [Remote 协议](../api/api-core-dsh-typert-protocol-root-overview.md)、[生成器](../api/api-core-dsh-typert-generator-root-overview.md)、[Loader](../api/api-core-dsh-typert-loader-root-overview.md)、[Gateway](../api/api-core-dsh-api-gateway-root-overview.md) 的运行侧。协议声明不会注册服务；装饰器也不会自行提供传输、授权或严格类型反射。
2. 使用 [Remote 完整双侧例](../examples/example-core-remote.md) 的 `TypertRemoteService`、`@Remote` 和错误码合并。只标公开实例方法；静态、私有方法不允许。查找对象仅占顶层参数，协作取消的 AbortSignal 必须是最后参数，由调用注入，不放进 JSON。
3. 按完整例分别创建 Host 包与 Client assembly，配置包 tsconfig、tsdown、根 Host/Client aggregate references 与源码 paths。在拥有该 Service 的 Loader entry 包声明 `./typert`、`./remote` 导出和 files；Host 先生成 artifact，Client 后消费生成的 remote client 声明。`./remote` 使用 workspace 包链接和 exports 解析，不添加指向 `.d.ts` 或 `.js` 的单一 paths 别名。修改签名、错误表、namespace 或 export name 后重新生成；只改业务方法体不需重算契约。
4. 目标版本的 `typertPlugin()` 会寻找含 `tsconfig.host.json` 与 `packages/` 的 workspace 根，且分析相互独立的 Host、Client 编译面；普通只有 package.json 的外部 npm 项目不能直接套上此构建插件。需要自建 Remote 时在具备该布局的源码 workspace 增加包，使用完整例的 `typertPlugin({mode: 'workspace', faces: ['host']})` 和先 Host 后 Client 的构建顺序。不要把源码模式发现到方法名等同于完整 codec 已生成，也不手写一个伪造的远端签名绕过生成。
5. Host 以包根名称经 Loader 装载带 `./typert` 的 Service；现有基础 Profile 的 Registry/Gateway 不重复插入。Client assembly 值导入生成 contribution（同时加载类型合并），`await ctx.remote.$mount`，失败回滚及正常卸载逆序 await disposer。完整例的两个 entry 进入同一 Profile 并依靠 Client manifest 的模块依赖装载；其他消费插件声明 `inject = ['remote', 'remote.localNotes']`。业务 Client 直接调用生成的 `ctx.remote.localNotes.echo(...)`；不要复制一份手写接口。单次调用返回 `RemoteResult<T>`，在 `!result.ok` 分支按 `result.error.code` 判别 details，异常流程可 throw result.error；本地缺陷不应伪装成远端业务错误。
6. 验证有效输入、无效参数、预先取消和执行中取消；未分类的异常折叠到 `gateway/internal`，载体取消是 `gateway/cancelled`。停用 Service 后确认端点不可调用；重连后刷新依赖远端状态的 UI。

完成判据：生成产物真实存在且两侧编译通过，实际调用到 Host 方法，拒绝输入不进入业务方法，signal 中止被观察，卸载移除端点。授权测试要创建真实非 owner Peer 并核查资源，不能由 owner 调用成功推断权限正确。

## 为 Remote 声明完整资源与流所有权

相关对象：

- [RemoteInvocation](../api/api-core-dsh-typert-protocol-root-3.md#remoteinvocation-公开契约)。
- [RemoteMethodOptions](../api/api-core-dsh-typert-protocol-root-3.md#remotemethodoptions-公开契约)。
- [RemoteScopeOptions](../api/api-core-dsh-typert-protocol-root-3.md#remotescopeoptions-公开契约)。
- [RemoteStreamHandle](../api/api-core-dsh-typert-protocol-root-4.md#remotestreamhandle-公开契约)。
- [principalOf](../api/api-core-dsh-typert-protocol-root-12.md#principalof-公开契约)。
- [typertOwnedValue](../api/api-core-dsh-typert-protocol-root-13.md#typertownedvalue-公开契约)。

目标：非 owner 调用仅在全部被访问资源获准时执行；流上下行和持有资源可终止。

1. 查看 [资源与调用身份](../api/api-core-dsh-typert-protocol-root-overview.md) 和 [RemoteAccess](../api/api-core-dsh-api-remote-access-root-overview.md)。principal 由 Host 创建 Peer 时固定，wire 字段不能替代可信身份。`principalOf(this.ctx.invocation)` 对非 owner 返回该身份，对 owner 和非 Remote 调用返回 undefined；持久记录只在存在时写入。
2. 默认资源推导来自声明过 resource 的 lookup、scoped Context 或注册的默认 wire 字段；推导不到身份就访问 global。方法读取多个或嵌套资源时，用 `resources` 读取函数显式列全；访问控制不会检查遗漏的资源。global 授权不自动授权所有 session。
3. `@Remote({mode:'stream'})` 方法返回 Iterable、AsyncIterable 或 `RemoteStream<Out, In>`。`this.ctx.invocation.uplink<In>()` 读上行，Client 的 `RemoteStreamHandle` 在迭代外还有 send/end/dispose。消费者提前停止时 dispose；Host 的异步生成器使用 finally 释放资源并观察 carrier signal。
4. 自建 lookup 或 scoped Context provider 若返回调用持有的资源，用 `typertOwnedValue(value, release)` 将幂等且不抛异常的 release 交给 Gateway，后者在处理器和回复结束后释放。借用的 Context 不要错误包装成新 owner。
5. 测试 owner、显式允许、显式拒绝、缺失资源、跨 session 身份及重连；对上下行分别测试无效项、正常 end、取消和消费端提前 dispose。一元结果可支持生成的 Uint8Array codec，但参数、事件和流条目仍须 JSON，不能因一元返回字节就发送二进制流条目。

完成判据：资源读取覆盖实际访问集，拒绝发生在业务副作用之前；正常、取消、断开和解析失败均只释放一次资源。
