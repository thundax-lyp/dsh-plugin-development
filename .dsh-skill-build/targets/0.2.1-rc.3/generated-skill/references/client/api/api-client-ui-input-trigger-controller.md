# ui-input-trigger：controller 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

输入触发器区分检测、候选、选择和提交。匹配源、选中值与文本插入在 controller 中仲裁；检测不应发送业务请求。候选加载失败、输入变化和取消需要使用各调用给定的 signal/结果分支，不能让陈旧菜单结果提交到新输入。

## InputTriggerController client

入口 `@deepseek-ai/dsh-client-ui-input-trigger/client`，公开符号 `InputTriggerController`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare class InputTriggerController {
    readonly menu: SnapshotStore<MenuState>;
    readonly launcher: SnapshotStore<string | null>;
    readonly headers: SnapshotStore<ReadonlyMap<string, readonly InputTriggerCrumb[]>>;
    readonly lexicon: SnapshotStore<ReadonlyMap<TriggerChar, readonly string[]>>;
    constructor(deps: InputTriggerControllerDeps);
    track(draft: string, caret: number, guard: TriggerGuard, draftRev: number): void;
    toggleSource(source: string, hit: TriggerHit): void;
    pick(source: string, index: number, action?: PickAction): void;
    pickCrumb(source: string, index: number): void;
    hover(source: string, index: number): void;
    arbitrate(key: ArbitrateKey, composing: boolean): ArbitrateOutcome;
    onSpace(): boolean;
    serializeReference(source: string, ref: string, signal: AbortSignal): Promise<string>;
    openReference(source: string | undefined, reference: Pick<ReferenceInsert, 'ref' | 'appearance'>): boolean;
    adjudicate(line: string, signal: AbortSignal, envelope: SubmitEnvelope): Promise<PickOutcome>;
    resolveClaim(token: string, signal: AbortSignal): Promise<CommandClaim | undefined>;
    sourceRemoved(source: InputTriggerSource): void;
    sourceAdded(source: InputTriggerSource): void;
    dismiss(): void;
    refreshOpenMenu(): void;
    dispose(): void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `menu` | `readonly menu: SnapshotStore<MenuState>;` |
| `launcher` | `readonly launcher: SnapshotStore<string \| null>;` |
| `headers` | `readonly headers: SnapshotStore<ReadonlyMap<string, readonly InputTriggerCrumb[]>>;` |
| `lexicon` | `readonly lexicon: SnapshotStore<ReadonlyMap<TriggerChar, readonly string[]>>;` |
| `constructor` | `constructor(deps: InputTriggerControllerDeps);` |
| `track` | `track(draft: string, caret: number, guard: TriggerGuard, draftRev: number): void;` |
| `toggleSource` | `toggleSource(source: string, hit: TriggerHit): void;` |
| `pick` | `pick(source: string, index: number, action?: PickAction): void;` |
| `pickCrumb` | `pickCrumb(source: string, index: number): void;` |
| `hover` | `hover(source: string, index: number): void;` |
| `arbitrate` | `arbitrate(key: ArbitrateKey, composing: boolean): ArbitrateOutcome;` |
| `onSpace` | `onSpace(): boolean;` |
| `serializeReference` | `serializeReference(source: string, ref: string, signal: AbortSignal): Promise<string>;` |
| `openReference` | `openReference(source: string \| undefined, reference: Pick<ReferenceInsert, 'ref' \| 'appearance'>): boolean;` |
| `adjudicate` | `adjudicate(line: string, signal: AbortSignal, envelope: SubmitEnvelope): Promise<PickOutcome>;` |
| `resolveClaim` | `resolveClaim(token: string, signal: AbortSignal): Promise<CommandClaim \| undefined>;` |
| `sourceRemoved` | `sourceRemoved(source: InputTriggerSource): void;` |
| `sourceAdded` | `sourceAdded(source: InputTriggerSource): void;` |
| `dismiss` | `dismiss(): void;` |
| `refreshOpenMenu` | `refreshOpenMenu(): void;` |
| `dispose` | `dispose(): void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-input-trigger.md#接入-ui-input-trigger) 在真实装载路径检验成功、失败与卸载。

## InputTriggerControllerDeps client

入口 `@deepseek-ai/dsh-client-ui-input-trigger/client`，公开符号 `InputTriggerControllerDeps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface InputTriggerControllerDeps {
    actx: ClientContext;
    sessionId: SessionId;
    roster: SourceRoster;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `actx` | `actx: ClientContext;` |
| `sessionId` | `sessionId: SessionId;` |
| `roster` | `roster: SourceRoster;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-input-trigger.md#接入-ui-input-trigger) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SourceRoster {
  sources(trigger: string): readonly InputTriggerSource[]
  all(): readonly InputTriggerSource[]
}
```

## SourceRoster client

入口 `@deepseek-ai/dsh-client-ui-input-trigger/client`，公开符号 `SourceRoster`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SourceRoster {
    sources(trigger: string): readonly InputTriggerSource[];
    all(): readonly InputTriggerSource[];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `sources` | `sources(trigger: string): readonly InputTriggerSource[];` |
| `all` | `all(): readonly InputTriggerSource[];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-input-trigger.md#接入-ui-input-trigger) 在真实装载路径检验成功、失败与卸载。
