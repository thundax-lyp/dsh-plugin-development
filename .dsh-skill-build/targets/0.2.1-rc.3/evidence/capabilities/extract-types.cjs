const fs=require('node:fs'),path=require('node:path'),ts=require(path.resolve('node_modules/typescript'));
const base='.dsh-skill-build/targets/0.2.1-rc.3';const r=JSON.parse(fs.readFileSync(base+'/evidence/capabilities/result.json','utf8'));let out={};
for(const file of new Set(r.objects.filter(o=>o.decision==='included').map(o=>o.source))){
 const text=fs.readFileSync(base+'/checkout/'+file,'utf8'),sf=ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true);
 for(const st of sf.statements){
  if((ts.isInterfaceDeclaration(st)||ts.isTypeAliasDeclaration(st))&&st.name){
   const raw=st.getText(sf).replace(/\/\*[\s\S]*?\*\//g,'').replace(/\/\/[^\n]*/g,'').replace(/^export /,'').replace(/\n\s*\n/g,'\n');
   out[file+'#'+st.name.text]=raw;
  }
 }
}
fs.writeFileSync(base+'/evidence/capabilities/type-declarations.json',JSON.stringify(out,null,4)+'\n');
