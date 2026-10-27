# ui-settings：config-form 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

ConfigForms 是浏览器读取与编辑 Host 配置的入口。通过 namespace/entryId 取得表单，订阅不可变 snapshot，再使用 set/mutate 提交；Host 验证成功才接受持久值。配置无效或 revision 不匹配应保留错误与重新读取，不能把本地表单 staging 当已保存状态。

## ConfigForms client

入口 `@deepseek-ai/dsh-client-ui-settings/client`，公开符号 `ConfigForms`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare class ConfigForms extends Service {
    readonly developerTools: DeveloperToolsPreference;
    constructor(ctx: Context, config: {
        mirror: SettingsDescribeMirror;
        schema: SettingsSchemaService;
    });
    describe(): SettingsDescribeFace;
    get<T>(entryId: string): ConfigForm<T>;
    whileServed(namespaces: readonly string[], register: (served: ReadonlySet<string>) => () => void): () => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `developerTools` | `readonly developerTools: DeveloperToolsPreference;` |
| `constructor` | `constructor(ctx: Context, config: { mirror: SettingsDescribeMirror; schema: SettingsSchemaService; });` |
| `describe` | `describe(): SettingsDescribeFace;` |
| `get` | `get<T>(entryId: string): ConfigForm<T>;` |
| `whileServed` | `whileServed(namespaces: readonly string[], register: (served: ReadonlySet<string>) => () => void): () => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-settings.md#接入-ui-settings) 在真实装载路径检验成功、失败与卸载。
