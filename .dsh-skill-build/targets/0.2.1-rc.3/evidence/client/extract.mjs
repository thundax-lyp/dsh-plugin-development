import fs from 'node:fs'; import ts from 'typescript'; import path from 'node:path';
const root=path.resolve('.dsh-skill-build/targets/0.2.1-rc.3');
const data=JSON.parse(fs.readFileSync(root+'/evidence/api-symbol-candidates.json'));const out={};
for (const e of data.entries) for (const s of e.symbols) {if(!s.source?.startsWith('packages/client/')&&!s.source?.startsWith('packages/experimental/client-'))continue;
const file=root+'/checkout/'+s.source;let source=ts.createSourceFile(file,fs.readFileSync(file,'utf8'),ts.ScriptTarget.Latest,true);let found;
function walk(n){if(n.name?.getText(source)===s.name && (ts.isFunctionDeclaration(n)||ts.isInterfaceDeclaration(n)||ts.isTypeAliasDeclaration(n)||ts.isClassDeclaration(n)||ts.isVariableDeclaration(n)))found??=n;ts.forEachChild(n,walk)}walk(source);
if(found){let text;if(ts.isFunctionDeclaration(found)){text=found.getText(source);if(found.body)text=text.slice(0,found.body.pos-found.getStart(source)).trim()+';'}else if(ts.isClassDeclaration(found)){text=found.name.getText(source)+'\n'+s.members.map(m=>m.name+': '+m.signature).join('\n');}else text=found.getText(source);out[e.entry+':'+s.name]=text.replace(/\/\*[^]*?\*\//g,'').replace(/^\s*\/\/.*$/gm,'').trim()}}
fs.writeFileSync(root+'/evidence/client/declarations.json',JSON.stringify(out,null,4)+'\n');
