import {readFileSync,writeFileSync,existsSync} from 'node:fs'
import {join,resolve} from 'node:path'
const p=resolve('.dsh-skill-build/targets/0.2.1-rc.3'),ts=(await import(join(p,'checkout/node_modules/typescript/lib/typescript.js'))).default
const result=JSON.parse(readFileSync(join(p,'evidence/core/result.json'),'utf8')),printer=ts.createPrinter({removeComments:true,newLine:ts.NewLineKind.LineFeed}),output={}
for(const o of result.objects){
 if(o.decision!=='included')continue
 const rel=o.source.replace('/src/','/lib/types/').replace(/\.tsx?$/,'.d.ts'),path=join(p,'checkout',rel)
 if(!existsSync(path))continue
 const sf=ts.createSourceFile(rel,readFileSync(path,'utf8'),ts.ScriptTarget.Latest,true)
 const found=[]
 for(let n of sf.statements){
  const def=n.modifiers?.some(m=>m.kind===ts.SyntaxKind.DefaultKeyword)
  if(n.name?.getText(sf)===o.symbol || o.symbol==='default'&&def){
   if(ts.isClassDeclaration(n))n=ts.factory.updateClassDeclaration(n,n.modifiers,n.name,n.typeParameters,n.heritageClauses,n.members.filter(m=>!m.modifiers?.some(x=>x.kind===ts.SyntaxKind.PrivateKeyword)&&!ts.isPrivateIdentifier(m.name??ts.factory.createIdentifier('_'))))
   if(ts.isClassDeclaration(n)||ts.isInterfaceDeclaration(n)||ts.isTypeAliasDeclaration(n)||ts.isFunctionDeclaration(n)||ts.isModuleDeclaration(n))found.push(printer.printNode(ts.EmitHint.Unspecified,n,sf))
  }
  if(ts.isVariableStatement(n)){
   const ds=n.declarationList.declarations.filter(d=>d.name.getText(sf)===o.symbol)
   if(ds.length)found.push(printer.printNode(ts.EmitHint.Unspecified,ts.factory.updateVariableStatement(n,n.modifiers,ts.factory.updateVariableDeclarationList(n.declarationList,ds)),sf))
  }
 }
 if(found.length)output[o.id]=found.join('\n')
}
writeFileSync(join(p,'evidence/core/built-public-declarations.json'),JSON.stringify(output,null,4)+'\n');console.log(Object.keys(output).length)
