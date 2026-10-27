# @deepseek-ai/dsh-llm-retry 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

挂载 `@deepseek-ai/dsh-llm-retry`，可在持久 agent 步骤边界重试失败的模型请求。提供方的 `retryPolicy` 设置可选择有界的 normal mode 重试或无上限的 always mode 重试；计划的尝试会在退避前写入会话日志，取消后历史仍保持一致。重试会在同一个打开的轮次内重跑失败步骤，而直接 `ctx.llm.stream()` 调用仍只尝试一次。每次重试都会产生另一次提供方请求计费，always mode 会持续到成功、取消或释放。

### 使用本包

当 agent 运行应从暂时性模型请求失败——速率限制、服务端错误、超时、传输错误——中恢复而不是结束轮次时，挂载本插件。它是执行器：重试策略本身位于各提供方适配器的配置上，本包没有任何自己的配置。

#### 何时选择

当组合运行 agent loop（智能体循环）并需要持久请求恢复时选择它。本插件是无配置的函数插件；`dsh-llm-deepseek` 与 `dsh-llm-pi-ai` 等提供方适配器拥有各自路由的 `retryPolicy`，多提供方适配器把它放进每个 provider profile。当调用不经 agent loop、直接走 `ctx.llm.stream()` 时跳过它：这些消费方仍是单次尝试，因为原始流无法持久地区分已发出的分片。

#### 最小配置

```yaml
- name: '@deepseek-ai/dsh-llm-deepseek-api-key'
  config:
    apiKeyEnv: DEEPSEEK_API_KEY
    retryPolicy:
      mode: always
      backoff:
        initialDelayMs: 1000
        maxDelayMs: 30000
        jitterRatio: 0.2

- name: '@deepseek-ai/dsh-llm-retry'
```

省略 `retryPolicy` 时使用 normal mode：对 `EMPTY_RESPONSE`、`RATE_LIMIT`、`SERVER`、`TIMEOUT` 与 `TRANSPORT` 最多重试五次，退避从 500 毫秒到 10 秒、带 10% 抖动。normal mode 可以更改其有界预算、合格 code 与退避；always mode 先询问下游恢复，然后无尝试上限地重试每个模型请求失败，只在成功、取消或插件释放时停止。

#### 你可以观察到什么

每次计划的重试在等待前就是持久的：插件会先追加携带重试 id、提供方、模式、策略键、失败与计划延迟的非表层 `llm/retry` 事件，然后在重试开始前立即追加 `llm/retry-started` 事件。提供方给出且符合策略边界的有效 `Retry-After` 会替换本地退避。等待完成后，loop 会在同一个打开的轮次内重跑失败步骤，仍基于同一份持久历史，因此重试请求与原始请求一样可以从会话日志重建。取消或插件释放会中止进行中的退避、等待活跃的委派恢复结算，并使释放前捕获的回调只能以失败结束。

#### 失败与恢复

在任何最终适配器被选中之前发生的失败没有提供方策略，原样委派下游。normal mode 中，不在合格集合内的失败 code 或已耗尽的预算会委派；always mode 中，超上限的提供方延迟使用配置的本地退避，因此策略不会因该指令终止。这里没有任何模型可见内容：重试事件、延迟、提供方错误或失败的部分输出都不会到达模型或派生消息。

-----

### 已知限制与延期工作

这些限制说明执行器在哪里停止、由未来工作接续。它们是当前包约束，不是通用重试对比或任务积压。

- **agent 轮次是唯一重试边界**——直接 `ctx.llm.stream()` 消费方仍是单次尝试，因为原始流无法持久地区分已发出的分片。
- **always mode 会重试永久性失败**——认证、配额、无效请求、协议与不可恢复的上下文错误会持续到成功、取消或释放；部署方负责提供方专属的成本与延迟控制。
- **有界插件预算相加**——normal mode 只统计其配置的 code 与精确提供方策略，而上下文溢出压缩（compaction）拥有独立预算。任何重叠策略都必须定义注册顺序行为。
- **恢复策略按 waterfall 顺序组合**——always mode 先接受下游重试，再应用其回退。之后忽略取消且永不结算的策略也会阻止回退、轮次完全停稳与插件释放完成。
- **`llm/retry` 记录调度，而非完成**——后续步骤与轮次事件才确立成功、耗尽或取消。

## Config（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type Config = Readonly<Record<string, never>>;

export declare const Config: z<Config>;
```

公开导入：`@deepseek-ai/dsh-llm-retry`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-retry.md)。

## LlmRetryEventData（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type LlmRetryEventData = {
    retryId: RetryId;
    turn: number;
    step: number;
    provider: string;
    mode: 'normal';
    policyKey: string;
    retry: number;
    maxRetries: number;
    delayMs: number;
    failure: LlmFailure;
} | {
    retryId: RetryId;
    turn: number;
    step: number;
    provider: string;
    mode: 'always';
    policyKey: string;
    retry: number;
    delayMs: number;
    failure: LlmFailure;
};
```

公开导入：`@deepseek-ai/dsh-llm-retry`；公开符号：`LlmRetryEventData`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`delayMs`、`failure`、`mode`、`policyKey`、`provider`、`retry`、`retryId`、`step`、`turn`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-retry.md)。

## LlmRetryStartedEventData（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface LlmRetryStartedEventData {
    retryId: RetryId;
    turn: number;
    step: number;
    retry: number;
}
```

公开导入：`@deepseek-ai/dsh-llm-retry`；公开符号：`LlmRetryStartedEventData`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`retry`、`retryId`、`step`、`turn`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-retry.md)。

## RetryId（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export declare function RetryId(id: string): RetryId;

export type RetryId = Branded<'RetryId'>;
```

公开导入：`@deepseek-ai/dsh-llm-retry`；公开符号：`RetryId`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-retry.md)。

## RetryInternals（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface RetryInternals {
    random?: () => number;
}
```

公开导入：`@deepseek-ai/dsh-llm-retry`；公开符号：`RetryInternals`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`random`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-retry.md)。

## apply（.）

公开导入：`@deepseek-ai/dsh-llm-retry`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context, config?: Config, internals?: RetryInternals): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-retry.md)。

## inject（.）

公开导入：`@deepseek-ai/dsh-llm-retry`；公开符号：`inject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-retry.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-llm-retry`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "llm-retry";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-retry.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
