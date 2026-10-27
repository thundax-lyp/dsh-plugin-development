# 插件凭证、引用与交互授权

## 对象关系

CredentialKey 把插件 scope 与 id 组合，CredentialRef 是稳定配置引用而不是 secret。凭证 record 的 api-key/grant 判别分支不同，UI 只应显示 info 投影。AuthorizationFlow 以 key 注册且 methods 非空，每个 key 同时只准一个 attempt；run 必须在 attempt 内提交且结束时记录仍存在才算成功。用 session.commit 使取消与写入协调，notify 不阻塞流程，prompt 区分人类拒绝与界面故障。flow 注册返回 disposer，插件卸载撤销注册和运行中的会话。

## 选型与使用

AuthorizationDeclinedError 只用于人类明确拒绝，signal 撤销不能冒充人类回答。授权协议由 flow 自己实现；credentials 服务不是 Host 身份认证或多租户授权边界。

- [@deepseek-ai/dsh-authorization.](api-runtime-dsh-authorization.md)：模块和公开对象。
- [@deepseek-ai/dsh-credentials-local.](api-runtime-dsh-credentials-local.md)：模块和公开对象。
- [@deepseek-ai/dsh-credentials.](api-runtime-dsh-credentials.md)：模块和公开对象。
- [@deepseek-ai/dsh-deepseek-account-platform.](api-runtime-dsh-deepseek-account-platform.md)：模块和公开对象。
- [@deepseek-ai/dsh-deepseek-account-platform./types](api-runtime-dsh-deepseek-account-platform--types.md)：子路径对象。
- [@deepseek-ai/dsh-deepseek-account.](api-runtime-dsh-deepseek-account.md)：模块和公开对象。

[操作步骤](../how-to/how-to-runtime-credentials.md)说明配置、调用和清理顺序。
