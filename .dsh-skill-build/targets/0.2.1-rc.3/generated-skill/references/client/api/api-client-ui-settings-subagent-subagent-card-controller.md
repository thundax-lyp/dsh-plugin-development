# ui-settings-subagent：subagent-card-controller 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 ui-settings-subagent 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## SubagentCardFace client

入口 `@deepseek-ai/dsh-client-ui-settings-subagent/client`，公开符号 `SubagentCardFace`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SubagentCardFace {
    hooks: SubagentLimitsCardFace['hooks'] & SubagentModelSelectionCardFace['hooks'];
    editLimit: SubagentLimitsCardFace['edit'];
    resetLimit: SubagentLimitsCardFace['resetField'];
    toggleEnabled: SubagentModelSelectionCardFace['toggleEnabled'];
    toggleModel: SubagentModelSelectionCardFace['toggleModel'];
    retryCatalog: SubagentModelSelectionCardFace['retryCatalog'];
    save: () => void;
    discard: () => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `hooks` | `hooks: SubagentLimitsCardFace['hooks'] & SubagentModelSelectionCardFace['hooks'];` |
| `editLimit` | `editLimit: SubagentLimitsCardFace['edit'];` |
| `resetLimit` | `resetLimit: SubagentLimitsCardFace['resetField'];` |
| `toggleEnabled` | `toggleEnabled: SubagentModelSelectionCardFace['toggleEnabled'];` |
| `toggleModel` | `toggleModel: SubagentModelSelectionCardFace['toggleModel'];` |
| `retryCatalog` | `retryCatalog: SubagentModelSelectionCardFace['retryCatalog'];` |
| `save` | `save: () => void;` |
| `discard` | `discard: () => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-settings-subagent.md#接入-ui-settings-subagent) 在真实装载路径检验成功、失败与卸载。
