# Infrastructure task API

本页锁定 `dsh-v0.2.0-rc.2` 的任务所需公开对象和直接成员；运行语义、生命周期与失败边界见 [对应 guardrail](api-infra-runtime.md)。未列入的公开符号仍在 `api-surface.json` 中逐项裁决，但不进入常规插件指导。

## Infrastructure task API

**`AgentPresetRegistry`**

- Entry: `export:@deepseek-ai/dsh-agent-preset-registry:.`
- Signature: `AgentPresetRegistry`
- Source: `packages/preset/agent-preset-registry/src/index.ts`

| Member     | Signature                                                          | Task use                                           |
| ---------- | ------------------------------------------------------------------ | -------------------------------------------------- |
| `config`   | `Config`                                                           | Used by the task contract in the linked guardrail. |
| `list`     | `() => Promise<AgentPreset[]>`                                     | Used by the task contract in the linked guardrail. |
| `mount`    | `(ctx: Context, id?: string \| undefined) => Promise<AgentPreset>` | Used by the task contract in the linked guardrail. |
| `register` | `(definition: PresetDefinition) => Promise<() => Promise<void>>`   | Used by the task contract in the linked guardrail. |
| `resolve`  | `(id?: string \| undefined) => Promise<AgentPreset>`               | Used by the task contract in the linked guardrail. |
| `select`   | `(agent: Agent, agentPreset: string) => Promise<string>`           | Used by the task contract in the linked guardrail. |

**`AttachmentStore`**

- Entry: `export:@deepseek-ai/dsh-attachment:.`
- Signature: `AttachmentStore`
- Source: `packages/attachment/attachment/src/index.ts`

No directly declared member is needed beyond the callable/type signature for the selected task.

**`AuthorizationService`**

- Entry: `export:@deepseek-ai/dsh-authorization:.`
- Signature: `AuthorizationService`
- Source: `packages/credentials/authorization/src/index.ts`

| Member   | Signature                             | Task use                                           |
| -------- | ------------------------------------- | -------------------------------------------------- |
| `cancel` | `(key: CredentialKey) => void`        | Used by the task contract in the linked guardrail. |
| `list`   | `() => readonly AuthorizationEntry[]` | Used by the task contract in the linked guardrail. |

**`CredentialProvider`**

- Entry: `export:@deepseek-ai/dsh-credentials:.`
- Signature: `CredentialProvider`
- Source: `packages/credentials/credentials/src/index.ts`

| Member    | Signature                                                                     | Task use                                           |
| --------- | ----------------------------------------------------------------------------- | -------------------------------------------------- |
| `resolve` | `(ref: Branded<"CredentialRef">) => Promise<ResolvedCredential \| undefined>` | Used by the task contract in the linked guardrail. |
| `set`     | `(ref: Branded<"CredentialRef">, value: string) => Promise<void>`             | Used by the task contract in the linked guardrail. |

**`FileSystem`**

- Entry: `export:@deepseek-ai/dsh-fs:.`
- Signature: `FileSystem`
- Source: `packages/fs/fs/src/index.ts`

| Member        | Signature                                                                                                                    | Task use                                           |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `readBytes`   | `(target: FsTarget, signal: AbortSignal \| undefined, maxBytes: number) => Promise<Uint8Array<ArrayBufferLike>>`             | Used by the task contract in the linked guardrail. |
| `resolve`     | `(path: string, opts?: { cwd?: string \| undefined; signal?: AbortSignal \| undefined; } \| undefined) => Promise<FsTarget>` | Used by the task contract in the linked guardrail. |
| `sandboxMode` | `any`                                                                                                                        | Used by the task contract in the linked guardrail. |
| `stat`        | `(target: FsTarget, signal?: AbortSignal \| undefined) => Promise<FsInfo \| undefined>`                                      | Used by the task contract in the linked guardrail. |
| `watch`       | `(target: FsTarget, changed: (error?: Error \| undefined) => void, signal: AbortSignal) => Promise<() => Promise<void>>`     | Used by the task contract in the linked guardrail. |

**`WebServer`**

- Entry: `export:@deepseek-ai/dsh-host-webserver:.`
- Signature: `WebServer`
- Source: `packages/host/webserver/src/index.ts`

| Member     | Signature                         | Task use                                           |
| ---------- | --------------------------------- | -------------------------------------------------- |
| `host`     | `"127.0.0.1" \| "0.0.0.0"`        | Used by the task contract in the linked guardrail. |
| `port`     | `number`                          | Used by the task contract in the linked guardrail. |
| `register` | `(route: WebRoute) => () => void` | Used by the task contract in the linked guardrail. |

**`LspService`**

- Entry: `export:@deepseek-ai/dsh-lsp:.`
- Signature: `LspService`
- Source: `packages/lsp/lsp/src/types.ts`

No directly declared member is needed beyond the callable/type signature for the selected task.

**`McpResourceRuntime`**

- Entry: `export:@deepseek-ai/dsh-mcp-resources:.`
- Signature: `McpResourceRuntime`
- Source: `packages/mcp/mcp-resources/src/index.ts`

| Member     | Signature                                                       | Task use                                           |
| ---------- | --------------------------------------------------------------- | -------------------------------------------------- |
| `register` | `(server: string, provider: McpResourceProvider) => () => void` | Used by the task contract in the linked guardrail. |

**`DshBundleManifest`**

- Entry: `export:@deepseek-ai/dsh-package-manifest:.`
- Signature: `DshBundleManifest`
- Source: `packages/util/package-manifest/src/types.ts`

| Member  | Signature            | Task use                                           |
| ------- | -------------------- | -------------------------------------------------- |
| `patch` | `string \| string[]` | Used by the task contract in the linked guardrail. |

**`DshClientManifest`**

- Entry: `export:@deepseek-ai/dsh-package-manifest:.`
- Signature: `DshClientManifest`
- Source: `packages/util/package-manifest/src/types.ts`

| Member     | Signature               | Task use                                           |
| ---------- | ----------------------- | -------------------------------------------------- |
| `external` | `string[] \| undefined` | Used by the task contract in the linked guardrail. |
| `inject`   | `string[] \| undefined` | Used by the task contract in the linked guardrail. |

**`DshManifest`**

- Entry: `export:@deepseek-ai/dsh-package-manifest:.`
- Signature: `DshManifest`
- Source: `packages/util/package-manifest/src/types.ts`

| Member            | Signature                        | Task use                                           |
| ----------------- | -------------------------------- | -------------------------------------------------- |
| `bundle`          | `DshBundleManifest \| undefined` | Used by the task contract in the linked guardrail. |
| `client`          | `DshClientManifest \| undefined` | Used by the task contract in the linked guardrail. |
| `manifestVersion` | `1 \| undefined`                 | Used by the task contract in the linked guardrail. |

**`DshPackageManifest`**

- Entry: `export:@deepseek-ai/dsh-package-manifest:.`
- Signature: `DshPackageManifest`
- Source: `packages/util/package-manifest/src/types.ts`

| Member         | Signature                             | Task use                                           |
| -------------- | ------------------------------------- | -------------------------------------------------- |
| `dependencies` | `Record<string, string> \| undefined` | Used by the task contract in the linked guardrail. |
| `dsh`          | `DshManifest \| undefined`            | Used by the task contract in the linked guardrail. |
| `engines`      | `DshEnginesManifest \| undefined`     | Used by the task contract in the linked guardrail. |
| `name`         | `string`                              | Used by the task contract in the linked guardrail. |
| `version`      | `string`                              | Used by the task contract in the linked guardrail. |

**`DshProfileManifest`**

- Entry: `export:@deepseek-ai/dsh-package-manifest:.`
- Signature: `DshProfileManifest`
- Source: `packages/util/package-manifest/src/types.ts`

No directly declared member is needed beyond the callable/type signature for the selected task.

**`PtcRuntime`**

- Entry: `export:@deepseek-ai/dsh-ptc-runtime:.`
- Signature: `PtcRuntime`
- Source: `packages/ptc-runtime/ptc-runtime/src/index.ts`

| Member        | Signature                                     | Task use                                           |
| ------------- | --------------------------------------------- | -------------------------------------------------- |
| `isolation`   | `string`                                      | Used by the task contract in the linked guardrail. |
| `resolve`     | `(request: PtcRunRequest) => PtcRunSpec`      | Used by the task contract in the linked guardrail. |
| `run`         | `(spec: PtcRunSpec) => Promise<PtcRunResult>` | Used by the task contract in the linked guardrail. |
| `sandboxMode` | `any`                                         | Used by the task contract in the linked guardrail. |

**`SandboxPolicyService`**

- Entry: `export:@deepseek-ai/dsh-sandbox-policy:.`
- Signature: `SandboxPolicyService`
- Source: `packages/sandbox/sandbox-policy/src/index.ts`

| Member    | Signature                                                    | Task use                                           |
| --------- | ------------------------------------------------------------ | -------------------------------------------------- |
| `resolve` | `(request?: SandboxPolicyRequest) => SandboxExecutionPolicy` | Used by the task contract in the linked guardrail. |

**`SandboxProvider`**

- Entry: `export:@deepseek-ai/dsh-sandbox:.`
- Signature: `SandboxProvider`
- Source: `packages/sandbox/sandbox/src/index.ts`

No directly declared member is needed beyond the callable/type signature for the selected task.

**`ShellExecutor`**

- Entry: `export:@deepseek-ai/dsh-shell:.`
- Signature: `ShellExecutor`
- Source: `packages/shell/shell/src/index.ts`

| Member        | Signature                                          | Task use                                           |
| ------------- | -------------------------------------------------- | -------------------------------------------------- |
| `execute`     | `(spec: ShellExecSpec) => Promise<ShellExecution>` | Used by the task contract in the linked guardrail. |
| `resolve`     | `(request: ShellExecRequest) => ShellExecSpec`     | Used by the task contract in the linked guardrail. |
| `sandboxMode` | `any`                                              | Used by the task contract in the linked guardrail. |

**`SpillStore`**

- Entry: `export:@deepseek-ai/dsh-spill:.`
- Signature: `SpillStore`
- Source: `packages/spill/spill/src/index.ts`

No directly declared member is needed beyond the callable/type signature for the selected task.

**`Domain`**

- Entry: `export:@deepseek-ai/dsh-storage-domain:.`
- Signature: `Domain<S>`
- Source: `packages/storage/storage-domain/src/domain.ts`

| Member  | Signature                                                                                          | Task use                                           |
| ------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `close` | `() => Promise<void>`                                                                              | Used by the task contract in the linked guardrail. |
| `name`  | `string`                                                                                           | Used by the task contract in the linked guardrail. |
| `table` | `<N extends keyof S["tables"] & string>(name: N) => KvTable<TableKeyOf<S, N>, TableValueOf<S, N>>` | Used by the task contract in the linked guardrail. |

**`Storage`**

- Entry: `export:@deepseek-ai/dsh-storage:.`
- Signature: `Storage`
- Source: `packages/storage/storage/src/index.ts`

| Member   | Signature                                                                          | Task use                                           |
| -------- | ---------------------------------------------------------------------------------- | -------------------------------------------------- |
| `domain` | `never`                                                                            | Used by the task contract in the linked guardrail. |
| `form`   | `<K extends keyof StorageForms>(form: K) => StorageForms[K]`                       | Used by the task contract in the linked guardrail. |
| `mount`  | `<K extends keyof StorageForms>(form: K, facility: StorageForms[K]) => () => void` | Used by the task contract in the linked guardrail. |

**`SubprocessRuntime`**

- Entry: `export:@deepseek-ai/dsh-subprocess:.`
- Signature: `SubprocessRuntime`
- Source: `packages/subprocess/subprocess/src/index.ts`

No directly declared member is needed beyond the callable/type signature for the selected task.

**`TypertRemoteService`**

- Entry: `export:@deepseek-ai/dsh-typert-protocol:.`
- Signature: `TypertRemoteService<T>`
- Source: `packages/typert/protocol/src/index.ts`

No directly declared member is needed beyond the callable/type signature for the selected task.

**`WebhookRuntime`**

- Entry: `export:@deepseek-ai/dsh-webhook:.`
- Signature: `WebhookRuntime`
- Source: `packages/webhook/webhook/src/index.ts`

| Member     | Signature                                                          | Task use                                           |
| ---------- | ------------------------------------------------------------------ | -------------------------------------------------- |
| `dispatch` | `<K extends string>(delivery: VerifiedWebhookDelivery<K>) => void` | Used by the task contract in the linked guardrail. |
| `register` | `<K extends string>(rule: WebhookRule<K>) => () => Promise<void>`  | Used by the task contract in the linked guardrail. |
