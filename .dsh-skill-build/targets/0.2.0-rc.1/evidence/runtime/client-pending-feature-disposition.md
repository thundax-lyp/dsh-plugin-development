# Remaining Client feature entry triage

Target: `dsh-v0.2.0-rc.1` at `4878cdabd87d4041bdaff61d04c966883b9fd07a`. This file proposes entry dispositions for the still-pending `dsh-client-*` packages after the five priority packages in [client-pending-priority-disposition.md](client-pending-priority-disposition.md). These are source/export decisions, not isolated consumer or browser test results. `merged` names the owning plugin-author task rather than claiming that an application feature has its own public registration API.

## Infrastructure and test entries

| Export entry | Recommendation | Exact-source basis / owning task |
| --- | --- | --- |
| `@deepseek-ai/dsh-client-connection/client` | included in `api-client-connection.md` | `packages/client/connection/src/client/index.ts` exports `ConnectionHandle` generation/state observables, `rpc`, `reconnect`, `registerGenerationSource`, `start`, and transport hooks. Consumers can react to `connection/reset`; a custom carrier is a specialized shell composition, with `start` and generation source single-owner. |
| `@deepseek-ai/dsh-client-resources` root | merged into `api-client-resources.md` | `packages/client/resources/src/index.ts` is only empty Host `apply`; `./client` carries actual provider registration. |
| `@deepseek-ai/dsh-client-shortcuts` root | merged into `api-client-shortcuts.md` | `packages/client/shortcuts/src/index.ts` publishes Host configuration for shortcuts, while `./client` is the actual registry and keybinding task. |
| `@deepseek-ai/dsh-client-ui-slots` root | included in `api-client-slots.md` | `packages/client/ui-slots/src/index.ts` publishes `SlotMap`, `SlotFactoryMap`, store/renderer contracts and real registration types; no generic Host `apply` task is implied. |
| `@deepseek-ai/dsh-client-test-runtime` root | included in Client test support, if test tasks are in scope | This package is under `packages/test-support/client-runtime`, not `packages/client`. Its `package.json` describes jsdom slot bench and whole-client `bootClient` over a Remote mock; investigate and route its concrete exports through a testing reference before treating it as application runtime. |

## Built-in feature components

For the table below, the package's `src/client/index.ts` supplies the cited feature. Most corresponding `src/index.ts` files explicitly return from an empty `apply()` solely to create a Loader row; those roots should be **merged** into the indicated composition task and not presented as Host services. The exceptions with real Host work are called out separately below. A built-in feature calling `ctx.slots.register()` is evidence of how to use the common slots registry; it does not create a new third-party registry in that feature package.

| `@deepseek-ai/dsh-client-*` package | Pending `./client` recommendation | Source evidence / owning task |
| --- | --- | --- |
| `ui-agent-preset` | merged into settings and agent preset UI | `src/client/index.ts` registers `settings.section` and preset seat/chip; external plugins contribute to `ctx.slots`, while preset data comes from the Session/settings APIs. |
| `ui-approval` | merged into conversation composer | `src/client/index.ts` installs approval presentation at `conversation.composer`, consuming Remote approval state. |
| `ui-attachment` | merged into attachment UI | `src/client/index.ts` registers input attachment and message/tool image slots; custom upload ownership is the separate file-upload Client service. |
| `ui-brand-official` | excluded as an official identity implementation | `src/client/index.ts` fills `sidebar.brand.mark` and `.name`; external brand contribution uses those slots. |
| `ui-commands` | merged into input-trigger/command UI | `src/client/index.ts` supplies the command popup at `conversation.input.overlay`; `ctx.inputTriggers` owns third-party trigger registration. |
| `ui-deliverables` | merged into tool-view and right-sidebar tasks | `src/client/index.ts` registers `tool.call.toolview` and `sidebar.right.pane.tab`; Host `src/index.ts` additionally owns file-reference guidance and native open routes, not a general feature registry. |
| `ui-directory-picker-browse`, `ui-directory-picker-native` | merged into directory-picker task | Each `src/client/index.ts` registers `conversation.hero.workspace.directoryFlow` and `sidebar.workspaces.directoryFlow`; these are alternative implementations of one picker seat, not two generic registration services. |
| `ui-goal` | merged into goal and conversation-node task | `src/client/index.ts` contributes `conversation.chat.node` and input dock, registers a goal event in `ctx.uiConversation.events`. |
| `ui-input-trigger` root | merged into `api-client-input-trigger.md` | Root `src/index.ts` is empty Loader half; `./client` owns trigger registry and existing reference. |
| `ui-jobs` | merged into Jobs UI | `src/client/index.ts` contributes the list action using `ctx.jobs` and `ctx.slots`; background execution is in Jobs packages, not this UI feature. |
| `ui-layout` | included as `./client` supporting API in `api-client-main-panels.md` | `src/client/index.ts` owns `ctx.layout`, main panel state, AppFrame slot and shortcuts. The Host root is empty. |
| `ui-message-feedback` | merged into feedback UI | `src/client/index.ts` creates `feedbackUi` over Remote feedback methods and slots; Host feedback recording is a separate API. |
| `ui-model-selection` | merged into Session model selection UI | `src/client/index.ts` registers a command and `conversation.input.model` seat; authoritative selection flows through Session controller. |
| `ui-open-in-app` | merged into shortcut/slot task | `src/client/index.ts` registers browser shortcut and file/document action seats; no separate open-action registry. |
| `ui-permission-presets` | merged into permission preset UI | `src/client/index.ts` contributes `settings.general.item` and `conversation.input.permission`, reading policy catalog/Session state. |
| `ui-plan` | merged into planning and conversation UI | `src/client/index.ts` uses conversation event registry, resource provider, right tab and `conversation.input.plan` seat; planning data is not owned by this presentation package. |
| `ui-reference` | merged into Session reference input | `src/client/index.ts` is a built-in file/Session reference affordance over Remote/Session APIs, not a fresh provider registry. |
| `ui-schedule` | merged into schedule and right-tab UI | `src/client/index.ts` registers schedule tab, panel, conversation event and sidebar seats; task creation belongs to schedule Remote/Host API. |
| `ui-skill` | merged into skill provider and input-trigger UI | `src/client/index.ts` consumes `remote.skills`, registers a tool view and trigger affordances; skill provider registration is a Host task. |
| `ui-subagent` | merged into subagent UI | `src/client/index.ts` composes subagent display and controls using existing Session and slots faces. |
| `ui-tool` | merged into conversation/tool-view task | `src/client/index.ts` only re-exports `apply`/types from `apply.ts`; keyed tool rendering is the common slot contract. |
| `ui-trajectory` | merged into conversation view task | `src/client/index.ts` uses `ctx.uiSession` and contributes `conversation.view`; not a separate trajectory provider registry. |
| `ui-user-questions` | merged into question/composer task | `src/client/index.ts` registers `conversation.composer`, consumes Session/Remote pending questions. |
| `ui-workflow-run` | merged into workflow run conversation node | `src/client/index.ts` registers event and `conversation.chat.node`; durable run state is in workflow Host packages. |
| `ui-workspace` | merged into workspace/sidebar task | `src/client/index.ts` owns UI navigation and registers workspace sidebar, session actions and hero seats; workspace mutation is via controller Remote. |

## Shared UI owners and settings surfaces

| Export entry/group | Recommendation | Exact-source basis / owning task |
| --- | --- | --- |
| `ui-chat` root/client | root merged into chat preferences; `./client` merged into conversation-node task | Root `src/index.ts` registers browser Chat preferences. `src/client/index.ts` exports built-in chat node plugin and types; third-party node registry is `ctx.uiConversation.events/views`, documented in `api-conversation-nodes.md`. |
| `ui-conversation` root/client | root merged into conversation settings; `./client` included in `api-conversation-nodes.md` | Root registers submission settings. `src/client/index.ts` publicly exports `UiConversation`, `ConversationDefinitionRegistry`, `ConversationEventRegistry`, `ConversationViewRegistry`, and input/slot contracts. |
| `ui-renderer` root/invariant | root merged into Client render boot; invariant merged into invariant instrumentation task | Root is empty Host Loader entry. `src/invariant.ts` exports a real Cordis companion `apply()` that calls `ctx.invariants.register()` to check `slots/changed` dispatch order. It is package-owned diagnostic instrumentation, not the external slots contribution API; external UI contribution still uses `ctx.slots` and published slot types. |
| `ui-session` root/client | root merged into Session UI boot; `./client` included as session UI consumer API | Root empty. `src/client/index.ts` exports `UiSession`, `SessionSourceContribution`, pending-interaction publication and Session snapshot hooks; custom Client Session views may consume/provide these with lifecycle ownership. |
| `ui-plugin-manager` root/client | root merged into Profile bundle management; `./client` merged into plugin settings card / main panel | Root `src/index.ts` handles registry-response probe for install dialog. `src/client/index.ts` owns `pluginNavigation.openBundle()` and declares `plugins.*` child slots from its one main panel. External package configuration contributes via those slots, not by replacing manager service. |
| `ui-plugin-manager/remote`, `/typert` | merged into generated Remote owner | Generated wire artifacts for one built-in manager, not a separate third-party registration point. |
| `ui-sidebar-right` root/client | root merged; `./client` included in `api-sidebar-right-tabs.md` | Root empty. Client owns `ctx.sidebarRightTabs.register()` and tab registry. |
| `ui-sidebar` root/client | root merged; `./client` included as supporting navigation/slot API | Root empty. Client owns sidebar service and slots; independent sidebar contribution uses `sidebar.panellist` or named seats. |
| `ui-shortcuts` root/client | root merged; `./client` merged into `api-client-shortcuts.md` | Root empty. Client contributes settings row and keyboard UI over `ctx.shortcuts.register()` from `dsh-client-shortcuts/client`. |
| `ui-theme` root/client | root merged into preference bootstrap; `./client` included in `api-client-theme.md` | Root registers preference and pre-plugin palette. Client exports theme service/contribution API. |
| `ui-settings` root | merged into `api-client-settings-forms.md` | Root installs developer-tool preference; its `./client` is already included as forms/schema owner. |
| `ui-settings-account`, `ui-settings-general`, `ui-settings-models` root | merged into settings task | Their roots register account, welcome or model onboarding settings/bootstrap. They are product-owned preference namespaces, not generic plugin configuration APIs. |
| `ui-settings-*` Client feature entries | merged into `api-client-settings-forms.md` and `how-to-add-plugin-settings-card.md` | `agent-loop`, `general`, `models`, `plugin-inventory`, `plugins`, `session-log`, `shell`, `subagent`, `web-search`, `account` client indexes all contribute to shared `settings.*` or `plugins.item` seats. External plugins use `ctx.configForms` plus those slots. `ui-settings-general/types` only supplies its preference value contract. |
| `ui-settings-plugin-inventory`, `ui-settings-plugins`, `ui-settings-session-log`, `ui-settings-shell`, `ui-settings-subagent`, `ui-settings-web-search`, `ui-settings-agent-loop` root | merged into settings Loader composition | Their roots are empty Host `apply()` entries. |
| `ui-sidebar-browser`, `ui-sidebar-files`, `ui-sidebar-terminal` root/client | root merged; `./client` merged into `api-sidebar-right-tabs.md` | Roots empty. Client indexes register named right-tab definitions and panes; third-party authors call `ctx.sidebarRightTabs.register()` directly. `ui-sidebar-browser/types` is browser tab value contract. |
| `ui-sidebar-documentpreview` root/client | root merged into document preview route; `./client` merged into right-tab/resource task | Host root registers preview configuration and routes. Client registers a named right tab and consumes resources. |
| `ui-cordis` root/client | root merged; `./client` merged into dynamic Cordis task | This package lives under `packages/extensions/ui-cordis`. Root `apply()` is empty. Client owns built-in inventory panel and `cordis_*` tool-view cards over `remote.dynamicCordisRunner`; external card additions use the declared `tool.view.cordis` child slot. |

The `./client` feature entries in the built-in table above are **merged** for task coverage, not excluded from the published export inventory. Any promoted `included` object needs symbol/member coverage within the exact section mapped by the shared API ledger. This review has not compiled every UI feature export as an isolated external consumer, and no browser run was performed for this broad triage. Separate Client task evidence covers the already documented slots, resources, settings forms, connection, shortcuts, sidebar tabs, theme, locale, input trigger, conversation nodes and main panels.
