import { readFile, mkdir, writeFile, symlink, readdir, realpath } from 'node:fs/promises'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import assert from 'node:assert/strict'
const evidence = dirname(fileURLToPath(import.meta.url))
const target = resolve(evidence, '../..')
const checkout = join(target, 'checkout')
const skillFlag = process.argv.indexOf('--skill')
if (skillFlag !== -1 && (!process.argv[skillFlag + 1] || process.argv[skillFlag + 1].startsWith('--'))) throw new Error('--skill requires a Skill root')
const skillRoot = skillFlag === -1 ? undefined : resolve(process.argv[skillFlag + 1])
const settingsPath = skillRoot ? join(skillRoot, 'references/client/examples/example-client-settings.md') : join(target, 'skill-source/examples/client-settings.md')
const workerPath = skillRoot ? join(skillRoot, 'references/infra/examples/example-worker-image.md') : join(target, 'skill-source/examples/worker-image.md')
const consumer = join(evidence, 'consumer-settings-worker')
await mkdir(consumer, {recursive:true})
const packages = new Map()
async function scan(dir) {
 for(const entry of await readdir(dir, {withFileTypes:true})) {
  if(!entry.isDirectory() || ['node_modules','lib','.git','dist'].includes(entry.name)) continue
  const path = join(dir, entry.name)
  try {const m=JSON.parse(await readFile(join(path,'package.json'),'utf8')); if(m.name) packages.set(m.name,path)}catch{}
  if(dir === checkout || !['vendor','packages','apps','native'].includes(entry.name)) {
   if(path.split('/').length-checkout.split('/').length<4) await scan(path)
  } else await scan(path)
 }
}
await scan(checkout)
async function link(name, project=consumer) {
 const path=join(project,'node_modules',name);await mkdir(dirname(path),{recursive:true})
 let source=packages.get(name)
 if(!source) {
  for(const candidate of [join(checkout,'node_modules',name),join(checkout,'packages/client/ui-primitives/node_modules',name)]) {
   try {source=await realpath(candidate);break}catch{}
  }
 }
 if(!source && name === 'esbuild') source = join(checkout,'node_modules/.pnpm/esbuild@0.25.12/node_modules/esbuild')
 if(!source) throw new Error('cannot resolve '+name)
 try{await symlink(source,path,'dir')}catch(e){if(e.code!=='EEXIST')throw e}
}
const settings=await readFile(settingsPath,'utf8')
const blocks=[...settings.matchAll(/```(\w+)[^\n]*\n([\s\S]*?)\n```/g)]
const pkg=JSON.parse(blocks.find(b=>b[1]==='json')[2])
await writeFile(join(consumer,'package.json'),JSON.stringify(pkg))
for(const dep of Object.keys(pkg.devDependencies)) await link(dep)
await mkdir(join(consumer,'src'),{recursive:true})
await writeFile(join(consumer,'tsconfig.json'),blocks.filter(b=>b[1]==='json')[1][2])
await writeFile(join(consumer,'src/index.ts'),blocks.find(b=>b[1]==='ts')[2])
await writeFile(join(consumer,'src/client.tsx'),blocks.find(b=>b[1]==='tsx')[2])
await writeFile(join(consumer,'build.mjs'),blocks.find(b=>b[1]==='javascript')[2])
function run(cmd,args,cwd=consumer) {
 const r=spawnSync(cmd,args,{cwd,encoding:'utf8',timeout:180000})
 if(r.status!==0) throw new Error(`${cmd} failed\n${r.stdout}\n${r.stderr}`)
 return r.stdout
}
run('node',[join(checkout,'node_modules/typescript/bin/tsc')])
run('node',['build.mjs'])
await link('@deepseek-ai/dsh-experimental-webworker-packer')
await link('@deepseek-ai/dsh-experimental-webworker-runtime')
const worker=await readFile(workerPath,'utf8')
const workerCode=[...worker.matchAll(/```javascript\n([\s\S]*?)\n```/g)][0][1]
await writeFile(join(consumer,'pack.mjs'),workerCode)
const output=run('node',['pack.mjs'])
assert.match(output,/断言通过/)
console.log(JSON.stringify({hostBlocks:1,clientBlocks:1,checks:{'settings-package-types':true,'settings-host-client-build':true,'worker-public-library-pack-mount-module-overlay':true}}))
