# rc.1 http-proxy 插件作者任务

精确 checkout `dsh-v0.2.0-rc.1` / `4878cdabd87d4041bdaff61d04c966883b9fd07a`。`packages/util/http-proxy/src/index.ts` 根入口仅导出 `installProxyFromEnvironment`、`proxyRouteFor`、`proxyEnvironmentForChild`、`clearedProxyEnv` 和 `ProxyRoute`；`src/{install,policy}.ts` 的进程级 undici dispatcher、代理 URL 解析、NO_PROXY/loopback/ALL_PROXY 策略是实现。无 Cordis service 或 plugin。第三方 Host 独立进程可完成“装配出站代理与子进程环境”，owner 建议 `references/api-http-proxy.md` 的 `对象类型与成员`，完整任务 `references/how-to-use-outbound-http-proxy.md`。

隔离 `evidence/tests/http-proxy-consumer/` 使用 npm 发布 `@deepseek-ai/dsh-http-proxy@0.2.0-rc.1`、Cordis 4.0.4、TypeScript 6.0.3；`npm install --ignore-scripts --no-audit --no-fund`、`npm run build`、`npm run smoke`、`npm pack --dry-run --json` 均成功。smoke 在虚构 `http://127.0.0.1:18765` 代理下观察 HTTPS route 代理、127.0.0.2 与 `NO_PROXY=internal.test` 直连、child overlay 的 `NODE_USE_ENV_PROXY`/loopback 列表、replay 清除代理变量、disposer 后原 `HTTP_PROXY` 和 direct route 恢复。未发起任何网络请求。

未验证真实代理服务器、fetch 通道、子进程实际 spawn、worker thread 或并发安装。该全局状态应由独立进程 owner 安装一次并等待异步 disposer，不由每个插件 fiber 争用。含认证信息的代理 URL 不应进入日志/Session/模型消息。
