# 工具输出预算、取消期限与进程代理

## 对象关系

这些是可直接导入的库，不向 Profile 挂载或注入 Service。ItemRetainer 限有序逻辑条目，TextRetainer 按字节保留 head/tail/headTail 且维持 UTF-8 边界。truncated 仅代表预算省略已观察内容，不包括权限失败、跳过二进制或上游本来不完整；seen 是已观察数而不是全源总量。deadline/idleWatchdog 只发取消通知，实际停止与 abandoned demand 释放由调用者拥有。HTTP 代理是进程策略，launcher安装；插件不能另建隐藏全局dispatcher。

## 选型与使用

clampTimeout 的公开 requested 必须正且有限，零不是公开禁用哨兵；deadline 内部 timeoutMs<=0 才表示不设 timer。signal reason 保留第一触发原因；必须 dispose timer。代理继承子进程时使用 proxyEnvironmentForChild；对其他HTTP客户端读取 proxyRouteFor，不绕过用户路由。

- [@deepseek-ai/dsh-home-paths.](api-runtime-dsh-home-paths.md)：模块和公开对象。
- [@deepseek-ai/dsh-http-proxy.](api-runtime-dsh-http-proxy.md)：模块和公开对象。
- [@deepseek-ai/dsh-output-retention.](api-runtime-dsh-output-retention.md)：模块和公开对象。
- [@deepseek-ai/dsh-timeout.](api-runtime-dsh-timeout.md)：模块和公开对象。

[操作步骤](../how-to/how-to-runtime-util.md)说明配置、调用和清理顺序。
