const fs=require('node:fs'),path=require('node:path'),ts=require(path.resolve('node_modules/typescript'));
const base='.dsh-skill-build/targets/0.2.1-rc.3';const r=JSON.parse(fs.readFileSync(base+'/evidence/capabilities/result.json','utf8'));let out={};
for(const file of new Set(r.objects.filter(o=>o.decision==='included').map(o=>o.source))){
 const text=fs.readFileSync(base+'/checkout/'+file,'utf8'),sf=ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true);
 for(const st of sf.statements){
  if((ts.isInterfaceDeclaration(st)||ts.isClassDeclaration(st))&&st.name){
   for(const m of st.members){if(!m.name)continue;let raw=m.getText(sf).replace(/\/\*[\s\S]*?\*\//g,'').replace(/\/\/[^\n]*/g,'').trim();
    if(m.body)raw=raw.slice(0,m.body.getStart(sf)-m.getStart(sf)).trim();
    if(m.initializer)raw=raw.slice(0,m.initializer.getStart(sf)-m.getStart(sf)).replace(/=\s*$/,'').trim();
    out[file+'#'+st.name.text+'#'+m.name.getText(sf)]=raw.replace(/\s+/g,' ');
   }
  }
 }
}
fs.writeFileSync(base+'/evidence/capabilities/member-syntax.json',JSON.stringify(out,null,4)+'\n');
