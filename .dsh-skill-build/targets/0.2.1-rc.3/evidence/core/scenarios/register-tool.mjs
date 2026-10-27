import assert from 'node:assert/strict'
import {mkdtemp,writeFile,rm} from 'node:fs/promises'
import {join} from 'node:path'
import {tmpdir} from 'node:os'
import {pathToFileURL} from 'node:url'
import {spawnSync} from 'node:child_process'
const checkout=process.env.DSH_TARGET_CHECKOUT;assert(checkout)
const dir=await mkdtemp(join(tmpdir(),'dsh-register-tool-'));const url=p=>pathToFileURL(join(checkout,p)).href
try{
 await writeFile(join(dir,'package.json'),'{"type":"module"}\n')
 await writeFile(join(dir,'tool.ts'),`import {defineTool} from ${JSON.stringify(url('packages/core/tools/src/index.ts'))};export const inject=['tools'];export function apply(ctx){ctx.tools.register(defineTool({name:'scenario_greet',description:'本地问候',parameters:{name:{type:'string',required:true}},output:{schema:{type:'string'},render:(_args,value)=>[{type:'text',text:value}]},async execute(args,exec){exec.signal.throwIfAborted();globalThis.__executions=(globalThis.__executions??0)+1;return '你好，'+args.name}}))}`)
 await writeFile(join(dir,'cordis.yml'),`- id: system-prompt\n  name: ${JSON.stringify(url('packages/core/system-prompt/src/index.ts'))}\n- id: tools\n  name: ${JSON.stringify(url('packages/core/tools/src/index.ts'))}\n  config:\n    mode: native\n- id: fixture-tool\n  name: ${JSON.stringify(pathToFileURL(join(dir,'tool.ts')).href)}\n`)
 await writeFile(join(dir,'run.ts'),`import assert from 'node:assert/strict';import {boot} from ${JSON.stringify(url('packages/boot/app-boot/src/index.ts'))};
const ctx=await boot('tool-scenario',${JSON.stringify(join(dir,'cordis.yml'))});assert(ctx.tools.get('scenario_greet'));
let event;ctx.on('tools/result',(_exec,result)=>{event=result});
const request=(id,args,signal=new AbortController().signal)=>({callId:id,name:'scenario_greet',arguments:args,signal});
const value=await ctx.tools.execute(request('success',{name:'DSH'}));assert.equal(value.isError,false);assert.equal(value.value,'你好，DSH');assert.deepEqual(value.content,[{type:'text',text:'你好，DSH'}]);assert.deepEqual(event,value);
const invalid=await ctx.tools.execute(request('invalid',{name:1}));assert.equal(invalid.isError,true);assert.equal(globalThis.__executions,1);
const cancelled=new AbortController();cancelled.abort();const outcome=await ctx.tools.execute(request('cancelled',{name:'DSH'},cancelled.signal));assert.equal(outcome.isError,true);assert.equal(globalThis.__executions,1);
const entry=[...ctx.loader.entries()].find(entry=>entry.options.id==='fixture-tool');assert(entry);await entry.fiber.dispose();assert.equal(ctx.tools.get('scenario_greet'),undefined);await ctx.fiber.dispose();
process.stdout.write(JSON.stringify({taskId:'register-tool',checks:{'loader-load':true,'tool-call':true,'input-rejected':true,'cancel':true,'result-event':true,'unload':true}}));`)
 const run=spawnSync(process.execPath,['--import',url('node_modules/tsx/dist/loader.mjs'),join(dir,'run.ts')],{cwd:checkout,env:{...process.env,TSX_TSCONFIG_PATH:join(checkout,'tsconfig.host.json')},encoding:'utf8',timeout:60000});if(run.status!==0)throw Error(run.stderr+'\n'+run.stdout);process.stdout.write(run.stdout)
}finally{await rm(dir,{recursive:true,force:true})}
