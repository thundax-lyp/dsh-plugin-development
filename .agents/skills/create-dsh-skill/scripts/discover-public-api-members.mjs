#!/usr/bin/env node

import { existsSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";
import {
    assertIdentity,
    loadTarget,
    readJson,
    writeJsonAtomic,
} from "./skill-build-contract.mjs";

function typeTarget(value) {
    if (typeof value === "string") return value;
    if (!value || typeof value !== "object") return null;
    if (typeof value.types === "string") return value.types;
    for (const nested of Object.values(value)) {
        const found = typeTarget(nested);
        if (found) return found;
    }
    return null;
}

function sourceFor(checkoutPath, candidate) {
    const packageRoot = dirname(candidate.path);
    const subpath =
        candidate.subpath === "."
            ? "index"
            : candidate.subpath.replace(/^\.\//, "");
    const typePath = typeTarget(candidate.declaration);
    const possibilities = [];
    if (typePath && !typePath.includes("*")) {
        const clean = typePath.replace(/^\.\//, "");
        possibilities.push(clean);
        possibilities.push(
            clean
                .replace(/^lib\/types\//, "src/")
                .replace(/\.d\.[cm]?ts$/, ".ts"),
        );
    }
    possibilities.push(
        `src/${subpath}.ts`,
        `src/${subpath}.tsx`,
        `src/${subpath}/index.ts`,
        `src/${subpath}/index.tsx`,
    );
    for (const path of possibilities) {
        const full = resolve(checkoutPath, packageRoot, path);
        if (
            full.startsWith(`${resolve(checkoutPath)}/`) &&
            existsSync(full) &&
            /\.[cm]?[jt]sx?$/.test(full)
        ) {
            return full;
        }
    }
    return null;
}

export function discoverPublicApiMembers(target) {
    const entriesPath = join(target.evidencePath, "api-entry-candidates.json");
    const entries = readJson(entriesPath);
    assertIdentity(entries, target.provenance, "API entry candidates");
    const roots = new Map(
        entries.candidates.map((entry) => [
            entry.id,
            sourceFor(target.checkoutPath, entry),
        ]),
    );
    const sourceFiles = [...new Set([...roots.values()].filter(Boolean))];
    const program = ts.createProgram(sourceFiles, {
        allowImportingTsExtensions: true,
        noEmit: true,
        skipLibCheck: true,
        module: ts.ModuleKind.ESNext,
        moduleResolution: ts.ModuleResolutionKind.Bundler,
        target: ts.ScriptTarget.ESNext,
        jsx: ts.JsxEmit.ReactJSX,
    });
    const checker = program.getTypeChecker();
    const output = [];
    for (const entry of entries.candidates) {
        const root = roots.get(entry.id);
        if (!root) {
            output.push({
                entry: entry.id,
                source: null,
                status: "unresolved",
                symbols: [],
            });
            continue;
        }
        const file = program.getSourceFile(root);
        const module = file && checker.getSymbolAtLocation(file);
        if (!module) {
            output.push({
                entry: entry.id,
                source: relative(target.checkoutPath, root),
                status: "unresolved",
                symbols: [],
            });
            continue;
        }
        const symbols = checker.getExportsOfModule(module).map((exported) => {
            const symbol =
                exported.flags & ts.SymbolFlags.Alias
                    ? checker.getAliasedSymbol(exported)
                    : exported;
            const declaration =
                symbol.valueDeclaration ??
                symbol.declarations?.[0] ??
                exported.declarations?.[0];
            const source =
                declaration &&
                relative(
                    target.checkoutPath,
                    declaration.getSourceFile().fileName,
                ).replaceAll("\\", "/");
            const ownFiles = new Set(
                (symbol.declarations ?? []).map(
                    (item) => item.getSourceFile().fileName,
                ),
            );
            const deprecated = [
                ...exported.getJsDocTags(checker),
                ...symbol.getJsDocTags(checker),
            ].some((tag) => tag.name === "deprecated");
            let members = [];
            let signature = "unknown";
            try {
                const type = checker.getDeclaredTypeOfSymbol(symbol);
                signature = checker.typeToString(type);
                members = checker
                    .getPropertiesOfType(type)
                    .flatMap((member) => {
                        const memberDeclaration = (
                            member.declarations ?? []
                        ).find((item) =>
                            ownFiles.has(item.getSourceFile().fileName),
                        );
                        if (!memberDeclaration) return [];
                        // TypeScript encodes computed symbol keys as unstable __@ names.
                        // Their semantics require manual source review, not a fake API name.
                        if (member.getName().startsWith("__@")) return [];
                        const modifiers =
                            ts.getCombinedModifierFlags(memberDeclaration);
                        if (
                            modifiers &
                                (ts.ModifierFlags.Private |
                                    ts.ModifierFlags.Protected) ||
                            member.getName().startsWith("#")
                        )
                            return [];
                        return [
                            {
                                name: member.getName(),
                                signature: checker.typeToString(
                                    checker.getTypeOfSymbolAtLocation(
                                        member,
                                        memberDeclaration,
                                    ),
                                ),
                                deprecated: member
                                    .getJsDocTags(checker)
                                    .some((tag) => tag.name === "deprecated"),
                            },
                        ];
                    });
            } catch {
                members = [];
            }
            return {
                name: exported.getName(),
                signature,
                deprecated,
                source: source && !source.startsWith("../") ? source : null,
                members: members.sort((a, b) => a.name.localeCompare(b.name)),
            };
        });
        output.push({
            entry: entry.id,
            source: relative(target.checkoutPath, root).replaceAll("\\", "/"),
            status: "resolved",
            symbols: symbols.sort((a, b) => a.name.localeCompare(b.name)),
        });
    }
    return {
        schemaVersion: 1,
        version: target.provenance.version,
        tag: target.provenance.tag,
        commit: target.provenance.commit,
        remote: target.provenance.remote,
        entries: output,
    };
}

function main() {
    if (
        process.argv.length < 3 ||
        process.argv.length > 4 ||
        (process.argv.length === 4 && process.argv[3] !== "--refresh")
    )
        throw new Error(
            "Usage: discover-public-api-members.mjs <prepared-target-path> [--refresh]",
        );
    const target = loadTarget(process.argv[2]);
    const result = discoverPublicApiMembers(target);
    const path = join(target.evidencePath, "api-symbol-candidates.json");
    if (existsSync(path)) {
        const previous = readJson(path);
        assertIdentity(
            previous,
            target.provenance,
            "Existing API symbol candidates",
        );
        if (
            JSON.stringify(previous) !== JSON.stringify(result) &&
            process.argv[3] !== "--refresh"
        )
            throw new Error(
                `Existing API symbol candidates differ from target checkout: ${path}`,
            );
        if (process.argv[3] === "--refresh") writeJsonAtomic(path, result);
    } else writeJsonAtomic(path, result);
    process.stdout.write(
        `${JSON.stringify({ path, entries: result.entries.length, symbols: result.entries.reduce((sum, entry) => sum + entry.symbols.length, 0) }, null, 2)}\n`,
    );
}

if (
    process.argv[1] &&
    pathToFileURL(process.argv[1]).href === import.meta.url
) {
    try {
        main();
    } catch (error) {
        process.stderr.write(
            `${error instanceof Error ? error.message : String(error)}\n`,
        );
        process.exitCode = 1;
    }
}
