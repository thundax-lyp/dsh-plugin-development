import fs from 'node:fs/promises';import path from 'node:path';import os from 'node:os';import {pathToFileURL}from'node:url';import assert from'node:assert/strict';
const target=path.resolve('.dsh-skill-build/targets/0.2.1-rc.3'),root=path.join(target,'checkout');
const from=p=>import(pathToFileURL(path.join(root,p)).href);
const {Context}=await from('vendor/cordis/lib/index.js'),{default:LocalFs}=await from('packages/fs/fs-local/lib/index.js'),{default:ts}=await from('node_modules/typescript/lib/typescript.js');
const tmp=await fs.mkdtemp(path.join(os.tmpdir(),'dsh-fs-example-')),ctx=new Context();
try{const source=await fs.readFile(path.join(target,'skill-source/examples/runtime-fs.md'),'utf8'),code=source.match(/^```ts\n([\s\S]*?)^```/m)[1];
await fs.mkdir(path.join(tmp,'node_modules/@deepseek-ai'),{recursive:true});for(const[n,p]of[['cordis','vendor/cordis'],['dsh-fs','packages/fs/fs']])await fs.symlink(path.join(root,p),path.join(tmp,'node_modules/@deepseek-ai',n));
await fs.writeFile(path.join(tmp,'example.mjs'),ts.transpileModule(code,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText);
await ctx.plugin(LocalFs,{cwd:tmp});const mod=await import(pathToFileURL(path.join(tmp,'example.mjs')).href);const fiber=await ctx.plugin(mod);assert.equal(await fs.readFile(path.join(tmp,'plugin-note.txt'),'utf8'),'来自插件的一行\n');await fiber.dispose();await ctx.fiber.dispose();console.log(JSON.stringify({example:'runtime-fs',checks:{'actual-example-mount':true,'file-written':true,'unload':true}}));
}finally{await ctx.fiber.dispose();await fs.rm(tmp,{recursive:true,force:true});}
