# @deepseek-ai/dsh-permission-presets 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

提供具名权限模式，同时设置沙箱与审批，但各执行服务仍保留自己的值。配置预设提供未来会话默认值；显式加载的 Auto review integration 可以增加一个仅限当前会话的选项。客户端从进程目录读取可选项，从 Session 投影读取当前选择。不匹配任何预设的旋钮组合显示为 `custom`，用户可以离开该状态，但不能选择它。本包拥有选择与默认值；沙箱、审批和 Auto integration 拥有执行行为。

### 使用本包

当部署希望向用户提供一个 Permissions 选择器、而非分离的沙箱与审批控件时，选择此服务。它捆绑旋钮；执行与审批各自保留自己的取值，因此以后移除本包，最后一次取值依然生效。

#### 配置预设

插件配置定义预设表与新会话的默认值。每个预设名称把一个沙箱模式与一个审批策略捆绑为一组；`name` 与 `description` 是可选的客户端呈现。保留名称 `custom` 与 `auto` 不能出现在该表中。

```yaml
- name: '@deepseek-ai/dsh-permission-presets'
  config:
    presets:
      workspace-write:
        sandbox: workspace-write
        approval: ask
      danger-full-access:
        sandbox: danger-full-access
        approval: never
    defaultPreset: workspace-write
```

| 字段 | 默认值 | 含义 |
|---|---|---|
| `presets` | `workspace-write`、`danger-full-access` | 预设名称 → 沙箱／审批捆绑的表 |
| `defaultPreset` | 推断 | 固定到新会话的预设；组合默认值不匹配任何预设时必填 |

#### 切换预设

切换到 Auto 时，服务先同步执行其准入检查；每次预设切换随后只改变实际值不同的旋钮，再次选择当前已生效的预设不会产生任何变化。当前值解析顺序为：仍匹配的最近一次记录选择（已记录的 Auto 选择在 `never` 审批策略下也匹配），其次是配置表中的第一个匹配项，否则为 `custom`。用户通过 `/permission` 命令切换：不带参数调用时报告当前预设与所有可用条目，带预设参数时切换过去。

#### 用户看到什么

客户端从进程级目录渲染可选条目：先按表顺序列出配置预设，再在 Auto integration 存活时列出 Auto。客户端把这份快照与 Session 当前值合并；不匹配的 `custom` 值可以标记当前控件，但绝不会成为可选目录行。Auto 的身份与旋钮组合（Full access 沙箱加 `ask` 审批策略）固定在本服务内部；已记录的 Auto 选择也匹配委派子会话固定的 `never` 策略。shipped 客户端的 locale 字典拥有 Auto 的 label 与 description，而配置预设保留 Host 提供的展示信息。调用方不能通过通用 contribution API 发布其他预设；他们可以从 `custom` 切换出去，但不能通过此服务选中或持久化一个具名 custom 预设。

#### 会话默认值

`permission` 设置命名空间为未来会话持有 `defaultPreset`，且只接受配置预设。创建会话时读取它，将其应用于沙箱模式与审批策略，并把应用的预设记录为一次 `permission/preset` 选择。之后的设置变更绝不会改变现有会话。恢复的 seed（包括由 `session/end-seed` 明确标记的空 seed）会保留其有效权限，并只接收缺失的持久事实，而不会接收最新用户默认值；持久化的 `auto` 身份在发布前必须存在 live Auto 注册并通过准入。

-----

### 已知限制与延期工作

这些限制说明预设服务不提供什么。它们是当前包约束，不是权限系统对比。

- **只组合两个机制级旋钮**：预设选择沙箱模式和审批策略；固定 Auto integration 可以增加准入行为，但 agent（智能体）／profile 选择不属于 `PresetSpec`。
- **`custom` 只能推导得出**：调用方可以从不匹配的旋钮组合切换出去，但无法通过此服务选中或持久化一个名为 custom 的预设。
- **配置预设表在插件生命周期内固定**：只有固定的 Auto contribution 可以在不重新加载本服务的情况下改变实时进程目录。
- **Auto 不能成为默认值**：它只在 integration effect 存活期间存在，并且有意不进入 `permission` 设置 schema。
- **配置的默认值必须指向已配置预设**——移除被引用预设时，必须在同一次 Config 编辑中修改 `defaultPreset`。

## AUTO_PRESET（.）

公开导入：`@deepseek-ai/dsh-permission-presets`；公开符号：`AUTO_PRESET`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const AUTO_PRESET = "auto";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-permission-presets.md)。

## CUSTOM_PRESET（.）

公开导入：`@deepseek-ai/dsh-permission-presets`；公开符号：`CUSTOM_PRESET`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const CUSTOM_PRESET = "custom";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-permission-presets.md)。

## Config（.）

公开导入：`@deepseek-ai/dsh-permission-presets`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export interface Config {
    presets: Record<string, PresetSpec>;
    defaultPreset: Volatile<string | undefined>;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-permission-presets.md)。

## KnobState（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface KnobState {
    preset: string | null;
    sandbox: SandboxMode | null;
    approval: ApprovalPolicy | null;
}
```

公开导入：`@deepseek-ai/dsh-permission-presets`；公开符号：`KnobState`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`approval`、`preset`、`sandbox`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-permission-presets.md)。

## PermissionCatalog（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface PermissionCatalog {
    options: PresetOption[];
    defaultOptions: PresetOption[];
    defaultPreset: string;
}
```

公开导入：`@deepseek-ai/dsh-permission-presets`；公开符号：`PermissionCatalog`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`defaultOptions`、`defaultPreset`、`options`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-permission-presets.md)。

## PermissionPresetService（.）

公开导入：`@deepseek-ai/dsh-permission-presets`；公开符号：`PermissionPresetService`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare class PermissionPresetService extends TypertRemoteService {
    static Config: z<Schemastery.ObjectS<NoInfer<{
        presets: z<import("@deepseek-ai/cosmokit").Dict<{
            sandbox?: "read-only" | "workspace-write" | "danger-full-access" | null;
            approval?: "ask" | "never" | null;
            name?: string | null;
            description?: string | null;
        } & import("@deepseek-ai/cosmokit").Dict, string>, import("@deepseek-ai/cosmokit").Dict<Schemastery.ObjectT<NoInfer<{
            sandbox: z<"read-only" | "workspace-write" | "danger-full-access", "read-only" | "workspace-write" | "danger-full-access", "defined">;
            approval: z<"ask" | "never", "ask" | "never", "defined">;
            name: z<string, string, "plain">;
            description: z<string, string, "plain">;
        }>>, string>, "defined">;
        defaultPreset: z<string, string, "volatile">;
    }>>, Schemastery.ObjectT<NoInfer<{
        presets: z<import("@deepseek-ai/cosmokit").Dict<{
            sandbox?: "read-only" | "workspace-write" | "danger-full-access" | null;
            approval?: "ask" | "never" | null;
            name?: string | null;
            description?: string | null;
        } & import("@deepseek-ai/cosmokit").Dict, string>, import("@deepseek-ai/cosmokit").Dict<Schemastery.ObjectT<NoInfer<{
            sandbox: z<"read-only" | "workspace-write" | "danger-full-access", "read-only" | "workspace-write" | "danger-full-access", "defined">;
            approval: z<"ask" | "never", "ask" | "never", "defined">;
            name: z<string, string, "plain">;
            description: z<string, string, "plain">;
        }>>, string>, "defined">;
        defaultPreset: z<string, string, "volatile">;
    }>>, "plain">;
    static inject: string[];
    constructor(ctx: Context, config: Config);
    get names(): readonly string[];
    catalog(): PermissionCatalog;
    registerAuto(admit: () => void): () => Promise<void>;
    get defaultPreset(): string;
    current(session: Session): string;
    resolve(name: string): PresetSpec;
    optionOf(name: string): PresetOption;
    set(session: Session, name: string): void;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-permission-presets.md)。

## PermissionSelection（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface PermissionSelection {
    currentValue: string;
}
```

公开导入：`@deepseek-ai/dsh-permission-presets`；公开符号：`PermissionSelection`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`currentValue`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-permission-presets.md)。

## PermissionSettings（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface PermissionSettings {
    defaultPreset: string;
}
```

公开导入：`@deepseek-ai/dsh-permission-presets`；公开符号：`PermissionSettings`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`defaultPreset`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-permission-presets.md)。

## PresetOption（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface PresetOption {
    value: string;
    name: string;
    description?: string;
}
```

公开导入：`@deepseek-ai/dsh-permission-presets`；公开符号：`PresetOption`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`description`、`name`、`value`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-permission-presets.md)。

## PresetSpec（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface PresetSpec {
    sandbox: SandboxMode;
    approval: ApprovalPolicy;
    name?: string;
    description?: string;
}
```

公开导入：`@deepseek-ai/dsh-permission-presets`；公开符号：`PresetSpec`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`approval`、`description`、`name`、`sandbox`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-permission-presets.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。

## Context 声明合并入口

完整公开声明：

```text
interface Context {
    permissionPresets: PermissionPresetService;
}
```


Host 的 Cordis `Context` 由本包声明合并补充以下服务键。先挂载提供者再注入使用；类型可见不代表实际 scope 存在此服务。服务由其提供 fiber 负责撤回，消费者不能自行销毁共享服务。

| 服务键或事件 | 精确公开声明 |
| --- | --- |
| `permissionPresets` | `permissionPresets: PermissionPresetService` |

与对应服务对象一起按[接入指南](../how-to/how-to-capabilities-dsh-permission-presets.md)验证装载和卸载；隔离的 scope 不应消费其他 Agent 的事件或服务。

## Events 声明合并入口

完整公开声明：

```text
interface Events {
    'permission-presets/catalog-changed'(): void;
}
```


本包通过 Cordis `Events` 声明以下事件。监听注册归调用插件 scope，卸载后撤回；waterfall handler 只有调用 next 才继续到下一层，不把观察通知改作隐式授权。可持久重建的业务事实由服务写入 Session，事件监听本身不形成恢复记录。

| 服务键或事件 | 精确公开声明 |
| --- | --- |
| `permission-presets/catalog-changed` | `'permission-presets/catalog-changed'(): void` |

与对应服务对象一起按[接入指南](../how-to/how-to-capabilities-dsh-permission-presets.md)验证装载和卸载；隔离的 scope 不应消费其他 Agent 的事件或服务。
