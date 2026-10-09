import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import {
    existsSync,
    lstatSync,
    readFileSync,
    readdirSync,
    renameSync,
    writeFileSync,
} from "node:fs";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";

export const identityKeys = ["version", "tag", "commit", "remote"];

export function readJson(path) {
    return JSON.parse(readFileSync(path, "utf8"));
}

export function writeJsonAtomic(path, value) {
    const temporary = `${path}.tmp-${process.pid}`;
    writeFileSync(temporary, `${JSON.stringify(value, null, 4)}\n`, {
        flag: "wx",
    });
    renameSync(temporary, path);
}

export function sha256File(path) {
    return createHash("sha256").update(readFileSync(path)).digest("hex");
}

export function stripBuildComments(markdown) {
    if (
        !/^<!-- (?:BEGIN|END) GENERATED |^<!-- prettier-ignore -->/m.test(
            markdown,
        )
    )
        return markdown;
    return markdown
        .replace(
            /^<!-- (?:BEGIN|END) GENERATED (?:TASK NAVIGATION|OBJECT INDEX|OBJECT TABLE) -->\r?\n|^<!-- prettier-ignore -->\r?\n/gm,
            "",
        )
        .replace(/\n{3,}/g, "\n\n")
        .replace(/\n+$/, "\n");
}

export function normalizeRelativePath(value, label) {
    if (typeof value !== "string" || value === "" || isAbsolute(value)) {
        throw new Error(`${label} must be a non-empty relative path.`);
    }
    const normalized = value.replaceAll("\\", "/");
    if (
        normalized === "." ||
        normalized.startsWith("../") ||
        normalized.includes("/../") ||
        normalized.endsWith("/..")
    ) {
        throw new Error(`${label} escapes its root: ${value}`);
    }
    return normalized.replace(/^\.\//, "");
}

export function resolveInside(root, value, label) {
    const normalized = normalizeRelativePath(value, label);
    const path = resolve(root, normalized);
    const prefix = `${resolve(root)}${sep}`;
    if (!path.startsWith(prefix)) {
        throw new Error(`${label} escapes its root: ${value}`);
    }
    return path;
}

export function listFiles(root) {
    if (!existsSync(root)) return [];
    const files = [];
    function visit(path) {
        for (const entry of readdirSync(path, { withFileTypes: true }).sort(
            (left, right) => left.name.localeCompare(right.name),
        )) {
            const child = join(path, entry.name);
            if (entry.isDirectory()) visit(child);
            else if (entry.isFile() || entry.isSymbolicLink()) {
                files.push(relative(root, child).split(sep).join("/"));
            } else {
                throw new Error(`Unsupported filesystem entry: ${child}`);
            }
        }
    }
    visit(root);
    return files;
}

export function directoryDigest(root) {
    const hash = createHash("sha256");
    for (const file of listFiles(root)) {
        const path = resolveInside(root, file, "directory entry");
        const stats = lstatSync(path);
        if (stats.isSymbolicLink()) {
            throw new Error(
                `Generated output must not contain symlinks: ${path}`,
            );
        }
        hash.update(`${file}\0${sha256File(path)}\0`);
    }
    return hash.digest("hex");
}

export function assertIdentity(actual, expected, label) {
    for (const key of identityKeys) {
        if (actual[key] !== expected[key]) {
            throw new Error(
                `${label} has ${key}=${actual[key]}, expected ${expected[key]}.`,
            );
        }
    }
}

export function loadTarget(targetArgument) {
    if (!targetArgument) {
        throw new Error("A prepared target path is required.");
    }
    const targetPath = resolve(targetArgument);
    const provenancePath = join(targetPath, "provenance.json");
    const manifestPath = join(targetPath, "skill-source", "manifest.json");
    const checkoutPath = join(targetPath, "checkout");
    for (const path of [
        targetPath,
        provenancePath,
        manifestPath,
        checkoutPath,
    ]) {
        if (!existsSync(path))
            throw new Error(`Missing prepared target path: ${path}`);
    }
    const provenance = readJson(provenancePath);
    const manifest = readJson(manifestPath);
    assertIdentity(manifest, provenance, "skill-source manifest");
    const head = execFileSync("git", ["rev-parse", "HEAD"], {
        cwd: checkoutPath,
        encoding: "utf8",
    }).trim();
    if (head !== provenance.commit) {
        throw new Error(
            `Target checkout is ${head}, expected ${provenance.commit}.`,
        );
    }
    const status = execFileSync(
        "git",
        ["status", "--porcelain", "--untracked-files=all"],
        { cwd: checkoutPath, encoding: "utf8" },
    ).trim();
    if (status !== "")
        throw new Error("Target checkout has working-tree modifications.");
    return {
        targetPath,
        checkoutPath,
        evidencePath: join(targetPath, "evidence"),
        skillSourcePath: join(targetPath, "skill-source"),
        generatedSkillPath: join(targetPath, "generated-skill"),
        provenance,
        manifest,
        manifestPath,
    };
}
