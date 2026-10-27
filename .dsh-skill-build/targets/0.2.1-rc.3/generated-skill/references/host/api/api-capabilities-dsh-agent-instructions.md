# @deepseek-ai/dsh-agent-instructions 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

`dsh-agent-instructions` 向 agent（智能体）提供来自用户全局文件和项目级文件的工作区指引；这些文件均与 `AGENTS.md` 兼容。它为第一次请求加载适用的指令链。它不会持续监视外部编辑：成功的文件系统操作会发现新适用的嵌套文件，并让后续变更或移除可见；恢复会话也会对账基线。`dsh-base` 默认启用此行为，profile 可以禁用。字节预算限制注入的上下文：较宽泛的文件先被省略，最具体的文件最后被截断，空指令链不添加任何内容。

### 使用本包

切换 Session 工作目录后，下一次请求前会重新加载适用的项目指令链。

当 agent 需要依据工作区自身的指令文件工作时，挂载此插件。`dsh-base` 已包含它并给予 65,536 字节预算，因此基于 base 的 profile 仅在需要其他 `maxBytes` 时替换该配置行；没有文件系统提供方的树加载不到任何内容，直到提供方出现。

#### agent 获得的内容

第一次请求包含一条持久基线消息：先是用户全局指令链——`$DSH_HOME/AGENTS.md`，然后是 `<agentsHome>/AGENTS.md`——再按从宽泛到具体的顺序包含项目指令链：从项目根目录到会话工作目录的每个目录中所有现有候选文件。同一候选组内去除首尾空白后内容一致的文件只渲染一次：复制了 `AGENTS.md` 的 `CLAUDE.md` 不会被重复加载，与 harness home 文件重复的共享根 `AGENTS.md` 也会折叠在其后。当成功的 `read`、`write` 或 `edit` 调用到达更深的目录后，下一次请求会包含新适用的指令文件；已改变的文件会替换其内容，消失或成为较早候选文件重复项的文件会产生移除通知。

#### 配置

默认设置适合典型检出：`.git` 标记项目根目录，`AGENTS.md` 与 `CLAUDE.md` 是基础候选，`AGENTS.local.md` 与 `CLAUDE.local.md` 是叠加的本地 overlay。只有 `maxBytes` 必填——它限制完整渲染后的基线，让每个部署显式选择自己的提示词预算。

存放用户全局 `AGENTS.md` 的 harness home 属于进程策略，而不是配置行：该插件通过 `@deepseek-ai/dsh-home-paths` 解析 `$DSH_HOME` 或 `~/.dsh`，因此指令加载始终读取进程 home。共享 agents 根目录同样如此解析：`$DSH_AGENTS_HOME` 或 `~/.agents`。残留的 `dshHome` 与 `agentsHome` 配置行字段会被忽略。

只有确认项目根标记不存在时，项目根发现才会继续上溯。权限或 I/O 失败会停止发现，并抛出宿主或文件系统提供方的原始错误，而不会选择祖先项目。历史根标记元数据决策说明发现为何必须失败，而不能替换为其他根目录。

```yaml
- name: '@deepseek-ai/dsh-agent-instructions'
  config:
    maxBytes: 65536
```

受支持的字段一览：

| 字段 | 默认值 | 含义 |
|---|---|---|
| `maxBytes` | 必填 | 完整渲染基线消息的上限，单位为字节 |
| `maxSourceBytes` | `1048576` | 渲染前单个源指令文件的上限 |
| `projectRootMarkers` | `['.git']` | 标记项目根目录的目录名 |
| `instructionFileCandidates` | `['AGENTS.md', 'CLAUDE.md']` | 每个项目目录中加载的基础文件名 |
| `localInstructionFileCandidates` | `['AGENTS.local.md', 'CLAUDE.local.md']` | 在基础文件之后加载的本地 overlay 文件名 |

#### 观察预算

渲染会优先保留最具体的文件：先丢弃完整的较宽泛文件，再截断最具体的文件，并发出可见的 `Workspace instruction budget ...` 通知，指名被省略与被截断的路径。渲染后的字节数绝不超过 `maxBytes`。超出预算的宽泛文件会被忽略；刷新期间它被视为暂时不可用，而非被移除。

-----

### 已知限制与延期工作

这些限制说明指令加载何时不合适或需要运维注意。它们是当前包约束，不是任务积压。

- **发现跟随结构化 fs 工具，而非 shell 导航**：更改目录的 `bash` 命令不会触发嵌套指令发现，因为 shell 语法与每次调用的 shell 状态不是可靠的文件系统 seam。
- **刷新由 touch 驱动**：没有 watcher；外部编辑会在下一次成功的第一方 `read`、`write` 或 `edit` 时、恢复对账可见基线时，或进入步骤的 pre-step 恢复被遮蔽基线时可见。
- **候选语义有意保持简单**：不解释小写名称、`.claude/rules/` 与 `@path` import；项目 scope 默认加载 `AGENTS.local.md`／`CLAUDE.local.md` overlay，但两个用户全局根目录都没有本地 overlay，其他自定义名称需要显式候选配置。与用户全局 scope 目录同名的项目目录会渲染为 `./<name>/...`，从而保留自己的 scope，而不会解析到全局根目录。
- **去重在同一候选组内基于内容**：候选只有在去除首尾空白后字节完全一致时才折叠。两个用户全局根目录共享同一个组，因此共享根文件会折叠在内容一致的 harness home 文件之后；同级项目候选同样折叠，而从 `AGENTS.md` 漂移的独立副本则会与它一起完整加载。预算保留内容的重复候选仍参与对账：保留的候选一旦改变或消失，它就会重新可见。未改变的隐藏重复项（包括因重复而从可见状态移除的文件）使用缓存元数据，不重新读取内容。
- **同一候选组共享失败命运**：组内任一候选（包括隐藏的重复项）的元数据或内容无法读取时，整个组在该轮保留最后一次成功状态。因此共享 agents 根目录不可读时，harness home 的变更通知也会推迟到之后某一轮同时观测到两个根目录时。
- **字节预算省略的候选不重新进入对账**：基线因预算丢弃的候选及其内容重复项在可见基线存续期间不再被探测，只有基线重建后才会重新可见。
- **Symlink 指令文件会跨越信任边界跟随**：最终组件是 symlink 的候选文件会被解析并加载其目标，因此克隆仓库可以将树外文件内容呈现为较低优先级的工作区指引（它绝不覆盖 system、developer 或用户直接下达的指令）。加载不受信任仓库时，请用文件系统策略门禁或 OS 沙箱限制 `ctx.fs`。
- **指令内容受限但不会被摘要**：超出预算的宽泛文件会被省略，最具体文件可能被截断；该插件绝不请求模型压缩指令文本。

## Config（.）

公开导入：`@deepseek-ai/dsh-agent-instructions`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export interface Config {
    projectRootMarkers?: string[];
    maxBytes: number;
    maxSourceBytes?: number;
    instructionFileCandidates?: string[];
    localInstructionFileCandidates?: string[];
}

export declare const Config: z<Config>;
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-agent-instructions.md)。

## InstructionFile（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface InstructionFile {
    absolutePath: string;
    displayPath: string;
}
```

公开导入：`@deepseek-ai/dsh-agent-instructions`；公开符号：`InstructionFile`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`absolutePath`、`displayPath`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-agent-instructions.md)。

## LoadedInstructionFile（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface LoadedInstructionFile extends InstructionFile {
    content: string;
    version?: FsVersion;
}
```

公开导入：`@deepseek-ai/dsh-agent-instructions`；公开符号：`LoadedInstructionFile`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`absolutePath`、`content`、`displayPath`、`version`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-agent-instructions.md)。

## RenderedAgentInstructions（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface RenderedAgentInstructions {
    text: string;
    omitted: InstructionFile[];
    truncated: TruncatedInstruction[];
}
```

公开导入：`@deepseek-ai/dsh-agent-instructions`；公开符号：`RenderedAgentInstructions`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`omitted`、`text`、`truncated`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-agent-instructions.md)。

## TruncatedInstruction（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TruncatedInstruction {
    displayPath: string;
    originalBytes: number;
    includedBytes: number;
}
```

公开导入：`@deepseek-ai/dsh-agent-instructions`；公开符号：`TruncatedInstruction`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`displayPath`、`includedBytes`、`originalBytes`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-agent-instructions.md)。

## apply（.）

公开导入：`@deepseek-ai/dsh-agent-instructions`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context, config: Config): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-agent-instructions.md)。

## discoverBaselineInstructionFiles（.）

公开导入：`@deepseek-ai/dsh-agent-instructions`；公开符号：`discoverBaselineInstructionFiles`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function discoverBaselineInstructionFiles(options: DiscoverOptions): Promise<InstructionFile[]>;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-agent-instructions.md)。

## inject（.）

公开导入：`@deepseek-ai/dsh-agent-instructions`；公开符号：`inject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-agent-instructions.md)。

## loadBaselineInstructions（.）

公开导入：`@deepseek-ai/dsh-agent-instructions`；公开符号：`loadBaselineInstructions`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function loadBaselineInstructions(options: LoadOptions, fileSystem?: FileSystem): Promise<RenderedAgentInstructions | undefined>;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-agent-instructions.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-agent-instructions`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "agent-instructions";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-agent-instructions.md)。

## renderAgentInstructions（.）

公开导入：`@deepseek-ai/dsh-agent-instructions`；公开符号：`renderAgentInstructions`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function renderAgentInstructions(files: LoadedInstructionFile[], options: {
    maxBytes: number;
    replacePreviousBaseline?: boolean;
}): RenderedAgentInstructions;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-agent-instructions.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
