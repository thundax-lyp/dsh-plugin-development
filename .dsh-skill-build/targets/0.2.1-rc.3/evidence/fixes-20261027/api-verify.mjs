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
const skillIndex = process.argv.indexOf('--skill');
const skillRoot = skillIndex < 0 ? null : path.resolve(process.argv[skillIndex + 1] ?? (() => { throw new Error('--skill 需要路径'); })());
const manifest = JSON.parse(fs.readFileSync(path.join(source, 'manifest.json')));
function readSource(relative) {
    if (!skillRoot) return fs.readFileSync(path.join(source, relative), 'utf8');
    const mapping = manifest.files.find(f => f.source === relative);
    assert(mapping, `缺少素材输出映射 ${relative}`);
    return fs.readFileSync(path.join(skillRoot, mapping.output), 'utf8');
}

const observations = JSON.parse(fs.readFileSync(path.join(target, 'evidence/fixes-20261027/api-declaration-observations.json')));
const surface = JSON.parse(fs.readFileSync(path.join(source, 'api-surface.json')));
const normalized = s => s.replace(/\s+/g, ' ').trim();
const printer = ts.createPrinter({ removeComments: true });
const declarationCache = new Map();
function visible(member) {
    return !member.modifiers?.some(mod => mod.kind === ts.SyntaxKind.PrivateKeyword || mod.kind === ts.SyntaxKind.ProtectedKeyword)
        && !member.name?.getText().startsWith('#') && !ts.getJSDocDeprecatedTag(member);
}
function exactPublicDeclarations(origin) {
    if (declarationCache.has(origin)) return declarationCache.get(origin);
    const file = ts.createSourceFile(origin, fs.readFileSync(path.join(checkout, origin), 'utf8'), ts.ScriptTarget.Latest, true);
    const declarations = [];
    function walk(node) {
        let projected = node;
        if (ts.isClassDeclaration(node)) projected = ts.factory.updateClassDeclaration(node, node.modifiers, node.name, node.typeParameters, node.heritageClauses, node.members.filter(visible));
        if (ts.isInterfaceDeclaration(node)) projected = ts.factory.updateInterfaceDeclaration(node, node.modifiers, node.name, node.typeParameters, node.heritageClauses, node.members.filter(visible));
        if (ts.isVariableDeclaration(node)) declarations.push(normalized(`export declare ${node.parent.flags & ts.NodeFlags.Const ? 'const' : node.parent.flags & ts.NodeFlags.Let ? 'let' : 'var'} ${printer.printNode(ts.EmitHint.Unspecified, node, file)};`));
        else if (ts.isClassDeclaration(node) || ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node) || ts.isFunctionDeclaration(node) || ts.isEnumDeclaration(node) || ts.isModuleDeclaration(node)) declarations.push(normalized(printer.printNode(ts.EmitHint.Unspecified, projected, file)));
        ts.forEachChild(node, walk);
    }
    walk(file);
    declarationCache.set(origin, declarations);
    return declarations;
}
function contractStatements(text) {
    const file = ts.createSourceFile('contract.d.ts', text, ts.ScriptTarget.Latest, true);
    return [...file.statements].map(s => normalized(printer.printNode(ts.EmitHint.Unspecified, s, file)).replace(/\b(?:export|declare)\s+/g, ''));
}
function tokens(text) {
    const scanner = ts.createScanner(ts.ScriptTarget.Latest, true, ts.LanguageVariant.Standard, text);
    const result = [];
    for (let token = scanner.scan(); token !== ts.SyntaxKind.EndOfFileToken; token = scanner.scan()) result.push([token, token === ts.SyntaxKind.StringLiteral ? scanner.getTokenValue() : scanner.getTokenText()]);
    return JSON.stringify(result);
}
let checked = 0;
for (const record of observations.fixes) {
    const o = surface.objects.find(o => o.id === record.id);
    const body = readSource(record.source);
    const section = body.split(`## ${o.section}\n`)[1]?.split('\n## ')[0];
    assert(section, record.id);
    const alias = observations.aliases.find(a => a.id === record.id);
    if (alias) {
        const authority = surface.objects.find(o => o.id === alias.authority);
        assert(section.includes(path.posix.basename(authority.owner) + '#'), record.id);
        assert(!/```text\nany\n```/.test(section), record.id);
        const map = manifest.files.find(f => f.output === authority.owner);
        assert(map, authority.owner);
        const authorityBody = readSource(map.source);
        const authoritySection = authorityBody.split(`## ${authority.section}\n`)[1]?.split('\n## ')[0];
        assert(authoritySection, authority.id);
        const authoritative = [...authoritySection.matchAll(/```(?:text|ts|typescript)\n([\s\S]*?)\n```/g)].flatMap(m => contractStatements(m[1])).map(tokens);
        for (const contract of contractStatements(record.declaration)) assert(authoritative.includes(tokens(contract)), `重导出权威声明与真实签名不一致 ${record.id}`);

    } else {
        for (const fragment of record.fragments ?? [{ declaration: record.declaration }]) assert(section.includes(fragment.declaration), `声明改变或被截断 ${record.id}`);
    }
    const origins = Array.isArray(record.origin) ? record.origin : [record.origin];
    for (const origin of origins) assert(fs.existsSync(path.join(checkout, origin)), origin);
    const exact = origins.flatMap(exactPublicDeclarations);
    const emitted = ts.createSourceFile('expected.d.ts', record.declaration, ts.ScriptTarget.Latest, true);
    for (const statement of emitted.statements) {
        const contract = normalized(printer.printNode(ts.EmitHint.Unspecified, statement, emitted));
        assert(exact.some(s => s === contract), `当前真实声明与恢复记录不一致 ${record.id}`);
    }
    assert(!/\.\.\.\s*\d+ more|SlotComponent\.\.\./.test(record.declaration), record.id);
    checked++;
}
const memberOwnership = JSON.parse(fs.readFileSync(path.join(target, 'evidence/fixes-20261027/api-member-ownership.json')));
const memberOriginCache = new Map();
const verifiedMemberNames = new Set();
let checkedMemberDeclarations = 0;
for (const record of memberOwnership.filter(r => r.decision === 'included')) {
    const o = surface.objects.find(o => o.id === record.id);
    const map = manifest.files.find(f => f.output === o.owner);
    assert(map, o.owner);
    const body = readSource(map.source);
    const section = body.split(`## ${o.section}\n`)[1]?.split('\n## ')[0];
    assert(section?.includes('`' + record.name + '`'), `成员索引丢失 ${record.id}.${record.name}`);
    const tableDeclaration = record.declaration.replace(/\s+/g, ' ').replace(/\|/g, '\\|').replace(/`/g, '\\`');
    assert(section.includes(tableDeclaration), `成员声明丢失 ${record.id}.${record.name}`);
    if (!memberOriginCache.has(record.origin)) {
        const file = ts.createSourceFile(record.origin, fs.readFileSync(path.join(checkout, record.origin), 'utf8'), ts.ScriptTarget.Latest, true);
        const nodes = [];
        function walk(node) {
            if (node.name && !ts.getJSDocDeprecatedTag(node)) nodes.push(normalized(printer.printNode(ts.EmitHint.Unspecified, node, file)));
            ts.forEachChild(node, walk);
        }
        walk(file);
        memberOriginCache.set(record.origin, nodes);
    }
    assert(memberOriginCache.get(record.origin).includes(normalized(record.declaration)), `实际成员声明不一致 ${record.id}.${record.name}`);
    verifiedMemberNames.add(record.id + ':' + record.name);
    checkedMemberDeclarations++;
}
const dependentDeclarations = JSON.parse(fs.readFileSync(path.join(target, 'evidence/fixes-20261027/api-dependent-declarations.json')));
let checkedDependentMembers = 0;
for (const record of dependentDeclarations) {
    const o = surface.objects.find(o => o.id === record.id);
    const section = readSource(record.source).split(`## ${o.section}\n`)[1]?.split('\n## ')[0];
    assert(section, record.id);
    for (const name of record.members) { assert(section.includes(name), `类型依赖成员未展开 ${record.id}.${name}`); checkedDependentMembers++; }
    for (const dependency of record.dependencies ?? []) {
        assert(section.includes(dependency), `类型依赖声明丢失 ${record.id}`);
        const expected = contractStatements(dependency).map(tokens);
        const actual = exactPublicDeclarations(record.origin).flatMap(contractStatements).map(tokens);
        for (const statement of expected) assert(actual.includes(statement), `类型依赖与真实声明不一致 ${record.id}`);
    }
    if (record.authority) {
        const authority = surface.objects.find(o => o.id === record.authority);
        assert(section.includes(authority.section.toLowerCase().replace(/[^\p{L}\p{N}_ -]/gu, '').replace(/ /g, '-')), record.id);
        const map = manifest.files.find(f => f.output === authority.owner);
        const authoritySection = readSource(map.source).split(`## ${authority.section}\n`)[1]?.split('\n## ')[0];
        assert(authoritySection, authority.id);
        for (const name of record.members) assert(authoritySection.includes(name), `别名父权威缺成员 ${record.id}.${name}`);
    }
}
const read = p => readSource('api-guardrails/' + p);
assert(read('client-ui-renderer-registry.md').includes("readonly register: SlotCore['register']"));
assert(read('client-resources-contract.md').includes('AsyncIterable<RemoteResult<ResourceProtocolMap[P]>>'));
assert(read('client-resources-contract.md').includes('readonly failure: RemoteFailure | undefined'));
assert(read('client-ui-primitives-form-model.md').includes('class SettingsFormModel<T>'));
assert(read('client-ui-primitives-form-model.md').includes('constructor(scope: SettingsFormScope<T>, specs: SettingsFieldSpec[], secrets?: SettingsSecretSpec[])'));
assert(read('capabilities-dsh-llm-deepseek-api-key.md').includes('export interface Config extends ProtocolConfig, ModelListingConfig'));
assert(read('capabilities-dsh-llm-deepseek-api-key.md').includes('export declare const Config:'));
const fixture = path.join(target, 'evidence/fixes-20261027/consumer-api');
fs.mkdirSync(fixture, { recursive: true });
fs.writeFileSync(path.join(fixture, 'package.json'), JSON.stringify({ private: true, type: 'module' }) + '\n');
const clientText = `import type { SlotRegistry } from '@deepseek-ai/dsh-client-ui-renderer/client';
import { SlotCore } from '@deepseek-ai/dsh-client-ui-slots';
import type { ResourceProvider } from '@deepseek-ai/dsh-client-resources/client';
import { SettingsFormModel, settingsTextField, languageForPath } from '@deepseek-ai/dsh-client-ui-primitives';
import type { SettingsFormScope } from '@deepseek-ai/dsh-client-ui-primitives';
import { defineStore } from '@deepseek-ai/dsh-client-store';
import type { BoundActions } from '@deepseek-ai/dsh-client-store';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface SlotMap { 'audit.own': { kind: 'single'; scope: 'root'; owner: { label: string } } }
    interface ResourceProtocolMap { audit: { body: string } }
}
export function ownSlot(registry: SlotRegistry) {
    const register: SlotCore['register'] = registry.register;
    return register({ name: 'audit.own' }, (props: { label: string }) => props.label);
}
export const provider: ResourceProvider<'audit'> = {
    protocol: 'audit',
    async *open(_address, context) {
        if (context.signal.aborted) return;
        yield { ok: true, value: { body: 'value' } };
    },
};
export function settings(scope: SettingsFormScope<{ title: string }>) {
    const model = new SettingsFormModel(scope, [settingsTextField('title')]);
    const snapshot = model.bind(() => ({ title: model.field('title').text, ...model.shell() }));
    const title: string = snapshot.getSnapshot().title;
    model.actions().edit('title', title);
    return { save: () => model.save(), dispose: () => model.dispose() };
}
const handle = defineStore({ init: () => ({ n: 0 }), actions: { add(draft: { n: number }, delta: number) { draft.n += delta; } } });
type Actions = BoundActions<typeof handle>;
export function call(actions: Actions): string | undefined { actions.add(1); return languageForPath('index.ts'); }
`;
const hostText = `import { Config, plainOptions } from '@deepseek-ai/dsh-llm-deepseek-api-key';
import type { Config as ConfigType } from '@deepseek-ai/dsh-llm-deepseek-api-key';
import Schema from '@deepseek-ai/schemastery';
const schema = Schema.string().required().description('Title');
const parsed: string = schema('title');
const metadata: Schemastery.Meta<string> = schema.meta;
const factories: Schemastery.Static = Schema;
export const schemaTypes = { parsed, metadata, factories };
const config: ConfigType = Config({});
export const inheritedMaxTokens: ConfigType['maxTokens'] = config.maxTokens;
export const inheritedListingTimeout: ConfigType['modelsTimeoutMs'] = config.modelsTimeoutMs;
export const credential: ConfigType['apiKeyEnv'] = config.apiKeyEnv;
export const options = plainOptions(config);
`;
const compilation = {};
for (const [side, content] of [['client', clientText], ['host', hostText]]) {
    const file = path.join(fixture, `${side}.ts`);
    fs.writeFileSync(file, content);
    const configFile = path.join(checkout, side === 'client' ? 'tsconfig.base.client.json' : 'tsconfig.base.json');
    const raw = ts.readConfigFile(configFile, ts.sys.readFile);
    const parsed = ts.parseJsonConfigFileContent(raw.config, ts.sys, checkout);
    const paths = Object.fromEntries(Object.entries(parsed.options.paths).map(([k, ps]) => [k, ps.map(p => builtDeclarationPath(p))]));
    const program = ts.createProgram([file], { ...parsed.options, paths, baseUrl: checkout, skipLibCheck: true, noEmit: true, composite: false, declaration: false, declarationMap: false, incremental: false, types: [], module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler, ignoreDeprecations: '6.0' });
    const diagnostics = ts.getPreEmitDiagnostics(program);
    compilation[side] = diagnostics.map(d => ({ file: d.file && path.relative(checkout, d.file.fileName), code: d.code, message: ts.flattenDiagnosticMessageText(d.messageText, '\n') }));
}
fs.writeFileSync(path.join(target, 'evidence/fixes-20261027/api-verification.json'), JSON.stringify({ checkedDeclarations: checked, checkedMemberDeclarations, checkedMemberNames: verifiedMemberNames.size, checkedDependentMembers, bareAnyOriginal: observations.fixes.filter(o => o.old?.trim() === 'any').length, aliases: observations.aliases.length, legitimateAny: observations.anyAudit.filter(o => o.resolution === 'upstream-explicit-any').map(o => o.id), compilation }, null, 4) + '\n');
assert.equal(compilation.client.length, 0, 'Client 独立消费者编译');
assert.equal(compilation.host.length, 0, 'Host 独立消费者编译');

console.log(JSON.stringify({ checkedDeclarations: checked, checkedMemberDeclarations, checkedMemberNames: verifiedMemberNames.size, checkedDependentMembers, hostBlocks: 0, clientBlocks: 0, aliases: observations.aliases.length, checks: { 'api-signatures': true, 'inherited-and-composed-members': true, 'alias-static-instance-dependencies': true, 're-export-authorities': true, 'no-truncated-callables': true, 'indexed-access': true, 'settings-constructor': true, 'host-schema-type-and-value': true, 'client-consumer-types': true, 'host-consumer-types': true }, consumerTypechecks: { client: true, host: true } }, null, 4));
