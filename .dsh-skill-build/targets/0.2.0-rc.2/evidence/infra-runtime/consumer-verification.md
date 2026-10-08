# Isolated Host bundle consumer check

Target: `dsh-v0.2.0-rc.2` at `639ed015397290b3745d163aafe02ffee4aa3f84` on macOS arm64. This check used a fresh temporary `DSH_HOME` and a package made from the three code blocks in `skill-source/how-to/infra-runtime.md`.

1. `pnpm dsh plugin --profile demo add <local-package> --offline` exited 0. pnpm installed a local link to `dsh-observe-demo`.
2. `pnpm dsh --profile demo --dump-config` exited 0 and showed the `dsh-observe-demo` layer with the `observe-demo` row.
3. The first boot failed during Host preparation because the local pnpm layout did not resolve the installed optional `node-addon-require-builtin-darwin-arm64` package from `node-addon-require-builtin`. `pnpm run build:native-system` succeeded but does not provide that separate addon.
4. With `NODE_PATH` pointed at that already installed optional package's local pnpm directory, boot printed `observe-demo active`. Sending SIGINT printed `observe-demo disposed`. This checks activation and scoped cleanup in the isolated Profile; it is an environment-specific dependency-resolution workaround, not an installation instruction for consumers.
5. `pnpm dsh plugin --profile demo remove dsh-observe-demo` exited 0. A subsequent config dump contained no `observe-demo` row. `pnpm remove` does not accept the `--offline` option; an initial attempt with that option failed before removal, then the supported command succeeded.

The first boot failure means a default local checkout cannot currently demonstrate this Profile path without resolving the optional addon layout. This check did not exercise a model call, Client build, Remote binding, or external provider.
