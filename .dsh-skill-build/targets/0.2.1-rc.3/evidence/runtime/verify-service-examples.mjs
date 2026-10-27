import fs from'node:fs/promises';import path from'node:path';import os from'node:os';import assert from'node:assert/strict';import{pathToFileURL}from'node:url';
const target=path.resolve('.dsh-skill-build/targets/0.2.1-rc.3'),root=path.join(target,'checkout'),from=p=>import(pathToFileURL(path.join(root,p)).href);
const{Context}=await from('vendor/cordis/lib/index.js'),{default:ts}=await from('node_modules/typescript/lib/typescript.js');
for(const kind of ['storage','web']){
 const tmp=await fs.mkdtemp(path.join(os.tmpdir(),'dsh-example-'+kind+'-')),ctx=new Context();
 try{
  await fs.mkdir(path.join(tmp,'node_modules/@deepseek-ai'),{recursive:true});for(const[n,p]of[['cordis','vendor/cordis'],['dsh-storage-domain','packages/storage/storage-domain'],['dsh-web','packages/web/web']])await fs.symlink(path.join(root,p),path.join(tmp,'node_modules/@deepseek-ai',n));await fs.symlink(path.join(root,'node_modules/zod'),path.join(tmp,'node_modules/zod'));
  const source=await fs.readFile(path.join(target,`skill-source/examples/runtime-${kind}.md`),'utf8'),code=source.match(/^```ts\n([\s\S]*?)^```/m)[1];await fs.writeFile(path.join(tmp,'example.mjs'),ts.transpileModule(code,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText);
  if(kind==='storage'){
   await ctx.plugin((await from('packages/storage/storage/lib/index.js')).default);await ctx.plugin(await from('packages/storage/storage-json/lib/index.js'),{root:path.join(tmp,'data')});await ctx.plugin(await from('packages/storage/storage-domain/lib/index.js'),{backend:'json'});
  }else await ctx.plugin((await from('packages/web/web/lib/index.js')).default,{searchProvider:'local-search'});
  const mod=await import(pathToFileURL(path.join(tmp,'example.mjs')).href),fiber=await ctx.plugin(mod);
  if(kind==='storage'){
   assert.deepEqual(ctx.storageDomain.get('local_domain_note').table('notes').get('welcome'),{text:'你好，DSH'});await fiber.dispose();assert.equal(ctx.storageDomain.get('local_domain_note'),undefined);
  }else{
   const result=await ctx.web.search({query:'本地测试',maxResults:1});assert.equal(result.sources.length,1);assert.equal(result.truncated,true);await fiber.dispose();await assert.rejects(ctx.web.search({query:'本地测试'}),e=>e.code==='WEB_PROVIDER_CONFIGURED_MISSING');
  }
  console.log(JSON.stringify({example:`runtime-${kind}`,checks:{'actual-example-mount':true,'observable-call':true,'unload':true}}));
 }finally{await ctx.fiber.dispose();await fs.rm(tmp,{recursive:true,force:true});}
}
