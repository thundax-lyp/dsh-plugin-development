# @deepseek-ai/dsh-skill-filesystem 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

agent（智能体）可以使用来自仓库、自定义目录或用户 agent 配置的本地 skill（技能）：把 skill 编写为任一被扫描根目录下的目录 bundle（内含 `SKILL.md`）或平铺 `<name>.md` 文件，它就会出现在会话目录中。该提供方发现项目、自定义与用户根目录，解析每个 skill 的 YAML frontmatter，并监视这些目录，因此新增、改名或删除的 skill 无需重启即可到达 agent。当 skill 存放在磁盘上时选择它——注册表（`dsh-skill`）接受任意提供方，其他提供方可以从别处提供 skill。

### 使用本包

挂载插件即可让本地 skill 对 agent 可用。它扫描下方的项目、自定义与用户 skill 根目录，把每个 skill 的 frontmatter 解析为目录条目，并按需加载正文；它还会监视这些根目录，使新增、改名或删除的 skill 无需重启即可进入下一次目录。

#### 何时选择

当 skill 存放在磁盘上——仓库、自定义目录或用户的 agent 配置中——时，使用此提供方。当 skill 来自远程注册表或嵌入式插件数据时，请避免使用：注册表接受任意提供方，本包只是其中一种实现。

#### skill 格式

skill 可以是被扫描根目录顶层的目录 bundle `<name>/SKILL.md`，也可以是平铺文件 `<name>.md`；刻意不支持发现嵌套的 `**/SKILL.md`。文件以 YAML frontmatter 开头：必填 `name` 与 `description`，另有可选 `whenToUse`、`metadata`、`disable-model-invocation` 与 `user-invocable`。

`disable-model-invocation: true` 会把 skill 从面向模型的目录和 loader 中排除；`user-invocable: false` 会把它从面向用户的命令中排除，省略的字段默认允许对应接口调用。这两个键接受 YAML 布尔值，以及不区分大小写的 `true`/`false`、`yes`/`no`、`on`/`off` 和 `1`/`0` 形式；被拒绝的拼写或非布尔值会让整个 skill 随警告一起被丢弃，而不会静默允许某个接口。

目录条目和已加载 skill 提供解析后的指令文件路径，使符号链接目录和扁平文件都能作为普通文件预览。重新加载的定位信息和资源根保留发现时的路径，包括符号链接。

目录与正文具有独立的生命周期：发现阶段把 frontmatter 解析进目录条目，每次加载都会重新读取当前文件，因此编辑 skill 正文无需版本化或缓存失效。

#### 根目录与优先级

默认根按该提供方的 rank 顺序扫描：

| Rank | 来源 | 路径 |
|---|---|---|
| 100 | `project-dsh` | `<projectRoot>/.dsh/skills` |
| 200 | `project-agents` | `<projectRoot>/.agents/skills` |
| 300 | `custom` | `Config.customSkillDirs` |
| 400 | `user-dsh` | `<dshHome>/skills` |
| 500 | `user-agents` | `<agentsHome>/skills` |

项目根目录是包含 `.git` 的最近祖先目录；如果不存在，则使用当前 cwd。用户 DSH 根目录会跳过其 `.system` 子目录。`includeDefaultRoots: false` 会省略项目根、用户根以及 `$DSH_BUNDLED_SKILL_DIR` 默认值，使隔离提供方只看到自身配置的根；`bundledSkillDir` 会按 rank 600 添加一个随包提供的根目录。

#### 挂载与配置

与 skill 注册表一起加载该插件；它需要 `ctx.skills`。

```yaml
- name: '@deepseek-ai/dsh-skill'
- name: '@deepseek-ai/dsh-skill-filesystem'
```

| 字段 | 默认值 | 含义 |
|---|---|---|
| `providerName` | `filesystem` | 注册到 `ctx.skills` 的唯一提供方名称 |
| `includeDefaultRoots` | `true` | 在 `customSkillDirs` 周围包含项目根与用户根 |
| `dshHome` | `$DSH_HOME` 或 `~/.dsh` | Harness 配置根目录；扫描其 `skills` 子目录 |
| `agentsHome` | `$DSH_AGENTS_HOME` 或 `~/.agents` | 为兼容 skill 扫描的共享 agent 配置根目录 |
| `customSkillDirs` | `[]` | 其他本地 skill 根目录，位于项目根之后、用户根之前 |
| `watch` | `true` | 监视本地根，并在目录可能变化时使提供方失效 |
| `bundledSkillDir` | — | 配置后按 rank 600 扫描的随包提供的 skill 根目录 |

#### 变更检测

现有根目录会被监视，因此新增、改名或删除 skill（或编辑其 frontmatter）会在下一个模型步骤触发目录刷新；`references`、`scripts`、`assets` 等 bundle 资源下的编辑不会触发。当第一方 `write` 与 `edit` 工具的目标可能影响受监视的 skill 时，它们会直接使提供方失效，因此模型无需等待宿主 watcher 即可观察到自身的文件系统变更。外部 IDE、Git 与 shell 变更由宿主 watcher 捕获；尚不存在的根目录会被探测，直至其出现。

#### 可观察的成功与失败

任一被扫描根目录下的有效 skill 都会按名称排序出现在会话目录中，加载它即可返回当前文件正文。缺少有效 frontmatter、名称无效或调用值无效的文件会随警告被跳过，因此模型目录不会收到逐 skill 诊断，也无法区分缺失的 skill 与无效的 skill。意外的发现或读取失败会让目录观测保持不完整，而不会用看似发生删除的结果替换最后一份可用视图。

-----

### 已知限制与延期工作

这些限制说明该提供方何时不合适，或何时需要特别的运维注意。它们是当前包约束，不是任务积压。

- **发现深度为一层**——只识别 `<root>/<name>/SKILL.md` 与 `<root>/<name>.md`；忽略嵌套 skill 树与包 manifest（元数据清单）。
- **项目范围为最近 `.git` 祖先**——没有该标记的工作区回退到提供的 cwd，不支持其他项目根标记或 monorepo 子项目选择。
- **格式错误的条目随警告消失**——模型目录不会收到逐 skill 诊断，无法区分缺失的 skill 与无效的 skill；意外的 I/O 失败则会保留最后一份可用目录。
- **缺失根观察每次轮询一个路径段**——启动时不存在的根会使用 `fs.watchFile` 按 `watchPollIntervalMs` 轮询，直至 Chokidar 可以附加；这以有界检测延迟换取跨 IDE、Git 与 shell 工作流的可靠创建检测。
- **无正文修订协议**——已加载正文是普通的已保留工具历史；后续文件编辑会影响后续调用，但既不会改写旧结果，也不会通知正文已变化。

## Config（.）

公开导入：`@deepseek-ai/dsh-skill-filesystem`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export interface Config {
    providerName?: string;
    includeDefaultRoots?: boolean;
    dshHome?: string;
    agentsHome?: string;
    customSkillDirs?: string[];
    watch?: boolean;
    watchUsePolling?: boolean;
    watchStabilityThresholdMs?: number;
    watchPollIntervalMs?: number;
    watchMaxProjects?: number;
    watchFollowSymlinks?: boolean;
    bundledSkillDir?: string;
}

export declare const Config: Schema<Config>;
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-skill-filesystem.md)。

## FileSystemSkillProvider（.）

公开导入：`@deepseek-ai/dsh-skill-filesystem`；公开符号：`FileSystemSkillProvider`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare class FileSystemSkillProvider implements SkillProvider {
    readonly name: string;
    constructor(ctx: Context, control: SkillProviderControl, config?: Config);
    list(options: SkillLookupOptions): Promise<SkillCandidate[] | SkillProviderObservation>;
    get(candidate: SkillCandidate, options: SkillLookupOptions): Promise<SkillDefinition | undefined>;
    observeHostMutation(path: string): void;
    dispose(): Promise<void>;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这是调用方持有的运行时对象。按上文公开使用路径结束任务；取消和释放不同于业务成功，等待异步清理后才能认定资源已退出。跨进程恢复须读取业务拥有的持久数据，不能序列化此活对象。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-skill-filesystem.md)。

## apply（.）

公开导入：`@deepseek-ai/dsh-skill-filesystem`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context, config?: Config): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-skill-filesystem.md)。

## inject（.）

公开导入：`@deepseek-ai/dsh-skill-filesystem`；公开符号：`inject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-skill-filesystem.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-skill-filesystem`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "skill-filesystem";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-skill-filesystem.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
