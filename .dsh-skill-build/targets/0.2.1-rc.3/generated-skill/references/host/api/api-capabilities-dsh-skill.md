# @deepseek-ai/dsh-skill 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

使用本包可让 agent（智能体）和用户通过一个目录访问从本地目录、嵌入式插件数据或远程服务收集的可复用任务专项指令。它会以可预测的方式裁决重名项、验证条目、在来源不可用时保留可用结果，并按需加载所选 skill 的完整指令。当组合需要多个来源或非文件系统来源的 skill 时，请挂载本包；本包自身不含 skill 内容，因此本地发现需搭配 `dsh-skill-filesystem`，模型访问需搭配 `dsh-tool-skill`。

### 使用本包

挂载插件即可让组合拥有一个统一的 skill 注册表。skill 来源（提供方）和消费方（面向模型的目录与 loader，或你自己的代码）都通过 `ctx.skills` 交互；注册表合并任意提供方报告的一切内容，因此一次查找就能看到所有来源的 skill。

#### 何时选择

当 agent 需要通过同一个接口从多个来源加载 skill，或 skill 来源并非本地文件系统时，选择 `dsh-skill`。当组合完全不需要加载 skill 时，请避免使用——插件会增加一个服务以及每次查找的发现成本。随附的本地提供方（`dsh-skill-filesystem`）和面向模型的消费方（`dsh-tool-skill`）是独立包；部署需要本地 skill 和模型访问时，请一并挂载。

#### 挂载与配置

像任何 Cordis 插件一样加载即可。唯一配置项限制内存中保留的已完成提供方目录数量；其余都是提供方行为。

```yaml
- name: '@deepseek-ai/dsh-skill'
```

| 字段 | 默认值 | 含义 |
|---|---|---|
| `collectCacheMaxEntries` | `128` | 内存中保留的已完成 cwd/提供方目录数 |

#### 注册表提供什么

- **合并后的单一目录。** 消费方查询工作区的当前目录，即可收到来自所有提供方的全部胜出 skill 摘要，并按名称排序——无需自行做提供方特有的排序或去重。
- **按需加载。** 按名称查询某个 skill，会从拥有胜出候选项的提供方返回完整指令正文；注册表会重新验证加载的定义，并拒绝在发现与加载之间名称发生变化的陈旧选择。
- **嵌入式 skill。** 插件可用 `ctx.skills.register(...)` 注册内存中的 skill；注册表会补入默认调用策略与 `runtime` 提供方标签。同层同名运行时注册采用先到先得，并记录警告。
- **提供方注册。** 提供方用 `ctx.skills.registerProvider(...)` 贡献目录；注册是同步的，返回的 disposer（资源释放）会移除该提供方。`runtime` 是保留的提供方名称。

每个 skill 上的调用策略决定哪些接口可以展示并加载它：`modelInvocable` 用于面向模型的工具与目录，`userInvocable` 用于面向用户的命令。注册表保留全部四种组合，因此一次发现结果可以同时服务两个接口，而不会混淆各自的目录。

| 策略 | 模型 | 用户 |
|---|---|---|
| `{ modelInvocable: true, userInvocable: true }` | 包含 | 包含 |
| `{ modelInvocable: true, userInvocable: false }` | 包含 | 排除 |
| `{ modelInvocable: false, userInvocable: true }` | 排除 | 包含 |
| `{ modelInvocable: false, userInvocable: false }` | 排除 | 排除 |

#### 可观察的成功与失败

任意提供方报告的 skill 都会出现在合并目录中，按其精确 kebab-case 名称加载即可返回正文；无效名称返回无结果而非抛错。发现失败的提供方会被记录并跳过，观测被标记为不完整，因此消费方保留其最后一份可用目录；显式的不完整观测仍会贡献其候选项。格式错误的候选项会快速失败——注册表在缓存或返回任何内容之前，会先验证名称、描述、调用布尔值与提供方归属。

Skill 摘要保留胜出提供方可选的指令文件 `path`，供提供文件预览的发现消费者使用。列举仍不读取 skill 正文；面向模型的目录继续仅选择其负责的路由字段。

-----

### 已知限制与延期工作

这些限制说明注册表何时不合适，或何时需要特别的运维注意。它们是当前包约束，不是任务积压。

- **失效由提供方驱动**——注册表没有 TTL，无法推断任意远程来源是否已发生变化；每个可变提供方都必须保留其注册作用域内的 `invalidate()` 能力，并由自身的观测机制调用它。
- **提供方依次查询**——一个缓慢的提供方会延迟其后注册的所有提供方；取消会停止调用方的等待，但无法终止不响应取消的提供方持续运行的工作。
- **不保留不完整观测**——被拒绝的提供方会被省略，显式提供的候选项也仅在当前查找中可用；注册表既不负责最后一份可用目录，也不负责逐提供方诊断。
- **重名项的裁决采用先到先得**——系统会记录并隐藏层内较晚出现的低优先级候选项，较近的层会静默遮蔽较远的层；没有 API 可检查全部被遮蔽的定义。

## BUNDLED_SKILL_RANK（.）

公开导入：`@deepseek-ai/dsh-skill`；公开符号：`BUNDLED_SKILL_RANK`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const BUNDLED_SKILL_RANK = 600;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-skill.md)。

## Config（.）

公开导入：`@deepseek-ai/dsh-skill`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export interface Config {
    readonly collectCacheMaxEntries?: number;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-skill.md)。

## SkillCandidate（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SkillCandidate extends SkillSummary {
    readonly rank: number;
    readonly locator: unknown;
    readonly metadata?: Readonly<Record<string, unknown>>;
}
```

公开导入：`@deepseek-ai/dsh-skill`；公开符号：`SkillCandidate`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`description`、`invocation`、`locator`、`metadata`、`name`、`path`、`provider`、`rank`、`resourceBase`、`source`、`whenToUse`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-skill.md)。

## SkillCatalogSnapshot（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SkillCatalogSnapshot {
    readonly skills: SkillSummary[];
    readonly complete: boolean;
}
```

公开导入：`@deepseek-ai/dsh-skill`；公开符号：`SkillCatalogSnapshot`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`complete`、`skills`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-skill.md)。

## SkillDefinition（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SkillDefinition extends SkillSummary {
    readonly content: string;
    readonly metadata?: Readonly<Record<string, unknown>>;
}
```

公开导入：`@deepseek-ai/dsh-skill`；公开符号：`SkillDefinition`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`content`、`description`、`invocation`、`metadata`、`name`、`path`、`provider`、`resourceBase`、`source`、`whenToUse`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-skill.md)。

## SkillInvocationPolicy（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SkillInvocationPolicy {
    readonly modelInvocable: boolean;
    readonly userInvocable: boolean;
}
```

公开导入：`@deepseek-ai/dsh-skill`；公开符号：`SkillInvocationPolicy`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`modelInvocable`、`userInvocable`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-skill.md)。

## SkillInvocationSource（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SkillInvocationSource {
    readonly kind: 'skill-invocation';
    readonly name: string;
    readonly form: 'instructions';
}
```

公开导入：`@deepseek-ai/dsh-skill`；公开符号：`SkillInvocationSource`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`form`、`kind`、`name`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-skill.md)。

## SkillLookupOptions（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SkillLookupOptions {
    readonly cwd?: string | undefined;
    readonly signal?: AbortSignal | undefined;
}
```

公开导入：`@deepseek-ai/dsh-skill`；公开符号：`SkillLookupOptions`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`cwd`、`signal`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-skill.md)。

## SkillProvider（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SkillProvider {
    readonly name: string;
    readonly list: (options: SkillLookupOptions) => Promise<readonly SkillCandidate[] | SkillProviderObservation>;
    readonly get: (candidate: SkillCandidate, options: SkillLookupOptions) => Promise<SkillDefinition | undefined>;
}
```

公开导入：`@deepseek-ai/dsh-skill`；公开符号：`SkillProvider`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`get`、`list`、`name`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-skill.md)。

## SkillProviderControl（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SkillProviderControl {
    readonly signal: AbortSignal;
    readonly invalidate: () => void;
}
```

公开导入：`@deepseek-ai/dsh-skill`；公开符号：`SkillProviderControl`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`invalidate`、`signal`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-skill.md)。

## SkillProviderObservation（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SkillProviderObservation {
    readonly candidates: readonly SkillCandidate[];
    readonly complete: boolean;
}
```

公开导入：`@deepseek-ai/dsh-skill`；公开符号：`SkillProviderObservation`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`candidates`、`complete`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-skill.md)。

## SkillRegistration（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type SkillRegistration = Omit<SkillDefinition, 'invocation' | 'provider'> & {
    readonly invocation?: SkillInvocationPolicy;
    readonly provider?: string;
};
```

公开导入：`@deepseek-ai/dsh-skill`；公开符号：`SkillRegistration`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`content`、`description`、`invocation`、`metadata`、`name`、`path`、`provider`、`resourceBase`、`source`、`whenToUse`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-skill.md)。

## SkillRegistry（.）

公开导入：`@deepseek-ai/dsh-skill`；公开符号：`SkillRegistry`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare class SkillRegistry extends Service {
    static Config: Schema<Config>;
    constructor(ctx: Context, config?: Config);
    registerProvider(create: (control: SkillProviderControl) => SkillProvider): () => void;
    register(skill: SkillRegistration): () => void;
    list(options?: SkillViewOptions): Promise<SkillSummary[]>;
    snapshot(options?: SkillViewOptions): Promise<SkillCatalogSnapshot>;
    get(name: string, options?: SkillViewOptions): Promise<SkillDefinition | undefined>;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

注册在调用方 Cordis scope 中完成。保留返回的 disposer，在插件不再提供该能力时释放；不要让异步任务在 owner 结束后继续写入注册表。服务实现与消费者各自承担其资源，注册回调不是持久化记录。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-skill.md)。

## SkillResourceBase（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type SkillResourceBase = {
    readonly kind: 'directory';
    readonly path: string;
} | {
    readonly kind: 'url';
    readonly url: string;
} | {
    readonly kind: 'opaque';
    readonly description: string;
};
```

公开导入：`@deepseek-ai/dsh-skill`；公开符号：`SkillResourceBase`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`kind`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-skill.md)。

## SkillSource（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type SkillSource = 'project-dsh' | 'project-agents' | 'runtime' | 'user-dsh' | 'user-agents' | 'custom' | 'bundled' | (string & {});
```

公开导入：`@deepseek-ai/dsh-skill`；公开符号：`SkillSource`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-skill.md)。

## SkillSummary（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SkillSummary {
    readonly path?: string;
    readonly name: string;
    readonly description: string;
    readonly whenToUse?: string;
    readonly invocation: SkillInvocationPolicy;
    readonly source: SkillSource;
    readonly provider: string;
    readonly resourceBase?: SkillResourceBase;
}
```

公开导入：`@deepseek-ai/dsh-skill`；公开符号：`SkillSummary`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`description`、`invocation`、`name`、`path`、`provider`、`resourceBase`、`source`、`whenToUse`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-skill.md)。

## SkillViewOptions（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SkillViewOptions extends SkillLookupOptions {
    readonly scope?: ScopeKey | undefined;
}
```

公开导入：`@deepseek-ai/dsh-skill`；公开符号：`SkillViewOptions`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`cwd`、`scope`、`signal`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-skill.md)。

## escapeText（.）

公开导入：`@deepseek-ai/dsh-skill`；公开符号：`escapeText`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function escapeText(value: string): string;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-skill.md)。

## isModelInvocable（.）

公开导入：`@deepseek-ai/dsh-skill`；公开符号：`isModelInvocable`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function isModelInvocable(skill: Pick<SkillSummary, 'invocation'>): boolean;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-skill.md)。

## isSkillName（.）

公开导入：`@deepseek-ai/dsh-skill`；公开符号：`isSkillName`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function isSkillName(name: string): boolean;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-skill.md)。

## isUserInvocable（.）

公开导入：`@deepseek-ai/dsh-skill`；公开符号：`isUserInvocable`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function isUserInvocable(skill: Pick<SkillSummary, 'invocation'>): boolean;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-skill.md)。

## renderSkillContent（.）

公开导入：`@deepseek-ai/dsh-skill`；公开符号：`renderSkillContent`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function renderSkillContent(skill: Pick<SkillDefinition, 'name' | 'provider' | 'resourceBase' | 'content'>): string;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-skill.md)。

### Skill 提供方与目录的关键约束

`ctx.skills.register(skill)` 为当前层注册借用的只读 runtime skill；名称为 kebab-case，description 非空，省略 invocation 则允许模型与用户调用，省略 provider 则标记 runtime。同层 runtime 同名条目先到者生效，重复注册返回空操作 disposer，不能移除先到者。

`registerProvider(create)` 向工厂提供 `signal` 和 `invalidate()`。provider 的名字不能是保留的 runtime；owner 卸载会撤销注册并中止生命周期。provider 必须在内容改变后调用 invalidate，不能依赖 consumer 猜测目录变化。`list(options)` 返回候选数组，或 `{ candidates, complete }`；发现不完整时不缓存，并允许 consumer 保留上次良好状态。

层间最近 scope 覆盖远层；同一层按较小 rank、provider 顺序和本地顺序选赢家。项目、runtime、用户的优先级不由 `source` 文本本身决定。`scope` 选择观看层，`cwd` 选择工作区，`signal` 取消发现与加载；遗漏 scope 只读取全局层。不要在 provider 中改写借用的 options 或候选。

`get(name, options)` 把发现时的 opaque locator 原样交还 provider，随后验证完整定义和名称。取消会在缓存命中后再次检查，并停止等待不合作的加载。目录本身与用户/模型调用资格无关，实际加载边界使用 invocation policy 分别过滤。资源基址有 directory、url、opaque 三分支；只有类型声明不能证明文件可以访问。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。

## Context 声明合并入口

完整公开声明：

```text
interface Context {
    skills: SkillRegistry;
}
```


Host 的 Cordis `Context` 由本包声明合并补充以下服务键。先挂载提供者再注入使用；类型可见不代表实际 scope 存在此服务。服务由其提供 fiber 负责撤回，消费者不能自行销毁共享服务。

| 服务键或事件 | 精确公开声明 |
| --- | --- |
| `skills` | `skills: SkillRegistry` |

与对应服务对象一起按[接入指南](../how-to/how-to-capabilities-dsh-skill.md)验证装载和卸载；隔离的 scope 不应消费其他 Agent 的事件或服务。

## Events 声明合并入口

完整公开声明：

```text
interface Events {
    'skills/change'(): void;
}
```


本包通过 Cordis `Events` 声明以下事件。监听注册归调用插件 scope，卸载后撤回；waterfall handler 只有调用 next 才继续到下一层，不把观察通知改作隐式授权。可持久重建的业务事实由服务写入 Session，事件监听本身不形成恢复记录。

| 服务键或事件 | 精确公开声明 |
| --- | --- |
| `skills/change` | `'skills/change'(): void` |

与对应服务对象一起按[接入指南](../how-to/how-to-capabilities-dsh-skill.md)验证装载和卸载；隔离的 scope 不应消费其他 Agent 的事件或服务。
