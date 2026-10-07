#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { pathToFileURL } from "node:url";
import {
    listFiles,
    resolveInside,
    sha256File,
} from "./skill-build-contract.mjs";
import { validateSkillSource } from "./validate-skill-source.mjs";

const fencePattern = /^```[^\n]*\n.*?^```\s*$/gms;
const textDecoder = new TextDecoder("utf-8", { fatal: true });

function readUtf8Text(path) {
    const buffer = readFileSync(path);
    if (buffer.includes(0)) return null;
    try {
        return textDecoder.decode(buffer);
    } catch {
        return null;
    }
}

function parseYamlScalar(raw, label) {
    if (raw.startsWith('"')) {
        try {
            const parsed = JSON.parse(raw);
            if (typeof parsed !== "string")
                throw new Error(`${label} must be a string.`);
            return parsed;
        } catch (error) {
            throw new Error(
                `${label} has invalid quoted YAML: ${error.message}`,
            );
        }
    }
    if (raw.startsWith("'")) {
        if (!raw.endsWith("'") || raw.length < 2) {
            throw new Error(`${label} has invalid quoted YAML.`);
        }
        return raw.slice(1, -1).replaceAll("''", "'");
    }
    if (raw === "true") return true;
    if (raw === "false") return false;
    if (raw === "null" || raw === "~") return null;
    if (/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(raw)) return Number(raw);
    if (/^[!&*|>{[]/.test(raw)) {
        throw new Error(`${label} uses unsupported YAML syntax.`);
    }
    if (raw.includes(": ") || /\s#/.test(raw)) {
        throw new Error(`${label} must quote this YAML string.`);
    }
    return raw;
}

function parseSimpleYamlMapping(text, label) {
    if (text.includes("\t")) throw new Error(`${label} contains a tab.`);
    const root = Object.create(null);
    const stack = [{ indent: -4, value: root }];
    for (const [index, line] of text.split(/\r?\n/).entries()) {
        if (line.trim() === "" || line.trimStart().startsWith("#")) continue;
        const match = /^( *)([A-Za-z_][A-Za-z0-9_-]*):(?: +(.*))?$/.exec(line);
        if (!match) {
            throw new Error(
                `${label}:${index + 1} is not a supported mapping.`,
            );
        }
        const indent = match[1].length;
        if (indent % 4 !== 0) {
            throw new Error(
                `${label}:${index + 1} must use four-space indentation.`,
            );
        }
        while (stack.at(-1).indent >= indent) stack.pop();
        const parent = stack.at(-1);
        if (!parent || indent !== parent.indent + 4) {
            throw new Error(`${label}:${index + 1} has invalid indentation.`);
        }
        const key = match[2];
        if (Object.hasOwn(parent.value, key)) {
            throw new Error(`${label}:${index + 1} duplicates ${key}.`);
        }
        const raw = match[3];
        if (raw === undefined || raw === "") {
            const child = Object.create(null);
            parent.value[key] = child;
            stack.push({ indent, value: child });
        } else {
            parent.value[key] = parseYamlScalar(raw, `${label}:${index + 1}`);
        }
    }
    return root;
}

function validateEntrypoint(entrypoint, errors) {
    const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(entrypoint);
    if (!match) {
        errors.push("SKILL.md: missing or unclosed YAML frontmatter");
        return;
    }
    try {
        const frontmatter = parseSimpleYamlMapping(
            match[1],
            "SKILL.md frontmatter",
        );
        if (frontmatter.name !== "dsh-plugin-development") {
            errors.push("SKILL.md: name must be dsh-plugin-development");
        }
        if (
            typeof frontmatter.description !== "string" ||
            frontmatter.description.trim() === ""
        ) {
            errors.push("SKILL.md: description must be a non-empty string");
        }
    } catch (error) {
        errors.push(`SKILL.md: ${error.message}`);
    }
}

function validateMetadata(metadata, errors) {
    try {
        const parsed = parseSimpleYamlMapping(metadata, "agents/openai.yaml");
        if (
            !parsed.interface ||
            typeof parsed.interface !== "object" ||
            Array.isArray(parsed.interface)
        ) {
            errors.push("agents/openai.yaml: interface must be a mapping");
            return;
        }
        for (const field of [
            "display_name",
            "short_description",
            "default_prompt",
        ]) {
            const value = parsed.interface[field];
            if (typeof value !== "string" || value.trim() === "") {
                errors.push(
                    `agents/openai.yaml: interface.${field} must be a non-empty string`,
                );
            }
        }
    } catch (error) {
        errors.push(`agents/openai.yaml: ${error.message}`);
    }
}

function markdownAnchors(text) {
    const anchors = new Set();
    const counts = new Map();
    for (const match of text
        .replace(fencePattern, "")
        .matchAll(/^#{1,6}\s+(.+?)\s*#*$/gm)) {
        const slug = match[1]
            .replace(/<[^>]*>/g, "")
            .toLowerCase()
            .split("")
            .filter((character) => /[\p{L}\p{N}\p{M} _-]/u.test(character))
            .join("")
            .replaceAll(" ", "-");
        const count = counts.get(slug) ?? 0;
        counts.set(slug, count + 1);
        anchors.add(count === 0 ? slug : `${slug}-${count}`);
    }
    return anchors;
}

function validateMarkdown(root, path, errors) {
    const text = readFileSync(path, "utf8");
    for (const match of text.matchAll(/^```json\s*\n(.*?)^```\s*$/gms)) {
        try {
            JSON.parse(match[1]);
        } catch (error) {
            errors.push(`${path}: invalid JSON fence: ${error.message}`);
        }
    }
    for (const match of text
        .replace(fencePattern, "")
        .matchAll(/\]\(([^)]+)\)/g)) {
        const url = match[1];
        if (/^\w+:/.test(url)) continue;
        const [filename, encodedAnchor] = url.split("#", 2);
        const target = filename
            ? resolveInside(
                  root,
                  join(
                      dirname(path.slice(root.length + 1)),
                      decodeURIComponent(filename),
                  ),
                  "Markdown link",
              )
            : path;
        if (!existsSync(target)) {
            errors.push(`${path}: missing local link ${url}`);
        } else if (encodedAnchor && extname(target) === ".md") {
            const anchor = decodeURIComponent(encodedAnchor);
            if (!markdownAnchors(readFileSync(target, "utf8")).has(anchor)) {
                errors.push(`${path}: missing anchor ${url}`);
            }
        }
    }
}

export function verifyGeneratedSkill(targetArgument) {
    const target = validateSkillSource(targetArgument);
    if (target.manifest.status !== "frozen") {
        throw new Error(
            "Build verification requires a frozen skill-source manifest.",
        );
    }
    if (!existsSync(target.generatedSkillPath)) {
        throw new Error(
            `Missing generated Skill: ${target.generatedSkillPath}`,
        );
    }
    const expected = new Map(
        target.manifest.files.map((entry) => [entry.output, entry]),
    );
    const actual = listFiles(target.generatedSkillPath);
    for (const output of actual) {
        if (!expected.has(output))
            throw new Error(`Unexpected generated file: ${output}`);
    }
    for (const [output, entry] of expected) {
        const generated = resolveInside(
            target.generatedSkillPath,
            output,
            "generated output",
        );
        if (!existsSync(generated))
            throw new Error(`Missing generated file: ${output}`);
        if (sha256File(generated) !== entry.sha256) {
            throw new Error(
                `Generated file differs from frozen source: ${output}`,
            );
        }
    }

    const errors = [];
    for (const output of actual) {
        const path = resolveInside(
            target.generatedSkillPath,
            output,
            "generated output",
        );
        const text = readUtf8Text(path);
        if (text === null) continue;
        const offlineBoundaryText =
            extname(path) === ".md"
                ? text
                      .replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1\s*$/gm, "")
                      .replace(/`[^`\n]*`/g, "")
                : text;
        if (
            /https?:\/\/|\/(?:Users|Volumes)\/|[A-Za-z]:[\\/]Users[\\/]/.test(
                offlineBoundaryText,
            )
        ) {
            errors.push(`${output}: offline or local-path boundary violation`);
        }
        if (/[\t ]+$/m.test(text))
            errors.push(`${output}: trailing whitespace`);
        if (extname(path) === ".md")
            validateMarkdown(target.generatedSkillPath, path, errors);
    }

    const entrypoint = readFileSync(
        join(target.generatedSkillPath, "SKILL.md"),
        "utf8",
    );
    validateEntrypoint(entrypoint, errors);
    if (!entrypoint.includes(target.provenance.tag)) {
        errors.push(`SKILL.md: missing target tag ${target.provenance.tag}`);
    }
    const sourceMap = readFileSync(
        join(target.generatedSkillPath, "maintenance", "source-map.md"),
        "utf8",
    );
    for (const value of [target.provenance.tag, target.provenance.commit]) {
        if (!sourceMap.includes(value))
            errors.push(`source-map.md: missing ${value}`);
    }
    const metadata = readFileSync(
        join(target.generatedSkillPath, "agents", "openai.yaml"),
        "utf8",
    );
    validateMetadata(metadata, errors);
    if (errors.length > 0) throw new Error(errors.join("\n"));
    return {
        files: actual.length,
        markdown: actual.filter((file) => file.endsWith(".md")).length,
    };
}

function main() {
    if (process.argv.length !== 3) {
        throw new Error(
            "Usage: verify-generated-skill.mjs <prepared-target-path>",
        );
    }
    const result = verifyGeneratedSkill(process.argv[2]);
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
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
