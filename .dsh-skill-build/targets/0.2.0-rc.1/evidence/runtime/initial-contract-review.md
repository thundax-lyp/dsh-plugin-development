# Initial contract review (draft)

Target: `dsh-v0.2.0-rc.1` at `4878cdabd87d4041bdaff61d04c966883b9fd07a`. These are reviewed observations for later claim and task-path decisions, not frozen Skill content.

## Profile composition

- `apps/cli/src/profile-boot.ts` (`composeProfile`) specifies bundle patches in `dsh.profile.bundles` order, followed by profile patch, home patch, CLI `--patch` overlays, and a telemetry switch. The code creates the runtime resolution before plugin imports and reads overlays in argv order.
- `packages/boot/app-boot/tests/profile.spec.ts` has composition and ordered bundle patch tests. `apps/cli/tests/args.spec.ts` checks the CLI overlay grammar. The consumer-facing package/install path still needs separate inspection and end-to-end verification.
- `apps/cli/src/args.ts` parses `dsh plugin --profile <name> <pnpm-args...>` and reserves `plugin` as a management command. `packages/boot/plugin-manager/src/index.ts` inspects `dsh.bundle`, adds a selected bundle patch after package installation, and rejects an installed package without that declaration as a bundle. `docs/user/develop/basic/publish.md` provides a task-oriented package, patch, install, dump, boot, and removal example. These are separate code, runtime, and documentation evidence; the independent consumer install has not been run.

## Tool definition and registration

- `packages/core/tools/src/schema.ts` exports `DefineToolOptions` and `defineTool`. The options require a canonical output schema and `render`, typed `execute`, and permit optional presentation metadata, finalization, cancellation-aware execution context, and a positive timeout.
- `packages/core/tools/src/index.ts` `Tools.register` rejects missing or invalid output presentation, unsupported output schemas, invalid timeout, and the reserved `run_code` name. It returns the registration disposer through scoped effects.
- `packages/core/tools/tests/tools.spec.ts` and `packages/core/tools/tests/schema.spec.ts` are behavior-test candidates. Their assertions, injection requirements, service activation, and actual Profile behavior remain to be reviewed before publishing a reference.
- `packages/core/tools/package.json` publishes the main API and distinct `/types`, `/presentation`, and `/invariant` subpaths. `packages/core/tools/src/index.ts` re-exports `defineTool`, raw schema helpers, the presentation vocabulary, and `ToolDefinition`; its `ToolDefinition` requires one canonical output declaration and execution returning that value. `docs/user/develop/basic/tool.md` supplies a plugin task example, but its install and Web behavior still need independent consumer verification.
