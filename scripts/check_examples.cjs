// Compile Skill examples against an exact DSH checkout without editing its tracked files.
const fs = require("node:fs");
const path = require("node:path");
const cp = require("node:child_process");
const crypto = require("node:crypto");
const repo = path.resolve(__dirname, "..");
const refs = path.join(repo, "skills/dsh-plugin-development/references");
const argv = process.argv.slice(2);
if (argv.length !== 2 || argv[0] !== "--dsh") {
    console.error(
        "Usage: node scripts/check_examples.cjs --dsh <exact-tag-checkout>",
    );
    process.exit(2);
}
const root = fs.realpathSync(argv[1]);
function run(command, args, options = {}) {
    const result = cp.spawnSync(command, args, {
        cwd: root,
        stdio: "inherit",
        ...options,
    });
    if (result.error) throw result.error;
    if (result.status !== 0)
        throw Error(`${command} failed: ${result.status ?? result.signal}`);
}
function git(...args) {
    return cp.execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
}
let workspace, checkerCopy;
try {
    const map = fs.readFileSync(
        path.join(refs, "../maintenance/source-map.md"),
        "utf8",
    );
    const tag = map.match(/`(dsh-v[^`]+)`/)[1];
    const sha = map.match(/commit `([0-9a-f]{40})`/)[1];
    for (const ref of ["HEAD", tag]) {
        if (git("rev-parse", `${ref}^{commit}`) !== sha)
            throw Error(`Expected ${tag} / ${sha}; ${ref} differs`);
    }
    // Modified runtime, gates or manifests would invalidate exact-tag evidence.
    if (git("status", "--porcelain", "--untracked-files=no"))
        throw Error("DSH tracked files are modified");
    run("python3", [path.join(__dirname, "validate_skill.py"), "--dsh", root]);
    const checker = path.join(root, "scripts/doc-typecheck.ts");
    const original = fs.readFileSync(checker, "utf8");
    const needle = "const markdownGlobs = [";
    if (original.split(needle).length !== 2)
        throw Error("Unsupported upstream checker layout");
    const ts = require(path.join(root, "node_modules/typescript"));
    workspace = fs.mkdtempSync(path.join(root, ".skill-validation-"));
    const name = path.basename(workspace);
    let hostCount = 0;
    const client = [];
    for (const file of fs.readdirSync(refs).filter((f) => f.endsWith(".md"))) {
        const text = fs.readFileSync(path.join(refs, file), "utf8");
        fs.writeFileSync(path.join(workspace, file), text);
        for (const block of text.matchAll(
            /^```(ts[^\n]*)\n([\s\S]*?)^```\s*$/gm,
        )) {
            if (block[1].trim() === "ts") hostCount++;
            else if (
                block[1].trim() === "ts ignore-check" &&
                ["client-ui.md", "typert-remote-api.md"].includes(file)
            ) {
                const filename = path.join(
                    workspace,
                    `client-${client.length}.ts`,
                );
                fs.writeFileSync(filename, block[2]);
                client.push({
                    filename,
                    source: file,
                    line: text.slice(0, block.index).split("\n").length,
                });
            } else
                throw Error(
                    `Unassigned TypeScript fence: ${file}: ${block[1]}`,
                );
        }
    }
    if (!hostCount || !client.length)
        throw Error("Expected both Host and Client examples");
    // Keep the sibling location so upstream import.meta.dirname and relative imports stay valid.
    checkerCopy = path.join(
        root,
        "scripts",
        `.skill-doc-typecheck-${crypto.randomUUID()}.ts`,
    );
    fs.writeFileSync(
        checkerCopy,
        original.replace(needle, `${needle}'${name}/*.md', `),
        { flag: "wx" },
    );
    run("pnpm", ["exec", "tsx", checkerCopy], {
        env: { ...process.env, DSH_DOC_TYPECHECK_USE_BUILD_OUTPUT: "1" },
    });
    console.log(
        `Skill Host examples: ${hostCount} checked by upstream checker`,
    );
    const parsed = ts.getParsedCommandLineOfConfigFile(
        path.join(root, "tsconfig.client.json"),
        {},
        {
            ...ts.sys,
            onUnRecoverableConfigFileDiagnostic: (d) => {
                throw Error(
                    ts.flattenDiagnosticMessageText(d.messageText, "\n"),
                );
            },
        },
    );
    if (!parsed || parsed.errors.length)
        throw Error("Cannot parse Client compiler configuration");
    function built(p) {
        if (!p.includes("/src"))
            throw Error(`Unsupported declaration mapping: ${p}`);
        return p.replace("/src", "/lib/types").replace(/\.ts$/, ".d.ts");
    }
    const options = {
        ...parsed.options,
        paths: Object.fromEntries(
            Object.entries(parsed.options.paths).map(([k, v]) => [
                k,
                v.map(built),
            ]),
        ),
        noEmit: true,
        composite: false,
        incremental: false,
        declaration: false,
        declarationMap: false,
        noUnusedLocals: false,
        noUnusedParameters: false,
    };
    delete options.tsBuildInfoFile;
    // Generated Remote declarations are exported by their actual owning manifest.
    for (const file of git("ls-files", "packages/*/*/package.json").split(
        "\n",
    )) {
        const manifest = JSON.parse(
            fs.readFileSync(path.join(root, file), "utf8"),
        );
        const types = manifest.exports?.["./remote"]?.types;
        if (typeof types === "string")
            options.paths[`${manifest.name}/remote`] = [
                path.resolve(root, path.dirname(file), types),
            ];
    }
    const program = ts.createProgram(
        client.map((b) => b.filename),
        options,
    );
    const errors = ts.getPreEmitDiagnostics(program);
    if (errors.length) {
        console.error(
            ts.formatDiagnosticsWithColorAndContext(errors, {
                getCanonicalFileName: (f) => f,
                getCurrentDirectory: () => root,
                getNewLine: () => "\n",
            }),
        );
        console.error(client);
        throw Error(`Client diagnostics: ${errors.length}`);
    }
    console.log(`Skill Client examples: ${client.length}; 0 diagnostics`);
} catch (error) {
    console.error(error.message);
    console.error(
        "Validation FAILED. Prepare pinned dependencies, build:lib:host and typecheck:contracts-ready before retrying.",
    );
    process.exitCode = 1;
} finally {
    if (checkerCopy) fs.rmSync(checkerCopy, { force: true });
    if (workspace) fs.rmSync(workspace, { recursive: true, force: true });
}
