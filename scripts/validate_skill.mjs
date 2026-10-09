#!/usr/bin/env node

// Validate repository Markdown or one generated Skill without third-party packages.
import { execFileSync } from "node:child_process";
import {
    existsSync,
    readFileSync,
    readdirSync,
    realpathSync,
    statSync,
} from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fencePattern = /^```[^\n]*\n[\s\S]*?^```[ \t]*$/gm;
const sourcePathPattern =
    /`((?:(?:packages|docs|scripts|vendor|apps|snapshots|examples|python|native)\/[^`]+)|package\.json|AGENTS\.md|tsconfig\.client\.json|tsconfig\.host\.json|[^`]*config\.ts)`/g;

function filesUnder(root) {
    if (!existsSync(root)) return [];
    const files = [];
    function visit(directory) {
        for (const entry of readdirSync(directory, { withFileTypes: true })) {
            const path = join(directory, entry.name);
            if (entry.isDirectory()) visit(path);
            else if (entry.isFile()) files.push(path);
        }
    }
    visit(root);
    return files.sort();
}

function anchors(text) {
    const body = text.replace(fencePattern, "");
    const result = new Set(
        [...body.matchAll(/(?:id|name)=["']([^"']+)["']/g)].map(
            (match) => match[1],
        ),
    );
    const counts = new Map();
    for (const match of body.matchAll(/^#{1,6}\s+(.+?)\s*#*$/gm)) {
        const heading = match[1].replace(/<[^>]*>/g, "").toLowerCase();
        const slug = [...heading]
            .filter((character) => /[\p{L}\p{N}\p{M} _-]/u.test(character))
            .join("")
            .replaceAll(" ", "-");
        const count = counts.get(slug) ?? 0;
        counts.set(slug, count + 1);
        result.add(count ? `${slug}-${count}` : slug);
    }
    return result;
}

function offlineText(path, text) {
    if (extname(path) !== ".md") return text;
    return text.replace(fencePattern, "").replace(/`[^`\n]*`/g, "");
}

function git(args, cwd) {
    return execFileSync("git", args, {
        cwd,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
    }).trim();
}

export function validate({ root = repositoryRoot, skill, dsh } = {}) {
    root = resolve(root);
    const explicitSkill = skill !== undefined;
    const skillPath = resolve(
        skill ?? join(root, "skills/dsh-plugin-development"),
    );
    const dshPath = dsh && resolve(dsh);
    if (
        explicitSkill &&
        (!existsSync(skillPath) || !statSync(skillPath).isDirectory())
    ) {
        throw new Error(`Skill directory does not exist: ${skillPath}`);
    }
    const files = explicitSkill
        ? filesUnder(skillPath)
        : git(
              ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
              root,
          )
              .split("\0")
              .filter(Boolean)
              .filter((name) => !name.startsWith(".dsh-skill-build/"))
              .map((name) => join(root, name))
              .filter((path) => existsSync(path) && statSync(path).isFile())
              .sort();
    const display = (path) => relative(explicitSkill ? skillPath : root, path);
    const markdown = files.filter((path) => extname(path) === ".md");
    const errors = [];
    let links = 0;
    let fences = 0;
    for (const path of markdown) {
        const text = readFileSync(path, "utf8");
        for (const match of text.matchAll(
            /^```json[ \t]*\n([\s\S]*?)^```[ \t]*$/gm,
        )) {
            fences++;
            try {
                JSON.parse(match[1]);
            } catch (error) {
                errors.push(`${display(path)}: JSON ${error.message}`);
            }
        }
        for (const match of text
            .replace(fencePattern, "")
            .matchAll(/\]\(([^)]+)\)/g)) {
            const url = match[1];
            if (/^\w+:\/\/|^mailto:/.test(url)) continue;
            links++;
            let decoded;
            try {
                decoded = decodeURIComponent(url);
            } catch {
                errors.push(`${display(path)}: invalid link encoding ${url}`);
                continue;
            }
            const separator = decoded.indexOf("#");
            const filename =
                separator < 0 ? decoded : decoded.slice(0, separator);
            const anchor = separator < 0 ? "" : decoded.slice(separator + 1);
            const target = filename ? resolve(dirname(path), filename) : path;
            if (!existsSync(target))
                errors.push(`${display(path)}: missing ${url}`);
            else if (
                anchor &&
                extname(target) === ".md" &&
                !anchors(readFileSync(target, "utf8")).has(anchor)
            ) {
                errors.push(`${display(path)}: missing anchor ${url}`);
            }
        }
    }
    for (const path of files) {
        if (
            [".md", ".yml", ".yaml"].includes(extname(path)) &&
            /[\t ]+$/m.test(readFileSync(path, "utf8"))
        ) {
            errors.push(`trailing whitespace: ${display(path)}`);
        }
    }
    for (const path of filesUnder(skillPath)) {
        if (
            /https?:\/\/|\/Volumes\/|\/Users\//.test(
                offlineText(path, readFileSync(path, "utf8")),
            )
        ) {
            errors.push(`offline/local-path violation: ${display(path)}`);
        }
    }

    const sourceMapPath = join(skillPath, "maintenance/source-map.md");
    if (explicitSkill && !existsSync(sourceMapPath))
        errors.push(`missing source map: ${display(sourceMapPath)}`);
    if (dshPath && !existsSync(sourceMapPath))
        errors.push(
            `cannot validate DSH checkout without a generated Skill source map: ${display(sourceMapPath)}`,
        );
    const sourceMap = existsSync(sourceMapPath)
        ? readFileSync(sourceMapPath, "utf8")
        : "";
    const sourcePaths = new Set(
        [...sourceMap.matchAll(sourcePathPattern)].map((match) => match[1]),
    );
    if (dshPath && sourceMap) {
        const version = sourceMap.match(
            /(?:dsh-v|@deepseek-ai\/dsh-agent@)(\d+\.\d+\.\d+(?:-[\w.]+)?)/,
        )?.[1];
        if (!version) errors.push("source map missing npm version");
        else {
            const tag = `dsh-v${version}`;
            try {
                if (
                    git(["rev-parse", "HEAD^{commit}"], dshPath) !==
                    git(["rev-parse", `refs/tags/${tag}^{commit}`], dshPath)
                ) {
                    errors.push(
                        `baseline mismatch: HEAD does not match ${tag}`,
                    );
                }
            } catch {
                errors.push(`baseline tag unavailable: ${tag}`);
            }
        }
        for (const filename of sourcePaths) {
            if (!existsSync(join(dshPath, filename)))
                errors.push(`source map missing ${filename}`);
        }
    }
    return {
        errors,
        summary: `${markdown.length} Markdown files; ${links} local links/anchors; ${fences} JSON fences`,
        sourceSummary:
            dshPath && sourceMap
                ? `${sourcePaths.size} source paths checked`
                : "Source path validation NOT RUN (pass --dsh with a generated Skill)",
    };
}

function main(args) {
    let skill;
    let dsh;
    for (let index = 0; index < args.length; index += 2) {
        if (args[index] === "--skill" && args[index + 1])
            skill = args[index + 1];
        else if (args[index] === "--dsh" && args[index + 1])
            dsh = args[index + 1];
        else
            throw new Error(
                "Usage: node scripts/validate_skill.mjs [--skill <directory>] [--dsh <checkout>]",
            );
    }
    const result = validate({ skill, dsh });
    process.stdout.write(
        `${result.summary}\n${result.sourceSummary}\n${result.errors.length ? result.errors.join("\n") : "PASS"}\n`,
    );
    if (result.errors.length) process.exitCode = 1;
}

if (
    process.argv[1] &&
    realpathSync(process.argv[1]) ===
        realpathSync(fileURLToPath(import.meta.url))
) {
    try {
        main(process.argv.slice(2));
    } catch (error) {
        process.stderr.write(`${error.message}\n`);
        process.exitCode = 1;
    }
}
