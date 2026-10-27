# @deepseek-ai/dsh-tool-ask-user 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

`ask_user_question` 向用户请求确认、选择或缺失的信息。默认情况下，它会等待回答。设置 `mode: timed` 后，期限到达时模型可以继续独立工作，而问题仍可回答；`timeout: -1` 则无限期等待。存活的子 agent 不能调用此工具。调用方需提供回答界面。

### 使用本包

当模型需要用户决定时，将此插件与 `ctx.userQuestions` 组合。没有 answerer 时，阻塞式调用返回错误；有限时长的 timed 调用到期后返回 pending。

随附 preset 使用阻塞模式。要启用 timed 模式，请在当前 preset 的 `config.plugins` 列表中，将 `tool-ask-user` 条目设为 `mode: timed`：

```yaml
- id: tool-ask-user
  name: '@deepseek-ai/dsh-tool-ask-user'
  config:
    mode: timed
    timeout: 120
```

以上片段是插件条目，不是顶层 `--patch` 条目。在 Web profile 中，请修改 `preset-standard` 的插件列表，或使用 Agent Preset 编辑器。`mode: legacy` 或省略配置会保留阻塞式 schema。条目中的 `timeout` 默认适用于每次 timed 调用；设为 `-1` 时会无限期等待，除非模型传入正数期限。模型传入的 `-1` 只适用于该次调用，包括其中的所有问题。

#### 何时调用该工具

发送一个或多个问题，每个问题的 `id` 在本次调用内必须唯一；回答会带回这些 id。推荐选项放在首位，并在标签末尾追加 `(Recommended)`。可选的单次调用 `timeout` 以秒为单位；如果没有回答就无法安全继续，请使用 `-1`。超时绝不表示批准。在 Web 卡片中，开始编辑或选择“慢慢回答”也会让该 Client 的等待持续到提交或取消。

#### 模型得到什么

收到回答时，工具为每个问题返回一项。`selected` 保存选项标签；`custom` 可以补充多选答案，或替代单选选项。跳过的回答项具有空 `selected`，且没有 `custom`。

对于有限时长的 timed 调用，`{ "pending": true, "callId": "…" }` 表示前台等待结束时仍没有回答。问题仍可回答，模型可以继续独立工作。之后的回答以用户消息送达，由 `kind`、`tool` 和 `callId` 标识。Web 对话会配对展示问题与回答；其他消费方收到紧凑 JSON 文本。

#### 调用何时失败

Legacy 调用和 `timeout: -1` 调用会等待回答或取消；没有 answerer 接受时返回错误。有限时长的 timed 调用若没有 answerer，则在到期后返回 pending。取消调用，或调用方不是确切的存活运行时根时，也会返回错误。存活的子 agent 会以 `DELEGATED_CALLER` 被拒绝，必须在最终结果中包含尚未解决的决定。

-----

### 已知限制与延期工作

这些限制说明该工具何时不合适。它们是当前包约束，不是 UI 积压事项。

- **Legacy 工具不会报告 pending**：它只返回回答或错误。原生 legacy 调用不进入 `userQuestions` 投影；中断的调用不能接受迟到回答。
- **中断的 PTC 等待可能丢失问题**：若 `run_code` 进程在 `ask_user_question` 子调用记录 `tool/ptc-dispatch` 结果前结束，投影无法重建该子调用以接受迟到回答。
- **运行时中归属于其他 agent 的 subagent 不能向用户提问**：`ask_user_question` 会以 `DELEGATED_CALLER` 拒绝归属于另一个 agent 的存活子级；该子级必须在最终结果中包含尚未解决的问题或决定。持久谱系不能决定这一边界，因此带有谱系的会话恢复为运行时根后可以正常提问。
- **Native 回答渲染为 JSON 文本**：规范值仍为结构化数据，但模型侧结果使用紧凑 JSON，而非更丰富的内容块词汇。

## Config（.）

公开导入：`@deepseek-ai/dsh-tool-ask-user`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export interface Config {
    mode?: 'legacy' | 'timed';
    timeout?: number;
}

export declare const Config: z<Config>;
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-ask-user.md)。

## apply（.）

公开导入：`@deepseek-ai/dsh-tool-ask-user`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context, config?: Config): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-ask-user.md)。

## inject（.）

公开导入：`@deepseek-ai/dsh-tool-ask-user`；公开符号：`inject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-ask-user.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-tool-ask-user`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "tool-ask-user";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-ask-user.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
