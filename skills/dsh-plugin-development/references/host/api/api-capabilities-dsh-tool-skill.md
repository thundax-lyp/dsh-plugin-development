# @deepseek-ai/dsh-tool-skill 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

agent 可以在会话期间发现并加载 skill。在首次请求前，如果存在模型可调用 skill 且 `skill` 工具可见，agent 会收到一份持久目录，列出可用 skill 的名称与有长度上限的描述，并可用 `skill` 工具加载完整指令。用户可以用 `/name` 调用某个用户可调用的 skill，把相同的指令注入该步骤。目录变更会追加一份完整替换，其中空目录会停用旧名称；可配置 `catalogDescriptionMaxLength` 来限制每条描述的长度。

### 使用本包

技能发现、目录更新与显式技能调用均使用 Session 的当前工作目录。

与 skill 注册表一起挂载该插件，即可让 agent 拥有会话 skill 目录和 `skill` 加载工具。它需要 `ctx.agents`、`ctx.tools` 与 `ctx.skills`。

#### 何时选择

当 agent 应在会话期间发现并加载 skill 时使用它。当 skill 加载由其他消费方处理或完全不需要时，请跳过——没有它，提供方与注册表仍可工作，但不会有任何东西为模型渲染目录或工具。

#### 挂载与配置

与 skill 注册表和至少一个提供方一起加载该插件。唯一配置项限制目录中渲染的规范化描述长度。

```yaml
- name: '@deepseek-ai/dsh-skill'
- name: '@deepseek-ai/dsh-skill-filesystem'
- name: '@deepseek-ai/dsh-tool-skill'
```

| 字段 | 默认值 | 含义 |
|---|---|---|
| `catalogDescriptionMaxLength` | `500` | 会话目录中渲染的规范化描述最大长度；最小为 3 |

#### 模型得到什么

- **会话目录。** 当存在模型可调用 skill 且 `skill` 工具可见时，agent 会在首次请求前收到一条持久的用户角色消息，列出每个 skill 的名称与有长度上限的描述；该消息告诉模型在着手任务前先用工具加载 skill，且绝不能仅凭摘要推断指令。
- **加载工具。** 模型以精确的 skill 名称调用 `skill`，并收到完整指令正文以及规范的 `<skill_content>` 块中的资源指引；该结果作为普通工具历史保留。
- **用户显式调用。** 直接用户输入中的 `/name` token 若指名某个用户可调用 skill，会把该 skill 的指令注入该步骤，而无需模型自行加载。
- **实时目录更新。** 后续成员关系、描述或可见性变化会追加完整的替换目录；删除全部 skill 时会追加空目录，停用较早的名称。

#### 可观察的成功与失败

加载列出的 skill 会返回其完整指令；无论加载来自工具还是用户的显式调用，模型看到的都是同一种规范形态。无效名称会报告 `Error: invalid skill name "<name>"`，未知名称会报告该 skill 未知或已不可用，被禁用模型调用的 skill 会报告其不可用于模型调用。如果从未发布过目录，并且不存在模型可调用 skill，或 `skill` 工具被隐藏或遮蔽，则会整体省略目录；目录发布后，无论可见性丧失——`skill` 工具被隐藏或被同名作用域工具遮蔽——还是删除全部 skill，都会改为追加空目录来停用旧名称。

-----

### 已知限制与延期工作

这些限制说明目录或加载器何时不合适。它们是当前包约束，不是任务积压。

- **目录省略 `whenToUse`、来源和提供方元数据**——路由只基于名称和有长度上限的描述；`whenToUse` 仍是提供方元数据，加载后的包装层也不渲染它。
- **已加载指令正文没有大小上限**——提供方可返回足以占用大量下一步上下文的 skill；只有目录描述会被截断。
- **资源是指引，而非附件**——工具报告基础目录/URL/不透明提示，但既不列举也不为模型获取引用文件。
- **加载是一次性文本**——远程提供方缓慢或 skill 正文很大时，不提供部分内容、流式输出或缓存内容句柄。
- **目录替换采用全量列表**——一个名称或描述发生变化，就会追加所有可见摘要；这样能显式停用陈旧名称，但 token 成本与目录大小成正比。
- **正文不做版本化**——仅修改正文不会改变目录 digest，也不会通知模型；后续工具调用会读取提供方的当前内容，而先前工具结果仍是历史事实。

## Config（.）

公开导入：`@deepseek-ai/dsh-tool-skill`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export interface Config {
    catalogDescriptionMaxLength?: number;
}

export declare const Config: z<Config>;
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-skill.md)。

## SkillCatalogSource（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SkillCatalogSource {
    readonly kind: 'skill-catalog';
    readonly form: 'catalog';
    readonly update?: true;
    readonly entries: readonly {
        readonly name: string;
        readonly description: string;
    }[];
}
```

公开导入：`@deepseek-ai/dsh-tool-skill`；公开符号：`SkillCatalogSource`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`entries`、`form`、`kind`、`update`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-skill.md)。

## apply（.）

公开导入：`@deepseek-ai/dsh-tool-skill`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context, config?: Config): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-skill.md)。

## inject（.）

公开导入：`@deepseek-ai/dsh-tool-skill`；公开符号：`inject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-skill.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-tool-skill`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "tool-skill";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-skill.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
