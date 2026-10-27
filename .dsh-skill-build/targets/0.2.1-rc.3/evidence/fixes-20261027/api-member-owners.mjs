import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(path.resolve('package.json'));
const ts = require('typescript');
const { builtDeclarationPath } = require('./scripts/example_type_paths.cjs');
const target = path.resolve('.dsh-skill-build/targets/0.2.1-rc.3');
const checkout = path.join(target, 'checkout');
const source = path.join(target, 'skill-source');
const evidence = path.join(target, 'evidence/fixes-20261027');
const requested = JSON.parse(fs.readFileSync(path.join(evidence, 'new-member-body-audit.json')));
const api = JSON.parse(fs.readFileSync(path.join(source, 'api-surface.json')));
const manifest = JSON.parse(fs.readFileSync(path.join(source, 'manifest.json')));
const entries = new Map(JSON.parse(fs.readFileSync(path.join(target, 'evidence/api-symbol-candidates.json'))).entries.map(e => [e.entry, e]));
const objects = new Map(api.objects.map(o => [o.id, o]));
const mappings = new Map(manifest.files.map(f => [f.output, f.source]));
function built(p) {
    const result = p.replace('/src/', '/lib/types/').replace(/(?<!\.d)\.tsx?$/, '.d.ts');
    return path.join(checkout, fs.existsSync(path.join(checkout, result)) ? result : p);
}
const raw = ts.readConfigFile(path.join(checkout, 'tsconfig.base.client.json'), ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(raw.config, ts.sys, checkout);
const paths = Object.fromEntries(Object.entries(parsed.options.paths).map(([k, ps]) => [k, ps.map(builtDeclarationPath)]));
const roots = [...new Set(api.objects.filter(o => o.decision === 'included').map(o => built(o.origin === 'module-augmentation' ? o.source : entries.get(o.entry).source)))];
const program = ts.createProgram(roots, { ...parsed.options, paths, baseUrl: checkout, skipLibCheck: true, noEmit: true, composite: false, declaration: false });
const checker = program.getTypeChecker();
const printer = ts.createPrinter({ removeComments: true });
const output = [];
const anchor = s => s.toLowerCase().replace(/[^\p{L}\p{N}_ -]/gu, '').replace(/ /g, '-');
for (const id of [...new Set(requested.map(r => r[0]))]) {
    const o = objects.get(id);
    const file = program.getSourceFile(built(entries.get(o.entry).source));
    const module = checker.getSymbolAtLocation(file);
    let symbol = module && checker.getExportsOfModule(module).find(s => s.name === o.symbol);
    if (symbol?.flags & ts.SymbolFlags.Alias) symbol = checker.getAliasedSymbol(symbol);
    if (!symbol?.declarations?.length) { output.push({ id, decision: 'unresolved-symbol', members: requested.filter(r => r[0] === id).map(r => r[2]) }); continue; }
    const declared = symbol.flags & (ts.SymbolFlags.Class | ts.SymbolFlags.Interface | ts.SymbolFlags.TypeAlias) ? checker.getDeclaredTypeOfSymbol(symbol) : checker.getTypeOfSymbolAtLocation(symbol, symbol.declarations[0]);
    function propertyIn(type, name) {
        const direct = checker.getPropertyOfType(type, name);
        if (direct) return [direct];
        return type.isUnionOrIntersection() ? type.types.flatMap(t => propertyIn(t, name)) : [];
    }
    const rows = [];
    for (const request of requested.filter(r => r[0] === id)) {
        const name = request[2];
        const properties = [...new Set(propertyIn(declared, name))];
        if (!properties.length) { output.push({ id, name, decision: 'unresolved-member' }); continue; }
        for (const property of properties) {
            const declarations = property.declarations ?? [];
            if (!declarations.length) { output.push({ id, name, decision: 'synthetic-member', signature: checker.typeToString(checker.getTypeOfSymbolAtLocation(property, symbol.declarations[0]), symbol.declarations[0], ts.TypeFormatFlags.NoTruncation) }); continue; }
            for (const node of declarations) {
                const origin = path.relative(checkout, node.getSourceFile().fileName);
                if (ts.getJSDocDeprecatedTag(node)) { output.push({ id, name, origin, decision: 'excluded-deprecated' }); continue; }
                if (node.modifiers?.some(m => m.kind === ts.SyntaxKind.PrivateKeyword || m.kind === ts.SyntaxKind.ProtectedKeyword) || name.startsWith('__@')) { output.push({ id, name, origin, decision: 'excluded-non-public' }); continue; }
                const declaration = printer.printNode(ts.EmitHint.Unspecified, node, node.getSourceFile());
                let parent = node.parent;
                while (parent && !((ts.isInterfaceDeclaration(parent) || ts.isClassDeclaration(parent) || ts.isTypeAliasDeclaration(parent)) && parent.name)) parent = parent.parent;
                const parentName = parent?.name?.getText();
                const parentSource = parent && path.relative(checkout, parent.getSourceFile().fileName).replace('/lib/types/', '/src/').replace(/\.d\.ts$/, '.ts');
                const authority = api.objects.find(p => p.decision === 'included' && p.id !== id && p.symbol === parentName && (p.source === parentSource || p.source === parentSource + 'x'));
                const rel = authority && path.posix.relative(path.posix.dirname(o.owner), authority.owner);
                const owner = authority ? `[${parentName} 权威声明](${rel}#${anchor(authority.section)})` : parentName ? `来自 \`${parentName}\` 的公开继承或联合分支` : '来自上述类型组合的公开分支';
                rows.push(`| \`${name}\` | \`${declaration.replace(/\s+/g, ' ').replace(/\|/g, '\\|').replace(/`/g, '\\`')}\` | ${owner} |`);
                output.push({ id, name, origin, decision: 'included', declaration, ...(authority ? { authority: authority.id } : { parent: parentName }) });
            }
        }
    }
    if (rows.length) {
        const rel = mappings.get(o.owner);
        const p = path.join(source, rel);
        let body = fs.readFileSync(p, 'utf8');
        const header = `## ${o.section}\n`;
        const start = body.indexOf(header);
        assert(start >= 0, id);
        let end = body.indexOf('\n## ', start + header.length);
        if (end < 0) end = body.length;
        const extra = '\n\n继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。\n\n| 成员 | 公开成员声明 | 权威归属 |\n| --- | --- | --- |\n' + [...new Set(rows)].join('\n') + '\n';
        const section = body.slice(start, end);
        if (!section.includes('继承与类型组合成员索引：')) fs.writeFileSync(p, body.slice(0, end) + extra + body.slice(end));
    }
}
fs.writeFileSync(path.join(evidence, 'api-member-ownership.json'), JSON.stringify(output, null, 4) + '\n');
console.log(JSON.stringify(output.reduce((a, r) => (a[r.decision] = (a[r.decision] ?? 0) + 1, a), {})));
