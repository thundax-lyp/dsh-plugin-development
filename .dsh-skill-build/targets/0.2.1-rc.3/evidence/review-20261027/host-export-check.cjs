const fs=require('fs'),path=require('path');
const repo=process.cwd(), target=path.join(repo,'.dsh-skill-build/targets/0.2.1-rc.3'), root=path.join(target,'checkout');
const ts=require(path.join(root,'node_modules/typescript'));
const files=fs.readFileSync(path.join(__dirname,'host-files.txt'),'utf8').trim().split('\n');
const refs=[];
for (const file of files) {
 const text=fs.readFileSync(path.join(repo,'skills/dsh-plugin-development',file),'utf8');
 for(const match of text.matchAll(/公开导入：`([^`]+)`；公开符号：`([^`]+)`/g)) refs.push({file,module:match[1],name:match[2],line:text.slice(0,match.index).split('\n').length});
}
const parsed=ts.getParsedCommandLineOfConfigFile(path.join(root,'tsconfig.host.json'),{}, {...ts.sys,onUnRecoverableConfigFileDiagnostic(d){throw Error(ts.flattenDiagnosticMessageText(d.messageText,'\n'))}});
const options={...parsed.options,noEmit:true};
const modules=new Map();
for(const r of refs) if(!modules.has(r.module)) modules.set(r.module,ts.resolveModuleName(r.module,path.join(root,'__host-review__.ts'),options,ts.sys).resolvedModule?.resolvedFileName);
for(const [name,resolved] of modules) {
 if(resolved) continue;
 const packageName=name.startsWith('@')?name.split('/').slice(0,2).join('/'):name.split('/')[0];
 const source=parsed.options.paths[packageName]?.[0];
 if(!source) continue;
 const packageRoot=path.resolve(root,source.endsWith('/src')?source.slice(0,-4):path.dirname(source));
 const manifest=JSON.parse(fs.readFileSync(path.join(packageRoot,'package.json'),'utf8'));
 const subpath=name===packageName?'.':'.'+name.slice(packageName.length);
 const exp=manifest.exports?.[subpath];
 const types=typeof exp==='object'?exp.types:undefined;
 if(types && fs.existsSync(path.resolve(packageRoot,types))) modules.set(name,path.resolve(packageRoot,types));
}
const roots=[...new Set([...modules.values()].filter(Boolean))];
const program=ts.createProgram(roots,options), checker=program.getTypeChecker();
const errors=[];
for(const r of refs){
 const resolved=modules.get(r.module), sf=resolved&&program.getSourceFile(resolved), mod=sf&&checker.getSymbolAtLocation(sf);
 if(!mod) errors.push({...r,error:'module unresolved'});
 else if(!checker.getExportsOfModule(mod).some(s=>s.name===r.name)) errors.push({...r,error:'export absent',resolved:path.relative(root,resolved)});
}
const report={checks:refs.length,modules:modules.size,errors};
fs.writeFileSync(path.join(__dirname,'host-export-check.json'),JSON.stringify(report,null,4)+'\n');
console.log(JSON.stringify(report));
