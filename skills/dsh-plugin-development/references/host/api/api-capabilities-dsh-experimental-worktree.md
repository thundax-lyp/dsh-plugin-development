# @deepseek-ai/dsh-experimental-worktree 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

从本地提交创建隔离的检出目录，并在其中继续同一个 Session。每次操作创建新的具名分支，源检出目录保持不变。所有写入均受现有沙箱约束。离开检出目录会保留文件与分支。

### 使用本包

将服务与 `workingDirectory`、`fs`、`subprocess`、`sandbox` 和 `sandboxPolicy` 提供方一起挂载。模型需要此操作时，再添加工具包。

```yaml
- name: '@deepseek-ai/dsh-experimental-worktree'
- name: '@deepseek-ai/dsh-experimental-tool-worktree'
```

`ctx.worktrees.create(agent, { name?, from? }, signal?)` 创建新分支与检出目录，再通过 `ctx.workingDirectory.set` 进入规范化的检出目录。`from` 在创建前解析为本地提交，默认是 `HEAD`；暂存、未暂存、未跟踪以及被忽略的源文件均不复制。`baseCommit` 报告解析出的提交对象名称；仓库本地的替换引用仍作用于检出的内容。检出操作禁用已配置的 Git clean、smudge 和 process 过滤器，不修改仓库配置。分支或检出路径已存在时会报错。返回记录包含 `path`、`branch`、`baseCommit` 和 `repositoryRoot`。

-----

### 已知限制与待办工作

- **保留产物**——离开工作树会保留其分支和文件。初始化失败也可能留下部分产物；移除、清理注册信息与删除分支由用户或其他消费方负责。
- **仅限本地提交**——创建操作不会获取远端提交或部分克隆中缺失的对象、初始化子模块、安装依赖或复制未提交文件。Git 满足执行要求时，本地对象缺失会导致创建失败。
- **过滤器处理前的内容**——检出时跳过已配置的过滤器，以避免执行仓库配置的程序或隐式下载。Git LFS 指针与加密 blob 保持存储时的形式；拉取实体内容或解密由用户另行执行。
- **执行要求**——子进程提供方必须在与文件系统提供方相同的执行环境中提供 Git 与 Node。Git 必须识别 `GIT_NO_LAZY_FETCH`：Git 2.45 及 2.39.4、2.40.2、2.41.1、2.42.2、2.43.4、2.44.1 维护版本均支持；更早的版本会忽略该变量并继续执行而不报错，因此创建操作可能从 promisor 远程获取缺失的部分克隆对象。`git --no-lazy-fetch` 选项会拒绝这些版本，但它仅在 Git 2.45 及以后存在，也会拒绝上述已修补的维护版本。现有沙箱必须允许写入检出目录与共享 Git 元数据。

## Config（.）

公开导入：`@deepseek-ai/dsh-experimental-worktree`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export interface Config {
    directory?: string;
    namePrefix?: string;
    gitCommand?: string;
    nodeCommand?: string;
    timeoutMs?: number;
    graceMs?: number;
    maxOutputBytes?: number;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-worktree.md)。

## CreateWorktreeRequest（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface CreateWorktreeRequest {
    name?: string;
    from?: string;
}
```

公开导入：`@deepseek-ai/dsh-experimental-worktree`；公开符号：`CreateWorktreeRequest`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`from`、`name`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-worktree.md)。

## CreatedWorktree（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface CreatedWorktree {
    path: string;
    branch: string;
    baseCommit: string;
    repositoryRoot: string;
}
```

公开导入：`@deepseek-ai/dsh-experimental-worktree`；公开符号：`CreatedWorktree`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`baseCommit`、`branch`、`path`、`repositoryRoot`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-worktree.md)。

## WorktreeService（.）

公开导入：`@deepseek-ai/dsh-experimental-worktree`；公开符号：`WorktreeService`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare class WorktreeService extends Service {
    static inject: string[];
    static Config: z<Config>;
    constructor(ctx: Context, config: Config);
    create(agent: Agent, request?: CreateWorktreeRequest, signal?: AbortSignal): Promise<CreatedWorktree>;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-worktree.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。

## Context 声明合并入口

完整公开声明：

```text
interface Context {
    worktrees: WorktreeService;
}
```


Host 的 Cordis `Context` 由本包声明合并补充以下服务键。先挂载提供者再注入使用；类型可见不代表实际 scope 存在此服务。服务由其提供 fiber 负责撤回，消费者不能自行销毁共享服务。

| 服务键或事件 | 精确公开声明 |
| --- | --- |
| `worktrees` | `worktrees: WorktreeService` |

与对应服务对象一起按[接入指南](../how-to/how-to-capabilities-dsh-experimental-worktree.md)验证装载和卸载；隔离的 scope 不应消费其他 Agent 的事件或服务。
