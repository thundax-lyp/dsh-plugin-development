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
        const target = resolveInside(
            root,
            join(
                dirname(path.slice(root.length + 1)),
                decodeURIComponent(filename),
            ),
            "Markdown link",
        );
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
        if (
            ![
                ".md",
                ".yaml",
                ".yml",
                ".json",
                ".js",
                ".mjs",
                ".ts",
                ".tsx",
            ].includes(extname(path))
        ) {
            continue;
        }
        const text = readFileSync(path, "utf8");
        if (/https?:\/\/|\/(?:Users|Volumes)\//.test(text)) {
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
    if (
        !/^---\n[\s\S]*?^name: dsh-plugin-development$[\s\S]*?^---$/m.test(
            entrypoint,
        )
    ) {
        errors.push("SKILL.md: invalid dsh-plugin-development frontmatter");
    }
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
    for (const field of [
        "interface:",
        "display_name:",
        "short_description:",
        "default_prompt:",
    ]) {
        if (!metadata.includes(field))
            errors.push(`agents/openai.yaml: missing ${field}`);
    }
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
