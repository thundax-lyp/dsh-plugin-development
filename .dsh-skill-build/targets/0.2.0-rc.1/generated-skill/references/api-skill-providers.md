# Skill Provider 与模型可见技能

## 适用范围与入口

目标 `dsh-v0.2.0-rc.1` 的 Host 插件从 `@deepseek-ai/dsh-skill` 根入口使用 `SkillRegistry`、`SkillProvider`、`SkillCandidate`、`SkillDefinition`、`SkillProviderControl`、`SkillLookupOptions` 等公开类型。base bundle 装载 `ctx.skills`；自定义 Profile 必须先装载该 service，提供者插件声明 `inject = ['skills']`。本文拥有“提供一个可发现、按需加载的技能”的 API 契约；实际组合路径见 [注册 Skill Provider](how-to-register-skill-provider.md)。静态、单个运行中定义可用 `ctx.skills.register(SkillRegistration)`，而工作区、远端或动态目录应实现 provider。

## 契约与运行语义

`ctx.skills.registerProvider(create)` 在插件 `apply` 中**同步**注册同进程 provider。`create(control)` 同步返回 `{name,list,get}`；远端鉴权和枚举放在异步 `list()`，不能阻塞注册。`control.signal` 在失败或该次注册释放时 abort；目录变化时调用 `control.invalidate()` 使已完成的缓存失效并发 `skills/change`，只有该次注册仍活跃时有效。注册句柄是精确 Cordis effect disposer，已归调用 fiber 所有；卸载撤销 provider。重复 provider 名在同一层抛错，`runtime` 名保留。

`list(options)` 根据 `cwd` 返回 `SkillCandidate[]`，或 `{candidates,complete}`；`complete=false` 的目录不缓存，供使用者保留 last-good 并下次重试。每个候选的 `provider` 必须等于提供者名，`name` 必须 kebab-case，`description` 非空，`rank` 有限。`get(candidate,options)` 只对胜出的候选调用，可用原样返回的 `locator` 载入正文，返回完整 `SkillDefinition` 或 `undefined`。候选与正文的 `name` 必须相同，否则注册表使该候选缓存失效并视为缺失。`options.signal` 控制本次查询；提供者自己也要在 I/O 上转发取消。列目录抛错会跳过该 provider 并令观察不完整；候选/定义格式错误则直接拒绝查询。

同一层内同名候选按较低 `rank`、较早 provider 注册、较早候选顺序胜出；有 scope 的 Agent preset 层遮蔽父层/全局同名技能，rank 只决定**同层**竞争。`ctx.skills.list/snapshot/get({cwd,scope,signal})` 是 invocation-neutral，调用边界再按 `invocation.modelInvocable` 与 `userInvocable` 过滤。模型看到的 `renderSkillContent(definition)` 使用 `<skill_content>` / `<skill_instructions>` 单一格式；资源 base 可是目录、URL 或不透明说明。Skill 正文是可信本地内容；外部不可信文本不应伪装成可执行指令。skill 内容不是 Session 自动持久事实，用户显式调用的注入会有 `skill-invocation` message source；恢复仍需按 Session 记录与当前 provider 实际定义裁决。

## 对象类型与成员

| 对象                                      | 直接使用的成员与限制                                                                                                                                                            |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SkillRegistry`                           | `register` 提供单个运行中定义；`registerProvider` 提供可变化的目录；`list`、`snapshot`、`get` 按 cwd/scope 查询，缓存失效由 provider control 驱动。                             |
| `SkillProvider`                           | `name: string`、`list(options): Promise<readonly SkillCandidate[] \| SkillProviderObservation>`、`get(candidate,options): Promise<SkillDefinition \| undefined>` 均必填。       |
| `SkillProviderControl`                    | `signal: AbortSignal` 随注册生灭；`invalidate(): void` 撤销缓存并通知观察者。                                                                                                   |
| `SkillLookupOptions` / `SkillViewOptions` | 可选 `cwd?: string`、`signal?: AbortSignal`；view 增加 `scope?: ScopeKey`。provider 只消费 lookup 字段。                                                                        |
| `SkillCandidate`                          | `name`、`description`、`invocation`、`source`、`provider`、`rank: number`、`locator: unknown` 必需；可选 `path`、`whenToUse`、`resourceBase`、`metadata`。rank 越小优先级越高。 |
| `SkillDefinition`                         | 与候选的 summary 字段同形，另有必需 `content: string`；无 rank/locator。`path` 为提供者给的绝对说明文件路径，虚拟技能可省略。                                                   |
| `SkillInvocationPolicy`                   | `modelInvocable: boolean`、`userInvocable: boolean` 均必需；两个受众独立。                                                                                                      |
| `SkillResourceBase`                       | 判别式 `directory {path}`、`url {url}`、`opaque {description}`；用于向模型说明相对资源如何解析，不自动读取文件或 URL。                                                          |
| `SkillProviderObservation`                | `candidates: readonly SkillCandidate[]` 与 `complete: boolean`；不完整结果不进入已完成缓存。                                                                                    |
| `SkillCatalogSnapshot`                    | `skills: SkillSummary[]`、`complete: boolean`；每次按名字排序，summary 不含 body。                                                                                              |
| `SkillRegistration`                       | 单个运行中技能的 `SkillDefinition` 去掉 provider/invocation 后，可选补回两者；省略时 provider 为 `runtime`，两种 invocation 均允许。                                            |

`isSkillName`、`isModelInvocable`、`isUserInvocable` 是公开纯检查工具；`BUNDLED_SKILL_RANK=600` 是已打包技能的标准 rank，不是所有自定义 provider 必须使用的值。`SkillRegistry.Config.collectCacheMaxEntries?` 默认 128，须为正整数。

## 生命周期与状态

Provider 注册与 dispose 都使 catalog 缓存失效；目录内部改变要主动调用注册控制的 `invalidate()`。`skills/change` 无 payload，使用者重读自己 `cwd/scope` 的 catalog，监听失败被隔离。Provider `list/get` 不拥有 Session 写入；若技能读取远端资源，认证、超时、I/O 取消与缓存一致性由 provider 实现。`get` 可被取消竞赛中止，即使底层 provider 不协作也不会无限阻塞调用者；底层 I/O 仍应主动响应 signal。

## 失败、权限与边界

技能能否被人或模型调用由 `invocation` 限制，注册本身不是授权外部网络/文件读取。`ctx.skills.register` 的同名 runtime 项 first-wins，后者只记 warning 并给 no-op disposer；不要用它模拟可变化的远端 catalog。`ctx.skills.get` 不保证一旦列出就永久可取，提供者资源消失时可返回 undefined。`renderSkillContent` 把 body 原样嵌入 trusted instructions，不能将任意工具结果直接提升为 Skill。

## 验证

公开导出与裁决：`packages/skill/skill/src/index.ts`，行为测试 `packages/skill/skill/tests/skill.spec.ts`。目标已发布 `skill-badge`、`skill-office`、`skill-filesystem` 是不同 provider 形态的代码证据，具体资源与 rank 不形成通用默认。隔离消费包的编译、注册、查询、渲染、卸载见创建工作区 `evidence/runtime/skill-context-review.md`；真实 Agent/Session 运行未在该测试中执行。
