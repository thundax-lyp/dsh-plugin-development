# @deepseek-ai/dsh-llm-pi-ai 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

`@deepseek-ai/dsh-llm-pi-ai` 通过一份配置把模型请求路由到多个 pi-ai 提供方、OpenAI 兼容网关或自托管服务器。已安装的 pi-ai 提供方会提供端点、协议和模型目录默认值；自定义路由可以直接声明这些值，无需修改代码。profile 与凭据按请求解析，因此设置变更会在下一个请求生效，无需重启。受支持的提供方可以使用已存储的 OAuth 或交互式密钥登录，并通过跨进程锁刷新凭据。本包可以在没有路由时启动，并在用户设置添加路由后将其激活。

### 使用本包

当组合需要通过 pi-ai 的提供方目录、或通过 pi-ai 已安装目录未描述的网关路由模型请求时挂载本插件。`providers` 字典就是整个配置面：每个键都是请求用 `GenerateOptions.provider` 选择的提供方路由名。

适配器接受 LLM 服务的仅供请求使用的 user 输入，并可将其与持久历史混用。user 身份与来源不会进入 pi-ai 内容；assistant 回放元数据和工具调用关联仍由持久消息携带。

#### 何时选择

当同一组合服务多个提供方、某条路由需要 pi-ai 目录默认值并修正少数字段、或必须通过自有端点与协议到达手工声明网关时，选择本适配器。当部署不需要其他提供方时，选择 `dsh-llm-deepseek` 直连 DeepSeek 路由。两个适配器可以同时挂载，因为它们的路由名不冲突；注册其他适配器已拥有的路由会导致插件加载失败。

#### 配置提供方路由

每个 profile 都可以设置 `retryPolicy`；省略时使用 normal mode、最多重试五次。`apiKeyEnv` 是按请求经 harness 凭据 seam 解析的凭据引用，因此配置文件绝不包含密钥；解析为空的引用会让请求以 `MISSING_CREDENTIAL` 失败。省略它会让路由保持已配置但无密钥（configured-but-keyless）状态，对已安装目录路由而言即交由 pi-ai 提供方原生的环境发现。

```yaml
- name: '@deepseek-ai/dsh-llm-pi-ai'
  config:
    providers:
      openai:
        apiKeyEnv: OPENAI_API_KEY
        baseURL: https://proxy.example.com:8443
        reasoning: high
        requestImagePixelBudget: 4194304 # total pixels; 2048 by 2048 default
        requestImageMaxBytes: 1048576    # raw bytes before base64 expansion
        maxRequestImageBytes: 20971520   # accumulated base64 payload
        retryPolicy:
          mode: normal
          maxRetries: 3
      anthropic:
        apiKeyEnv: ANTHROPIC_API_KEY
        models:
          - id: claude-sonnet-4-5
            contextWindow: 200000
      acme-gateway:
        displayName: Acme Gateway
        apiKeyEnv: ACME_GATEWAY_API_KEY
        api: openai-completions
        baseURL: https://gateway.acme.example/v1
        compat:
          thinkingFormat: deepseek
        models:
          - id: acme-think
            name: Acme Think
            contextWindow: 262144
            reasoningEfforts:
              off:
              high: high
```

| 字段 | 默认值 | 含义 |
|---|---|---|
| `apiKeyEnv` | 无 | 按请求解析的凭据引用；省略时交由 pi-ai 环境发现 |
| `displayName` | 提供方名 | 选择器界面显示的标签 |
| `api` | 目录协议 | 协议格式；仅目录不提供的路由需要 |
| `baseURL` | 目录端点 | 路由上所有模型的端点 |
| `models` | 已安装目录 | 整体替换路由目录；每个条目从已安装模型取默认值 |
| `modelOverrides` | 无 | 重塑个别已安装目录模型，而不替换其余模型 |
| `compat` | 目录检测 | 无法识别端点的协议兼容开关 |
| `defaultContextWindow` | `262,144` | 未描述模型的容量回退 |
| `defaultMaxTokens` | `32,768` | 未描述模型的输出上限回退 |
| `requestImagePixelBudget` | `4,194,304` | 每张确定性请求图片的总像素预算 |
| `requestImageMaxBytes` | `1 MiB` | 每张请求图片在 base64 扩展前的编码字节目标 |
| `maxRequestImageBytes` | `20 MiB` | base64 图片载荷总上限，保留图片超过时请求以 `IMAGE_OFFLOAD_REQUIRED` 失败 |
| `retryPolicy` | normal，5 次重试 | 由 `dsh-llm-retry` 执行的提供方自有重试策略 |

#### 登录提供方

pi-ai 提供登录的提供方可以通过 harness 授权 seam 登录：流程提供 OAuth 或交互式密钥提示（密钥键入 pi-ai 自己的登录提示，而非设置表单），得到的凭据存储在 harness 凭据存储的 `llm-pi-ai/<provider id>` 记录中。存储的登录在其路由的 `apiKeyEnv` 覆盖之下完成认证，并在存储的跨进程锁下自行刷新；退出登录即删除存储记录。落在记录文法之外——小写连字符标识符——的手工声明路由键无法登录，因为对它的记录写入会以 `LlmError('UNSTORABLE_PROVIDER_ID')` 拒绝；这类路由改用 `apiKeyEnv` 或提供方 ambient 设置认证。

#### 解析模型目录

profile 的 `models` 列表会替换而非扩展路由的已安装目录；每个条目从同 id 已安装模型取未设置字段的默认值，因此把路由收窄到两个模型、修正一个容量或添加比已安装目录更新的模型都是一行编辑。`modelOverrides` 无需该代价即可重塑个别已安装目录模型——修正一个模型，保留其余三十七个——当它与 `models` 列表并存、位于手工声明路由上、或点名目录未描述的模型时会被拒绝，因为静默不变的模型会成为别人日后寻找的拼写错误。

#### 带推理（reasoning）与协议兼容运行

`reasoningEfforts` 声明模型可选择的 thinking 等级：每个键都是选择器提供的等级，其值是分派时在协议中发送的拼写，因此 `max: ultra` 可以为拥有自有词汇的网关重命名等级。省略该字段时保留已安装目录条目的能力；`false` 声明非推理模型。对于 pi-ai 无法识别的端点，`compat` 开关重塑请求——哪个角色携带系统提示词、哪个字段限制输出、thinking 等级如何传递——可逐路由、逐模型配置。条目与已安装目录都没有尺寸的模型，会采用路由的 `defaultContextWindow` 与 `defaultMaxTokens` 回退值。

确切模型元数据将 `reasoning.efforts` 按可选强度从低到高排列。配置函数可从该列表中选择，再由 `prepareCall()` 校验具体强度。适配器只接收解析后的控制项。选择 `off` 不保证禁用推理：以省略推理字段表达该值的协议会沿用网关默认行为。所选等级下产生的推理 token 都计入该请求的输出上限。

对于自托管 Chat Completions 端点，`thinkingTokenBudgetField` 选择推理预算参数，`vllmPriority` 在服务端启用优先级调度时设置整数调度优先级。模板参数接受 `$var: thinking.budget`。`openai-responses` 网关可设置 `supportsMaxOutputTokens: false` 来省略 `max_output_tokens`；Azure 与 Codex 传输会忽略这个共享兼容字段。这些控制均需显式启用；目录拥有的 Anthropic effort 和回退能力不是可配置开关。

#### 运行时更改配置

每次操作捕获当前 `providers` Config 引用。新增或修改的 provider 配置在表单持久化前验证；未更改的目录故障仍可编辑。路由集合或重试策略变化时原子更新注册；如果其他适配器已拥有所请求的路由，则保留先前路由。

#### 从端点发现模型

插件会回答「该提供方可以提供哪些模型？」，供配置界面正在编辑或起草的路由使用。已安装目录提供的路由直接由目录回答，不发网络请求，并将其 `input` 数组保留为发现结果的 `inputModalities`；只有目录未描述的路由才会经网络询问。`openai-completions` 与 `openai-responses` 使用带 bearer 鉴权的 `GET {baseURL}/models`，`anthropic-messages` 则以 `x-api-key` 和 `anthropic-version` 使用原生 `GET /v1/models?limit=1000` 语义；其列表 URL 接受带或不带末尾 `/v1` 的 API 根地址，因为网关文档两种写法都会发布，且只有该列表 URL 会归一化这一段，模型请求收到的仍是配置原样的 `baseURL`。已配置且具名的路由会在 Host 内部提供已存凭据与 profile `headers`，因此通过 `cordis.patch.yml` 或 Cordis 配置设置的部署标头可以到达模型发现请求，但不会成为发现请求或 Models 页面的字段；表单中新键入的密钥仍优先于已存凭据。解析器接受标准 `data` 数组或富信息 `models` 对象，并归一化每个候选的 id、显示名、上下文窗口与最大输出 token 数；Anthropic 的 `max_input_tokens` 与 `max_tokens` 会进入相同容量字段，即使对象条目点名了另一个规范 id，对象键仍是请求 id，原始类型的对象属性会被忽略，缺失的显示名则回退到该请求 id。回答是界面可以提供给用户采纳的候选元数据——不存储任何内容，`cordis.patch.yml` 仍然是决定路由服务内容的唯一事实。

#### 失败与恢复

pi-ai 不提供的路由需要 `api`、`baseURL` 与非空 `models` 列表；无法服务的 profile 会在写入处被拒绝，并点名路由与模型。失败携带稳定 code：无法使用的凭据以 `INVALID_CREDENTIAL` 失败并点名路由与引用，`apiKeyEnv` 引用解析为空的路由以 `MISSING_CREDENTIAL` 失败，未配置模型以 `UNKNOWN_MODEL` 失败，终止性提供方失败则区分 `QUOTA` 与暂时性 `RATE_LIMIT`。`GenerateOptions.stop` 以 `UNSUPPORTED_OPTION` 被拒绝，因为 pi-ai 的通用流式 UI 无法跨提供方保证它。

Config 更新严格验证发生变化的 provider。初始加载将已存储的目录故障保留为可编辑的 provider 诊断；未更改的故障 provider 不阻止其他编辑。可用模型仍可选择，无法解析的模型在网络 I/O 前失败。修复或删除问题配置会清除其诊断。

只修改 `displayName`、`apiKeyEnv` 或 `baseURL` 而未解决提供方的模型配置错误时，保存仍会被拒绝。例如，OpenRouter 路由的模型 `111` 缺少 `api` 时，不能单独保存路由名称的修改：需要在同一份编辑草稿中修复或删除该模型，再保存完整的提供方配置。中间修复状态保留在草稿中，直到整条提供方配置通过校验；其他提供方可以独立保存。

模型发现会解析各路由的凭据配置。缺少必需凭据时返回空目录；其他解析错误继续抛出。使用原生认证或无需密钥的路由保留其配置的目录。此检查不会探测推理端点。

-----

### 已知限制与延期工作

这些限制说明适配器在哪里停止、由未来工作接续。它们是当前包约束，不是通用 pi-ai 对比或任务积压。

- **`maxRequestImageBytes` 只计算 base64 图片载荷**，文本、工具、描述符与 JSON 结构在该上限之外，因此它必须留有余量地低于网关请求体上限。
- **登录只存在于发起它的进程中**——授权尝试不持久，因此登录中途刷新页面会放弃它，用户需要重新开始。退出登录是对已存储记录执行 `deleteRecord`，只在本地忘记它，不会告知签发方。
- **OpenAI 不提供 ChatGPT 登录**——pi-ai 的 Sign in with ChatGPT 用应用提供的稳定 UUID 向 OpenAI 标识安装实例，而 harness 没有用于第三方账号登录的安装 ID；`openai` 路由改用 API key 登录。
- **提供方原生发现经本插件的 ambient context 回答**——不点名凭据的路由交由目录提供方自身解析，它会询问环境值（`AZURE_OPENAI_API_KEY`、`AWS_PROFILE` 及各提供方自有集合）与本地凭据文件。两个问题都在这里得到回答：凭据 seam 先于进程环境被查询，文件存在性则针对宿主进程的文件系统以 `~` 展开后检查。它做不到的是*读取*凭据文件内容——自行解析 `~/.aws/credentials` 的提供方会直接读取，不经该 seam。
- **重置恢复继承配置**——重置下层 profile 提供的路由会恢复该路由。
- **完整替换 Config 可以移除继承的字典条目**——字段重置则恢复其继承值。
- **`headers` 可以携带 redactor 永远看不到的凭据**——profile 解析会拒绝 Fetch 无法表示的名称与值，但该字典仍是纯字符串；以 `apiKeyEnv` 引用存储凭据。
- **发现操作不更改已配置模型**——需显式将发现结果采纳到路由配置中。
- **Anthropic 模型发现最多读取 1,000 个模型**——请求使用 API 的最大页大小，但不会遍历 `has_more`；第一页之外的条目需要手工添加。
- **目录外模型需要明确的协议**——目录路由保留每个模型的协议，包括 `azure` 下的两种 Azure API。混合协议目录中不存在的模型需要显式设置路由级 `api`；该设置覆盖路由上的所有模型，且必须属于受支持的自定义协议。Azure 部署名称应通过 `AZURE_OPENAI_DEPLOYMENT_NAME_MAP` 设置，模型 ID 保持为目录中的 ID。
- **模态声明不受校验**——声明 `image` 而其网关不支持的模型会在提示词准入后被提供方拒绝。持久图片仍留在历史中，同一误声明模型可能再次失败；切换到纯文本模型仍然可行，因为共享 LLM 运行时会针对该请求把图片引用投影为稳定文本。
- **未认证路由取决于其协议**——不点名凭据的路由解析为已配置但无密钥，但 pi-ai 的 OpenAI 兼容实现仍要求 API 密钥或 `Authorization` 标头，因此无密钥本地服务器需要由 `apiKeyEnv` 引用或 `headers` 中的 `Authorization` 条目提供的占位凭据。
- **不支持 `GenerateOptions.stop`**——pi-ai 的通用流式选项无法跨提供方保证停止序列行为。
- **对话更新支持只来自已安装的 pi-ai 目录**——只有当路由的目录模型声明了对话中 compat 标志时，该路由才会在历史中接收提示词与工具更新，且 profile 不能设置这些标志；手工声明的路由与未标记的模型会在每次请求开头接收拼接后的系统消息与完整的当前工具列表。
- **图片只在 user 与工具结果消息中被接受**——system、developer 或 assistant 历史中的图片在两条转换路径上都会以 `UNSUPPORTED_CONTENT` 失败。
- **提供方 HTTP 状态不可用**——pi-ai 错误事件不跨提供方暴露稳定 HTTP 状态。
- **重试策略由提供方自有，而非 SDK 重试**——pi-ai SDK 重试保持禁用，因此持久 agent（智能体）步骤与 `llm/retry` 事件拥有每个可见尝试，直接 `ctx.llm.stream()` 调用仍是单次尝试。
- **流式 JSON 工具调用参数避免逐 delta 重复解析**——安装的 pi-ai 带有 `patches/@earendil-works__pi-ai@1.1.0.patch`，它移除了每个流适配器中对整段累计参数 JSON 的逐 delta 重新解析（上游 earendil-works/pi#9265）；未打补丁时，数 MB 的参数流会在事件循环上消耗 O(n²) CPU，并使进程内所有会话停滞。完成事件提供解析后的参数；Responses 可能在参数完成和输出项完成时分别解析。本适配器只读取 delta 字符串与最终参数。每次升级 pi-ai 时都要重新应用或撤销该补丁。

## Config（.）

公开导入：`@deepseek-ai/dsh-llm-pi-ai`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

公开声明（保留类型空间与值空间）：

```text
export interface Config {
    providers: Volatile<Record<string, PiAiProviderProfile>>;
}

export declare const Config: z<Schemastery.ObjectS<NoInfer<{
    providers: z<NoInfer<import("@deepseek-ai/cosmokit").Dict<{
        apiKeyEnv?: string | null;
        displayName?: string | null;
        api?: string | null;
        baseURL?: string | null;
        models?: PiAiModelProfile[] | null;
        modelOverrides?: import("@deepseek-ai/cosmokit").Dict<PiAiModelOverride, string> | null;
        compat?: PiAiCompatProfile | null;
        defaultContextWindow?: number | null;
        defaultMaxTokens?: number | null;
        defaultInput?: ("text" | "image")[] | null;
        headers?: import("@deepseek-ai/cosmokit").Dict<string, string> | null;
        reasoning?: "off" | "minimal" | "low" | "medium" | "high" | "xhigh" | "max" | null;
        thinkingBudgets?: ({
            minimal?: number | null;
            low?: number | null;
            medium?: number | null;
            high?: number | null;
        } & import("@deepseek-ai/cosmokit").Dict) | null;
        cacheRetention?: "none" | "short" | "long" | null;
        transport?: "auto" | "sse" | "websocket" | "websocket-cached" | null;
        timeoutMs?: number | null;
        websocketConnectTimeoutMs?: number | null;
        streamIdleTimeoutMs?: number | null;
        maxRequestImageBytes?: number | null;
        requestImagePixelBudget?: number | null;
        requestImageMaxBytes?: number | null;
        retryPolicy?: RetryPolicyConfig | null;
    } & import("@deepseek-ai/cosmokit").Dict, string>>, NoInfer<import("@deepseek-ai/cosmokit").Dict<Schemastery.ObjectT<NoInfer<{
        apiKeyEnv: z<string, string, "plain">;
        displayName: z<string, string, "plain">;
        api: z<string, string, "plain">;
        baseURL: z<string, string, "plain">;
        models: z<PiAiModelProfile[], PiAiModelProfile[], "plain">;
        modelOverrides: z<import("@deepseek-ai/cosmokit").Dict<PiAiModelOverride, string>, import("@deepseek-ai/cosmokit").Dict<PiAiModelOverride, string>, "plain">;
        compat: z<PiAiCompatProfile>;
        defaultContextWindow: z<number, number, "defined">;
        defaultMaxTokens: z<number, number, "defined">;
        defaultInput: z<("text" | "image")[], ("text" | "image")[], "defined">;
        headers: z<import("@deepseek-ai/cosmokit").Dict<string, string>, import("@deepseek-ai/cosmokit").Dict<string, string>, "plain">;
        reasoning: z<"off" | "minimal" | "low" | "medium" | "high" | "xhigh" | "max", "off" | "minimal" | "low" | "medium" | "high" | "xhigh" | "max", "plain">;
        thinkingBudgets: z<Schemastery.ObjectS<NoInfer<{
            minimal: z<number, number, "plain">;
            low: z<number, number, "plain">;
            medium: z<number, number, "plain">;
            high: z<number, number, "plain">;
        }>>, Schemastery.ObjectT<NoInfer<{
            minimal: z<number, number, "plain">;
            low: z<number, number, "plain">;
            medium: z<number, number, "plain">;
            high: z<number, number, "plain">;
        }>>, "plain">;
        cacheRetention: z<"none" | "short" | "long", "none" | "short" | "long", "plain">;
        transport: z<"auto" | "sse" | "websocket" | "websocket-cached", "auto" | "sse" | "websocket" | "websocket-cached", "plain">;
        timeoutMs: z<number, number, "plain">;
        websocketConnectTimeoutMs: z<number, number, "plain">;
        streamIdleTimeoutMs: z<number, number, "defined">;
        maxRequestImageBytes: z<number, number, "defined">;
        requestImagePixelBudget: z<number, number, "defined">;
        requestImageMaxBytes: z<number, number, "defined">;
        retryPolicy: z<RetryPolicyConfig>;
    }>>, string>>, "volatile-defined">;
}>>, Schemastery.ObjectT<NoInfer<{
    providers: z<NoInfer<import("@deepseek-ai/cosmokit").Dict<{
        apiKeyEnv?: string | null;
        displayName?: string | null;
        api?: string | null;
        baseURL?: string | null;
        models?: PiAiModelProfile[] | null;
        modelOverrides?: import("@deepseek-ai/cosmokit").Dict<PiAiModelOverride, string> | null;
        compat?: PiAiCompatProfile | null;
        defaultContextWindow?: number | null;
        defaultMaxTokens?: number | null;
        defaultInput?: ("text" | "image")[] | null;
        headers?: import("@deepseek-ai/cosmokit").Dict<string, string> | null;
        reasoning?: "off" | "minimal" | "low" | "medium" | "high" | "xhigh" | "max" | null;
        thinkingBudgets?: ({
            minimal?: number | null;
            low?: number | null;
            medium?: number | null;
            high?: number | null;
        } & import("@deepseek-ai/cosmokit").Dict) | null;
        cacheRetention?: "none" | "short" | "long" | null;
        transport?: "auto" | "sse" | "websocket" | "websocket-cached" | null;
        timeoutMs?: number | null;
        websocketConnectTimeoutMs?: number | null;
        streamIdleTimeoutMs?: number | null;
        maxRequestImageBytes?: number | null;
        requestImagePixelBudget?: number | null;
        requestImageMaxBytes?: number | null;
        retryPolicy?: RetryPolicyConfig | null;
    } & import("@deepseek-ai/cosmokit").Dict, string>>, NoInfer<import("@deepseek-ai/cosmokit").Dict<Schemastery.ObjectT<NoInfer<{
        apiKeyEnv: z<string, string, "plain">;
        displayName: z<string, string, "plain">;
        api: z<string, string, "plain">;
        baseURL: z<string, string, "plain">;
        models: z<PiAiModelProfile[], PiAiModelProfile[], "plain">;
        modelOverrides: z<import("@deepseek-ai/cosmokit").Dict<PiAiModelOverride, string>, import("@deepseek-ai/cosmokit").Dict<PiAiModelOverride, string>, "plain">;
        compat: z<PiAiCompatProfile>;
        defaultContextWindow: z<number, number, "defined">;
        defaultMaxTokens: z<number, number, "defined">;
        defaultInput: z<("text" | "image")[], ("text" | "image")[], "defined">;
        headers: z<import("@deepseek-ai/cosmokit").Dict<string, string>, import("@deepseek-ai/cosmokit").Dict<string, string>, "plain">;
        reasoning: z<"off" | "minimal" | "low" | "medium" | "high" | "xhigh" | "max", "off" | "minimal" | "low" | "medium" | "high" | "xhigh" | "max", "plain">;
        thinkingBudgets: z<Schemastery.ObjectS<NoInfer<{
            minimal: z<number, number, "plain">;
            low: z<number, number, "plain">;
            medium: z<number, number, "plain">;
            high: z<number, number, "plain">;
        }>>, Schemastery.ObjectT<NoInfer<{
            minimal: z<number, number, "plain">;
            low: z<number, number, "plain">;
            medium: z<number, number, "plain">;
            high: z<number, number, "plain">;
        }>>, "plain">;
        cacheRetention: z<"none" | "short" | "long", "none" | "short" | "long", "plain">;
        transport: z<"auto" | "sse" | "websocket" | "websocket-cached", "auto" | "sse" | "websocket" | "websocket-cached", "plain">;
        timeoutMs: z<number, number, "plain">;
        websocketConnectTimeoutMs: z<number, number, "plain">;
        streamIdleTimeoutMs: z<number, number, "defined">;
        maxRequestImageBytes: z<number, number, "defined">;
        requestImagePixelBudget: z<number, number, "defined">;
        requestImageMaxBytes: z<number, number, "defined">;
        retryPolicy: z<RetryPolicyConfig>;
    }>>, string>>, "volatile-defined">;
}>>, "plain">;
```

同名导出同时提供类型与运行时值；使用 `import type` 引入配置类型，使用普通 `import` 引入运行时 schema，不能当作文本常量。

| 成员 | 公开类型 |
| --- | --- |
| `providers` | `providers: Volatile<Record<string, PiAiProviderProfile>>;` |

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-pi-ai.md)。

## Options（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type Options = {
    [K in keyof Config]?: Config[K] extends Volatile<infer T> ? T : never;
};
```

公开导入：`@deepseek-ai/dsh-llm-pi-ai`；公开符号：`Options`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`providers`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-pi-ai.md)。

## PiAiAdapter（.）

公开导入：`@deepseek-ai/dsh-llm-pi-ai`；公开符号：`PiAiAdapter`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare class PiAiAdapter extends LlmAdapter {
    constructor(config: PiAiAdapterOptions);
    imageRequestTarget(provider: string, model: string, image: ImageAttachmentRef): import("@deepseek-ai/dsh-attachment").ImageRequestTarget;
    providerInfo(provider: string): LlmProviderInfo;
    providerRetryPolicy(provider: string): ResolvedRetryPolicy | undefined;
    listModels(provider: string): Promise<readonly LlmModelInfo[]>;
    resolveModel(provider: string, model: string, _signal?: AbortSignal): Promise<LlmResolvedModelInfo>;
    prepareCall(provider: string, model: string, _signal?: AbortSignal): Promise<PreparedAdapterCall>;
    stream(options: GenerateOptions): AsyncIterable<StreamChunk>;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-pi-ai.md)。

## PiAiAdapterOptions（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface PiAiAdapterOptions {
    profiles: () => ReadonlyMap<string, ResolvedPiAiProviderProfile>;
    resolveApiKey: (provider: string, profile: ResolvedPiAiProviderProfile) => Promise<string | undefined>;
    auth: PiAiAuthInjection;
    resolveAttachments?: () => AttachmentStore | undefined;
    resolveImageAccess?: (attachments: AttachmentStore, ref: ImageAttachmentRef) => ImageAttachmentAccess | undefined;
    onReplayDegrade?: (detail: {
        provider: string;
        model: string;
        reason: string;
    }) => void;
}
```

公开导入：`@deepseek-ai/dsh-llm-pi-ai`；公开符号：`PiAiAdapterOptions`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`auth`、`onReplayDegrade`、`profiles`、`resolveApiKey`、`resolveAttachments`、`resolveImageAccess`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-pi-ai.md)。

## PiAiCompatProfile（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface PiAiCompatProfile {
    supportsStore?: boolean;
    supportsDeveloperRole?: boolean;
    supportsReasoningEffort?: boolean;
    supportsUsageInStreaming?: boolean;
    supportsFinishReason?: boolean;
    maxTokensField?: NonNullable<OpenAICompletionsCompat['maxTokensField']>;
    requiresToolResultName?: boolean;
    requiresAssistantAfterToolResult?: boolean;
    requiresThinkingAsText?: boolean;
    requiresReasoningContentOnAssistantMessages?: boolean;
    thinkingFormat?: PiAiThinkingFormat;
    chatTemplateKwargs?: NonNullable<OpenAICompletionsCompat['chatTemplateKwargs']>;
    chatTemplateArgs?: NonNullable<OpenAICompletionsCompat['chatTemplateArgs']>;
    supportsThinkingTokenBudget?: boolean;
    thinkingTokenBudgetField?: PiAiThinkingTokenBudgetField;
    vllmPriority?: number;
    supportsMaxOutputTokens?: boolean;
    supportsStrictMode?: boolean;
    cacheControlFormat?: NonNullable<OpenAICompletionsCompat['cacheControlFormat']>;
    supportsLongCacheRetention?: boolean;
    supportsEagerToolInputStreaming?: boolean;
    supportsCacheControlOnTools?: boolean;
    supportsTemperature?: boolean;
    forceAdaptiveThinking?: boolean;
    allowEmptySignature?: boolean;
    supportsStrictTools?: boolean;
}
```

公开导入：`@deepseek-ai/dsh-llm-pi-ai`；公开符号：`PiAiCompatProfile`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`allowEmptySignature`、`cacheControlFormat`、`chatTemplateArgs`、`chatTemplateKwargs`、`forceAdaptiveThinking`、`maxTokensField`、`requiresAssistantAfterToolResult`、`requiresReasoningContentOnAssistantMessages`、`requiresThinkingAsText`、`requiresToolResultName`、`supportsCacheControlOnTools`、`supportsDeveloperRole`、`supportsEagerToolInputStreaming`、`supportsFinishReason`、`supportsLongCacheRetention`、`supportsMaxOutputTokens`、`supportsReasoningEffort`、`supportsStore`、`supportsStrictMode`、`supportsStrictTools`、`supportsTemperature`、`supportsThinkingTokenBudget`、`supportsUsageInStreaming`、`thinkingFormat`、`thinkingTokenBudgetField`、`vllmPriority`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-pi-ai.md)。

## PiAiModality（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type PiAiModality = Model<Api>['input'][number];
```

公开导入：`@deepseek-ai/dsh-llm-pi-ai`；公开符号：`PiAiModality`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-pi-ai.md)。

## PiAiModelOverride（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type PiAiModelOverride = Omit<PiAiModelProfile, 'id'>;
```

公开导入：`@deepseek-ai/dsh-llm-pi-ai`；公开符号：`PiAiModelOverride`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`compat`、`contextWindow`、`input`、`maxTokens`、`name`、`reasoningEfforts`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-pi-ai.md)。

## PiAiModelProfile（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface PiAiModelProfile {
    id: string;
    name?: string;
    contextWindow?: number;
    maxTokens?: number;
    input?: PiAiModality[];
    reasoningEfforts?: false | PiAiReasoningEfforts;
    compat?: PiAiCompatProfile;
}
```

公开导入：`@deepseek-ai/dsh-llm-pi-ai`；公开符号：`PiAiModelProfile`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`compat`、`contextWindow`、`id`、`input`、`maxTokens`、`name`、`reasoningEfforts`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-pi-ai.md)。

## PiAiProviderProfile（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface PiAiProviderProfile {
    apiKeyEnv?: string;
    displayName?: string;
    api?: string;
    baseURL?: string;
    models?: PiAiModelProfile[];
    modelOverrides?: Record<string, PiAiModelOverride>;
    compat?: PiAiCompatProfile;
    defaultContextWindow?: number;
    defaultMaxTokens?: number;
    defaultInput?: PiAiModality[];
    headers?: Record<string, string>;
    reasoning?: ModelThinkingLevel;
    thinkingBudgets?: ThinkingBudgets;
    cacheRetention?: CacheRetention;
    transport?: Transport;
    timeoutMs?: number;
    websocketConnectTimeoutMs?: number;
    streamIdleTimeoutMs?: number;
    maxRequestImageBytes?: number;
    requestImagePixelBudget?: number;
    requestImageMaxBytes?: number;
    retryPolicy?: RetryPolicyConfig;
}
```

公开导入：`@deepseek-ai/dsh-llm-pi-ai`；公开符号：`PiAiProviderProfile`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`api`、`apiKeyEnv`、`baseURL`、`cacheRetention`、`compat`、`defaultContextWindow`、`defaultInput`、`defaultMaxTokens`、`displayName`、`headers`、`maxRequestImageBytes`、`modelOverrides`、`models`、`reasoning`、`requestImageMaxBytes`、`requestImagePixelBudget`、`retryPolicy`、`streamIdleTimeoutMs`、`thinkingBudgets`、`timeoutMs`、`transport`、`websocketConnectTimeoutMs`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-pi-ai.md)。

## PiAiReasoningEfforts（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type PiAiReasoningEfforts = Partial<Record<ModelThinkingLevel, string | null>>;
```

公开导入：`@deepseek-ai/dsh-llm-pi-ai`；公开符号：`PiAiReasoningEfforts`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-pi-ai.md)。

## PiAiThinkingFormat（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type PiAiThinkingFormat = NonNullable<OpenAICompletionsCompat['thinkingFormat']>;
```

公开导入：`@deepseek-ai/dsh-llm-pi-ai`；公开符号：`PiAiThinkingFormat`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-pi-ai.md)。

## ResolvedPiAiProviderProfile（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ResolvedPiAiProviderProfile extends Omit<PiAiProviderProfile, 'apiKeyEnv' | 'retryPolicy' | 'models' | 'displayName'> {
    provider: string;
    displayName: string;
    apiKeyEnv?: CredentialRef;
    streamIdleTimeoutMs: number;
    maxRequestImageBytes: number;
    requestImagePixelBudget: number;
    requestImageMaxBytes: number;
    retryPolicy: ResolvedRetryPolicy;
    piProvider?: Provider;
    catalogError?: string;
    modelErrors: ReadonlyMap<string, string>;
    configuredMaxTokens: ReadonlyMap<string, number>;
}
```

公开导入：`@deepseek-ai/dsh-llm-pi-ai`；公开符号：`ResolvedPiAiProviderProfile`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`api`、`apiKeyEnv`、`baseURL`、`cacheRetention`、`catalogError`、`compat`、`configuredMaxTokens`、`defaultContextWindow`、`defaultInput`、`defaultMaxTokens`、`displayName`、`headers`、`maxRequestImageBytes`、`modelErrors`、`modelOverrides`、`piProvider`、`provider`、`reasoning`、`requestImageMaxBytes`、`requestImagePixelBudget`、`retryPolicy`、`streamIdleTimeoutMs`、`thinkingBudgets`、`timeoutMs`、`transport`、`websocketConnectTimeoutMs`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-pi-ai.md)。

## apply（.）

公开导入：`@deepseek-ai/dsh-llm-pi-ai`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context, config: Config): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-pi-ai.md)。

## inject（.）

公开导入：`@deepseek-ai/dsh-llm-pi-ai`；公开符号：`inject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-pi-ai.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-llm-pi-ai`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "llm-pi-ai";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-pi-ai.md)。

## recordKeyFor（.）

公开导入：`@deepseek-ai/dsh-llm-pi-ai`；公开符号：`recordKeyFor`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function recordKeyFor(providerId: string): CredentialKey;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-pi-ai.md)。

## supportedProtocols（.）

公开导入：`@deepseek-ai/dsh-llm-pi-ai`；公开符号：`supportedProtocols`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function supportedProtocols(): readonly string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-pi-ai.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
