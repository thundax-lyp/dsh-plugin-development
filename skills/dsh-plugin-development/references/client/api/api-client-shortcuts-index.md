# shortcuts：index 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

命令 owner 注册语义命令与有效键位，显示方读取同一 binding 描述。web 与 desktop 的可用修饰键与保留键不同，不能直接监听一个全局 keydown 绕过 modal/terminal/composition 仲裁。注册结果或订阅必须随 ctx.effect 清理。

## default client

入口 `@deepseek-ai/dsh-client-shortcuts/client`，公开符号 `default`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export default class ShortcutsService extends Service implements Shortcuts {
    static inject: string[];
    readonly runtime: Shortcuts['runtime'];
    readonly platform: Shortcuts['platform'];
    readonly catalog: Shortcuts['catalog'];
    readonly config: Shortcuts['config'];
    readonly fixedCatalog: Shortcuts['fixedCatalog'];
    readonly stopSequenceMs: number;
    constructor(ctx: Context);
    register(command: Parameters<Shortcuts['register']>[0]): () => void;
    registerFixed(command: Parameters<Shortcuts['registerFixed']>[0]): () => void;
    observeFixedInput(listener: (input: ShortcutFixedInput) => void): () => void;
    describeBinding(binding: Parameters<Shortcuts['describeBinding']>[0]): ReturnType<Shortcuts['describeBinding']>;
    edit(...args: Parameters<Shortcuts['edit']>): ReturnType<Shortcuts['edit']>;
    recording(active: boolean): Promise<void>;
    closeWindow(): Promise<void>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `inject` | `static inject: string[];` |
| `runtime` | `readonly runtime: Shortcuts['runtime'];` |
| `platform` | `readonly platform: Shortcuts['platform'];` |
| `catalog` | `readonly catalog: Shortcuts['catalog'];` |
| `config` | `readonly config: Shortcuts['config'];` |
| `fixedCatalog` | `readonly fixedCatalog: Shortcuts['fixedCatalog'];` |
| `stopSequenceMs` | `readonly stopSequenceMs: number;` |
| `constructor` | `constructor(ctx: Context);` |
| `register` | `register(command: Parameters<Shortcuts['register']>[0]): () => void;` |
| `registerFixed` | `registerFixed(command: Parameters<Shortcuts['registerFixed']>[0]): () => void;` |
| `observeFixedInput` | `observeFixedInput(listener: (input: ShortcutFixedInput) => void): () => void;` |
| `describeBinding` | `describeBinding(binding: Parameters<Shortcuts['describeBinding']>[0]): ReturnType<Shortcuts['describeBinding']>;` |
| `edit` | `edit(...args: Parameters<Shortcuts['edit']>): ReturnType<Shortcuts['edit']>;` |
| `recording` | `recording(active: boolean): Promise<void>;` |
| `closeWindow` | `closeWindow(): Promise<void>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-shortcuts.md#接入-shortcuts) 在真实装载路径检验成功、失败与卸载。
