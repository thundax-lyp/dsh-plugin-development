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
const observations = JSON.parse(fs.readFileSync(path.join(evidence, 'api-declaration-observations.json')));
const surface = JSON.parse(fs.readFileSync(path.join(source, 'api-surface.json')));
const manifest = JSON.parse(fs.readFileSync(path.join(source, 'manifest.json')));
const entryMap = new Map(JSON.parse(fs.readFileSync(path.join(target, 'evidence/api-symbol-candidates.json'))).entries.map(e => [e.entry, e]));
const mappings = new Map(manifest.files.map(f => [f.output, f.source]));
const done = new Set(observations.fixes.map(r => r.id));
const objects = surface.objects.filter(o => o.decision === 'included' && mappings.get(o.owner)?.startsWith('api-guardrails/') && !done.has(o.id));
function built(p) {
    const result = p.replace('/src/', '/lib/types/').replace(/(?<!\.d)\.tsx?$/, '.d.ts');
    if (fs.existsSync(path.join(checkout, result))) return path.join(checkout, result);
    if (fs.existsSync(path.join(checkout, p))) return path.join(checkout, p);
    throw new Error(`缺少公开声明 ${p}`);
}
const config = ts.readConfigFile(path.join(checkout, 'tsconfig.base.client.json'), ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, checkout);
const paths = Object.fromEntries(Object.entries(parsed.options.paths).map(([k, ps]) => [k, ps.map(builtDeclarationPath)]));
const roots = [...new Set(objects.map(o => built(o.origin === 'module-augmentation' ? o.source : entryMap.get(o.entry).source)))];
const program = ts.createProgram(roots, { ...parsed.options, paths, baseUrl: checkout, noEmit: true, skipLibCheck: true, composite: false, declaration: false });
const checker = program.getTypeChecker();
const printer = ts.createPrinter({ removeComments: true });
function visible(m) {
    return !m.modifiers?.some(t => t.kind === ts.SyntaxKind.PrivateKeyword || t.kind === ts.SyntaxKind.ProtectedKeyword) && !m.name?.getText().startsWith('#') && !ts.getJSDocDeprecatedTag(m);
}
function declaration(n) {
    let projected = n;
    if (ts.isClassDeclaration(n)) projected = ts.factory.updateClassDeclaration(n, n.modifiers, n.name, n.typeParameters, n.heritageClauses, n.members.filter(visible));
    if (ts.isInterfaceDeclaration(n)) projected = ts.factory.updateInterfaceDeclaration(n, n.modifiers, n.name, n.typeParameters, n.heritageClauses, n.members.filter(visible));
    if (ts.isVariableDeclaration(n)) return `export declare ${n.parent.flags & ts.NodeFlags.Const ? 'const' : n.parent.flags & ts.NodeFlags.Let ? 'let' : 'var'} ${printer.printNode(ts.EmitHint.Unspecified, n, n.getSourceFile())};`;
    return printer.printNode(ts.EmitHint.Unspecified, projected, n.getSourceFile());
}
function resolve(o) {
    if (o.origin === 'module-augmentation') {
        const file = program.getSourceFile(built(o.source));
        const nodes = [];
        function walk(n) {
            if (n.name?.getText(file) === o.symbol && (ts.isInterfaceDeclaration(n) || ts.isClassDeclaration(n) || ts.isTypeAliasDeclaration(n))) nodes.push(n);
            ts.forEachChild(n, walk);
        }
        walk(file);
        assert(nodes.length, o.id);
        return nodes;
    }
    const file = program.getSourceFile(built(entryMap.get(o.entry).source));
    const module = checker.getSymbolAtLocation(file);
    let symbol = module && checker.getExportsOfModule(module).find(s => s.name === o.symbol);
    if (!symbol) return null;
    while (symbol.flags & ts.SymbolFlags.Alias) symbol = checker.getAliasedSymbol(symbol);
    return symbol.declarations?.filter(n => !ts.isImportSpecifier(n) && !ts.isExportSpecifier(n)) ?? null;
}
const unresolved = [];
let changed = 0;
for (const o of objects) {
    const nodes = resolve(o);
    if (!nodes?.length) { unresolved.push({ id: o.id, source: o.source, entry: o.entry, symbol: o.symbol }); continue; }
    const rel = mappings.get(o.owner);
    const file = path.join(source, rel);
    let body = fs.readFileSync(file, 'utf8');
    const header = `## ${o.section}\n`;
    const start = body.indexOf(header);
    assert(start >= 0, o.id);
    let end = body.indexOf('\n## ', start + header.length);
    if (end < 0) end = body.length;
    let section = body.slice(start, end);
    const before = section;
    const declarations = nodes.map(declaration);
    const origins = [...new Set(nodes.map(n => path.relative(checkout, n.getSourceFile().fileName)))];
    const fragments = nodes.map((n, index) => ({ declaration: declarations[index], origin: path.relative(checkout, n.getSourceFile().fileName) }));
    const text = declarations.join('\n\n');
    const first = section.match(/```text\n([\s\S]*?)\n```/);
    const rendered = origins.length < 2 ? `\`\`\`text\n${text}\n\`\`\`` : fragments.map(fragment => {
        let directory = path.dirname(path.join(checkout, fragment.origin));
        while (!fs.existsSync(path.join(directory, 'package.json')) && directory !== checkout) directory = path.dirname(directory);
        const pkg = JSON.parse(fs.readFileSync(path.join(directory, 'package.json'))).name;
        const side = fragment.origin.includes('/client/') ? 'Client' : 'Host 或该包声明的共享编译面';
        return `声明来源包 \`${pkg}\`，适用 ${side}；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。\n\n\`\`\`text\n${fragment.declaration}\n\`\`\``;
    }).join('\n\n');
    if (first) section = section.replace(first[0], rendered);
    else if (/公开类型：`[^\n]*`。/.test(section)) section = section.replace(/公开类型：`[^\n]*`。/, `完整公开声明：\n\n${rendered}`);
    else if (/公开类型：[^\n]*\n/.test(section)) section = section.replace(/公开类型：[^\n]*\n/, `完整公开声明：\n\n${rendered}\n`);
    else section = section.replace(header, header + '\n完整公开声明：\n\n' + rendered + '\n\n');
    const table = section.match(/\| 成员 \| (?:公开类型|类型|公开声明)[^\n]*\n\|[^\n]*\n(?:\|[^\n]*\n)+/);
    if (table) section = section.replace(table[0], '字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。\n');
    // 旧候选简写只用于定位；不允许其继续与恢复的完整声明冲突。
    section = section.replace(/公开类型：`[^\n]*`。/, '类型、值空间与调用形式以上方完整声明为准。');
    if (section !== before) {
        body = body.slice(0, start) + section + body.slice(end);
        fs.writeFileSync(file, body);
        observations.fixes.push({ id: o.id, source: rel, origin: origins, old: first?.[1] ?? before.match(/公开类型：`([^\n]*)`。/)?.[1] ?? '', declaration: text, ...(origins.length > 1 ? { fragments } : {}) });
        changed++;
    }
}
fs.writeFileSync(path.join(evidence, 'api-declaration-observations.json'), JSON.stringify(observations, null, 4) + '\n');
fs.writeFileSync(path.join(evidence, 'api-unresolved.json'), JSON.stringify(unresolved, null, 4) + '\n');
console.log(JSON.stringify({ objects: objects.length, changed, unresolved }));
