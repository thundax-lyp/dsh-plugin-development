import { Context } from '../../checkout/vendor/cordis/lib/index.js'
import { SubprocessRuntime } from '../../checkout/packages/subprocess/subprocess/lib/index.js'
import { LocalBashExecutor } from '../../checkout/packages/shell/bash-local/lib/index.js'
const ctx = new Context()
try {
    new SubprocessRuntime(ctx)
    new LocalBashExecutor(ctx, { cwd: process.cwd() })
    let error
    try { new LocalBashExecutor(ctx, { cwd: process.cwd() }) } catch (cause) { error = cause.message }
    if (!error?.includes('service "shell" has been registered')) throw new Error('expected duplicate-provider rejection')
    console.log(JSON.stringify({ firstShellRegistered: !!ctx.shell, secondProviderError: error, evidenceBoundary: 'real built Cordis and ShellExecutor registration; no real OS process or full default Profile boot' }))
} finally {
    await ctx.fiber.dispose()
}
