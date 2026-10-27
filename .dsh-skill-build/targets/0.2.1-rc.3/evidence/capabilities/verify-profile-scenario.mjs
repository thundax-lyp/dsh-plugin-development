import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync, cpSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
const here = dirname(fileURLToPath(import.meta.url))
const target = resolve(here, '../..')
const checkout = process.env.DSH_TARGET_CHECKOUT ?? join(target, 'checkout')
const temp = mkdtempSync(join(tmpdir(), 'dsh-capability-consumer-'))
const home = join(temp, 'home')
const consumer = join(temp, 'consumer')
mkdirSync(join(consumer, 'src'), {recursive:true})
const example = readFileSync(join(target, 'skill-source/examples/capabilities-example-local-llm.md'), 'utf8')
const jsonBlocks = [...example.matchAll(/```json\n([\s\S]*?)\n```/g)]
writeFileSync(join(consumer, 'package.json'), jsonBlocks[0][1]+'\n')
writeFileSync(join(consumer, 'tsconfig.json'), jsonBlocks[1][1]+'\n')
writeFileSync(join(consumer, 'src/index.ts'), example.match(/```ts\n([\s\S]*?)\n```/)[1]+'\n')
writeFileSync(join(consumer, 'cordis.patch.yml'), example.match(/```yaml\n([\s\S]*?)\n```/)[1]+'\n')
const env = {...process.env, DSH_HOME:home, DSH_TASK_VERIFICATION_OFFLINE:'1', npm_config_offline:'true'}
for (const key of Object.keys(env)) if (/token|api.?key|secret|password/i.test(key)) delete env[key]
function run(command,args,cwd=checkout){
 const result=spawnSync(command,args,{cwd,env,encoding:'utf8',timeout:60000,maxBuffer:4*1024*1024})
 if(result.error||result.status!==0) throw new Error(`${command} ${args.join(' ')} failed: ${result.error?.message??result.status}\n${result.stdout}\n${result.stderr}`)
 return result.stdout
}
const verifier = "import assert from 'node:assert/strict'\nexport const name = 'verify-profile-local-llm'\nexport const inject = ['llm', 'loader']\nexport function apply(ctx) {\n  const controller = new AbortController()\n  let task\n  ctx.effect(() => async () => { controller.abort(); await task })\n  task = (async () => {\n    if (!ctx.llm.listProviders().some(p=>p.id==='local-scripted')) {\n      await new Promise((resolve,reject)=> {\n        const remove=ctx.on('llm/adapters-updated',()=> {\n          if(ctx.llm.listProviders().some(p=>p.id==='local-scripted')) { remove(); resolve() }\n        })\n        controller.signal.addEventListener('abort',()=>{remove();reject(new Error('verification aborted'))},{once:true})\n      })\n    }\n    const models=await ctx.llm.listModels('local-scripted')\n    assert(models.some(m=>m.provider==='local-scripted'&&m.id==='local-fixed'))\n    const chunks=[]\n    for await(const chunk of ctx.llm.stream({provider:'local-scripted',model:'local-fixed',messages:[]})) chunks.push(chunk)\n    assert(chunks.some(c=>c.type==='text-delta'&&c.text==='离线提供方已接入'))\n    assert.equal(chunks.filter(c=>c.type==='finish').length,1)\n    assert.equal(chunks.at(-1).reason.kind,'stop')\n    const cancelled=[]\n    for await(const chunk of ctx.llm.stream({provider:'local-scripted',model:'local-fixed',messages:[],signal:AbortSignal.abort()})) cancelled.push(chunk)\n    assert(cancelled.some(c=>c.type==='finish'&&c.reason.kind==='aborted'))\n    const entry=[...ctx.loader.entries()].find(e=>e.options.id==='local-scripted-llm')\n    assert(entry?.fiber,'Profile Loader must own the consumer plugin fiber')\n    await entry.fiber.dispose()\n    assert(!ctx.llm.listProviders().some(p=>p.id==='local-scripted'))\n    const removed=[]\n    for await(const chunk of ctx.llm.stream({provider:'local-scripted',model:'local-fixed',messages:[]})) removed.push(chunk)\n    assert(removed.some(c=>c.type==='finish'&&c.reason.kind==='error'&&c.reason.failure.code==='NO_ADAPTER'))\n    console.log('CAPABILITY_PROFILE_RESULT '+JSON.stringify({profileLoad:true,consumerResolve:true,catalog:true,call:true,cancel:true,unload:true,afterUnloadNoAdapter:true}))\n    setImmediate(()=>process.kill(process.pid,'SIGTERM'))\n  })().catch(error=>{console.error('CAPABILITY_PROFILE_FAILURE',error);process.exitCode=1;setImmediate(()=>process.kill(process.pid,'SIGTERM'))})\n}\n"
try {
 const prepared = join(here,'consumer-local-llm/node_modules')
 for (const [pkg,version] of [['@deepseek-ai/cordis','4.0.5'],['@deepseek-ai/dsh-llm','0.2.1-rc.3'],['typescript','6.0.3']]) assert.equal(JSON.parse(readFileSync(join(prepared,pkg,'package.json'),'utf8')).version,version)
 cpSync(prepared,join(consumer,'node_modules'),{recursive:true,verbatimSymlinks:true})
 run(process.execPath,[join(consumer,'node_modules/typescript/bin/tsc'),'-p',join(consumer,'tsconfig.json')],consumer)
 run('pnpm',['dsh','plugin','--profile','capabilities-llm','add',consumer,'--offline'])
 const manifestPath=join(home,'profiles/capabilities-llm/package.json')
 const installed=JSON.parse(readFileSync(manifestPath,'utf8'))
 assert(installed.dependencies['dsh-local-scripted-llm'])
 assert(installed.dsh.profile.bundles.includes('dsh-local-scripted-llm'))
 const verifierPath=join(temp,'verify.mjs')
 const patch=join(temp,'verify.patch.yml')
 writeFileSync(verifierPath,verifier)
 writeFileSync(patch,'- insert:\n    - id: verify-profile-local-llm\n      name: '+JSON.stringify(verifierPath)+'\n')
 const stdout=run('pnpm',['dsh','--profile','capabilities-llm','--patch',patch])
 const match=stdout.match(/CAPABILITY_PROFILE_RESULT (\{[^\n]*\})/)
 assert(match,'missing runtime assertion result')
 const result=JSON.parse(match[1])
 for(const key of ['profileLoad','consumerResolve','catalog','call','cancel','unload','afterUnloadNoAdapter']) assert.equal(result[key],true,key)
 run('pnpm',['dsh','plugin','--profile','capabilities-llm','remove','dsh-local-scripted-llm'])
 const removed=JSON.parse(readFileSync(manifestPath,'utf8'))
 assert(!removed.dependencies?.['dsh-local-scripted-llm'])
 assert(!removed.dsh.profile.bundles.includes('dsh-local-scripted-llm'))
 console.log(JSON.stringify({taskId:'use-dsh-llm',checks:{'consumer-build':true,'profile-load':true,'llm-call':true,'cancel':true,'unload':true,'profile-uninstall':true}}))
} finally { rmSync(temp,{recursive:true,force:true}) }
