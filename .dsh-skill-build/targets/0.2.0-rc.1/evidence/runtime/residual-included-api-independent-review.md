# 剩余 API 提案独立复核

目标 `dsh-v0.2.0-rc.1`，commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。输入是 [root 提案](residual-included-api-proposal.json) 和当前 `skill-source/api-surface.json`；独立逐对象/成员裁决见 [机器矩阵](residual-included-api-independent-review.json)，由 [复核脚本](review-residual-included-api-proposal.py) 重建。矩阵保存提案/当前账本 SHA-256、原裁决、复核裁决、精确源码文件、owner/section 和理由，不修改共享账本。按并行分工跳过 `dsh-credentials`、`dsh-ptc-runtime`、`dsh-storage`、`dsh-settings`，以及未出现在提案中的 typert-registry、attachment-local、sdk-protocol、command-feedback；它们由另一专项审核。

当前所辖 21 包恰有 146 个仍 `pending` 对象，输入提案没有漏掉同范围当前对象。复核给出 58 `include`、80 `merge`、8 `exclude`；相对提案 125 个对象、214 个成员改变裁决。`merge` 表示归现有插件任务或同名再导出/组合元数据，不建立独立任务；共享账本最终的 `included`/`excluded` 回填仍需按 owner 的内容契约逐项决定。

初审的 52 个 owner section 符号缺口已处理：`default` Service 别名和无需独立任务的 estimate helper 改为 `merge`；LSP 请求/结果、Web 请求/结果、DirectoryPicker capability、MCP 配置、DeepSeek 扩展、Invariant、package manifest、Subagent 设置等真实作者契约已补进对应 reference 的指定节。现在 58 个建议 `include` 均可在 owner section 中定位符号，机器矩阵保留 `ownerSectionContainsSymbol`/`ownerSectionContainsSignature` 供复核。

| 包 | 源码复核与主要修正 |
| --- | --- |
| `dsh-browser-use` | `src/index.ts:16-40` 的 `BrowserUseRegistry.register/providerName` 和 `src/brand.ts` 是独占 Provider 路径；品牌纳入，`default` 合并到已纳入的具名 Service。 |
| `dsh-deepseek-llm-api-extensions` | `src/index.ts:66` 的 Registry 与 `types.ts` 的 Provider、请求、准备/接受结果属于字段扩展；同名 `./types` 再导出合并。 |
| `dsh-experimental-inspector` | `./client` 的 `InspectorService` 可在已装载实验组合中消费；Cordis runtime tree 帧是诊断投影，合并而不当新插件注册协议。 |
| `dsh-hooks-claude-code`、`dsh-hooks-codex` | `apply/inject/name` 只是两个具体桥接插件的装载元数据；6 个文档同名命中从 `include` 改 `merge`。 |
| `dsh-host-directory-picker` | `src/index.ts` 抽象 DirectoryPicker 的 `capability()`、browse/native union 与错误类型可由新 backend 实现；根/类型出口归同一契约。 |
| `dsh-invariants` | `src/index.ts:94` 的 InvariantRegistry、installer、筛选 Config 是自有诊断检查任务；4 个 `exclude` 改 `include`。 |
| `dsh-lsp` | `src/index.ts:82-143` 确认 `registerProvider` 原子注册和 `query`，`types.ts` 给请求/结果形状；11 个 `exclude` 改 `include`。 |
| `dsh-mcp-client` | `src/tools.ts:225` 的 `createMcpToolDefinition` 与结果/配置是公开桥接入口；`apply/inject/name` 只归 Profile 组合。 |
| `dsh-package-manifest` | `src/types.ts:8-65` 的 `DshPackageManifest`、`DshManifest`、engine 和 LocalizedText 是 `package.json` 作者输入；`PluginLocalizedMeta` 是 Loader 解析后的展示诊断，合并。 |
| `dsh-permission-presets` | 根默认 Service 的 `set/current/catalog` 不能因源码名为 `default` 排除；Config 保留，auto/custom 常量与派生 knob 状态归既有预设任务。 |
| `dsh-repeat-tool-reminder`、`dsh-tool-call-timeout-policy` | `apply/inject/name` 是具体 Guard 插件装载元数据，5 个提案 `include` 改 `merge`。 |
| `dsh-session-projection` | `src/index.ts:199` 的默认 Registry 是已纳入具名 Service 的别名；`./types` 的 Map/StateMap 是同名再导出。 |
| `dsh-spill` | `src/index.ts:45` 的默认 SpillStore 是已纳入具名 Service 的别名，`saveText` 仍是插件保存大结果的唯一操作。 |
| `dsh-token-meter` | `estimateMessage` 等公开 helper 与用量/压力投影归 `TokenMeter.measure` 的派生读数，不独立写成日志事实。 |
| `dsh-tool-subagent` | `src/model-selection-settings.ts:36` 的默认 Service、Config、current 状态是可装载模型选择设置；`./invariant` 与 name 只归诊断/装载。 |
| `dsh-tool-todo` | Config/TodoItem 是 `todo_write` 的作者可见值；根和 invariant 的 `apply/inject/name` 属固定插件装载。 |
| `dsh-web` | `src/index.ts:74-125` 的 WebRuntime.registerSearchProvider/registerFetchProvider 与请求/结果是完整第三方 Provider 路径；四个请求/结果类型纳入，`default` 合并到已纳入的具名 Service。 |
| `dsh-webhook` | `src/index.ts:58` 的 WebhookRuntime、branded delivery/source 身份和模型选择是规则/可信投递契约；`./types` 再导出与 invariant 元数据合并。 |
| `dsh` | `apps/cli/src/profile-boot.ts` 的 Profile 启动/准备函数是应用 CLI owner；8 个 `exclude` 保持。 |

主要误判机制已由源码交叉确认：TypeScript `default` 是实际 Service class 时，不能按符号文本缺席而排除；`apply/inject/name` 即使被文档提及，也只是可装载插件的静态元数据，不等于新业务操作。另须区分包的主入口与 `./types` 同名再导出、生成/诊断投影与可注册的 Provider 契约。

检查：146 个源文件路径在精确 checkout 中存在，非排除项 owner/section 在当前草稿中存在，ID 唯一，矩阵对象集合与这些包当前 `pending` 对象集合一致。此轮没有新增 TypeScript consumer 或真实 Profile/Browser/Remote 运行；已有专题各自的验证边界仍有效。
