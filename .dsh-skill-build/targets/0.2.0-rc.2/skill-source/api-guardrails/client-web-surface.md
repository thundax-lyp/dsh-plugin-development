# Client/Web task API

本页锁定 `dsh-v0.2.0-rc.2` 的任务所需公开对象和直接成员；运行语义、生命周期与失败边界见 [对应 guardrail](api-client-web.md)。未列入的公开符号仍在 `api-surface.json` 中逐项裁决，但不进入常规插件指导。

## Client/Web task API

**`TypertGatewayService`**

- Entry: `export:@deepseek-ai/dsh-api-gateway:.`
- Signature: `TypertGatewayService`
- Source: `packages/api/gateway/src/index.ts`

| Member   | Signature                                                           | Task use                                           |
| -------- | ------------------------------------------------------------------- | -------------------------------------------------- |
| `stream` | `(request: InvokeRemoteRequest) => Promise<AsyncIterable<unknown>>` | Used by the task contract in the linked guardrail. |

**`ClientRemote`**

- Entry: `export:@deepseek-ai/dsh-api-gateway:./client`
- Signature: `ClientRemote`
- Source: `packages/api/gateway/src/client/index.ts`

| Member  | Signature         | Task use                                           |
| ------- | ----------------- | -------------------------------------------------- |
| `$host` | `RemoteHostFacts` | Used by the task contract in the linked guardrail. |

**`SettingsForms`**

- Entry: `export:@deepseek-ai/dsh-settings:.`
- Signature: `SettingsForms`
- Source: `packages/settings/settings/src/index.ts`

| Member     | Signature                                                                                               | Task use                                           |
| ---------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `mutate`   | `(ns: string, ops: readonly SettingsPathOp[], expectedRevision?: number \| undefined) => Promise<void>` | Used by the task contract in the linked guardrail. |
| `writable` | `boolean`                                                                                               | Used by the task contract in the linked guardrail. |

**`ConfigForms`**

- Entry: `export:@deepseek-ai/dsh-client-ui-settings:./client`
- Signature: `ConfigForms`
- Source: `packages/client/ui-settings/src/client/config-form.ts`

| Member        | Signature                                                                                              | Task use                                           |
| ------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| `get`         | `<T>(entryId: string) => ConfigForm<T>`                                                                | Used by the task contract in the linked guardrail. |
| `whileServed` | `(namespaces: readonly string[], register: (served: ReadonlySet<string>) => () => void) => () => void` | Used by the task contract in the linked guardrail. |

**`SlotMap`**

- Entry: `export:@deepseek-ai/dsh-client-ui-slots:.`
- Signature: `SlotMap`
- Source: `packages/client/ui-slots/src/index.ts`

No directly declared member is needed beyond the callable/type signature for the selected task.

**`SlotCore`**

- Entry: `export:@deepseek-ai/dsh-client-ui-slots:.`
- Signature: `SlotCore`
- Source: `packages/client/ui-slots/src/index.ts`

| Member      | Signature                                                                                                                                                                                                                                                                                                                            | Task use                                           |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| `factory`   | `(name: string) => StoredFactory \| undefined`                                                                                                                                                                                                                                                                                       | Used by the task contract in the linked guardrail. |
| `register`  | `{ <K extends keyof SlotMap & string, const EntryKey extends EntryKeyOf<K> = EntryKeyOf<K>, const D extends ChildrenDecl = Record<never, never>, H extends StoreDecl \| undefined = undefined, M = never, N extends (keyof LocaleNamespaceMap & string) \| undefined = undefined, C extends SlotComponent<never> = SlotComponent...` | Used by the task contract in the linked guardrail. |
| `snapshot`  | `(root?: string \| undefined) => LiveCompositionNode[]`                                                                                                                                                                                                                                                                              | Used by the task contract in the linked guardrail. |
| `spec`      | `<K extends keyof SlotMap & string>(key: K) => SlotSpec<SlotMap[K]> \| undefined`                                                                                                                                                                                                                                                    | Used by the task contract in the linked guardrail. |
| `subscribe` | `(key: string, fn: () => void) => () => void`                                                                                                                                                                                                                                                                                        | Used by the task contract in the linked guardrail. |

**`WebRuntime`**

- Entry: `export:@deepseek-ai/dsh-web:.`
- Signature: `WebRuntime`
- Source: `packages/web/web/src/index.ts`

| Member   | Signature                                                                                    | Task use                                           |
| -------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `fetch`  | `(request: WebFetchRequest, signal?: AbortSignal \| undefined) => Promise<WebFetchResult>`   | Used by the task contract in the linked guardrail. |
| `search` | `(request: WebSearchRequest, signal?: AbortSignal \| undefined) => Promise<WebSearchResult>` | Used by the task contract in the linked guardrail. |

**`WebFetchProvider`**

- Entry: `export:@deepseek-ai/dsh-web:.`
- Signature: `WebFetchProvider`
- Source: `packages/web/web/src/types.ts`

| Member  | Signature                                                                                  | Task use                                           |
| ------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| `fetch` | `(request: WebFetchRequest, signal?: AbortSignal \| undefined) => Promise<WebFetchResult>` | Used by the task contract in the linked guardrail. |
| `id`    | `string`                                                                                   | Used by the task contract in the linked guardrail. |

**`WebSearchProvider`**

- Entry: `export:@deepseek-ai/dsh-web:.`
- Signature: `WebSearchProvider`
- Source: `packages/web/web/src/types.ts`

| Member   | Signature                                                                                    | Task use                                           |
| -------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `id`     | `string`                                                                                     | Used by the task contract in the linked guardrail. |
| `search` | `(request: WebSearchRequest, signal?: AbortSignal \| undefined) => Promise<WebSearchResult>` | Used by the task contract in the linked guardrail. |

**`OfficeToPdf`**

- Entry: `export:@deepseek-ai/dsh-office-to-pdf:.`
- Signature: `OfficeToPdf`
- Source: `packages/document/office-to-pdf/src/index.ts`

| Member   | Signature                                                                                                                                      | Task use                                           |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `render` | `(workspaceFileScope: WorkspaceFileScope, path: string, priority: OfficeToPdfPriority, signal: AbortSignal) => Promise<RenderedDocumentBytes>` | Used by the task contract in the linked guardrail. |

**`OfficeToPdfResult`**

- Entry: `export:@deepseek-ai/dsh-office-to-pdf:.`
- Signature: `OfficeToPdfResult`
- Source: `packages/document/office-to-pdf/src/types.ts`

No directly declared member is needed beyond the callable/type signature for the selected task.

**`DynamicCordisPackageRunner`**

- Entry: `export:@deepseek-ai/dsh-cordis-client-runner:./client`
- Signature: `DynamicCordisPackageRunner`
- Source: `packages/extensions/cordis-client-runner/src/client/runtime.ts`

| Member        | Signature                                                             | Task use                                           |
| ------------- | --------------------------------------------------------------------- | -------------------------------------------------- |
| `dispose`     | `() => Promise<void>`                                                 | Used by the task contract in the linked guardrail. |
| `getSnapshot` | `() => readonly DynamicCordisLivePackage[]`                           | Used by the task contract in the linked guardrail. |
| `load`        | `(half: DynamicCordisClientHalf) => Promise<DynamicCordisLoadResult>` | Used by the task contract in the linked guardrail. |
| `subscribe`   | `(fn: () => void) => () => void`                                      | Used by the task contract in the linked guardrail. |

**`TerminalController`**

- Entry: `export:@deepseek-ai/dsh-api-terminal-controller:.`
- Signature: `TerminalController`
- Source: `packages/api/terminal-controller/src/index.ts`

| Member   | Signature                                                                                                                                  | Task use                                           |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| `create` | `(agent: Agent, request: TerminalCreateRequest, signal: AbortSignal) => Promise<WebTerminalInfo>`                                          | Used by the task contract in the linked guardrail. |
| `list`   | `(sessionId: SessionId) => WebTerminalInfo[]`                                                                                              | Used by the task contract in the linked guardrail. |
| `resize` | `(agent: Agent, id: Branded<"WebTerminalId">, attachmentId: Branded<"TerminalAttachmentId">, cols: number, rows: number) => Promise<void>` | Used by the task contract in the linked guardrail. |
| `write`  | `(agent: Agent, id: Branded<"WebTerminalId">, attachmentId: Branded<"TerminalAttachmentId">, data: string) => Promise<void>`               | Used by the task contract in the linked guardrail. |

**`ClientTerminals`**

- Entry: `export:@deepseek-ai/dsh-api-terminal-controller:./client`
- Signature: `ClientTerminals`
- Source: `packages/api/terminal-controller/src/client/index.ts`

| Member | Signature                                                                                                                   | Task use                                           |
| ------ | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `view` | `(sessionId: SessionId, key: string, contentId: string, terminalId?: any, shellPath?: string \| undefined) => TerminalView` | Used by the task contract in the linked guardrail. |

**`Workspace`**

- Entry: `export:@deepseek-ai/dsh-workspace:.`
- Signature: `Workspace`
- Source: `packages/workspace/workspace/src/types.ts`

| Member   | Signature                              | Task use                                           |
| -------- | -------------------------------------- | -------------------------------------------------- |
| `id`     | `Branded<"WorkspaceId">`               | Used by the task contract in the linked guardrail. |
| `path`   | `string`                               | Used by the task contract in the linked guardrail. |
| `status` | `() => Promise<"ok" \| "missing-dir">` | Used by the task contract in the linked guardrail. |

**`IWorkspaces`**

- Entry: `export:@deepseek-ai/dsh-api-workspace-controller:./client`
- Signature: `IWorkspaces`
- Source: `packages/api/workspace-controller/src/client/service.ts`

| Member   | Signature                                              | Task use                                           |
| -------- | ------------------------------------------------------ | -------------------------------------------------- |
| `create` | `(input: { path: string; }) => Promise<WorkspaceView>` | Used by the task contract in the linked guardrail. |
| `list`   | `WorkspaceSource`                                      | Used by the task contract in the linked guardrail. |

**`defineStore`**

- Entry: `export:@deepseek-ai/dsh-client-store:.`
- Signature: `any`
- Source: `packages/client/store/src/index.ts`

No directly declared member is needed beyond the callable/type signature for the selected task.

**`createSnapshotStore`**

- Entry: `export:@deepseek-ai/dsh-client-store:.`
- Signature: `any`
- Source: `packages/client/store/src/index.ts`

No directly declared member is needed beyond the callable/type signature for the selected task.

**`ConfigForm`**

- Entry: `export:@deepseek-ai/dsh-client-ui-settings:./client`
- Signature: `ConfigForm<T>`
- Source: `packages/client/ui-settings/src/client/config-form-types.ts`

| Member        | Signature                                                                                          | Task use                                           |
| ------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `getSnapshot` | `() => ConfigFormSnapshot<T>`                                                                      | Used by the task contract in the linked guardrail. |
| `mutate`      | `(ops: readonly SettingsPathOpView[], expectedRevision?: number \| undefined) => Promise<boolean>` | Used by the task contract in the linked guardrail. |
| `set`         | `(field: string, value: unknown) => Promise<boolean>`                                              | Used by the task contract in the linked guardrail. |
| `subscribe`   | `(listener: () => void) => () => void`                                                             | Used by the task contract in the linked guardrail. |
| `unset`       | `(field: string) => Promise<boolean>`                                                              | Used by the task contract in the linked guardrail. |
