# 沙箱能力、执行策略与升级审批

## 对象关系

SandboxProvider 封装受限执行原语，sandbox-policy 决定部署及每次执行策略；消费者必须读取有效 mode/workspace root，不能只看执行器默认 sandboxMode。sandboxMode=undefined 表示默认不做约束。批准升级与执行是不同阶段，审批不自动改变所有后续调用；按 approveEscalation/validateEscalationArgs 的策略核查请求。OS provider 有平台前置，本地和 SSH provider 不可混用路径假设。

## 选型与使用

SANDBOX_UNAVAILABLE 是能力不可用，不能静默回退为无沙箱。RunnerFailureRule 只识别所声明失败签名，命令失败不都属于 sandbox 拒绝；按结构化结果判断。

- [@deepseek-ai/dsh-sandbox-local.](api-runtime-dsh-sandbox-local.md)：模块和公开对象。
- [@deepseek-ai/dsh-sandbox-policy.](api-runtime-dsh-sandbox-policy.md)：模块和公开对象。
- [@deepseek-ai/dsh-sandbox-windows-acl.](api-runtime-dsh-sandbox-windows-acl.md)：模块和公开对象。
- [@deepseek-ai/dsh-sandbox.](api-runtime-dsh-sandbox.md)：模块和公开对象。

[操作步骤](../how-to/how-to-runtime-sandbox.md)说明配置、调用和清理顺序。
