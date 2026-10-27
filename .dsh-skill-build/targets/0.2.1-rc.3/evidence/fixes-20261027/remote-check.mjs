import assert from 'node:assert/strict'
import {readFile,writeFile,mkdir,readdir,symlink,access} from 'node:fs/promises'
import {resolve,join} from 'node:path'
import {pathToFileURL,fileURLToPath} from 'node:url'
import {spawnSync} from 'node:child_process'
const target=resolve(fileURLToPath(new URL('../..',import.meta.url))),checkout=process.env.DSH_TARGET_CHECKOUT??join(target,'checkout'),root=join(target,'evidence/fixes-20261027/consumer/remote-workspace')
const json=async(p,v)=>{await mkdir(resolve(p,'..'),{recursive:true});await writeFile(p,JSON.stringify(v,null,4)+'\n')}
const put=async(p,v)=>{await mkdir(resolve(p,'..'),{recursive:true});await writeFile(p,v)}
function run(command,args,cwd=root){const r=spawnSync(command,args,{cwd,encoding:'utf8',env:{...process.env,NODE_OPTIONS:'--max-old-space-size=4096'},timeout:240000});if(r.status!==0)throw Error(command+' '+args.join(' ')+'\n'+r.stdout+'\n'+r.stderr);return r.stdout}
await mkdir(root,{recursive:true});run('rsync',['-a','--exclude','node_modules','--exclude','.git',checkout+'/',root+'/'])
async function links(rel=''){for(const e of await readdir(join(checkout,rel),{withFileTypes:true})){if(e.name==='.git')continue;const sub=join(rel,e.name);if(e.name==='node_modules'){try{await access(join(root,sub))}catch{await symlink(join(checkout,sub),join(root,sub))}}else if(e.isDirectory()&&!['lib','dist'].includes(e.name))await links(sub)}}await links()
const args=process.argv.slice(2),example=args.includes('--example')?resolve(args[args.indexOf('--example')+1]):join(target,'skill-source/examples/core-remote.md')
const markdown=await readFile(example,'utf8'),sections=[...markdown.matchAll(/^## (packages\/[^\n]+)\n([\s\S]*?)(?=^## |$(?![\s\S]))/gm)]
const sources=new Map();let hostBlocks=0,clientBlocks=0
for(const [,path,section] of sections){const block=section.match(/^```([^\n]+)\n([\s\S]*?)^```/m);if(!block)continue;sources.set(path,block[2]);if(block[1]==='ts remote-notes:host')hostBlocks++;if(block[1]==='tsx remote-notes:client')clientBlocks++}
assert.equal(sources.size,10,'示例必须给全10个文件');assert.equal(hostBlocks,5);assert.equal(clientBlocks,1)
for(const [path,content] of sources)await put(join(root,path),content)
const name='@deepseek-ai/dsh-local-notes',pkg=join(root,'packages/api/local-notes'),ui=join(root,'packages/client/local-notes')
await mkdir(join(ui,'node_modules/@deepseek-ai'),{recursive:true});try{await access(join(ui,'node_modules/@deepseek-ai/dsh-local-notes'))}catch{await symlink(pkg,join(ui,'node_modules/@deepseek-ai/dsh-local-notes'))}
const ts=await import(join(checkout,'node_modules/typescript/lib/typescript.js'))
const base=ts.default.readConfigFile(join(root,'tsconfig.base.json'),ts.default.sys.readFile).config
base.compilerOptions.paths[name]=['./packages/api/local-notes/src/index.ts'];base.compilerOptions.paths['@deepseek-ai/dsh-client-local-notes/client']=['./packages/client/local-notes/src/client/index.ts'];await json(join(root,'tsconfig.base.json'),base)
const agg=ts.default.readConfigFile(join(root,'tsconfig.host.json'),ts.default.sys.readFile).config;agg.references.push({path:'./packages/api/local-notes'});await json(join(root,'tsconfig.host.json'),agg)
const ca=ts.default.readConfigFile(join(root,'tsconfig.client.json'),ts.default.sys.readFile).config;ca.references.push({path:'./packages/client/local-notes'});await json(join(root,'tsconfig.client.json'),ca)
run(process.execPath,[join(checkout,'node_modules/typescript/bin/tsc'),'-b',join(pkg,'tsconfig.json')])
run(process.execPath,[join(checkout,'node_modules/tsdown/dist/run.mjs'),'--config-loader','native','--config',join(pkg,'tsdown.config.ts')],pkg)
for(const f of ['index.js','typert.host.js','typert.host.d.ts','typert.remote-client.js','typert.remote-client.d.ts'])await access(join(pkg,'lib',f))
run(process.execPath,[join(checkout,'node_modules/typescript/bin/tsc'),'-b',join(ui,'tsconfig.json')])
run(process.execPath,[join(checkout,'node_modules/tsdown/dist/run.mjs'),'--config-loader','native','--config',join(ui,'tsdown.config.ts'),'--env.DSH_BUILD_FACE','client'],ui)
await access(join(ui,'lib/client.js'))
const profile=join(root,'remote-profile')
await mkdir(join(profile,'node_modules/@deepseek-ai'),{recursive:true})
try {await access(join(profile,'node_modules/@deepseek-ai/dsh-local-notes'))}catch {await symlink(join(root,'packages/api/local-notes'),join(profile,'node_modules/@deepseek-ai/dsh-local-notes'))}
await writeFile(join(profile,'package.json'),JSON.stringify({private:true,type:'module',dependencies:{'@deepseek-ai/dsh-local-notes':'0.2.1-rc.3'}})+'\n')
const url=p=>pathToFileURL(join(root,p)).href
await writeFile(join(profile,'cordis.yml'),[['typert','packages/typert/registry/src/index.ts'],['remote-access','packages/api/remote-access/src/index.ts'],['gateway','packages/api/gateway/src/index.ts'],['typert-loader','packages/typert/loader/src/index.ts']].map(([id,p])=>`- id: ${id}\n  name: ${JSON.stringify(url(p))}\n${id==='typert-loader'?'  config: { packages: ["@deepseek-ai/dsh-local-notes"] }\n':''}`).join('')+'- id: local-notes\n  name: "@deepseek-ai/dsh-local-notes"\n')
await writeFile(join(root,'remote-runtime.ts'),`import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {Context} from './vendor/cordis/src/index.ts';
import {boot} from './packages/boot/app-boot/src/index.ts';
import TypertRegistry from './packages/typert/registry/src/index.ts';
import {Peer} from './packages/client/connection/src/index.ts';
import {remoteErrorOf} from './packages/typert/protocol/src/index.ts';
import * as gatewayClient from './packages/api/gateway/src/client/index.ts';
import {ClientModuleSystem} from './packages/client/modules/src/client/index.ts';
const host=await boot('local-notes',${JSON.stringify(join(profile,'cordis.yml'))});
assert(host.typert.local.get('localNotes/echo'));
const client=new Context();await client.plugin(TypertRegistry);const peer=new Peer(host,{principal:{kind:'owner'}});
client.provide('connection',{interactions:'none',isLoopback:true,generation:{getSnapshot:()=>undefined,subscribe:()=>()=>{}},state:{getSnapshot:()=>undefined,subscribe:()=>()=>{}},registerGenerationSource:()=>()=>{},start:()=>({stop(){}}),openWebSocket(){throw Error('不应使用网络')},rpc:{open:async function*(){},async call(channel,endpoint,payload,signal){assert.equal(channel,'/api');const [namespace,method]=endpoint.split('/');try{return {ok:true,value:await host.typertGateway.invoke({namespace,method,args:payload.args,signal,peer})}}catch(error){const failure=remoteErrorOf(error);if(!failure)throw error;return {ok:false,error:failure}}}}});
await client.plugin(gatewayClient);
const facade={mode:'queue',pendingQueue:[],load(registration){this.pendingQueue.push(registration)},create(){throw Error('禁止额外创建')}};
const system=new ClientModuleSystem({manifest:{rev:'local',modules:[],plugins:[]},staticModules:{zod:await import('zod'),'@deepseek-ai/cordis':await import('./vendor/cordis/src/index.ts'),'@deepseek-ai/dsh-api-gateway':gatewayClient},registrationTarget:facade,bootstrapModule:{id:'@deepseek-ai/dsh-client-modules',exports:{}},loadBundle:async()=>{throw Error('禁止网络')}});
const bundle=await readFile(new URL('./packages/client/local-notes/lib/client.js',import.meta.url),'utf8');new Function('window',bundle)({__ModuleLoader__:facade});
assert.equal(system.loadCache.has('@deepseek-ai/dsh-client-local-notes'),false);
const assembly=await system.import('@deepseek-ai/dsh-client-local-notes');const owner=client.plugin(assembly);await owner;
assert.deepEqual(await client.remote.localNotes.echo('成功'),{ok:true,value:'成功'});
const invalid=await client.remote.localNotes.echo(42);assert.equal(invalid.ok,false);assert.equal(invalid.error.code,'gateway/input-invalid');
const empty=await client.remote.localNotes.echo('');assert.equal(empty.ok,false);assert.equal(empty.error.code,'local-notes/empty');assert.deepEqual(empty.error.details,{field:'text'});
const aborted=new AbortController();aborted.abort();const pre=await client.remote.localNotes.echo('取消',aborted.signal);assert.equal(pre.ok,false);assert.equal(pre.error.code,'gateway/cancelled');
const pending=new AbortController();const wait=client.remote.localNotes.wait(pending.signal);await new Promise(resolve=>setTimeout(resolve,20));pending.abort();const cancelled=await wait;assert.equal(cancelled.ok,false);assert.equal(cancelled.error.code,'gateway/cancelled');
const held=client.remote.localNotes.echo;await owner.dispose();assert.equal(client.get('remote.localNotes'),undefined);assert.equal((await held('卸载')).ok,false);
const entry=[...host.loader.entries()].find(e=>e.options.id==='local-notes');assert(entry);await entry.fiber.dispose();assert.equal(host.get('localNotes'),undefined);
const after=await host.typertGateway.invoke({namespace:'localNotes',method:'echo',args:{text:'已卸载'},signal:new AbortController().signal,peer}).then(()=>false,()=>true);assert.equal(after,true);
await client.fiber.dispose();await host.fiber.dispose();
console.log(JSON.stringify({newContractGenerated:true,hostLoader:true,clientLazyBundle:true,clientMount:true,validCall:true,invalidInput:true,businessErrorDetails:true,preCancelled:true,inFlightCancelled:true,clientUnload:true,hostUnload:true}));
`)
const r=spawnSync(process.execPath,['--import',url('node_modules/tsx/dist/loader.mjs'),join(root,'remote-runtime.ts')],{cwd:root,env:{...process.env,TSX_TSCONFIG_PATH:join(root,'tsconfig.host.json'),DSH_HOME:join(profile,'dsh-home')},encoding:'utf8',timeout:90000});if(r.status!==0)throw Error(r.stderr+'\n'+r.stdout);const last=r.stdout.trim().split('\n').at(-1);const result=JSON.parse(last);assert(Object.values(result).every(v=>v===true));await writeFile(join(target,'evidence/fixes-20261027/remote-runtime-result.json'),JSON.stringify({...result,hostBlocks,clientBlocks},null,4)+'\n');console.log(JSON.stringify({hostBlocks,clientBlocks,checks:result}))
