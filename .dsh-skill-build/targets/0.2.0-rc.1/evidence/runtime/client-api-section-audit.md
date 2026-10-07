# Client API owner/section audit

Target: `dsh-v0.2.0-rc.1`. Read `skill-source/api-surface.json` included objects whose owner is one of this agent's Client slots, resources, shortcuts, conversation nodes, input trigger, main panel, sidebar-right tab or theme references. For each object, sliced only the declared Markdown `## section` and checked the exact symbol and each included member name within that section, then read the relevant table/narrative against the rc.1 source contract. Result: 25 included objects, 0 missing symbol/member names in the mapped section.

Specific corrections made after review:

- `client-shortcuts.md` → `公开对象与成员`: added explicit `ShortcutCommandId` row covering the Client and `./protocol` type; added an explicit `Shortcuts` service identity before the member table.
- `client-input-trigger.md` → `公开对象与成员`: added explicit `InputTriggerController` entry with `lexicon`, `pick`, `openReference`, which had been selected as included but were previously only implicit in the service description.
- `client-theme.md` → `公开对象与成员`: the section now names `ThemeRuntime` and `ThemeTokenOverrides` explicitly; the table covers `ThemeDefinition`, `ThemeSnapshot` and the selected runtime methods.

Other mapped objects already had an appropriate table or explicit section explanation: `ResourceProvider`, `SlotRegistry`, `ChatNodeDataMap`, `ConversationNodeDefinition`, `MainPanelId`, `SidebarPanelIconOwnerProps`, `SidebarRightGuideEntry`, `SidebarRightTabDefinition`, `SidebarRightTabInfo`, and the other shortcuts/input types. This is a mapping/content audit, not an additional runtime test. `client-locale.md` was newly authored and is not yet marked included in the shared ledger at the time of this audit; its `公开对象与成员` section explicitly covers `LocaleRuntime` and the dictionary, snapshot, language and translate types for any later inclusion decision.
