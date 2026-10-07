# 出站 HTTP 代理与子进程环境

## 适用范围与入口

目标 `dsh-v0.2.0-rc.1` 的 `@deepseek-ai/dsh-http-proxy` 根入口是**进程级库**，不是 Cordis service/plugin。Launcher 在任何 outbound 请求前解析 launch environment，安装 undici global dispatcher；第三方 Host 出站代码通常复用已装载的全局策略，或在自己拥有的独立进程中安装一次。完整可编译例子见[装配出站代理与子进程环境](how-to-use-outbound-http-proxy.md)。

## 对象类型与成员

| 公开成员                                  | 语义与所有权                                                                                                                                                                                               |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `installProxyFromEnvironment(env,report)` | 接受有 `get(name): {value}                                                                                                                                                                                 | undefined`的环境视图，报告拒绝的 SOCKS/非法 URL，安装进程全局 undici dispatcher 和归一化代理环境；返回异步 disposer，调用者在进程工作结束时`await`，恢复之前 dispatcher、策略、环境并关闭自己创建的 agent。 |
| `proxyRouteFor(url: URL): ProxyRoute`     | 给一条 URL 当前的 direct/proxied 判定；proxied 臂包含 proxy URL 与已安装 dispatcher，调用者不得关闭该 dispatcher。loopback 与 `NO_PROXY` 命中直连。不能将含凭证的 proxy URL 写入日志、Session 或模型结果。 |
| `proxyEnvironmentForChild()`              | 给子进程代理环境 overlay：保留用户显式导出的 proxy 值，补齐缺省 scheme 的已解析值与 loopback bypass；受支持时设 `NODE_USE_ENV_PROXY=1`。值为 undefined 的键在 spawn env 中必须删除。无活动代理时为空。     |
| `clearedProxyEnv()`                       | 返回各 proxy 环境名到 undefined 的 overlay，用于必须直连本地 fixture 的回放子进程；合成 spawn env 时删除这些键。                                                                                           |

## 生命周期、失败与边界

安装是全进程可变状态，由最外层 owner 保持到 outbound 工作结束；不要让每个请求并发安装/卸载。嵌套安装可恢复上一层，但同一时刻多个不协调的 owner 会改变彼此的路由。进程内 `fetch` 走全局 dispatcher；`proxyRouteFor` 的 proxied 臂还可供需要固定 dispatcher 的调用者。worker thread 有自己的 global dispatcher，主线程安装不自动覆盖。HTTP/HTTPS proxy URL 可用；SOCKS/PAC 或非法值会报告并为相应 scheme 直连，不凭空退回另一 scheme。`ALL_PROXY` 与 `NO_PROXY` 解析在目标库内完成；IPv4 loopback 全段也绕过代理。子进程使用 `proxyEnvironmentForChild`，回放隔离使用 `clearedProxyEnv`；这两者只返回 overlay，不直接创建进程。

## 验证

精确源码 `packages/util/http-proxy/src/{index,install,policy}.ts`，目标包测试 `packages/util/http-proxy/tests`。隔离 `evidence/tests/http-proxy-consumer/` 用 npm rc.1、TypeScript 6.0.3 编译并 smoke 验证路由、loopback/bypass、child/replay 环境与安装恢复；参见 `evidence/runtime/http-proxy-review.md`。未验证真实代理服务器、网络传输、worker thread 或真实子进程启动。
