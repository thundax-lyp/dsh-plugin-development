# Conversation node and keyed Chat renderer review

## Target and scope

- Exact checkout: `dsh-v0.2.0-rc.1`, commit `4878cdabd87d4041bdaff61d04c966883b9fd07a` (`git describe --tags --exact-match HEAD` and `git rev-parse HEAD`).
- Source-first review of public Client exports, runtime registry and Chat render dispatch; independent consumer declaration compile; isolated Web Profile and Chrome smoke.
- Subject: external plugin adding a `turn/start`-derived Chat node and a keyed renderer. This is a projection of existing Session history, not a new Host event writer.

## Source evidence

| Claim | Target source |
| --- | --- |
| Public `ConversationNodeDefinition`, match/start/update, paired `target` and `buildViewNode`, `ConversationViewNode`, location/data contracts | `packages/client/ui-conversation/src/client/contract/conversation.ts`; exports in `src/client/index.ts` |
| Unique `kind`, paired target validation, effect-scoped disposer and refresh | `packages/client/ui-conversation/src/client/conversation/event-registry.ts`, `definition-registry.ts` |
| Per-Session binding, target activation and registry rebuild | `packages/client/ui-conversation/src/client/conversation/assembly.ts` |
| Public `ChatNodeDataMap`, `ChatNode`, `ChatNodeViewProps`; Chat node adds `anchorSeq`, `location`, `visibility` | `packages/client/ui-chat/src/client/index.ts`, `contract/chat-nodes.ts`, `contract/slots.ts` |
| Chat declares session keyed `conversation.chat.node` and built-in keyed renderers | `packages/client/ui-chat/src/client/apply.ts`, `chat/register-node-renderers.ts` |
| Chat routes node `kind` into keyed slot; JSON fallback, Turn process folding | `packages/client/ui-chat/src/client/chat/ChatNodeSeat.tsx` |
| An in-tree business plugin contributes Chat node from durable Session event | `packages/client/ui-goal/src/client/goal-command-input.ts` |

The sample uses `turn/start`, a known Session event, so its UI state is reconstructible from Session history. The exact `kind` and slot `key` are both `example-turn-marker`; `target: 'chat'` uses Chat's existing view builder, without taking ownership of a new view target. The state and rendered payload are immutable values. No Host or model capability follows from Client registration.

## Independent consumer checks

- Fixture: `evidence/tests/conversation-node-consumer/src/client.tsx`, isolated `package.json` and `tsconfig.json`. It imports the exact rc.1 published Client types and merges the public Chat data map. Its `./node_modules/.bin/tsc -p tsconfig.json` exited 0. This verifies the TSX definition and renderer signatures, not generated bundle execution.
- Browser half: `evidence/tests/conversation-node-consumer/browser-half/`; `npm run build`, `node --check lib/client.js`, and `npm pack --dry-run --json` all exited 0. Dry-run tarball included `cordis.patch.yml`, `lib/client.js`, `lib/index.js`, and `package.json`.
- `DSH_HOME` was isolated under that fixture. `dsh --profile turn-marker-smoke --from-default-profile web --dump-config` initialized the Profile; `dsh plugin --profile turn-marker-smoke add <fixture path>` exited 0. The resulting configuration contained the Web/Chat modules and `turn-marker` row.
- Web server ran at local port 43883. Chrome loaded the Profile, skipped first-use API key setup, then submitted a harmless message to create one Turn. The model request failed `MISSING_CREDENTIAL`; no model success is claimed.

## Observed Web behavior

| State | Fixture lifecycle marker | Independent DOM observation |
| --- | --- | --- |
| After `turn/start` in a Session | `{"registrations":1,"renders":4,"unloaded":false}` | One `<span data-example-turn-marker>` with `Turn 1 opened`; its parent had `data-chat-flow-kind="example-turn-marker"`, `data-chat-turn="1"` and `data-slot="conversation.chat.node"`. |
| After `dsh plugin --profile turn-marker-smoke remove dsh-turn-marker` while Web server ran | `{"registrations":1,"renders":4,"unloaded":true}` | Zero matching spans and zero Chat flow wrappers. |

The first AX snapshot after sending did not expose the marker text: the wrapper had `data-turn-process-member="true"` and was inside the collapsed completed-analysis disclosure. To test actual visibility, the fixture was re-added and the same saved Session reopened. Clicking **已完成分析** changed the button to expanded; the accessibility tree then contained `Turn 1 opened`, and its DOM node had no hidden ancestor. Online removal while expanded removed that AX text and yielded zero marker nodes and zero Chat wrappers; the refreshed fixture marker ended `{"registrations":1,"renders":1,"unloaded":true}`. This confirms visible presentation after disclosure expansion, as well as current-Session disappearance.

Both remove commands exited 0. A `--dump-config | rg 'dsh-turn-marker|id: turn-marker'` after the first removal returned no match (rg exit 1). Marker counters are fixture instrumentation; the Chat wrapper, AX text and DOM text are independent renderer observations. Presentation folding still means this custom node is not always expanded by default.

## Limits

This run did not write a new custom Session event, test multi-event `update`, location-data publication, fallback registration, a new view target/builder, duplicate-key errors, cold restart, non-Web platforms, another browser or presentation-policy combinations. It verified online plugin removal and current Session disappearance. It did not complete model execution because credentials were absent.
