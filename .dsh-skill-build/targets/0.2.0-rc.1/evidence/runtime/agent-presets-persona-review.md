# Agent Preset 与 Persona 裁决

目标：`dsh-v0.2.0-rc.1`，commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。

## 公开入口与语义

- `packages/preset/agent-preset-registry/package.json` 根出口、`src/index.ts` 确认 `AgentPresetRegistry` Service、`ctx.agentPresets.register`/`list`/`resolve`/`mount`/`select`/`acquireScope`/`serviceFor`、async disposer 与修订租约。`src/definition.ts` 规定 ID、显示字段和 Cordis 子 entry 列表；`src/mount.ts` 负责隔离组装。失败的子树在 roster 上有 `broken`，不表示可 mount。
- `packages/preset/agent-preset/src/index.ts` 是 `AgentPreset` 声明 row，静态注入 registry 并在 Service.init 中 yield 注册 disposer；它让配置作者不写注册代码也能提交 definition。
- `packages/preset/persona/src/index.ts` 是 scope-only persona row。挂进预设的子 scope 会遮蔽部署 persona；全局挂载与 SystemPrompt 自有 section 冲突，目标测试 `persona.spec.ts` 明确覆盖。
- `select` 仅允许首轮前重组，提交 `agent-preset/selected` Session 事件；已有 turn 的 Session 返回 `agent-preset/locked`。在途旧 Agent 使用旧预设修订，直到 scope 释放。

## 独立发布包消费

`evidence/tests/agent-preset-persona-consumer/` 仅安装 npm 目标 rc.1 包、Cordis 4.0.4/Loader 1.0.5、TypeScript 6.0.3，不依赖目标 checkout 或正式 Skill。

- `npm install --ignore-scripts --no-audit --no-fund`：通过；首次误用 Loader 4.0.4 无版本，改为发布版 1.0.5 后重跑通过。
- `npm run build`：通过；独立 Host 编译 `PresetDefinition`、直接异步注册插件、`AgentPreset` 声明 row 与 `Persona` root 导出。
- `npm run smoke`：通过；真实 Cordis Loader、SessionProjectionRegistry、SystemPrompt、PresetRegistry 装载；直接注册含 Persona 子 row 的 `reviewer`，额外装载现成 `AgentPreset` row；`resolve/list` 可见且无 broken；scope mount 后 persona 与部署 persona 隔离；卸载后新 resolve 拒绝，已绑定 scope 随后释放。
- `npm pack --dry-run --json`：通过。

未运行真实 Agent 创建、Session 首轮/锁定、Client 预设选择 UI、跨进程恢复或新旧修订并发切换；这些仅由目标源码/测试支持。本任务没有更改 base Profile。

## 账本候选

Reference：`api-guardrails/agent-presets-persona.md`；HOW-TO：`how-to-declare-agent-preset-persona.md`。Task 候选 `register-agent-preset`、`declare-agent-preset-row`、`scope-persona-to-agent-preset`。`AgentPresetRegistry` root export 的注册/读取/挂载/选择成员与 `PresetDefinition`/`AgentPreset`/`Config` 可归此主题；`dsh-agent-preset` 的默认 class/`Config`；`dsh-persona` 的 `name/inject/Config/apply/PERSONA_PREFIX_SECTION/PERSONA_SUFFIX_SECTION`。Client UI 另按其浏览器入口审查，不能把 Host Service 直接导入 Client。
