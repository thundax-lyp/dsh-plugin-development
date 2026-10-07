# Session 标题 provider 与日志事实

## 目标与公开入口

目标 `dsh-v0.2.0-rc.1`，commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。`@deepseek-ai/dsh-session-title` 默认导出 `SessionTitleService`（`ctx.sessionTitle`）、`SessionTitleProviderId`、`SessionTitleProvider` 请求/结果类型及标题规范化函数。Host 插件可注册一个可取消的标题 provider，完整例见[注册标题 provider](how-to-register-session-title-provider.md)。已发布的 `session-title-llm` 与 `session-title-all-prompts-llm` 是模型生成实现；自定义 provider 不应把其辅助模型请求语义误当通用默认。

## 输入、结果与注册

`SessionTitleProvider` 以 `SessionTitleProviderId` 作为唯一注册身份；该品牌类型也用于日志 source 里的 provider 身份。

`ctx.sessionTitle.register({id,automatic,generate})` 只容纳一个 provider；id 非空，cadence 为 `first-prompt` 或 `all-prompts`，返回异步 disposer。卸载时取消该 provider 的待发和进行中工作并等待结算，之后才可注册替代 provider。`generate(request)` 收到 live `session`、从 `user/message` 中筛出的非空真实用户文本消息序列、可能存在的当前主请求 `route`、以及取消 `signal`；result 必需非空 `title` 和至少一个来自该次 `request.messages` 的唯一、按顺序 `messageSeqs`，可带实际使用的辅助 `{provider,model}`。输入 seq 是 Session 事实的身份，不能凭文字推测或凭空构造。

`SessionTitleService` 的公开成员还包括 `get(session)` 与 `rename(session,title)`；两者的日志与权限语义见下节。`refresh(session,signal?)` 是显式重生成入口。

| Provider 类型                 | 字段与约束                                                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `SessionTitleProviderRequest` | `session` 是 live 对象，`messages` 是本轮候选用户消息快照，`route?` 是已记录主请求模型身份，`signal` 取消该次生成。 |
| `SessionTitleProviderResult`  | `title` 和 `messageSeqs` 必填；`model?` 只能描述实际用于生成标题的辅助模型路由。                                    |
| `SessionTitleAutomaticMode`   | `first-prompt` 或 `all-prompts`，决定自动生成的 cadence。                                                           |

服务对接受的标题去控制字符、归一空白并按 `maxTitleBytes` 截 UTF-8 字节；规范化为空的结果拒绝。`fallbackMaxWords`、`fallbackMaxBytes`、`maxTitleBytes` 必须是正整数，fallback bytes 不得大于 maxTitleBytes。`first-prompt` 只在根 Session 的首条合格提示且尚无标题时排队；`all-prompts` 对后续用户提示也排队。自动 generation 先给出确定性 fallback，再等匹配的主请求 header/标记请求路由就绪后调用 provider；显式 `refresh(session,signal?)` 不需要等自动 cadence，没 provider 时尝试 fallback。

## 生命周期、权限与恢复

每次接受标题都 append 一条 `session/title`，source 为 `fallback`、`provider`（含 provider id 与可选真实辅助模型）或 `user`；title projection 最新值从日志折叠，事件是 log-only，不进入模型对话历史。`get(session)` 可从 live/replayed 日志重建标题。`rename(session,title)` 只接受当前 SessionStore 中同一 live 对象，写入 user source 并固定标题；之后自动 provider 不覆盖，可信用户显式 `refresh` 才会重新生成。更新 title 的用户权限由调用入口检查，服务只检查 live 对象。并发 provider 完成受 revision 与取消约束，旧工作不能覆盖新标题；provider 自己的外部 I/O 仍须响应 signal。重启后从 `session/title` 日志恢复标题，内存中待发工作不恢复；不能把待发生成视为 durable 任务。

`@deepseek-ai/dsh-session-title-llm` 提供共用的 LLM 标题请求与超时策略；`dsh-session-title-first-prompt-llm`、`dsh-session-title-all-prompts-llm` 是两个固定触发时机的 provider 组合。自有 provider 使用本页的 SessionTitleProvider 契约，不复制其 cadence。

## 验证边界

独立 npm rc.1 消费包已在真实 Session/Projection/Title 服务上验证 provider 刷新、`session/title` 日志、seq/source、用户重命名、显式 refresh 和插件卸载后重新注册。未运行 LLM 标题 provider、完整 Agent 自动 request header 触发、Session 持久化后重启或 Web 权限入口。
