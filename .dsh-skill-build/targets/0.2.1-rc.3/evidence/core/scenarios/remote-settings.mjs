import assert from 'node:assert/strict'
import {mkdtemp,writeFile,rm} from 'node:fs/promises'
import {join} from 'node:path'
import {tmpdir} from 'node:os'
import {pathToFileURL} from 'node:url'
import {spawnSync} from 'node:child_process'
const checkout=process.env.DSH_TARGET_CHECKOUT;assert(checkout)
const dir=await mkdtemp(join(tmpdir(),'dsh-remote-settings-'))
const url=p=>pathToFileURL(join(checkout,p)).href
try {
await writeFile(join(dir,'package.json'),' {"type":"module"}\n')
await writeFile(join(dir,'fixture.ts'),`import {TYPERT} from ${JSON.stringify(url('packages/api/settings-controller/lib/typert.host.js'))};
export const inject=['typert'];export function apply(ctx){ctx.typert.register(TYPERT);ctx.provide('settings',{writable:true,describe(options){if(options.redactSecrets!==true)throw Error('未脱敏');globalThis.__reads=(globalThis.__reads??0)+1;return []}})}`)
await writeFile(join(dir,'cordis.yml'),[
 ['typert','packages/typert/registry/src/index.ts'],['remote-access','packages/api/remote-access/src/index.ts'],['gateway','packages/api/gateway/src/index.ts'],['settings-controller','packages/api/settings-controller/src/index.ts']
].map(([id,p])=>`- id: ${id}\n  name: ${JSON.stringify(url(p))}\n`).join('')+`- id: settings-fixture\n  name: ${JSON.stringify(pathToFileURL(join(dir,'fixture.ts')).href)}\n`)
await writeFile(join(dir,'run.ts'),`import assert from 'node:assert/strict';
import {Context} from ${JSON.stringify(url('vendor/cordis/src/index.ts'))};
import {boot} from ${JSON.stringify(url('packages/boot/app-boot/src/index.ts'))};
import TypertRegistry from ${JSON.stringify(url('packages/typert/registry/src/index.ts'))};
import {Peer} from ${JSON.stringify(url('packages/client/connection/src/index.ts'))};
import {remoteErrorOf} from ${JSON.stringify(url('packages/typert/protocol/src/index.ts'))};
import {apply,inject} from ${JSON.stringify(url('packages/api/gateway/src/client/index.ts'))};
import {TYPERT_REMOTE} from ${JSON.stringify(url('packages/api/settings-controller/lib/typert.remote-client.js'))};
const host=await boot('remote-settings',${JSON.stringify(join(dir,'cordis.yml'))});
const client=new Context();await client.plugin(TypertRegistry);const peer=new Peer(host,{principal:{kind:'owner'}});
client.provide('connection',{interactions:'none',isLoopback:true,generation:{getSnapshot:()=>undefined,subscribe:()=>()=>{}},state:{getSnapshot:()=>undefined,subscribe:()=>()=>{}},registerGenerationSource:()=>()=>{},start:()=>({stop(){}}),openWebSocket(){throw Error('不应使用网络')},rpc:{open:async function*(){},async call(channel,endpoint,payload,signal){assert.equal(channel,'/api');const [namespace,method]=endpoint.split('/');try{return {ok:true,value:await host.typertGateway.invoke({namespace,method,args:payload.args,signal,peer})}}catch(error){const failure=remoteErrorOf(error);if(!failure)throw error;return {ok:false,error:failure}}}}});
await client.plugin({inject,apply});const owner=client.plugin({inject:['remote'],async apply(ctx){await ctx.remote.$mount(TYPERT_REMOTE)}});await owner;
const result=await client.remote.settings.describe();assert.deepEqual(result,{ok:true,value:{writable:true,hasDocument:true,namespaces:[]}});assert.equal(globalThis.__reads,1);
const controller=new AbortController();controller.abort();const cancelled=await client.remote.settings.openSettingsDocument(controller.signal);assert.equal(cancelled.ok,false);assert.equal(cancelled.error.code,'gateway/cancelled');
const held=client.remote.settings.describe;await owner.dispose();assert.equal(client.get('remote.settings'),undefined);const after=await held();assert.equal(after.ok,false);
await client.fiber.dispose();await host.fiber.dispose();
process.stdout.write(JSON.stringify({taskId:'publish-remote',checks:{'generated-codecs':true,'host-loader':true,'client-mount':true,'remote-call':true,'cancel':true,'unload':true}}));`)
const run=spawnSync(process.execPath,['--import',url('node_modules/tsx/dist/loader.mjs'),join(dir,'run.ts')],{cwd:checkout,env:{...process.env,TSX_TSCONFIG_PATH:join(checkout,'tsconfig.host.json')},encoding:'utf8',timeout:60000});if(run.status!==0)throw Error(run.stderr+'\n'+run.stdout);process.stdout.write(run.stdout)
}finally{await rm(dir,{recursive:true,force:true})}
