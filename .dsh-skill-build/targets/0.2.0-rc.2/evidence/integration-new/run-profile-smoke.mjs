import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { spawn } from 'node:child_process'

const checkout = resolve(process.argv[2] ?? '')
if (!checkout) throw new Error('Pass target checkout')
const scratch = mkdtempSync(join(checkout, '.skill-consumer-'))
const home = mkdtempSync(join(tmpdir(), 'dsh-skill-home-'))
const source = join(scratch, 'metrics.ts')
const consumer = join(scratch, 'consumer.ts')
const patch = join(scratch, 'cordis.patch.yml')
writeFileSync(source, `import { Service, type Context } from '@deepseek-ai/cordis'\nexport default class MetricsService extends Service {\n  private count = 0\n  constructor(ctx: Context) { super(ctx, 'metrics'); ctx.effect(() => () => console.log('DSH_SKILL_PROFILE_UNLOADED')); console.log('DSH_SKILL_PROFILE_METRICS_READY') }\n  record(): number { return ++this.count }\n}\n`)
writeFileSync(consumer, `import type { Context } from '@deepseek-ai/cordis'\nexport const inject = ['metrics']\nexport function apply(ctx: Context): void {\n  const value = (ctx as Context & { metrics: { record(): number } }).metrics.record()\n  console.log('DSH_SKILL_PROFILE_RECORD=' + value)\n}\n`)
writeFileSync(patch, `- insert:\n    - id: skill-profile-metrics\n      name: '${source}'\n    - id: skill-profile-consumer\n      name: '${consumer}'\n`)
let output = ''
let found = false
try {
  const child = spawn(process.execPath, ['--import', 'tsx/esm', 'apps/cli/src/bin.ts', 'web', '--patch', patch, '--port', '0', '--no-open'], {
    cwd: checkout,
    env: { ...process.env, DSH_HOME: home, NODE_PATH: join(checkout, 'node_modules/.pnpm/node-addon-require-builtin-darwin-arm64@0.1.6/node_modules') },
    stdio: ['pipe', 'pipe', 'pipe'],
  })
  const stop = () => { try { child.kill('SIGTERM') } catch {} }
  const collect = (chunk) => {
    output += chunk.toString()
    if (output.includes('DSH_SKILL_PROFILE_METRICS_READY') && output.includes('DSH_SKILL_PROFILE_RECORD=1')) found = true
    if (found) stop()
  }
  child.stdout.on('data', collect)
  child.stderr.on('data', collect)
  const timeout = setTimeout(stop, 25000)
  const status = await new Promise((resolveStatus) => child.on('close', (code, signal) => resolveStatus({code, signal})))
  clearTimeout(timeout)
  const unloaded = output.includes('DSH_SKILL_PROFILE_UNLOADED')
  process.stdout.write(JSON.stringify({ observed: found && unloaded, status, markers: { service: output.includes('DSH_SKILL_PROFILE_METRICS_READY'), call: output.includes('DSH_SKILL_PROFILE_RECORD=1'), unload: unloaded }, failureTail: found && unloaded ? undefined : output.slice(-4000).replace(/token=[^\s]+/g, 'token=[redacted]') }, null, 2) + '\n')
  if (!found || !unloaded) process.exitCode = 1
} finally {
  rmSync(scratch, {recursive:true,force:true})
  rmSync(home, {recursive:true,force:true})
}
