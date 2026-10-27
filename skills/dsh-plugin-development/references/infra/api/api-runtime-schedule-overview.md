# 定时任务的声明与投递

## 对象关系

调度记录区分一次性 at/after 与 every/daily/weekly/cron 等重复规则；规则、时区、间隔与未来时间在创建前校验。title/prompt 是任务内容，delivery receipt/history 是投递事实，不得把仅创建记录等同于完成执行。变更日志 fold 得到当前视图，修改内容与修改时间不同。运行依赖持久存储、Session 与子任务组合；外部模型执行必须另行授权，本地验证只测规则解析和脚本化执行。

## 选型与使用

InvalidRuleError、InvalidTimeZoneError、NotFutureError、FrequencyTooHighError、InvalidPromptError、SubagentSessionError 等区分输入与投递失败；不能因某次 Promise 返回就报告未来任务已经运行。

- [@deepseek-ai/dsh-schedule.](api-runtime-dsh-schedule.md)：模块和公开对象。
- [@deepseek-ai/dsh-schedule./client](api-runtime-dsh-schedule--client.md)：子路径对象。
- [@deepseek-ai/dsh-tool-schedule.](api-runtime-dsh-tool-schedule.md)：模块和公开对象。

[操作步骤](../how-to/how-to-runtime-schedule.md)说明配置、调用和清理顺序。
