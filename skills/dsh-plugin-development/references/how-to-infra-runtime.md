# HOW-TO: package and compose an infrastructure plugin

Use this path when a plugin contributes a Host capability, provider, route, webhook rule, Remote API, or optional experimental integration. Read the [infrastructure guardrail](api-infra-runtime.md) and [selected public surface](api-infra-runtime-surface.md) before choosing a provider.

## Files

```text
package.json
cordis.patch.yml
src/index.ts
README.md
```

Add a Client entry only when the task has a browser half; add generated Typert Host/Remote artifacts only for a Remote contract.

## Procedure

1. Pick the stable seam and side. Consume an existing service through `inject`, or implement its abstract service/provider contract. Do not create a second service key for a provider choice.
2. Implement lifecycle ownership. Register during `apply`; return or attach the disposer to the Cordis effect. Stop new work before cancelling owned work, await process/stream/resource cleanup, then release the registration. Forward caller cancellation, but record external side effects that cannot be rolled back.
3. Declare package metadata with `dsh.manifestVersion: 1`, a truthful exact-target-compatible `engines.dsh`, and `dsh.bundle.patch`. If a browser module exists, add `dsh.client` and its required package export rather than importing Host code into the Client.
4. Add the smallest patch layer. Give each row a stable `id`, package `name`, required `inject`, and complete `config`. Put the contract service before consumers conceptually; Loader dependency injection, not list order, determines activation. Use a group/isolation only when it owns a real lifetime or separate service instance.
5. For a Remote API, define the Host service/methods and cancellation contract, generate Typert artifacts, mount the Host contribution and Client Remote binder, and make stream consumers either iterate or dispose each stream. Do not hand-write the JSON-RPC envelope.
6. For browser/computer-use, mount the stable registry plus exactly one explicit experimental provider. Configure the provider in the same Profile/preset and document that cancellation does not reverse delivered actions.
7. Build Host and Client separately. Install the packed package into an isolated target Profile, apply the bundle, and inspect Loader fiber state. A row left `PENDING` means a missing service, not success.
8. Exercise one observable call and one failure/cancellation path. Then disable/remove the bundle and verify effect cleanup: the route/provider/rule is unregistered, streams and subprocesses terminate, filesystem watches close, storage domains close, and no later callback enters unloaded code.

## Minimal provider skeleton

```ts
import { Service, type Context } from '@deepseek-ai/cordis'

declare module '@deepseek-ai/cordis' {
  interface Context {
    demoRuntime: DemoRuntime
  }
}

export abstract class DemoRuntime extends Service {
  constructor(ctx: Context) {
    super(ctx, 'demoRuntime')
  }

  abstract run(input: string, signal?: AbortSignal): Promise<{ output: string }>
}

export const name = 'demo-runtime-local'

export function apply(ctx: Context) {
  class LocalDemoRuntime extends DemoRuntime {
    async run(input: string, signal?: AbortSignal) {
      signal?.throwIfAborted()
      return { output: input }
    }
  }
  ctx.plugin(LocalDemoRuntime)
}
```

Use the target package's actual base class and registration shape when extending an existing DSH seam; this skeleton demonstrates Cordis ownership only and is not a claim that `DemoRuntime` exists in DSH.

## Composition

```yaml
- id: demo-runtime
  name: '@example/dsh-plugin-demo'
  config: {}

- id: demo-consumer
  name: '@example/dsh-plugin-consumer'
  inject: [demoRuntime]
```

## Completion criteria

The task is complete only when exact-target declarations compile, the package resolves from an isolated consumer, the Profile activates all intended rows, the behavior and failure/cancellation path are observed, and unload leaves no registered or live resource. Static examples and a valid YAML patch do not prove Profile, native, network, Client, or Remote behavior.
