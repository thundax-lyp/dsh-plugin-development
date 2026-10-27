# ui-input-trigger：service 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

输入触发器区分检测、候选、选择和提交。匹配源、选中值与文本插入在 controller 中仲裁；检测不应发送业务请求。候选加载失败、输入变化和取消需要使用各调用给定的 signal/结果分支，不能让陈旧菜单结果提交到新输入。

## InputTriggerService client

入口 `@deepseek-ai/dsh-client-ui-input-trigger/client`，公开符号 `InputTriggerService`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare class InputTriggerService extends Service implements InputTriggerServiceContract {
    static inject: string[];
    constructor(ctx: Context);
    registerSource(src: InputTriggerSource): () => void;
    sessionOf(actx: ClientContext): InputTriggerController;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `inject` | `static inject: string[];` |
| `constructor` | `constructor(ctx: Context);` |
| `registerSource` | `registerSource(src: InputTriggerSource): () => void;` |
| `sessionOf` | `sessionOf(actx: ClientContext): InputTriggerController;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-input-trigger.md#接入-ui-input-trigger) 在真实装载路径检验成功、失败与卸载。
