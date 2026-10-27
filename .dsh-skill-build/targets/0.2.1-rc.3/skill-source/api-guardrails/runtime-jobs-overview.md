# 后台任务的所有权与输出

## 对象关系

JobRegistry 定义契约，jobs-local 提供执行。start 的 run 同步返回 cancel 与 done；先完成预检才调用 run，部分启动失败由生产者自行清理。done 必须在资源释放后才 settle，不能把业务完成等同于进程退出。owner 为 SessionId，可见性包含本 owner 与无 owner 任务；绑定 owner 时还要求该 id 对应当前 live Agent。read 消耗模型游标及一次性 result，readAt 使用独立 byte offset 不消耗其他读取者。output 环可能丢失旧数据，检查 lossy 和 spillPaths。job/registered 与 job/settled 是日志事实，fork 不转移 live execution ownership。

## 选型与使用

cancel 抛错可以导致注册记录强制失败但不能证明进程已停。wait 超时只结束等待，kill 才请求停止；完成通知与等待者交付避免重复。订阅 disposer 随调用 fiber 清理。

- [@deepseek-ai/dsh-jobs-local.](api-runtime-dsh-jobs-local.md)：模块和公开对象。
- [@deepseek-ai/dsh-jobs.](api-runtime-dsh-jobs.md)：模块和公开对象。
- [@deepseek-ai/dsh-tool-jobs.](api-runtime-dsh-tool-jobs.md)：模块和公开对象。
- [@deepseek-ai/dsh-tool-todo.](api-runtime-dsh-tool-todo.md)：模块和公开对象。

[操作步骤](../how-to/how-to-runtime-jobs.md)说明配置、调用和清理顺序。
