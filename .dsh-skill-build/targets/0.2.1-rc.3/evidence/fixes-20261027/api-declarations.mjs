import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(path.resolve('package.json'));
const ts = require('typescript');
const { builtDeclarationPath } = require('./scripts/example_type_paths.cjs');
const target = path.resolve('.dsh-skill-build/targets/0.2.1-rc.3');
// 首次生成后保留原问题快照；重复执行只核查，不覆盖人工补充的语义。
if (fs.existsSync(path.join(target, 'evidence/fixes-20261027/api-declaration-observations.json')) && !process.argv.includes('--refresh-origins')) {
    await import('./api-verify.mjs');
    process.exit(0);
}
const checkout = path.join(target, 'checkout');
const source = path.join(target, 'skill-source');
const surface = JSON.parse(fs.readFileSync(path.join(source, 'api-surface.json')));
const manifest = JSON.parse(fs.readFileSync(path.join(source, 'manifest.json')));
const entries = JSON.parse(fs.readFileSync(path.join(target, 'evidence/api-symbol-candidates.json'))).entries;
const entryMap = new Map(entries.map(e => [e.entry, e]));
const files = manifest.files.filter(f => f.source.startsWith('api-guardrails/client-'));
const clientOwners = new Set(files.map(f => f.output));
const clientObjects = surface.objects.filter(o => o.decision === 'included' && clientOwners.has(o.owner));
const prior = fs.existsSync(path.join(target, 'evidence/fixes-20261027/api-declaration-observations.json')) ? JSON.parse(fs.readFileSync(path.join(target, 'evidence/fixes-20261027/api-declaration-observations.json'))) : null;
const hostFiles = manifest.files.filter(f => f.source.startsWith('api-guardrails/capabilities-') && (fs.readFileSync(path.join(source, f.source), 'utf8').includes('string（由包提供的只读文本常量') || prior?.fixes.some(r => r.source === f.source)));
const hostOwners = new Set(hostFiles.map(f => f.output));
const hostObjects = surface.objects.filter(o => {
    if (o.decision !== 'included' || !hostOwners.has(o.owner)) return false;
    const f = hostFiles.find(f => f.output === o.owner);
    const body = fs.readFileSync(path.join(source, f.source), 'utf8');
    const section = body.split('## ' + o.section + '\n')[1]?.split('\n## ')[0];
    return section?.includes('string（由包提供的只读文本常量') || prior?.fixes.some(r => r.id === o.id);
});
const config = ts.readConfigFile(path.join(checkout, 'tsconfig.base.client.json'), ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, checkout);
const paths = Object.fromEntries(Object.entries(parsed.options.paths).map(([k, ps]) => [k, ps.map(p => builtDeclarationPath(p))]));
function declarationPath(p) {
    let r = p.replace('/src/', '/lib/types/').replace(/\.tsx?$/, '.d.ts');
    if (fs.existsSync(path.join(checkout, r))) return path.join(checkout, r);
    if (fs.existsSync(path.join(checkout, p))) return path.join(checkout, p);
    throw new Error(`缺少声明 ${p}`);
}
const roots = [...new Set([...clientObjects, ...hostObjects].map(o => declarationPath(entryMap.get(o.entry).source)))];
const program = ts.createProgram(roots, { ...parsed.options, paths, baseUrl: checkout, skipLibCheck: true, noEmit: true, composite: false, declaration: false });
const checker = program.getTypeChecker();
const printer = ts.createPrinter({ removeComments: true });
function resolve(o) {
    const root = declarationPath(entryMap.get(o.entry).source);
    const sf = program.getSourceFile(root);
    const module = checker.getSymbolAtLocation(sf);
    let symbol = checker.getExportsOfModule(module).find(s => s.name === o.symbol);
    if (!symbol) throw new Error(`没有公开声明 ${o.id}`);
    while (symbol.flags & ts.SymbolFlags.Alias) symbol = checker.getAliasedSymbol(symbol);
    const declarations = symbol.declarations?.filter(d => !ts.isImportSpecifier(d) && !ts.isExportSpecifier(d));
    if (!declarations?.length) throw new Error(`无法追踪声明 ${o.id}`);
    return { symbol, declarations, root };
}
const resolved = new Map([...clientObjects, ...hostObjects].map(o => [o.id, resolve(o)]));
if (process.argv.includes('--refresh-origins')) {
    for (const record of prior.fixes) record.origin = [...new Set(resolved.get(record.id).declarations.map(d => path.relative(checkout, d.getSourceFile().fileName)))];
    fs.writeFileSync(path.join(target, 'evidence/fixes-20261027/api-declaration-observations.json'), JSON.stringify(prior, null, 4) + '\n');
    process.exit(0);
}
const normalize = s => s.replace(/\s+/g, ' ').trim();
function visible(m) {
    return !m.modifiers?.some(t => t.kind === ts.SyntaxKind.PrivateKeyword || t.kind === ts.SyntaxKind.ProtectedKeyword) && !m.name?.getText().startsWith('#') && !ts.getJSDocDeprecatedTag(m);
}
function publicNode(n) {
    if (ts.isClassDeclaration(n)) return ts.factory.updateClassDeclaration(n, n.modifiers, n.name, n.typeParameters, n.heritageClauses, n.members.filter(visible));
    if (ts.isInterfaceDeclaration(n)) return ts.factory.updateInterfaceDeclaration(n, n.modifiers, n.name, n.typeParameters, n.heritageClauses, n.members.filter(visible));
    return n;
}
function printDeclaration(n) {
    if (ts.isVariableDeclaration(n)) {
        return `export declare ${n.parent.flags & ts.NodeFlags.Const ? 'const' : n.parent.flags & ts.NodeFlags.Let ? 'let' : 'var'} ${printer.printNode(ts.EmitHint.Unspecified, n, n.getSourceFile())};`;
    }
    return printer.printNode(ts.EmitHint.Unspecified, publicNode(n), n.getSourceFile());
}
function declarationText(r) { return r.declarations.map(printDeclaration).join('\n\n'); }
function memberRows(r) {
    return r.declarations.flatMap(d => (ts.isClassDeclaration(d) || ts.isInterfaceDeclaration(d)) ? [...d.members].filter(visible).map(m => {
        const name = ts.isConstructorDeclaration(m) ? 'constructor' : m.name?.getText();
        return name ? `| \`${name}\` | \`${printer.printNode(ts.EmitHint.Unspecified, m, m.getSourceFile()).replace(/\s+/g, ' ').replace(/\|/g, '\\|').replace(/`/g, '\\`')}\` |` : null;
    }).filter(Boolean) : []);
}
function anchor(section) { return section.toLowerCase().replace(/[^\p{L}\p{N}_ -]/gu, '').replace(/ /g, '-'); }
const fixes = [];
const aliases = [];
const anyAudit = [];
for (const f of files) {
    let body = fs.readFileSync(path.join(source, f.source), 'utf8');
    const objects = clientObjects.filter(o => o.owner === f.output);
    for (const o of objects) {
        const r = resolved.get(o.id);
        const sectionPattern = new RegExp(`(^## ${o.section.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\n)([\\s\\S]*?)(?=^## |$(?![\\s\\S]))`, 'm');
        const match = body.match(sectionPattern);
        if (!match) throw new Error(`找不到对象小节 ${o.id}`);
        let section = match[2];
        const before = section;
        const first = section.match(/```text\n([\s\S]*?)\n```/);
        if (!first) throw new Error(`缺少契约 ${o.id}`);
        const origin = r.declarations[0].getSourceFile().fileName;
        const authority = clientObjects.find(other => other.id !== o.id && resolved.get(other.id).symbol === r.symbol && other.source.replace('/src/', '/lib/types/').replace(/\.tsx?$/, '.d.ts') === path.relative(checkout, origin) && other.owner !== o.owner);
        // 只对无法展开的裸 any alias 改成相对链接；原对象页继续维护完整契约。
        if (first[1].trim() === 'any' && authority) {
            const rel = path.posix.relative(path.posix.dirname(o.owner), authority.owner);
            section = section.replace(first[0], `此入口是重导出，完整泛型、成员与调用契约见 [${authority.symbol} 权威契约](${rel}#${anchor(authority.section)})；本入口不另定义类型。`);
            aliases.push({ id: o.id, authority: authority.id });
        } else {
            section = section.replace(first[0], `\`\`\`text\n${declarationText(r)}\n\`\`\``);
        }
        const table = section.match(/\| 成员 \| 公开类型 \|\n\| --- \| --- \|\n(?:\|[^\n]*\n)+/);
        if (table) {
            const rows = memberRows(r);
            section = section.replace(table[0], rows.length ? `| 成员 | 公开声明 |\n| --- | --- |\n${rows.join('\n')}\n` : '成员及调用形式以上方完整声明或权威链接为准。\n');
        }
        // 同文件依赖块来自旧源码提取器；直接保留其中的显式源码声明，后续独立检查覆盖其一致性。
        if (section !== before) {
            body = body.replace(match[0], match[1] + section);
            fixes.push({ id: o.id, source: f.source, origin: [...new Set(r.declarations.map(d => path.relative(checkout, d.getSourceFile().fileName)))], old: first[1], declaration: declarationText(r) });
        }
        if (/\bany\b/.test(before)) anyAudit.push({ id: o.id, origin: path.relative(checkout, origin), resolution: first[1].trim() === 'any' && authority ? 'alias-to-authority' : /\bany\b/.test(declarationText(r)) ? 'upstream-explicit-any' : 'restored-concrete-declaration', declaration: declarationText(r) });
    }
    if (body !== fs.readFileSync(path.join(source, f.source), 'utf8')) fs.writeFileSync(path.join(source, f.source), body);
}
for (const f of hostFiles) {
    let body = fs.readFileSync(path.join(source, f.source), 'utf8');
    for (const o of hostObjects.filter(o => o.owner === f.output)) {
        const sectionPattern = new RegExp(`(^## ${o.section.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\n)([\\s\\S]*?)(?=^## |$(?![\\s\\S]))`, 'm');
        const match = body.match(sectionPattern);
        if (!match || !match[2].includes('string（由包提供的只读文本常量')) continue;
        const r = resolved.get(o.id);
        const replacement = `公开声明（保留类型空间与值空间）：\n\n\`\`\`text\n${declarationText(r)}\n\`\`\`\n\n${r.symbol.flags & ts.SymbolFlags.Type && r.symbol.flags & ts.SymbolFlags.Value ? '同名导出同时提供类型与运行时值；使用 `import type` 引入配置类型，使用普通 `import` 引入运行时 schema，不能当作文本常量。' : '这是上方声明的公开对象；按实际类型使用，不把它当作文本常量。'}`;
        const section = match[2].replace('公开类型：`string（由包提供的只读文本常量；消费方引用导出，不复制其正文）`。', replacement);
        body = body.replace(match[0], match[1] + section);
        fixes.push({ id: o.id, source: f.source, origin: r.declarations.map(d => path.relative(checkout, d.getSourceFile().fileName)), declaration: declarationText(r), typeSpace: !!(r.symbol.flags & ts.SymbolFlags.Type), valueSpace: !!(r.symbol.flags & ts.SymbolFlags.Value) });
    }
    fs.writeFileSync(path.join(source, f.source), body);
}
fs.writeFileSync(path.join(target, 'evidence/fixes-20261027/api-declaration-observations.json'), JSON.stringify({ fixes, aliases, anyAudit }, null, 4) + '\n');
console.log(JSON.stringify({ clientObjects: clientObjects.length, hostFiles: hostFiles.length, fixes: fixes.length, aliases: aliases.length, anyAudit: anyAudit.length }));
