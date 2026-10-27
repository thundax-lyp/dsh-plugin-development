# shortcuts：native 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

命令 owner 注册语义命令与有效键位，显示方读取同一 binding 描述。web 与 desktop 的可用修饰键与保留键不同，不能直接监听一个全局 keydown 绕过 modal/terminal/composition 仲裁。注册结果或订阅必须随 ctx.effect 清理。

## DesktopKeyboardApi protocol

入口 `@deepseek-ai/dsh-client-shortcuts/protocol`，公开符号 `DesktopKeyboardApi`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface DesktopKeyboardApi {
    subscribe(listener: (input: DesktopShortcutInput) => void): () => void;
    closeWindow(revision: ShortcutRevision): Promise<void>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `subscribe` | `subscribe(listener: (input: DesktopShortcutInput) => void): () => void;` |
| `closeWindow` | `closeWindow(revision: ShortcutRevision): Promise<void>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type DesktopShortcutInput = {
  readonly revision: ShortcutRevision
} & ({ readonly kind: 'menu'; readonly commandId: ShortcutCommandId }
  | { readonly kind: 'keyboard' | 'iframe' | 'webview'
    readonly frameName: string
    readonly code: string
    readonly secondCode?: string
    readonly control: boolean
    readonly alt: boolean
    readonly shift: boolean
    readonly meta: boolean
    readonly repeat: boolean })
```

## DesktopShortcutInput protocol

入口 `@deepseek-ai/dsh-client-shortcuts/protocol`，公开符号 `DesktopShortcutInput`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type DesktopShortcutInput = {
    readonly revision: ShortcutRevision;
} & ({
    readonly kind: 'menu';
    readonly commandId: ShortcutCommandId;
} | {
    readonly kind: 'keyboard' | 'iframe' | 'webview';
    readonly frameName: string;
    readonly code: string;
    readonly secondCode?: string;
    readonly control: boolean;
    readonly alt: boolean;
    readonly shift: boolean;
    readonly meta: boolean;
    readonly repeat: boolean;
});
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。
