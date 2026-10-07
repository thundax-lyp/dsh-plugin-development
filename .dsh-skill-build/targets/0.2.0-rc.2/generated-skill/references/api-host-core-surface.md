# Host/Core task API

本页锁定 `dsh-v0.2.0-rc.2` 的任务所需公开对象和直接成员；运行语义、生命周期与失败边界见 [对应 guardrail](api-host-core.md)。未列入的公开符号仍在 `api-surface.json` 中逐项裁决，但不进入常规插件指导。

## Host/Core task API

**`SystemPrompt`**

- Entry: `export:@deepseek-ai/dsh-system-prompt:.`
- Signature: `SystemPrompt`
- Source: `packages/core/system-prompt/src/index.ts`

| Member                   | Signature                                                                                                                                                                                                                                                | Task use                                           |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `assemble`               | `(context?: AssembleContext) => Promise<PromptAssembly>`                                                                                                                                                                                                 | Used by the task contract in the linked guardrail. |
| `context`                | `(context: PromptContext) => () => void`                                                                                                                                                                                                                 | Used by the task contract in the linked guardrail. |
| `getContextOrder`        | `(name: "SANDBOX_POLICY" \| "APPROVAL_POLICY" \| "SUBAGENT_DELEGATION") => number`                                                                                                                                                                       | Used by the task contract in the linked guardrail. |
| `getSectionOrder`        | `(name: "HARNESS_IDENTITY" \| "DEPLOYMENT_PERSONA_PREFIX" \| "PLAN_POLICY" \| "TEAM_POLICY" \| "PTC_ONLY" \| "FILE_REFERENCE" \| "TOOL_BASH" \| "TOOL_PWSH" \| "TOOL_READ" \| "TOOL_WRITE" \| ... 21 more ... \| "DEPLOYMENT_PERSONA_SUFFIX") => number` | Used by the task contract in the linked guardrail. |
| `section`                | `(section: PromptSection) => () => void`                                                                                                                                                                                                                 | Used by the task contract in the linked guardrail. |
| `suppressRuntimeContext` | `() => () => void`                                                                                                                                                                                                                                       | Used by the task contract in the linked guardrail. |
| `tools`                  | `(provider: (context: AssembleContext) => ToolProviderResult) => () => void`                                                                                                                                                                             | Used by the task contract in the linked guardrail. |
| `variable`               | `(name: string, provider: (context: AssembleContext) => string \| undefined) => () => void`                                                                                                                                                              | Used by the task contract in the linked guardrail. |

**`ToolRuntime`**

- Entry: `export:@deepseek-ai/dsh-tools:.`
- Signature: `ToolRuntime`
- Source: `packages/core/tools/src/index.ts`

| Member     | Signature                                                    | Task use                                           |
| ---------- | ------------------------------------------------------------ | -------------------------------------------------- |
| `execute`  | `(exec: ToolExecutionInput) => Promise<ToolExecutionResult>` | Used by the task contract in the linked guardrail. |
| `get`      | `(name: string, scope?: any) => ToolDefinition \| undefined` | Used by the task contract in the linked guardrail. |
| `guard`    | `(guard: ToolGuard) => () => void`                           | Used by the task contract in the linked guardrail. |
| `register` | `(definition: ToolDefinition) => () => void`                 | Used by the task contract in the linked guardrail. |

**`ToolDefinition`**

- Entry: `export:@deepseek-ai/dsh-tools:.`
- Signature: `ToolDefinition`
- Source: `packages/core/tools/src/index.ts`

| Member              | Signature                                                                                                              | Task use                                           |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `execute`           | `(args: unknown, exec: ToolRunContext) => Promise<unknown>`                                                            | Used by the task contract in the linked guardrail. |
| `finalizeContent`   | `((exec: Readonly<ToolExecution>, result: Readonly<ToolExecutionResult>) => ContentBlock[] \| undefined) \| undefined` | Used by the task contract in the linked guardrail. |
| `isConcurrencySafe` | `((args: unknown) => boolean) \| undefined`                                                                            | Used by the task contract in the linked guardrail. |
| `output`            | `ToolOutputDefinition`                                                                                                 | Used by the task contract in the linked guardrail. |
| `presentCall`       | `((args: unknown) => ToolCallView \| undefined) \| undefined`                                                          | Used by the task contract in the linked guardrail. |
| `presentResult`     | `((args: unknown, result: ToolResult) => ToolResultView \| undefined) \| undefined`                                    | Used by the task contract in the linked guardrail. |
| `projectContent`    | `((exec: Readonly<ToolExecution>, result: Readonly<ToolExecutionResult>) => ContentBlock[] \| undefined) \| undefined` | Used by the task contract in the linked guardrail. |
| `timeoutMs`         | `number \| undefined`                                                                                                  | Used by the task contract in the linked guardrail. |

**`LlmRuntime`**

- Entry: `export:@deepseek-ai/dsh-llm:.`
- Signature: `LlmRuntime`
- Source: `packages/llm/llm/src/index.ts`

| Member        | Signature                                                                                | Task use                                           |
| ------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `prepareCall` | `(config: LlmCallConfig, signal?: AbortSignal \| undefined) => Promise<PreparedLlmCall>` | Used by the task contract in the linked guardrail. |
| `stream`      | `(options: GenerateOptions) => AsyncIterable<StreamChunk>`                               | Used by the task contract in the linked guardrail. |

**`LlmAdapter`**

- Entry: `export:@deepseek-ai/dsh-llm:.`
- Signature: `LlmAdapter`
- Source: `packages/llm/llm/src/index.ts`

| Member        | Signature                                                                                              | Task use                                           |
| ------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| `prepareCall` | `(provider: string, model: string, signal?: AbortSignal \| undefined) => Promise<PreparedAdapterCall>` | Used by the task contract in the linked guardrail. |
| `stream`      | `(options: GenerateOptions) => AsyncIterable<StreamChunk>`                                             | Used by the task contract in the linked guardrail. |

**`Session`**

- Entry: `export:@deepseek-ai/dsh-session:.`
- Signature: `Session`
- Source: `packages/core/session/src/index.ts`

| Member    | Signature                                                                                                                                                   | Task use                                           |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `append`  | `<T extends SessionEventType>(type: T, data: SessionEventMap[T], ...opts: T extends SurfaceEventType ? [opts: SurfaceIntent<T>] : []) => SessionEvent<...>` | Used by the task contract in the linked guardrail. |
| `header`  | `SessionHeader`                                                                                                                                             | Used by the task contract in the linked guardrail. |
| `id`      | `Branded<"SessionId">`                                                                                                                                      | Used by the task contract in the linked guardrail. |
| `seq`     | `BrandedNumber<"SessionLogOffset">`                                                                                                                         | Used by the task contract in the linked guardrail. |
| `surface` | `SessionSurface`                                                                                                                                            | Used by the task contract in the linked guardrail. |

**`SessionProjectionRegistry`**

- Entry: `export:@deepseek-ai/dsh-session-projection:.`
- Signature: `SessionProjectionRegistry`
- Source: `packages/session/session-projection/src/index.ts`

| Member       | Signature                                                                                                                                                                                                                                                                                                                          | Task use                                           |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `checkpoint` | `(session: Session) => ProjectionCheckpoint`                                                                                                                                                                                                                                                                                       | Used by the task contract in the linked guardrail. |
| `register`   | `{ <K extends keyof SessionProjectionMap, S extends SessionProjectionStateMap[K]>(definition: Omit<ProjectionDefinition<K, S>, "wire"> & { wire: (K extends never ? { ...; } : never) & {}; }): () => void; <K extends Exclude<keyof SessionProjectionStateMap, keyof SessionProjectionMap>, S extends SessionProjectionStateM...` | Used by the task contract in the linked guardrail. |
| `restore`    | `(checkpoint: ProjectionCheckpoint, events: readonly SessionEvent[], baseSeq: SessionLogOffset, header: SessionHeader, inheritedEventCount: SessionLogOffset) => { snapshot: ProjectionSnapshot; checkpoint: ProjectionCheckpoint; }`                                                                                              | Used by the task contract in the linked guardrail. |
| `snapshot`   | `(session: Session, keys?: readonly never[] \| undefined) => ProjectionSnapshot`                                                                                                                                                                                                                                                   | Used by the task contract in the linked guardrail. |

**`CommandRuntime`**

- Entry: `export:@deepseek-ai/dsh-commands:.`
- Signature: `CommandRuntime`
- Source: `packages/interaction/commands/src/index.ts`

| Member     | Signature                                                                                                                           | Task use                                           |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `execute`  | `(agent: Agent, line: string, submittedAttachments: readonly any[], signal: AbortSignal) => Promise<CommandExecution \| undefined>` | Used by the task contract in the linked guardrail. |
| `list`     | `(agent: Agent) => readonly CommandDescriptor[]`                                                                                    | Used by the task contract in the linked guardrail. |
| `register` | `(definition: CommandDefinition) => () => void`                                                                                     | Used by the task contract in the linked guardrail. |

**`ApprovalService`**

- Entry: `export:@deepseek-ai/dsh-user-approval:.`
- Signature: `ApprovalService`
- Source: `packages/interaction/user-approval/src/index.ts`

| Member    | Signature                                            | Task use                                           |
| --------- | ---------------------------------------------------- | -------------------------------------------------- |
| `config`  | `Config`                                             | Used by the task contract in the linked guardrail. |
| `request` | `(req: ApprovalRequest) => Promise<ApprovalOutcome>` | Used by the task contract in the linked guardrail. |

**`GoalService`**

- Entry: `export:@deepseek-ai/dsh-goal:.`
- Signature: `GoalService`
- Source: `packages/goal/goal/src/index.ts`

| Member     | Signature                                                            | Task use                                           |
| ---------- | -------------------------------------------------------------------- | -------------------------------------------------- |
| `block`    | `(agent: Agent, ref: GoalRef, reason: GoalBlockReason) => GoalView`  | Used by the task contract in the linked guardrail. |
| `clear`    | `(agent: Agent, ref: GoalRef) => GoalRef`                            | Used by the task contract in the linked guardrail. |
| `complete` | `(agent: Agent, ref: GoalRef) => GoalView`                           | Used by the task contract in the linked guardrail. |
| `create`   | `(agent: Agent, request: CreateGoalRequest) => GoalView`             | Used by the task contract in the linked guardrail. |
| `edit`     | `(agent: Agent, ref: GoalRef, request: EditGoalRequest) => GoalView` | Used by the task contract in the linked guardrail. |
| `get`      | `(agent: Agent) => GoalView \| undefined`                            | Used by the task contract in the linked guardrail. |
| `pause`    | `(agent: Agent, ref: GoalRef) => GoalView`                           | Used by the task contract in the linked guardrail. |
| `resume`   | `(agent: Agent, ref: GoalRef) => GoalView`                           | Used by the task contract in the linked guardrail. |

**`JobRegistry`**

- Entry: `export:@deepseek-ai/dsh-jobs:.`
- Signature: `JobRegistry`
- Source: `packages/jobs/jobs/src/index.ts`

| Member   | Signature                                                                                                        | Task use                                           |
| -------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `events` | `JobEvents`                                                                                                      | Used by the task contract in the linked guardrail. |
| `get`    | `(id: Branded<"JobId">, caller?: any) => JobView`                                                                | Used by the task contract in the linked guardrail. |
| `kill`   | `(id: Branded<"JobId">, caller?: any, reason?: string \| undefined) => "requested" \| "already-finished"`        | Used by the task contract in the linked guardrail. |
| `list`   | `(caller?: any) => JobView[]`                                                                                    | Used by the task contract in the linked guardrail. |
| `read`   | `(id: Branded<"JobId">, caller?: any) => JobRead`                                                                | Used by the task contract in the linked guardrail. |
| `readAt` | `(id: Branded<"JobId">, from: number, caller?: any) => JobOutputRead`                                            | Used by the task contract in the linked guardrail. |
| `remove` | `(id: Branded<"JobId">, caller?: any) => void`                                                                   | Used by the task contract in the linked guardrail. |
| `start`  | `(spec: JobSpec) => Branded<"JobId">`                                                                            | Used by the task contract in the linked guardrail. |
| `wait`   | `(id: Branded<"JobId">, timeoutMs: number, caller?: any, signal?: AbortSignal \| undefined) => Promise<JobView>` | Used by the task contract in the linked guardrail. |

**`LocalJobRegistry`**

- Entry: `export:@deepseek-ai/dsh-jobs-local:.`
- Signature: `LocalJobRegistry`
- Source: `packages/jobs/jobs-local/src/index.ts`

| Member   | Signature                                                                                             | Task use                                           |
| -------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `events` | `JobEvents`                                                                                           | Used by the task contract in the linked guardrail. |
| `get`    | `(id: JobId, caller?: any) => JobView`                                                                | Used by the task contract in the linked guardrail. |
| `kill`   | `(id: JobId, caller?: any, reason?: string \| undefined) => "requested" \| "already-finished"`        | Used by the task contract in the linked guardrail. |
| `list`   | `(caller?: any) => JobView[]`                                                                         | Used by the task contract in the linked guardrail. |
| `read`   | `(id: JobId, caller?: any) => JobRead`                                                                | Used by the task contract in the linked guardrail. |
| `readAt` | `(id: JobId, from: number, caller?: any) => JobOutputRead`                                            | Used by the task contract in the linked guardrail. |
| `remove` | `(id: JobId, caller?: any) => void`                                                                   | Used by the task contract in the linked guardrail. |
| `start`  | `(spec: JobSpec) => JobId`                                                                            | Used by the task contract in the linked guardrail. |
| `wait`   | `(id: JobId, timeoutMs: number, caller?: any, signal?: AbortSignal \| undefined) => Promise<JobView>` | Used by the task contract in the linked guardrail. |

**`SkillRegistry`**

- Entry: `export:@deepseek-ai/dsh-skill:.`
- Signature: `SkillRegistry`
- Source: `packages/skill/skill/src/index.ts`

| Member             | Signature                                                                             | Task use                                           |
| ------------------ | ------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `get`              | `(name: string, options?: SkillViewOptions) => Promise<SkillDefinition \| undefined>` | Used by the task contract in the linked guardrail. |
| `list`             | `(options?: SkillViewOptions) => Promise<SkillSummary[]>`                             | Used by the task contract in the linked guardrail. |
| `register`         | `(skill: SkillRegistration) => () => void`                                            | Used by the task contract in the linked guardrail. |
| `registerProvider` | `(create: (control: SkillProviderControl) => SkillProvider) => () => void`            | Used by the task contract in the linked guardrail. |
| `snapshot`         | `(options?: SkillViewOptions) => Promise<SkillCatalogSnapshot>`                       | Used by the task contract in the linked guardrail. |

**`FileSystemSkillProvider`**

- Entry: `export:@deepseek-ai/dsh-skill-filesystem:.`
- Signature: `FileSystemSkillProvider`
- Source: `packages/skill/skill-filesystem/src/index.ts`

| Member    | Signature                                                                  | Task use                                           |
| --------- | -------------------------------------------------------------------------- | -------------------------------------------------- |
| `dispose` | `() => Promise<void>`                                                      | Used by the task contract in the linked guardrail. |
| `get`     | `(candidate: SkillCandidate, options: SkillLookupOptions) => Promise<any>` | Used by the task contract in the linked guardrail. |
| `list`    | `(options: SkillLookupOptions) => Promise<any>`                            | Used by the task contract in the linked guardrail. |
| `name`    | `string`                                                                   | Used by the task contract in the linked guardrail. |

**`SubagentRuntime`**

- Entry: `export:@deepseek-ai/dsh-subagent:.`
- Signature: `SubagentRuntime`
- Source: `packages/subagent/subagent/src/index.ts`

| Member             | Signature                                                                                 | Task use                                           |
| ------------------ | ----------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `interrupt`        | `(targetSessionId: SessionId, authority: SubagentInterruptAuthority) => void`             | Used by the task contract in the linked guardrail. |
| `list`             | `() => string[]`                                                                          | Used by the task contract in the linked guardrail. |
| `prompt`           | `(request: SubagentPromptRequest, signal: AbortSignal) => Promise<SubagentPromptReceipt>` | Used by the task contract in the linked guardrail. |
| `registerProvider` | `(provider: SubagentProvider) => () => void`                                              | Used by the task contract in the linked guardrail. |
| `start`            | `(name: string, request: SubagentStartRequest) => Promise<SubagentRun>`                   | Used by the task contract in the linked guardrail. |

**`default`**

- Entry: `export:@deepseek-ai/dsh-tool-subagent:./model-selection-settings`
- Signature: `SubagentModelSelectionConfig`
- Source: `packages/subagent/tool-subagent/src/model-selection-settings.ts`

| Member    | Signature                              | Task use                                           |
| --------- | -------------------------------------- | -------------------------------------------------- |
| `current` | `() => SubagentModelSelectionSettings` | Used by the task contract in the linked guardrail. |

**`WorkflowEngine`**

- Entry: `export:@deepseek-ai/dsh-workflow:.`
- Signature: `WorkflowEngine`
- Source: `packages/workflow/workflow/src/index.ts`

| Member  | Signature                                        | Task use                                           |
| ------- | ------------------------------------------------ | -------------------------------------------------- |
| `start` | `(request: WorkflowStartRequest) => WorkflowRun` | Used by the task contract in the linked guardrail. |

**`default`**

- Entry: `export:@deepseek-ai/dsh-workflow-ptc:.`
- Signature: `PtcWorkflowEngine`
- Source: `packages/workflow/workflow-ptc/src/index.ts`

| Member  | Signature                                        | Task use                                           |
| ------- | ------------------------------------------------ | -------------------------------------------------- |
| `start` | `(request: WorkflowStartRequest) => WorkflowRun` | Used by the task contract in the linked guardrail. |

**`runHook`**

- Entry: `export:@deepseek-ai/dsh-hook-protocol:.`
- Signature: `any`
- Source: `packages/hooks/hook-protocol/src/runner.ts`

No directly declared member is needed beyond the callable/type signature for the selected task.

**`AgentRegistry`**

- Entry: `export:@deepseek-ai/dsh-agent:.`
- Signature: `AgentRegistry`
- Source: `packages/core/agent/src/index.ts`

| Member     | Signature                                                 | Task use                                           |
| ---------- | --------------------------------------------------------- | -------------------------------------------------- |
| `create`   | `(options: CreateAgentOptions) => Promise<AgentHandle>`   | Used by the task contract in the linked guardrail. |
| `enter`    | `(agent: Agent, owner: Agent \| undefined) => () => void` | Used by the task contract in the linked guardrail. |
| `get`      | `(id: SessionId) => Agent \| undefined`                   | Used by the task contract in the linked guardrail. |
| `list`     | `() => Agent[]`                                           | Used by the task contract in the linked guardrail. |
| `register` | `(agent: Agent) => any`                                   | Used by the task contract in the linked guardrail. |
| `resume`   | `(options: ResumeAgentOptions) => Promise<AgentHandle>`   | Used by the task contract in the linked guardrail. |
| `roots`    | `() => Agent[]`                                           | Used by the task contract in the linked guardrail. |

**`AgentHandle`**

- Entry: `export:@deepseek-ai/dsh-agent:.`
- Signature: `AgentHandle`
- Source: `packages/core/agent/src/index.ts`

| Member    | Signature             | Task use                                           |
| --------- | --------------------- | -------------------------------------------------- |
| `agent`   | `Agent`               | Used by the task contract in the linked guardrail. |
| `dispose` | `() => Promise<void>` | Used by the task contract in the linked guardrail. |
