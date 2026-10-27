# @deepseek-ai/dsh-experimental-browser-use-stagehand-native 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

导航浏览器标签页、截图，并让 Stagehand 执行操作、查找可用操作或提取页面数据。Stagehand 的 AI（人工智能）辅助操作使用单独配置的原生模型。每个活动 Session 获得独立浏览器，也可由一个 Session 独占连接到显式配置的现有浏览器。这个公开的实验性包需要显式启用。

### 使用此包

在已提供 Agent、Session、工具注册表和系统提示的 profile 中挂载此 Provider。若需以图像形式接收截图，还应配置附件存储和支持图像输入的 Session 模型。

#### 最小配置

```yaml
- name: '@deepseek-ai/dsh-browser-use'
- name: '@deepseek-ai/dsh-experimental-browser-use-stagehand-native'
  config:
    mode: launch
    headless: true
    model:
      modelName: openai/gpt-5.4-mini
      apiKey: !!js process.env.OPENAI_API_KEY
```

使用此示例前设置 `OPENAI_API_KEY`。即使只使用导航，也必须提供 `model`。固定版本 SDK 接受其目录中的 OpenAI、Anthropic、Google、Groq 和 Cerebras 模型；不支持 DeepSeek 端点或 `baseURL` 覆盖。

提供方通过 Worker 将 `model.apiKey` 和可选的 `model.headers` 转发给 Stagehand 浏览器扩展，由扩展发送原生模型请求。

安装与固定版本 Stagehand SDK 兼容的 Chrome 或 Chromium 可执行程序。首次浏览器工具调用时才启动原生运行时。默认查找稳定版 Chrome 的标准安装路径；其他 Chrome 或 Chromium 安装位置通过 `executablePath` 指定。Stagehand 管理其运行时扩展；运行时不兼容或不可用时，启动会失败。

| 字段 | 默认值 | 含义 |
|---|---|---|
| `mode` | `launch` | 启动独立浏览器，或以 `attach` 连接现有浏览器。 |
| `cdpEndpoint` | `attach` 必填 | 由 profile 选择的 HTTP 或 WebSocket 调试端点。 |
| `extensionId` | 加载内置扩展 | 在现有浏览器中使用的已安装 Stagehand 扩展。 |
| `executablePath` | 已安装的稳定版 Chrome | Chrome 或 Chromium 可执行程序，仅适用于 `launch`。 |
| `headless` | `true` | 隐藏启动的浏览器窗口。 |
| `operationTimeoutMs` | `30000` | Chromium 启动、导航和自然语言操作的超时时间。 |
| `model.modelName` | 必填 | 固定版本 Stagehand SDK 目录中的模型。 |
| `model.apiKey` | 必填 | 原生模型提供方 API 密钥，会转发给浏览器扩展。 |
| `model.headers` | 无 | 原生模型请求的附加请求头。 |
| `shutdownGraceMs` | `5000` | 终止连接 Worker 前，允许 SDK 完成清理的宽限时间。 |

现有 Chromium 浏览器必须开放 CDP，并允许 Stagehand 扩展连接。已验证的本地配置使用 `--remote-debugging-port=0`、`--remote-allow-origins=*`、`--enable-unsafe-extension-debugging` 以及独立的 `--user-data-dir`。将 `cdpEndpoint` 设为 Chrome 报告的端点。

连接模式同时只允许一个确切的活动 Agent。其他 Session 会收到占用错误，直到所有者释放。连接由 profile 配置决定；工具参数不能切换端点或模型。释放连接运行时后，外部所有的浏览器继续运行。

#### 验证

定向检查覆盖原生模型配置、生命周期、Loader 组合、取消和截图接纳。

```sh
pnpm exec vitest run packages/experimental/browser-use-stagehand-native/tests
```

显式启用的已安装浏览器测试使用受控本地页面和构建后的连接 Worker。请将 `DSH_BROWSER_EXECUTABLE` 设为已安装的 Chromium 可执行程序。只有同时提供 `DSH_STAGEHAND_MODEL` 和 `DSH_STAGEHAND_MODEL_API_KEY` 时，才会测试原生推理。

```sh
pnpm run build
env -u NODE_USE_ENV_PROXY DSH_STAGEHAND_E2E=1 pnpm exec vitest run --config vitest.e2e.config.ts packages/experimental/browser-use-stagehand-native/tests/native.e2e.ts
```

-----

### 已知限制与暂缓工作

此 Provider 继承固定版本 Stagehand SDK 的浏览器与扩展要求。

- **仅 Chromium**——Firefox 和 WebKit 不在此 Provider 的支持范围内。
- **活动浏览器状态**——Session 回放恢复记录的对话数据，不恢复浏览器进程、Cookie 或标签页句柄。
- **原生模型**——模型名称仅限固定版本 SDK 目录中的 OpenAI、Anthropic、Google、Groq 和 Cerebras。DeepSeek 端点、`baseURL` 覆盖、自主 agent 和单次调用的模型选择均不受支持。
- **取消**——原生推理不接受 abort signal。SDK 关闭会等待活动工作；清理成功后，下次工具调用可重新连接并保留浏览器。取消不撤销浏览器输入，也不保证原生模型请求停止。
- **现有浏览器访问**——用户也可修改已连接的浏览器；占用机制只协调 DSH Session。
- **清理失败**——SDK 工作未能结束时，保留附加浏览器的占用，因为原生扩展中的工作可能继续。启动浏览器的最终清理可在 Chromium 和 Worker 都终止后释放占用，即使 SDK 工作未正常结束。Worker、自有进程或配置目录清理失败时保留占用；选择其他 Provider 前应重启宿主。
- **DSH 模型集成**——暂缓 Session 模型路由、DSH 凭据复用、底层推理请求/响应捕获，以及与 DSH Session 用量计量的集成。返回的工具数据和 SDK 元数据仍可回放。

## Config（.）

公开导入：`@deepseek-ai/dsh-experimental-browser-use-stagehand-native`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export interface Config {
    model: StagehandModelConfig;
    mode: 'launch' | 'attach';
    cdpEndpoint?: string;
    extensionId?: string;
    executablePath?: string;
    headless?: boolean;
    operationTimeoutMs?: number;
    shutdownGraceMs?: number;
}

export declare const Config: Schema<Config, ResolvedConfig>;
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-browser-use-stagehand-native.md)。

## apply（.）

公开导入：`@deepseek-ai/dsh-experimental-browser-use-stagehand-native`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context, input: Config): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-browser-use-stagehand-native.md)。

## inject（.）

公开导入：`@deepseek-ai/dsh-experimental-browser-use-stagehand-native`；公开符号：`inject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-browser-use-stagehand-native.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-experimental-browser-use-stagehand-native`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "experimental-browser-use-stagehand-native";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-browser-use-stagehand-native.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
