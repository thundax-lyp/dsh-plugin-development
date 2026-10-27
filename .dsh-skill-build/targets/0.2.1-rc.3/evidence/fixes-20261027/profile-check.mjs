import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import {tmpdir} from 'node:os'
import {fileURLToPath,pathToFileURL} from 'node:url'
import {createRequire} from 'node:module'
const target=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..'),checkout=process.env.DSH_TARGET_CHECKOUT??path.join(target,'checkout')
const require=createRequire(path.join(checkout,'package.json')),yaml=require('js-yaml')
const {entryListSchema,applyEntryPatches}=await import(pathToFileURL(path.join(checkout,'vendor/include/lib/index.js')))
const {boot}=await import(pathToFileURL(path.join(checkout,'packages/boot/app-boot/lib/index.js')))
const args=process.argv.slice(2),skill=args.includes('--skill')?path.resolve(args[args.indexOf('--skill')+1]):null
const doc=await fs.readFile(skill?path.join(skill,'references/infra/how-to/how-to-core-profile.md'):path.join(target,'skill-source/how-to/core-profile.md'),'utf8')
const patches=[...doc.matchAll(/^```yaml\n([\s\S]*?)^```/gm)].slice(-2).map(m=>yaml.load(m[1],{schema:entryListSchema}))
assert.equal(patches.length,2)
const warn=(message)=>{throw Error(message)}
const base=applyEntryPatches([],yaml.load(await fs.readFile(path.join(checkout,'packages/bundle/base/cordis.patch.yml'),'utf8'),{schema:entryListSchema}),warn)
const flatten=rows=>rows.flatMap(e=>[e,...(e.group&&Array.isArray(e.config)?flatten(e.config):[])])
const before=flatten(base),configured=flatten(applyEntryPatches(base,patches[0],warn)),replaced=flatten(applyEntryPatches(base,patches[1],warn))
for(const id of ['subprocess','goal','subagent-spawn-in-process'])assert.equal(configured.filter(e=>e.id===id).length,1)
assert.equal(configured.find(e=>e.id==='bash-sandbox').config.timeoutMs,30000)
assert.equal(replaced.find(e=>e.id==='bash-sandbox').disabled,true)
assert.equal(replaced.filter(e=>e.name==='@deepseek-ai/dsh-bash-local').length,1)
const scratch=await fs.mkdtemp(path.join(tmpdir(),'dsh-profile-reuse-'))
let ctx
try {
 const manifests=[]
 for(const top of ['vendor','packages'])for(const parent of await fs.readdir(path.join(checkout,top),{withFileTypes:true})){
  if(!parent.isDirectory())continue
  const root=path.join(checkout,top,parent.name)
  const candidates=top==='vendor'?[root]:(await fs.readdir(root,{withFileTypes:true})).filter(e=>e.isDirectory()).map(e=>path.join(root,e.name))
  for(const dir of candidates)try{const m=JSON.parse(await fs.readFile(path.join(dir,'package.json'),'utf8'));manifests.push([m.name,dir])}catch{}
 }
 const packagePaths=new Map(manifests)
 const ids=['subprocess','session','agent','session-projection','goal','local-bash-replacement']
 const selected=ids.map(id=>{const row=replaced.find(e=>e.id===id);assert(row,id);return row})
 await fs.mkdir(path.join(scratch,'node_modules/@deepseek-ai'),{recursive:true})
 for(const row of selected)await fs.symlink(packagePaths.get(row.name),path.join(scratch,'node_modules',row.name))
 await fs.writeFile(path.join(scratch,'package.json'),JSON.stringify({type:'module',private:true})+'\n')
 await fs.writeFile(path.join(scratch,'consumer.mjs'),`import assert from 'node:assert/strict';export const inject=['shell','goals'];export async function apply(ctx){const execution=await ctx.shell.execute(ctx.shell.resolve({command:'printf local-profile-ok'}));const result=await execution.result();assert.equal(result.exitCode,0);assert.equal(result.stdout.text,'local-profile-ok');assert.equal(typeof ctx.goals.create,'function');ctx.provide('reuseProbe',{output:result.stdout.text});}`)
 selected.push({id:'local-consumer',name:pathToFileURL(path.join(scratch,'consumer.mjs')).href})
 const leaf=path.join(scratch,'cordis.yml');await fs.writeFile(leaf,yaml.dump(selected,{schema:entryListSchema}))
 ctx=await boot('profile-reuse',leaf)
 assert.equal(ctx.reuseProbe.output,'local-profile-ok')
 assert(ctx.get('shell')); assert(ctx.get('goals'))
 const entry=[...ctx.loader.entries()].find(e=>e.options.id==='local-consumer');assert(entry);await entry.fiber.dispose()
 assert.equal(ctx.get('reuseProbe'),undefined);assert(ctx.get('shell'));assert(ctx.get('goals'))
 await ctx.fiber.dispose();ctx=null
 assert.equal(before.filter(e=>e.id==='goal').length,1)
 console.log(JSON.stringify({taskId:'runtime-shell',hostBlocks:0,clientBlocks:0,checks:{'base-patch-service-uniqueness':true,'existing-config-override':true,'provider-replacement-patch':true,'real-loader-composition':true,'shell-call':true,'consumer-unload-keeps-shared-services':true},boundary:'Actual base rows for a dependency-complete subset, not full default web startup or real sandbox enforcement.'}))
}finally{if(ctx)await ctx.fiber.dispose();await fs.rm(scratch,{recursive:true,force:true})}
