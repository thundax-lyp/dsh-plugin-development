# @deepseek-ai/cordis .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/cordis 选型与组合](api-core-cordis-root-overview.md)。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## Context 公开契约

Context 是代理依赖容器。`extend(meta)` 创建以当前 Context 为原型的子作用域，不修改父级；meta 自有属性遮蔽父属性。`isolate(name,label?)` 为服务名建立独立解析标签，复用同一 label 才共享隔离组；这不提供进程或权限隔离。`intercept(name, config)` 只为其下的插件贡献该服务的配置，合并次序为祖先到后代。`Context.is(value)` 用全局 symbol 跨 realm 与 Cordis 副本识别 Context，优于 instanceof。`root` 在源码上标为 experimental，不能将 root 上任意操作推定为稳定扩展契约。声明合并还把 `ctx.plugin/inject/on/once/effect/get/provide` 置于 Context；仅此对象的直接成员表不表示这些服务混入不存在。

导入入口：`@deepseek-ai/cordis`；公开符号：`Context`。

目标版本编译声明（省略源码注释与实现体）：

声明来源包 `@deepseek-ai/cordis`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
export interface Context {
    [symbols.isolate]: Dict<symbol>;
    [symbols.intercept]: Dict;
    root: this;
    baseUrl?: string;
    events: EventsService;
    logger: LoggerService;
    reflect: ReflectService;
    registry: RegistryService;
}
```

声明来源包 `@deepseek-ai/cordis`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
export declare class Context {
    static readonly effect: unique symbol;
    static readonly filter: unique symbol;
    static readonly isolate: unique symbol;
    static readonly intercept: unique symbol;
    static is(value: any): value is Context;
    constructor();
    extend(meta?: {}): this;
    isolate(name: string, label?: symbol): this;
    intercept<K extends InjectKey>(name: K, config: Context[K] extends {
        [symbols.config]: infer T;
    } ? T : never): this;
    intercept(name: string, config: any): this;
}
```

声明来源包 `@deepseek-ai/cordis`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    inject(deps: Inject, callback: Plugin.Function<void>): Fiber & PromiseLike<Fiber>;
    plugin<P extends Plugin>(plugin: P, ...args: Spread<GetPluginConfig<P>>): Fiber & PromiseLike<Fiber>;
}
```

声明来源包 `@deepseek-ai/cordis`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    get<K extends string & keyof this>(name: K, strict?: boolean): undefined | this[K];
    get(name: string, strict?: boolean): any;
    set<K extends string & keyof this>(name: K, value: undefined | this[K]): void;
    set(name: string, value: any): void;
    provide<K extends string & keyof this>(name: K, value: undefined | this[K]): () => void;
    provide(name: string, value?: any): () => void;
    accessor(name: string, options: Omit<Property.Accessor, 'type'>): void;
    mixin<K extends string & keyof this>(name: K, mixins: (keyof this & keyof this[K])[] | Dict<string>): void;
    mixin<T extends {}>(source: T, mixins: (keyof this & keyof T)[] | Dict<string>): void;
}
```

声明来源包 `@deepseek-ai/cordis`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context extends Pick<Fiber, 'effect'> {
    fiber: Fiber;
}
```

声明来源包 `@deepseek-ai/cordis`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    parallel<K extends keyof Events>(name: K, ...args: Parameters<Events[K]>): Promise<void>;
    parallel<K extends keyof Events>(thisArg: NoInfer<ThisType<Events[K]>>, name: K, ...args: Parameters<Events[K]>): Promise<void>;
    emit<K extends keyof Events>(name: K, ...args: Parameters<Events[K]>): void;
    emit<K extends keyof Events>(thisArg: NoInfer<ThisType<Events[K]>>, name: K, ...args: Parameters<Events[K]>): void;
    serial<K extends keyof Events>(name: K, ...args: Parameters<Events[K]>): Promisify<ReturnType<Events[K]>>;
    serial<K extends keyof Events>(thisArg: NoInfer<ThisType<Events[K]>>, name: K, ...args: Parameters<Events[K]>): Promisify<ReturnType<Events[K]>>;
    bail<K extends keyof Events>(name: K, ...args: Parameters<Events[K]>): ReturnType<Events[K]>;
    bail<K extends keyof Events>(thisArg: NoInfer<ThisType<Events[K]>>, name: K, ...args: Parameters<Events[K]>): ReturnType<Events[K]>;
    waterfall<K extends keyof Events>(name: K, ...args: Parameters<Events[K]>): ReturnType<Events[K]>;
    waterfall<K extends keyof Events>(thisArg: NoInfer<ThisType<Events[K]>>, name: K, ...args: Parameters<Events[K]>): ReturnType<Events[K]>;
    on<K extends keyof Events>(name: K, listener: Events[K], options?: boolean | EventOptions): () => boolean;
    once<K extends keyof Events>(name: K, listener: Events[K], options?: boolean | EventOptions): () => boolean;
}
```

声明来源包 `@deepseek-ai/dsh-experimental-inspector`，适用 Client；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    inspector: InspectorService;
}
```

声明来源包 `@deepseek-ai/dsh-typert-protocol`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    typert: TypertRegistryContract;
    readonly invocation: RemoteInvocation | undefined;
}
```

声明来源包 `@deepseek-ai/dsh-attachment`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    attachments: AttachmentStore;
}
```

声明来源包 `@deepseek-ai/dsh-llm`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    llm: LlmRuntime;
}
```

声明来源包 `@deepseek-ai/dsh-session`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    sessions: SessionStore;
}
```

声明来源包 `@deepseek-ai/dsh-system-prompt`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    systemPrompt: SystemPrompt;
}
```

声明来源包 `@deepseek-ai/dsh-agent`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    agents: AgentRegistry;
}
```

声明来源包 `@deepseek-ai/dsh-sandbox`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    sandbox: SandboxProvider;
}
```

声明来源包 `@deepseek-ai/dsh-ptc-runtime`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    ptcRuntime: PtcRuntime;
}
```

声明来源包 `@deepseek-ai/dsh-user-approval`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    approval: ApprovalService;
}
```

声明来源包 `@deepseek-ai/dsh-tools`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    tools: ToolRuntime;
}
```

声明来源包 `@deepseek-ai/dsh-subagent`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    subagents: SubagentRuntime;
}
```

声明来源包 `@deepseek-ai/dsh-commands`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    commands: CommandRuntime;
}
```

声明来源包 `@deepseek-ai/dsh-workflow`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    workflowEngine: WorkflowEngine;
}
```

声明来源包 `@deepseek-ai/dsh-user-questions`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    userQuestions: UserQuestionService;
}
```

声明来源包 `@deepseek-ai/dsh-experimental-inspector`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    inspector: InspectorService;
}
```

声明来源包 `@deepseek-ai/dsh-launch-environment`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    launchEnvironment?: LaunchEnvironmentSnapshot;
}
```

声明来源包 `@deepseek-ai/dsh-deepseek-llm-api-extensions`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    deepseekLlmApiExtensions: DeepSeekLlmApiExtensionRegistry;
}
```

声明来源包 `@deepseek-ai/dsh-experimental-claude-code-mods`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    claudeCodeMods: ClaudeCodeMods;
}
```

声明来源包 `@deepseek-ai/dsh-compaction`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    compaction: CompactionEngine;
}
```

声明来源包 `@deepseek-ai/dsh-skill`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    skills: SkillRegistry;
}
```

声明来源包 `@deepseek-ai/cordis-plugin-loader`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    loader: Loader;
}
```

声明来源包 `@deepseek-ai/dsh-compaction-tool-result-pruner`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    toolResultPruner: ToolResultPruner;
}
```

声明来源包 `@deepseek-ai/dsh-session-reference`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    sessionReferenceResolver: SessionReferenceResolver;
}
```

声明来源包 `@deepseek-ai/dsh-session-title`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    sessionTitle: SessionTitleService;
}
```

声明来源包 `@deepseek-ai/dsh-subprocess`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    subprocess: SubprocessRuntime;
}
```

声明来源包 `@deepseek-ai/dsh-shell`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    shell: ShellExecutor;
}
```

声明来源包 `@deepseek-ai/dsh-goal`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    goals: GoalService;
}
```

声明来源包 `@deepseek-ai/dsh-file-reference`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    fileReferences: FileReferenceService;
}
```

声明来源包 `@deepseek-ai/dsh-experimental-speech-to-text`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    speechToText: SpeechToText;
}
```

声明来源包 `@deepseek-ai/dsh-credentials`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    credentials: CredentialProvider;
}
```

声明来源包 `@deepseek-ai/dsh-permission-presets`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    permissionPresets: PermissionPresetService;
}
```

声明来源包 `@deepseek-ai/dsh-experimental-agent-team`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    agentTeams: TeamService;
}
```

声明来源包 `@deepseek-ai/dsh-webhook`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    webhookRuntime: WebhookRuntime;
}
```

声明来源包 `@deepseek-ai/dsh-token-meter`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    tokenMeter: TokenMeter;
}
```

声明来源包 `@deepseek-ai/dsh-experimental-translator`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    translator: Translator;
}
```

声明来源包 `@deepseek-ai/dsh-mcp-resources`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    mcpResources: McpResourceRuntime;
}
```

声明来源包 `@deepseek-ai/dsh-host-webserver`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    webServer: WebServer;
}
```

声明来源包 `@deepseek-ai/dsh-plan-mode`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    planMode: PlanModeController;
}
```

声明来源包 `@deepseek-ai/dsh-experimental-worktree`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    worktrees: WorktreeService;
}
```

声明来源包 `@deepseek-ai/dsh-fs`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    fs: FileSystem;
}
```

声明来源包 `@deepseek-ai/dsh-experimental-api-speech-to-text`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    speechController: SpeechController;
}
```

声明来源包 `@deepseek-ai/dsh-tool-subagent`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    subagentModelSelection: SubagentModelSelectionConfig;
}
```

声明来源包 `@deepseek-ai/dsh-plugin-manager`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    pluginManager: PluginManager;
}
```

声明来源包 `@deepseek-ai/dsh-settings`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    settings: SettingsForms;
}
```

声明来源包 `@deepseek-ai/dsh-plugin-market`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    pluginMarket: PluginMarket;
}
```

声明来源包 `@deepseek-ai/dsh-api-gateway`，适用 Client；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    remote: ClientRemote;
}
```

声明来源包 `@deepseek-ai/dsh-api-remotes`，适用 Client；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    remote: ClientRemote;
}
```

声明来源包 `@deepseek-ai/dsh-api-job-controller`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    jobController: JobController;
}
```

声明来源包 `@deepseek-ai/dsh-api-session-controller`，适用 Client；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    sessions: import('./contract/sessions.ts').ISessions;
}
```

声明来源包 `@deepseek-ai/dsh-session-persistence`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    sessionPersistence: SessionPersistence;
}
```

声明来源包 `@deepseek-ai/dsh-session-projection`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    sessionProjections: SessionProjectionRegistry;
}
```

声明来源包 `@deepseek-ai/dsh-session-query`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    sessionQuery: SessionQueryEngine;
}
```

声明来源包 `@deepseek-ai/dsh-api-session-controller`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    sessionFileReferences: SessionFileReferences;
}
```

声明来源包 `@deepseek-ai/dsh-api-session-controller`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    sessionSkillCatalog: SessionSkillCatalog;
}
```

声明来源包 `@deepseek-ai/dsh-api-session-controller`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    sessionController: SessionController;
}
```

声明来源包 `@deepseek-ai/dsh-host-directory-picker`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    directoryPicker: DirectoryPicker;
}
```

声明来源包 `@deepseek-ai/dsh-api-job-controller`，适用 Client；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    jobs: IJobs;
}
```

声明来源包 `@deepseek-ai/dsh-cordis-host-runner`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    cordisInspect: CordisInspectRegistryService;
}
```

声明来源包 `@deepseek-ai/dsh-cordis-host-runner`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    dynamicCordisRunner: DynamicCordisRunnerService;
}
```

声明来源包 `@deepseek-ai/dsh-app-boot`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    profileContext: ProfileContext;
}
```

声明来源包 `@deepseek-ai/dsh-app-boot`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    pluginPackages: PluginPackages;
}
```

声明来源包 `@deepseek-ai/dsh-app-boot`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    dshHomePath?: typeof dshHomePath;
}
```

声明来源包 `@deepseek-ai/dsh-agent-default-model`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    agentDefaultModel: AgentDefaultModelConfig;
}
```

声明来源包 `@deepseek-ai/dsh-client-modules`，适用 Client；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    modules: ClientModuleLoader;
}
```

声明来源包 `@deepseek-ai/dsh-client-ui-renderer`，适用 Client；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    slots: SlotRegistry;
    uiRenderer: UiRendererService;
}
```

声明来源包 `@deepseek-ai/dsh-cordis-client-runner`，适用 Client；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    cordisInspect: ClientCordisInspectRegistry;
}
```

声明来源包 `@deepseek-ai/dsh-cordis-client-runner`，适用 Client；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context extends Pick<ClientTimerService, 'interval' | 'timeout' | 'throttle' | 'debounce' | 'setTimeout' | 'setInterval'> {
    timer: ClientTimerService;
}
```

声明来源包 `@deepseek-ai/dsh-cordis-client-runner`，适用 Client；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    dynamicCordisRunner: CordisRunnerFace;
}
```

声明来源包 `@deepseek-ai/dsh-client-file-upload`，适用 Client；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    fileUpload: FileUploadService;
}
```

声明来源包 `@deepseek-ai/dsh-api-workspace-controller`，适用 Client；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    workspaces: import('./service.ts').IWorkspaces;
}
```

声明来源包 `@deepseek-ai/dsh-api-remote-access`，适用 Client；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    remoteAccess: ClientRemoteAccess;
}
```

声明来源包 `@deepseek-ai/dsh-client-ui-session`，适用 Client；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    uiSession: UiSession;
}
```

声明来源包 `@deepseek-ai/dsh-client-ui-conversation`，适用 Client；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    conversation: import('./service.ts').IConversation;
    uiConversation: import('./conversation/assembly.ts').UiConversation;
}
```

声明来源包 `@deepseek-ai/dsh-client-ui-chat`，适用 Client；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    chatFileMentions: ChatFileMentions;
}
```

声明来源包 `@deepseek-ai/dsh-client-ui-tool`，适用 Client；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    userQuestionPanels: UserQuestionPanels;
}
```

声明来源包 `@deepseek-ai/dsh-api-workspace-controller`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    directoryPickerController: DirectoryPickerController;
}
```

声明来源包 `@deepseek-ai/dsh-api-workspace-controller`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    workspaceController: WorkspaceController;
}
```

声明来源包 `@deepseek-ai/dsh-api-terminal-controller`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    terminalController: TerminalController;
}
```

声明来源包 `@deepseek-ai/dsh-api-gateway`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    typertGateway: TypertGateway;
}
```

声明来源包 `@deepseek-ai/dsh-hmr`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    hmr: Hmr;
}
```

声明来源包 `@deepseek-ai/dsh-api-workspace-files`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    workspaceFiles: WorkspaceFiles;
}
```

声明来源包 `@deepseek-ai/dsh-api-terminal-controller`，适用 Client；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    webTerminals: ClientTerminals;
}
```

声明来源包 `@deepseek-ai/dsh-api-remote-access`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    remoteAccess: RemoteAccessService;
}
```

声明来源包 `@deepseek-ai/dsh-cmdline`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    cmdlineArgs?: CmdlineArgs;
    appExit?: AppExit;
    appReady?: AppReady;
}
```

声明来源包 `@deepseek-ai/dsh-otel`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    otel: OTel;
}
```

声明来源包 `@deepseek-ai/dsh-host-product-telemetry-otel`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    productTelemetry: ProductTelemetry;
}
```

声明来源包 `@deepseek-ai/dsh-web-app`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    webApp: WebApp;
}
```

声明来源包 `@deepseek-ai/dsh-agent-preset-registry`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    agentPresets: AgentPresetRegistry;
}
```

声明来源包 `@deepseek-ai/dsh-api-settings-controller`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    credentialsController: CredentialsController;
}
```

声明来源包 `@deepseek-ai/dsh-api-settings-controller`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    settingsController: SettingsController;
}
```

声明来源包 `@deepseek-ai/dsh-agent-loop`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    agentLoop: AgentLoop;
    configuredAgentIdentities?: ConfiguredAgentIdentities;
}
```

声明来源包 `@deepseek-ai/cordis-plugin-hmr`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    hmr: Hmr;
}
```

声明来源包 `@deepseek-ai/cordis-plugin-timer`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context extends Pick<TimerService, 'interval' | 'timeout' | 'throttle' | 'debounce' | 'setTimeout' | 'setInterval'> {
    timer: TimerService;
}
```

声明来源包 `@deepseek-ai/dsh-config-editor`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    configEditor: ConfigEditor;
}
```

声明来源包 `@deepseek-ai/dsh-authorization`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    authorization: AuthorizationService;
}
```

声明来源包 `@deepseek-ai/dsh-browser-use`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    browserUse: BrowserUseRegistry;
}
```

声明来源包 `@deepseek-ai/dsh-command-feedback`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    sessionFeedback: SessionFeedbackService;
}
```

声明来源包 `@deepseek-ai/dsh-computer-use`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    computerUse: ComputerUseRegistry;
}
```

声明来源包 `@deepseek-ai/dsh-deepseek-account`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    deepseekAccount: DeepSeekAccount;
}
```

声明来源包 `@deepseek-ai/dsh-jobs`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    jobs: JobRegistry;
}
```

声明来源包 `@deepseek-ai/dsh-lsp`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    lsp: LspService;
}
```

声明来源包 `@deepseek-ai/dsh-message-feedback`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    messageFeedback: MessageFeedbackService;
}
```

声明来源包 `@deepseek-ai/dsh-office-to-pdf`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    officeToPdf: OfficeToPdf;
}
```

声明来源包 `@deepseek-ai/dsh-sandbox-policy`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    sandboxPolicy: SandboxPolicyService;
}
```

声明来源包 `@deepseek-ai/dsh-storage`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    storage: Storage;
}
```

声明来源包 `@deepseek-ai/dsh-storage-domain`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    storageDomain: DomainFacility;
}
```

声明来源包 `@deepseek-ai/dsh-schedule`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    schedule: ScheduleService;
}
```

声明来源包 `@deepseek-ai/dsh-session-log-export`，适用 Client；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    sessionLogDownload: SessionLogDownloadController;
}
```

声明来源包 `@deepseek-ai/dsh-session-projection-cache`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    sessionProjectionCache: SessionProjectionCache;
}
```

声明来源包 `@deepseek-ai/dsh-session-query-sqlite`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    launcherSessionQueryPath?: string;
}
```

声明来源包 `@deepseek-ai/dsh-session-telemetry`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    sessionTelemetry: SessionTelemetryBackend;
}
```

声明来源包 `@deepseek-ai/dsh-shell-env`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    shellEnv: ShellEnvRegistry;
}
```

声明来源包 `@deepseek-ai/dsh-spill`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    spillStore: SpillStore;
}
```

声明来源包 `@deepseek-ai/dsh-ssh`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    ssh: SshConnection;
}
```

声明来源包 `@deepseek-ai/dsh-terminal`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    terminals: TerminalSessionService;
}
```

声明来源包 `@deepseek-ai/dsh-web`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    web: WebRuntime;
}
```

声明来源包 `@deepseek-ai/dsh-working-directory`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    workingDirectory: WorkingDirectoryService;
}
```

声明来源包 `@deepseek-ai/dsh-workspace-changes`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    workspaceChanges: WorkspaceChanges;
}
```

声明来源包 `@deepseek-ai/dsh-workspace`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Context {
    workspaceRegistry: WorkspaceRegistry;
}
```

成员检索：`accessor`、`bail`、`baseUrl`、`effect`、`emit`、`events`、`extend`、`fiber`、`get`、`inject`、`intercept`、`isolate`、`logger`、`mixin`、`on`、`once`、`parallel`、`plugin`、`provide`、`reflect`、`registry`、`root`、`serial`、`set`、`waterfall`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## DispatchMode 公开契约

导入入口：`@deepseek-ai/cordis`；公开符号：`DispatchMode`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type DispatchMode = 'emit' | 'parallel' | 'serial' | 'bail' | 'waterfall';
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## Disposable 公开契约

导入入口：`@deepseek-ai/cordis`；公开符号：`Disposable`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type Disposable<T = any> = () => T;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## Effect 公开契约

导入入口：`@deepseek-ai/cordis`；公开符号：`Effect`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type Effect<T = any> = SyncEffect<T> | AsyncEffect<T>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## EventOptions 公开契约

导入入口：`@deepseek-ai/cordis`；公开符号：`EventOptions`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface EventOptions {
    prepend?: boolean;
    global?: boolean;
}
```

成员检索：`global`、`prepend`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。
