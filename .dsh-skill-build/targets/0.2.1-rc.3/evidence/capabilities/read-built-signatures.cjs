const fs=require('node:fs'),path=require('node:path'),ts=require(path.resolve('node_modules/typescript'));
const base='.dsh-skill-build/targets/0.2.1-rc.3',r=JSON.parse(fs.readFileSync(base+'/evidence/capabilities/result.json','utf8')),out={};
for(const file of new Set(r.objects.filter(o=>o.decision==='included'&&!o.origin).map(o=>o.source))){
 let dfile=file.replace('/src/','/lib/types/').replace(/\.tsx?$/,'.d.ts');
 if(!fs.existsSync(base+'/checkout/'+dfile))dfile=file;
 const text=fs.readFileSync(base+'/checkout/'+dfile,'utf8'),sf=ts.createSourceFile(dfile,text,ts.ScriptTarget.Latest,true);
 const clean=s=>s.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\/\/[^\n]*/g,'').replace(/\s+/g,' ').trim();
 for(const st of sf.statements){
  if(ts.isVariableStatement(st))for(const d of st.declarationList.declarations){if(ts.isIdentifier(d.name)){let type=d.type?.getText(sf);if(!type&&d.initializer&&(ts.isStringLiteral(d.initializer)||ts.isNumericLiteral(d.initializer)||ts.isArrayLiteralExpression(d.initializer)||d.initializer.kind===ts.SyntaxKind.TrueKeyword||d.initializer.kind===ts.SyntaxKind.FalseKeyword))type=d.initializer.getText(sf);if(type)out[file+'#'+d.name.text]={...(out[file+'#'+d.name.text]||{}),type:clean(type)};}}
  if(ts.isFunctionDeclaration(st)&&st.name){let sig=st.getText(sf);if(st.body)sig=sig.slice(0,st.body.getStart(sf)-st.getStart(sf));out[file+'#'+st.name.text]={type:clean(sig).replace(/^export (?:declare )?/,''),members:{}};}
  if((ts.isInterfaceDeclaration(st)||ts.isClassDeclaration(st))&&st.name){const key=file+'#'+st.name.text;let found=out[key]||{type:st.name.text};found.members=found.members||{};
   if(ts.isInterfaceDeclaration(st))found.interface=st.getText(sf).replace(/\/\*[\s\S]*?\*\//g,'').replace(/\n\s*\n/g,'\n').replace(/^export /,'');
   for(const m of st.members){if(m.name){let raw=m.getText(sf);if(m.body)raw=raw.slice(0,m.body.getStart(sf)-m.getStart(sf));found.members[m.name.getText(sf)]=clean(raw);}if(ts.isConstructorDeclaration(m))for(const a of m.parameters){if(a.modifiers?.some(x=>[ts.SyntaxKind.PublicKeyword,ts.SyntaxKind.ReadonlyKeyword].includes(x.kind)))found.members[a.name.getText(sf)]=clean(a.getText(sf));}}
   out[key]=found;
  }
 }
}
fs.writeFileSync(base+'/evidence/capabilities/built-signatures.json',JSON.stringify(out,null,4)+'\n');
