# @deepseek-ai/dsh-experimental-claude-code-mods 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

在智能体运行中执行 Claude Code 模组：用 `defineMod` 包装模组的 `register(on, options)`，在本桥接之后作为插件挂载，其钩子即可通过同一套 `$`、`e`、`next` 链守卫工具调用、改写提示词、添加命令与工具、读取会话事实，并在提示框上方绘制一条横幅。桥接需要 `dsh-working-directory`，每次 `$` 调用都落在一个已组合的 harness 服务上。它是 alpha 阶段的接口兼容性演示：未服务的事件在加载时报告，未服务的 `$` 成员以指明缺口的消息失败，兼容性页面 列出了全部差异。

### 使用本包

模组就是插件。`defineMod` 接收模组的 `register` 函数以及 `plugin.json` 本应承载的身份，返回一个 Cordis 插件：其配置就是 `register` 收到的 `options` 对象，覆盖在你给出的 `userConfig` 默认值之上。先挂载桥接，再按链顺序挂载各模组。

| 桥接字段 | 默认值 | 含义 |
|---|---|---|
| `hookTimeoutMs` | `10000` | 钩子每个事件自身的运行时间（Claude Code 的限制）；`next` 或 `$` 调用内部的时间不计入 |
| `catchTimeoutMs` | `1000` | `.catch` 处理器的运行时间 |
| `processTimeoutMs` | `30000` | `$.process.run` 与 `$.http.fetch` 的默认超时 |
| `toolAliases` | — | 追加到内置表的 Claude Code 工具名 → harness 工具名条目 |
| `bandColumns` | `120` | 提示框上方横幅向 `ui.render` 报告的列数（`bodyColumns` 与 `viewport.columns`） |
| `bandRows` | `10` | 横幅报告的 `maxRows` 行数 |

Blast Radius 的 DSH 包装使用当前运行的可执行文件提供 Node 计时子进程，因此 Proceed/Cancel 等待在 Windows 上不依赖 POSIX `sleep`。等待仍通过 `$.process.run` 执行，暂停钩子自身的运行时间预算，并随事件取消子进程。独立的 Claude Code hooks 模块默认使用 `sleep 0.25`；其预演命令也需要宿主机提供相应工具。

#### 你的模组会收到哪些事件

| 事件 | 触发自 | 钩子可以 |
|---|---|---|
| `session.start` | 根智能体的 `agent/created`，在其首轮之前等待完成；`cwd` 使用已验证的目录，包括从持久化恢复的目录；取消创建会放弃验证和等待中的钩子 | 观察；注册命令与工具 |
| `prompt.submit` | 带有已认领消息的 `agent/pre-step`；`e.text` 拼接人类自己（`user` 来源）消息的文本块，改写也只触及这些块 | 改写 `text`、在输入的提示词之后追加 `context` 块，或 `{ drop }` 掉提示词 |
| `turn.start` | 一轮中的首个 `agent/pre-step` | 观察 |
| `tool.call` | `tools/execute` 瀑布流，在 harness 权限决定之后；模组用 `$.tool.call` 发起的调用只到达在它之前加载的模组，并归属于调用方 | 前后观察、`{ deny }`、以 `{ result }` 作答，或在 `next` 之后改写结果或其 `isError` |
| `turn.complete` | `turn/end` 会话事件 | 观察；返回 `{ text }` 在宿主日志中写一行 |
| `command.run` | 模组用 `$.command.register` 注册的命令被输入 | 以 `{ text }` 或 `{}` 作答 |
| `ui.render` | 提示框上方的横幅重绘：`{ component: 'AbovePrompt' }`，带 `bodyColumns`、`hasSurvey`、`isWorking`、`maxRows` 属性 | 从 `$.ui.resolve(e)` 返回 `Box`/`Text`/`Button` 树，或 `next(e)` 让出横幅 |
| `session.end` | 根智能体的 `agent/disposed`；钩子结束前 `$.state` 仍可读 | 观察 |
| `<namespace>.<method>` | 更晚加载的模组的 `$` 调用（`tool.call` 则经由工具流水线到达） | 观察、改写或 `{ deny }` |

`e.tool` 与 `tool` 匹配器在 harness 工具有对应名时使用 Claude Code 的名字（`Bash` ↔ `bash`、`Read` ↔ `read`、`Edit` ↔ `edit`、`Write` ↔ `write`、`Glob` ↔ `glob`、`Grep` ↔ `grep`、`WebFetch` ↔ `web_fetch`、`WebSearch` ↔ `web_search`、`Task` ↔ `subagent`、`TodoWrite` ↔ `todo_write`、`AskUserQuestion` ↔ `ask_user_question`、`ExitPlanMode` ↔ `exit_plan_mode`、`Skill` ↔ `skill`）；其余工具保留 harness 名。子智能体事件带 `e.agentId`。其他所有 Claude Code 事件名都能注册而不报错，但永不触发，并在模组加载时以警告点名。

#### 提示框上方的横幅

横幅每个会话一个实例，由加载顺序中第一个 `ui.render` 钩子返回树的模组绘制；调用 `next(e)` 的钩子把横幅让给下一个模组，因此把只在持有事项时才绘制的模组（Blast Radius、Replay Theater）放在只要有读数就绘制的模组（Token Weather）之前。横幅在 `session.start` 之后、上次绘制读取过的 `$.state` 值被写入时、在 `$.ui.open`、`$.ui.close`、`$.ui.invalidate` 之后、在每条 `tool.call` 链与 `turn.complete` 结束之后以及按钮按下之后重绘。`Button` 的 `onPress` 留在宿主中；Web 横幅把点击连同它看到的代数发回，针对更早绘制的点击会被报告并忽略。`$.ui.open` 回答 `{ isPlaced: false }`：没有面板被放置，降级到横幅的模组就在横幅中绘制。测试工具包的 `$.ui.mount` 不需要 Client 就能渲染同样的钩子。

#### 你的模组可以调用哪些 `$` 成员

| 命名空间 | 已服务 | 基于 |
|---|---|---|
| `$.plugin` | `name`、`root` | `defineMod` 的规格 |
| `$.ui` | `resolve`、`invalidate`、`open`、`close`、`panes`、`log`、`toast`、`status`、`ask` | `resolve` 交出元素构造器；`invalidate`、`open`、`close` 重绘横幅；`ask` 基于 `ctx.userQuestions`；`log`、`toast`、`status` 到达宿主日志 |
| `$.command` | `register`、`run`、`list` | `ctx.commands`，限定在事件所属的智能体 |
| `$.tool` | `register`、`call`、`list` | `ctx.tools`；注册的工具名为 `mcp__<plugin>__<tool>`；工具推迟到下一请求的上下文会注入会话 |
| `$.prompt` | `submit` | `agent.followup()`，作为 `user` 来源的消息，除非 `asUser` 否则套上"来自模组"的框架；它触发的 `prompt.submit` 带 `origin: { kind: 'plugin', name }` |
| `$.session` | `id`、`cwd`、`root`、`model`、`turns`、`messages`、`usage`、`version` | 智能体的 Session 及 `turnBoundary`、`contextPressure` 投影；`cwd` 通过 `ctx.workingDirectory` 报告已提交的当前目录；`root` 保留原始项目 |
| `$.state` | `get`、`set` | 为会话持有的内存，以模组命名的 `{ plugin, key }` 寻址；`ui.render` 期间的读取会让横幅订阅 |
| `$.store` | `get`、`set`、`delete`、`keys` | `claude_code_mods` 存储域，每插件一个 JSON 对象，4 MiB |
| `$.clock` | `now`、`sleep`、`after`、`every` | 由安排它们的事件所属会话拥有的定时器；事件取消时 `sleep` 拒绝 |
| `$.fs` | `read`、`write`、`list`、`exists`、`stat` | `ctx.fs`，相对于已验证的 Session 当前目录，每文件 4 MiB |
| `$.process` | `run` | `ctx.subprocess`，不经 shell 的 argv；未提供 `init.cwd` 时，新进程默认使用已验证的 Session 当前目录 |
| `$.http` | `fetch` | 进程的 `fetch`，正文最多 4 MiB |
| `$.env` | `get`、`set` | 本进程的环境变量，所有会话与插件共享 |

所需服务未组合的调用以缺失服务的包名拒绝；表外的命名空间或方法以 `no implementation for <namespace>.<method>` 拒绝。模组以本进程的全部权限运行：`$.env` 读写 harness 的环境变量，`$.http.fetch` 可访问任意 URL，`$.fs` 与 `$.tool.call` 以会话的身份行动。

#### 测试模组

来自 `@deepseek-ai/dsh-experimental-claude-code-mods/testing` 的 `createModTestKit` 加载 `defineMod` 插件或裸定义，并以桩在底层回答的方式让事件穿过它们，形态与 `claude-code/testing` 相同：`kit.on('tool.call', () => ({ result: 'ok' }))` 代替引擎作答，`kit.$.tool.call({ tool: 'Bash', command: 'ls' })` 触发事件，`kit.$.ui.mount({ component: 'AbovePrompt' })` 渲染横幅并查找或按下其元素，`mock.store(kit.on)` 从内存回答 `$.store`。在本仓库内，`claude-code/testing` 解析为该工具包加上 Vitest 的 `describe`、`test`、`expect`，因此示例模组的测试按为 `claude plugin test` 编写的原样运行。

-----

### 已知限制与延期工作

这些限制描述 Claude Code 模组经本桥接运行时行为不同之处；兼容性页面 是完整清单。它们是当前的包约束，不是任务积压。

- **一个绘制表面** — 服务 `AbovePrompt`；`Pane`、其他渲染位点、`Input`、热键、`ui.press`、`ui.input`、`ui.select`、`ui.focus`、`ui.scroll` 不服务：`$.ui.open` 回答 `{ isPlaced: false }`，`$.ui.log`、`$.ui.toast`、`$.ui.status` 到达宿主日志而非 GUI。钩子按 `bandColumns` 列宽的横幅绘制；Web 横幅会换行。按钮的 `onPress` 没有时间限制；挂起的 `onPress` 会让横幅的按钮保持禁用直到它结束。
- **`next` 只运行一次** — 调用 `next` 两次的钩子得到第一次的运行；Claude Code 会再次运行下层链。在其 `next` 仍在运行时作答的钩子会等待该次运行。
- **未服务的事件** — `tool.check`、`tool.describe`、`turn.step`、其他 `prompt.*` 事件、`command.describe`、`config.*`、`session.compact`、`session.receive`、`session.send`、`session.append`、`session.attach`、`session.detach`、`session.measure`、`agent.*`、`plugin.register`、`engine.create`、`telemetry.*` 可注册、永不触发，并在加载时以警告点名；`classic.*` 名字与任何未知事件一样在 `register` 时被拒绝。
- **未服务的 `$` 命名空间** — `$.model`、`$.agent`、`$.config`、`$.settings`、`$.mcp`、`$.audio`、`$.telemetry`、`$.turn`、`$.ui.notice`、`$.ui.blit`、`$.ui.copy`、`$.fs.ancestors`、`$.process.spawn` 以及 `$.session.repo`、`send`、`append`、`authorize`、`compact`、`surfaces` 以 `no implementation` 拒绝。`$.model.complete` 等待一个写入日志的副请求事件，以便模组的模型调用仍可从 Session 日志重建。
- **`tool.call` 在权限决定之后运行** — Claude Code 在其权限检查之前运行模组的 `tool.call` 钩子；此处 harness 的 `tools/pre-execute` 瀑布流（含审批）先行结束。改写传给 `next` 的参数或改名工具的钩子会被跳过并报告（参数情形指向工具前输入改写提案），因为已写入日志的调用按原样运行。
- **一个进程，多个会话** — 模组的模块级变量与 `$.env.set` 写入由进程内所有会话与插件共享，而 Claude Code 每进程一个会话；按会话的值请放在 `$.state`。`session.start` 与 `session.end` 只为根智能体触发。
- **无沙箱、无静态分析、无热重载** — 钩子模块以 Node 全局对象在进程内运行，拥有本进程的全部权限（环境变量、网络、文件系统与工具）；仅 `$` 访问规则、`claude plugin validate`、类型生成、`--plugin-dir` 监视与会话内模组编写流程均未实现。只挂载你愿意作为插件运行的模组。再次挂载模组会在同一已求值模块上重新运行 `register`，模块级变量保留其值。
- **`turn.complete` 文本** — 钩子返回的 `{ text }` 到达宿主日志，而非答案下方的一行；`durationMs` 从该轮的 `turn/start` 起算。
- **`$.session.usage`** — 在 token 计量器得知路由的上下文窗口与提供商用量报告之前，`window` 为 `0` 且无 `percent`；`rateLimits` 始终为空。`$.fs.stat` 报告 `mtimeMs: 0`。
- **`plugin.json` 与 `hooks.json`** — 不读取；`defineMod` 承载身份，插件的设置钩子需要 `@deepseek-ai/dsh-hooks-claude-code`。

## ClaudeCodeMods（.）

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`ClaudeCodeMods`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare class ClaudeCodeMods extends TypertRemoteService {
    static Config: z<Config>;
    static inject: string[];
    constructor(ctx: Context, config: Config);
    watchBand(agent: Agent, signal: AbortSignal): AsyncIterable<SurfaceSnapshot>;
    pressBand(agent: Agent, generation: number, actionId: string): Promise<SurfaceSnapshot>;
    add(definition: ModDefinition): Promise<() => Promise<void>>;
    get mods(): readonly LoadedMod[];
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## Config（.）

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export interface Config {
    hookTimeoutMs?: number;
    catchTimeoutMs?: number;
    processTimeoutMs?: number;
    toolAliases?: Record<string, string>;
    bandColumns?: number;
    bandRows?: number;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## SERVED_EVENTS（.）

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`SERVED_EVENTS`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const SERVED_EVENTS: ReadonlySet<string>;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。

相关对象：[types](api-capabilities-dsh-experimental-claude-code-mods-types.md)。

相关对象：[elements](api-capabilities-dsh-experimental-claude-code-mods-elements.md)。

相关对象：[tool-names](api-capabilities-dsh-experimental-claude-code-mods-tool-names.md)。

相关对象：[matcher](api-capabilities-dsh-experimental-claude-code-mods-matcher.md)。

相关对象：[host-ops](api-capabilities-dsh-experimental-claude-code-mods-host-ops.md)。

相关对象：[define-mod](api-capabilities-dsh-experimental-claude-code-mods-define-mod.md)。

## Context 声明合并入口

完整公开声明：

```text
interface Context {
    claudeCodeMods: ClaudeCodeMods;
}
```


Host 的 Cordis `Context` 由本包声明合并补充以下服务键。先挂载提供者再注入使用；类型可见不代表实际 scope 存在此服务。服务由其提供 fiber 负责撤回，消费者不能自行销毁共享服务。

| 服务键或事件 | 精确公开声明 |
| --- | --- |
| `claudeCodeMods` | `claudeCodeMods: ClaudeCodeMods` |

与对应服务对象一起按[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)验证装载和卸载；隔离的 scope 不应消费其他 Agent 的事件或服务。
