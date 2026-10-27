# ui-renderer：registry 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

浏览器 `apply` 提供 `ctx.slots: SlotRegistry` 与 `ctx.uiRenderer`。插件使用服务代理方法 register/inject，不新建 SlotRegistry；代理将注册 effect 归入调用插件的 fiber。inject 等待目标 slot 的声明生命周期，声明消失就清理，重新声明再安装；回调必须同步返回 disposer 或 disposer iterable。不要注册 root：它是框架 AppFrame 的 single slot，覆盖它会移除整个页面；全局浮层使用 shell.overlay。

## RootOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-renderer/client`，公开符号 `RootOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface RootOwnerProps {
    children?: never;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `children` | `children?: never;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-renderer.md#接入-ui-renderer) 在真实装载路径检验成功、失败与卸载。

## SlotRegistry client

入口 `@deepseek-ai/dsh-client-ui-renderer/client`，公开符号 `SlotRegistry`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare class SlotRegistry extends Service {
    constructor(ctx: Context);
    readonly register: SlotCore['register'];
    readonly registerFactory: RegisterFactory;
    inject(key: keyof SlotMap & string, callback: () => SlotInjectionEffect): () => void;
    install(renderer: SlotRenderer): void;
    installLocale(face: LocaleFace): void;
    provideRoot(contribution: RootStandardSourceContribution): () => void;
    installScope(scope: Exclude<SlotScope, 'root' | 'session-maybe'>, adapter: SlotScopeAdapter): void;
    bindStoreScope(binding: Pick<ScopedStandardSourceBinding, 'key' | 'ctx'>): void;
    renderSlot<K extends keyof SlotMap & string>(key: K, owner: OwnerOf<K>): ReturnType<SlotRenderer['renderRoot']>;
    entries(key: keyof SlotMap & string): readonly StoredEntry[];
    entriesOfSlot(key: keyof SlotMap & string): readonly StoredEntry[];
    snapshot(root?: string): LiveCompositionNode[];
    onEntryError(fn: (key: string, registration: StoredEntry | StoredFactory, error: unknown, info: {
        abdicated: boolean;
    }) => void): () => void;
    spec<K extends keyof SlotMap & string>(key: K): SlotSpec<SlotMap[K]> | undefined;
    subscribe(key: keyof SlotMap & string, fn: () => void): () => void;
    getVersion(key: keyof SlotMap & string): number;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `constructor` | `constructor(ctx: Context);` |
| `register` | `readonly register: SlotCore['register'];` |
| `registerFactory` | `readonly registerFactory: RegisterFactory;` |
| `inject` | `inject(key: keyof SlotMap & string, callback: () => SlotInjectionEffect): () => void;` |
| `install` | `install(renderer: SlotRenderer): void;` |
| `installLocale` | `installLocale(face: LocaleFace): void;` |
| `provideRoot` | `provideRoot(contribution: RootStandardSourceContribution): () => void;` |
| `installScope` | `installScope(scope: Exclude<SlotScope, 'root' \| 'session-maybe'>, adapter: SlotScopeAdapter): void;` |
| `bindStoreScope` | `bindStoreScope(binding: Pick<ScopedStandardSourceBinding, 'key' \| 'ctx'>): void;` |
| `renderSlot` | `renderSlot<K extends keyof SlotMap & string>(key: K, owner: OwnerOf<K>): ReturnType<SlotRenderer['renderRoot']>;` |
| `entries` | `entries(key: keyof SlotMap & string): readonly StoredEntry[];` |
| `entriesOfSlot` | `entriesOfSlot(key: keyof SlotMap & string): readonly StoredEntry[];` |
| `snapshot` | `snapshot(root?: string): LiveCompositionNode[];` |
| `onEntryError` | `onEntryError(fn: (key: string, registration: StoredEntry \| StoredFactory, error: unknown, info: { abdicated: boolean; }) => void): () => void;` |
| `spec` | `spec<K extends keyof SlotMap & string>(key: K): SlotSpec<SlotMap[K]> \| undefined;` |
| `subscribe` | `subscribe(key: keyof SlotMap & string, fn: () => void): () => void;` |
| `getVersion` | `getVersion(key: keyof SlotMap & string): number;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-renderer.md#接入-ui-renderer) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
type SlotInjectionEffect = (() => void) | Iterable<() => void, void, void>
```
