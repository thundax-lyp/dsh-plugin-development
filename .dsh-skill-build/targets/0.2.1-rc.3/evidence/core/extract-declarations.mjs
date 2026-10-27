import {readFileSync,writeFileSync} from 'node:fs'
import {join,resolve} from 'node:path'
const p=resolve('.dsh-skill-build/targets/0.2.1-rc.3')
const ts=(await import(join(p,'checkout/node_modules/typescript/lib/typescript.js'))).default
const result=JSON.parse(readFileSync(join(p,'evidence/core/result.json'),'utf8'))
const printer=ts.createPrinter({removeComments:true,newLine:ts.NewLineKind.LineFeed})
const output={}
for(const o of result.objects){
 if(o.decision!=='included')continue
 const code=readFileSync(join(p,'checkout',o.source),'utf8'),sf=ts.createSourceFile(o.source,code,ts.ScriptTarget.Latest,true)
 const found=[]
 function visit(n){
  if(n.name?.getText(sf)===o.symbol){
   if(ts.isInterfaceDeclaration(n)||ts.isTypeAliasDeclaration(n))found.push(printer.printNode(ts.EmitHint.Unspecified,n,sf))
   else if(ts.isFunctionDeclaration(n))found.push(printer.printNode(ts.EmitHint.Unspecified,ts.factory.updateFunctionDeclaration(n,n.modifiers,n.asteriskToken,n.name,n.typeParameters,n.parameters,n.type,undefined),sf))
  }
  ts.forEachChild(n,visit)
 }
 visit(sf)
 if(found.length)output[o.id]=[...new Set(found)].join('\n')
}
writeFileSync(join(p,'evidence/core/public-declarations.json'),JSON.stringify(output,null,4)+'\n')
console.log(Object.keys(output).length)
