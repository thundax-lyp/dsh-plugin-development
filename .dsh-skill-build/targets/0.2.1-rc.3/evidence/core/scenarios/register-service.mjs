import assert from 'node:assert/strict'
import { mkdtemp, writeFile, readFile, mkdir, symlink, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { spawnSync } from 'node:child_process'

const checkout = process.env.DSH_TARGET_CHECKOUT
assert(checkout, '需要目标 checkout')
const scratch = await mkdtemp(join(tmpdir(), 'dsh-local-service-'))
const home = process.env.DSH_HOME ?? join(scratch, 'home')
try {
  await writeFile(join(scratch, 'package.json'), JSON.stringify({type:'module'}))
  const packageDir = join(scratch, 'local-greeting')
  const profile = join(home, 'profiles', 'service-scenario')
  await mkdir(join(packageDir, 'lib'),{recursive:true})
  await mkdir(join(packageDir, 'node_modules/@deepseek-ai'),{recursive:true})
  await symlink(join(checkout,'vendor/cordis'),join(packageDir,'node_modules/@deepseek-ai/cordis'))
  await mkdir(join(profile, 'node_modules'),{recursive:true})
  await writeFile(join(packageDir,'package.json'),JSON.stringify({name:'local-greeting',version:'1.0.0',type:'module',exports:{'.':'./lib/index.js','./package.json':'./package.json'},peerDependencies:{'@deepseek-ai/cordis':'4.0.5'},devDependencies:{'@deepseek-ai/cordis':'4.0.5',typescript:'6.0.3'},dsh:{bundle:{patch:'./cordis.patch.yml'}}}))
  const code = `import { Service, type Context } from '@deepseek-ai/cordis';
export default class LocalGreeting extends Service {
 constructor(ctx: Context) {super(ctx, 'scenarioGreeting');ctx.effect(()=>()=>{const state=globalThis as typeof globalThis & {__cleaned?:number};state.__cleaned=(state.__cleaned??0)+1})}
 greet(name: string): string {return '你好，'+name}
}`
  await writeFile(join(packageDir,'index.ts'),code)
  await writeFile(join(packageDir,'tsconfig.json'),JSON.stringify({compilerOptions:{target:'ES2022',module:'NodeNext',moduleResolution:'NodeNext',strict:true,declaration:true,rootDir:'.',outDir:'lib',skipLibCheck:true},include:['index.ts']}))
  const compiler=join(checkout,'node_modules/typescript/bin/tsc')
  const compilation=spawnSync(process.execPath,[compiler,'-p',join(packageDir,'tsconfig.json')],{cwd:packageDir,encoding:'utf8',timeout:60000})
  if(compilation.status!==0)throw Error('独立消费包tsc失败：'+compilation.stdout+'\n'+compilation.stderr)
  const files=spawnSync(process.execPath,[compiler,'-p',join(packageDir,'tsconfig.json'),'--listFilesOnly'],{cwd:packageDir,encoding:'utf8',timeout:60000})
  assert.equal(files.status,0)
  assert(files.stdout.includes('vendor/cordis/lib/types/index.d.ts'),'必须消费已构建Cordis声明，不能借源码paths')
  assert((await readFile(join(packageDir,'lib/index.js'),'utf8')).includes('class LocalGreeting'))
  await writeFile(join(packageDir,'cordis.patch.yml'),'- insert:\n    - id: service-scenario-provider\n      name: local-greeting\n')
  await symlink(packageDir,join(profile,'node_modules/local-greeting'))
  await writeFile(join(profile,'package.json'),JSON.stringify({name:'service-scenario',private:true,type:'module',dependencies:{'local-greeting':'file:'+packageDir},dsh:{profile:{bundles:['local-greeting']}}}))
  await writeFile(join(profile,'cordis.patch.yml'),'[]\n')
  await writeFile(join(profile,'cordis.yml'),'[]\n')
  const runner = join(scratch,'run.ts')
  const url = relative => pathToFileURL(join(checkout, relative)).href
  await writeFile(runner, `import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {boot,loadProfileDirectory,readProfilePatches} from ${JSON.stringify(url('packages/boot/app-boot/src/index.ts'))};
const dir=${JSON.stringify(profile)},home=${JSON.stringify(home)},anchor=${JSON.stringify(join(checkout,'apps/cli/package.json'))};
const require=createRequire(dir+'/package.json');assert(require.resolve('local-greeting').endsWith('/lib/index.js'));
const profile=loadProfileDirectory('service-scenario',dir,anchor);assert.equal(profile.skippedBundles.length,0);assert.equal(profile.layers.length,1);
const facts={name:'service-scenario',dir,home,patchPath:dir+'/cordis.patch.yml',installAnchor:anchor,cwd:dir,startedBundles:['local-greeting'],overlays:[],telemetryDisabledEnv:'1'};
const patches=readProfilePatches('service-scenario',facts,profile);
const ctx=await boot('service-scenario',dir+'/cordis.yml',patches,ctx=>{ctx.provide('profileContext',facts)});
assert.equal(ctx.scenarioGreeting.greet('DSH'),'你好，DSH');
await ctx.fiber.dispose();assert.equal(globalThis.__cleaned,1);assert.equal(ctx.get('scenarioGreeting'),undefined);
process.stdout.write(JSON.stringify({taskId:'register-service',checks:{'package-resolution':true,'package-build':true,'package-types':true,'profile-load':true,'service-call':true,'unload':true}}));`)
  const result = spawnSync(process.execPath, ['--import', url('node_modules/tsx/dist/loader.mjs'), runner], { cwd:checkout, env:{...process.env,DSH_HOME:home,TSX_TSCONFIG_PATH:join(checkout,'tsconfig.host.json')}, encoding:'utf8',timeout:60000 })
  if(result.status!==0) throw new Error(`真实 Profile 场景失败：${result.stderr}\n${result.stdout}`)
  process.stdout.write(result.stdout)
} finally {
  await rm(scratch,{recursive:true,force:true})
}
