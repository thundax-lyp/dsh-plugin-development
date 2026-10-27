const fs=require('node:fs'),path=require('node:path'),ts=require(path.resolve('node_modules/typescript'));
const base='.dsh-skill-build/targets/0.2.1-rc.3';const r=JSON.parse(fs.readFileSync(base+'/evidence/capabilities/result.json','utf8'));let out=[];
for(const e of r.entries.filter(e=>e.decision==='included'&&e.candidate.endsWith(':.'))){
 const pkg=e.candidate.split(':')[1],objs=r.objects.filter(o=>o.entry===e.candidate);const srcs=new Set(objs.map(o=>o.source));
 for(const file of srcs){const text=fs.readFileSync(base+'/checkout/'+file,'utf8'),sf=ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true);
  for(const st of sf.statements){if(!ts.isModuleDeclaration(st)||st.name.text!=='@deepseek-ai/cordis'||!st.body||!ts.isModuleBlock(st.body))continue;
   for(const d of st.body.statements){if(!ts.isInterfaceDeclaration(d)||!['Context','Events'].includes(d.name.text))continue;
    out.push({entry:e.candidate,source:file,symbol:d.name.text,members:d.members.filter(m=>m.name).map(m=>({name:m.name.getText(sf).replace(/^['"]|['"]$/g,''),signature:m.getText(sf).replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s+/g,' ').trim(),mode:(m.getFullText(sf).match(/@mode\s+(\w+)/)||[])[1]}))});
   }
  }
 }
}
fs.writeFileSync(base+'/evidence/capabilities/augmentations.json',JSON.stringify(out,null,4)+'\n');console.log(out.length);
