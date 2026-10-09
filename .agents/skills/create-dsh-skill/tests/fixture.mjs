import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

export function write(path, content) {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content);
}

export function createFixture(t, options = {}) {
    const layered = options.taskNavigation === "entrypoint";
    const apiSection = layered ? "Fixture" : "Tool contract";
    const root = mkdtempSync(join(tmpdir(), "create-dsh-skill-test-"));
    t.after(() => rmSync(root, { recursive: true, force: true }));
    const targetPath = join(root, "target");
    const checkoutPath = join(targetPath, "checkout");
    const skillSourcePath = join(targetPath, "skill-source");
    mkdirSync(checkoutPath, { recursive: true });
    write(join(checkoutPath, ".gitignore"), "ignored-proof.ts\n");
    write(
        join(checkoutPath, "proof.ts"),
        "export const proof = true;\nexport interface Fixture { run(): void }\n",
    );
    write(
        join(checkoutPath, "docs/how-to.md"),
        "# How to register a tool\n\nUse a plugin.\n",
    );
    execFileSync("git", ["init", "-q"], { cwd: checkoutPath });
    execFileSync("git", ["add", "."], { cwd: checkoutPath });
    execFileSync(
        "git",
        [
            "-c",
            "user.name=Skill Test",
            "-c",
            "user.email=skill-test@example.invalid",
            "commit",
            "-qm",
            "fixture",
        ],
        { cwd: checkoutPath },
    );
    const commit = execFileSync("git", ["rev-parse", "HEAD"], {
        cwd: checkoutPath,
        encoding: "utf8",
    }).trim();
    const identity = {
        version: "9.9.9-rc.9",
        tag: "dsh-v9.9.9-rc.9",
        commit,
        remote: "https://github.com/deepseek-ai/deepseek-harness",
    };
    write(
        join(targetPath, "provenance.json"),
        `${JSON.stringify(
            {
                package: "@deepseek-ai/dsh-agent",
                ...identity,
                ...(options.creationContract
                    ? { creationContract: options.creationContract }
                    : {}),
            },
            null,
            4,
        )}\n`,
    );
    write(
        join(targetPath, "evidence", "inventory.json"),
        `${JSON.stringify({ schemaVersion: 1, ...identity }, null, 4)}\n`,
    );
    write(
        join(targetPath, "evidence", "capability-candidates.json"),
        `${JSON.stringify({ schemaVersion: 1, ...identity, candidates: [{ id: "package:fixture", kind: "public-package", path: "proof.ts" }] }, null, 4)}\n`,
    );
    if (options.schemaVersion === 3) {
        write(
            join(targetPath, "evidence", "api-entry-candidates.json"),
            `${JSON.stringify({ schemaVersion: 1, ...identity, candidates: [{ id: "export:@deepseek-ai/dsh-fixture:.", package: "@deepseek-ai/dsh-fixture", subpath: ".", path: "proof.ts" }] }, null, 4)}\n`,
        );
        write(
            join(targetPath, "evidence", "api-symbol-candidates.json"),
            `${JSON.stringify({ schemaVersion: 1, ...identity, entries: [{ entry: "export:@deepseek-ai/dsh-fixture:.", source: "proof.ts", status: "resolved", symbols: [{ name: "Fixture", signature: "Fixture", source: "proof.ts", members: [{ name: "run", signature: "() => void" }] }] }] }, null, 4)}\n`,
        );
        write(
            join(targetPath, "evidence", "task-candidates.json"),
            `${JSON.stringify({ schemaVersion: 1, ...identity, candidates: [{ id: "task:docs/how-to.md:1", path: "docs/how-to.md", line: 1, title: "How to register a tool" }] }, null, 4)}\n`,
        );
        write(
            join(skillSourcePath, "api-surface.json"),
            `${JSON.stringify(options.apiSurface ?? { schemaVersion: 1, ...identity, entries: [{ candidate: "export:@deepseek-ai/dsh-fixture:.", decision: "included" }], objects: [{ id: "fixture", entry: "export:@deepseek-ai/dsh-fixture:.", symbol: "Fixture", signature: "Fixture", source: "proof.ts", decision: "included", owner: "references/api-tools.md", section: apiSection, members: [{ name: "run", signature: "() => void", decision: "included" }] }] }, null, 4)}\n`,
        );
    }

    const sourceFiles = [
        {
            source: "entrypoint/SKILL.md",
            output: "SKILL.md",
            kind: "entrypoint",
            content:
                options.entrypoint ??
                "---\nname: dsh-plugin-development\ndescription: Fixture Skill\n---\n# @deepseek-ai/dsh-agent@9.9.9-rc.9\n\n[Section](#section)\n\n## Section\n",
        },
        {
            source: "metadata/openai.yaml",
            output: "agents/openai.yaml",
            kind: "metadata",
            content:
                options.metadata ??
                'interface:\n    display_name: "Fixture"\n    short_description: "Fixture"\n    default_prompt: "Fixture"\n',
        },
        {
            source: "indexes/routing.md",
            output: "references/plugin-development-routing.md",
            kind: "index",
            content:
                options.routing ??
                "# Routing\n\n[Tool contract](api-tools.md)\n[How-to](how-to.md)\n",
        },
        {
            source: "indexes/keyword.md",
            output: "references/keyword-index.md",
            kind: "index",
            content: "# Keywords\n",
        },
        {
            source: "concepts/terminology.md",
            output: "references/terminology.md",
            kind: "index",
            content: "# Terminology\n",
        },
        {
            source: "api-guardrails/tools.md",
            output: "references/api-tools.md",
            kind: "api-guardrail",
            ...(layered
                ? { role: "subject", topic: "tools", subject: "tool-contract" }
                : {}),
            content: layered
                ? "# API\n\n## Fixture\n\nFixture registers a tool.\n\n### 成员\n\nrun() registers a tool for a plugin task.\n"
                : `# API\n\n## ${apiSection}\n\nFixture.run registers a tool for a plugin task.\n`,
        },
        ...(layered
            ? [
                  {
                      source: "api-guardrails/tools-overview.md",
                      output: "references/api-tools-overview.md",
                      kind: "api-guardrail",
                      role: "topic",
                      topic: "tools",
                      content:
                          "# Tools\n\n## 对象关系\n\nFixture 是工具契约对象。\n\n## 选型与使用\n\n插件使用 [Fixture](api-tools.md#fixture) 注册工具。\n",
                  },
              ]
            : []),
        {
            source: "how-to/example.md",
            output: "references/how-to.md",
            kind: "how-to",
            content: layered
                ? "# How-to\n\n## Complete task\n\nBuild and load the plugin using [Fixture](api-tools.md#fixture).\n"
                : "# How-to\n\n## Complete task\n\nBuild and load the plugin.\n",
        },
        {
            source: "maintenance/source-map.md",
            output: "maintenance/source-map.md",
            kind: "maintenance",
            content: "# Source map\n\n@deepseek-ai/dsh-agent@9.9.9-rc.9\n",
        },
        {
            source: "maintenance/skill-maintenance.md",
            output: "maintenance/skill-maintenance.md",
            kind: "maintenance",
            content: "# Maintenance\n",
        },
        ...(options.extraFiles ?? []),
    ];
    if (options.taskNavigation === "entrypoint") {
        sourceFiles.push({
            source: "indexes/object-index.md",
            output: "references/object-index.md",
            kind: "index",
            content:
                "# 关键对象索引\n\n<!-- BEGIN GENERATED OBJECT TABLE -->\n<!-- END GENERATED OBJECT TABLE -->\n",
        });
        for (const output of [
            "references/plugin-development-routing.md",
            "references/keyword-index.md",
            "references/terminology.md",
        ]) {
            sourceFiles.splice(
                sourceFiles.findIndex((file) => file.output === output),
                1,
            );
        }
    }
    for (const file of sourceFiles) {
        write(join(skillSourcePath, file.source), file.content);
    }
    write(
        join(skillSourcePath, "manifest.json"),
        `${JSON.stringify(
            {
                schemaVersion: options.schemaVersion ?? 1,
                ...identity,
                status: "draft",
                ...(options.taskNavigation
                    ? { taskNavigation: options.taskNavigation }
                    : {}),
                topics: ["tools"],
                files: sourceFiles.map(
                    ({ source, output, kind, role, topic, subject }) => ({
                        source,
                        output,
                        kind,
                        ...(role
                            ? { role, topic, ...(subject ? { subject } : {}) }
                            : {}),
                    }),
                ),
            },
            null,
            4,
        )}\n`,
    );
    write(
        join(skillSourcePath, "claims.json"),
        `${JSON.stringify(
            [
                {
                    id: "api",
                    kind: "implemented-behavior",
                    topic: "tools",
                    decision: "accepted",
                    owner: "references/api-tools.md",
                    summary: "API claim",
                    evidence: [{ category: "public-api", path: "proof.ts" }],
                },
                {
                    id: "how-to",
                    kind: "derived-guidance",
                    topic: "tools",
                    decision: "accepted",
                    owner: "references/how-to.md",
                    summary: "How-to claim",
                    evidence: [{ category: "public-api", path: "proof.ts" }],
                },
                ...(layered
                    ? [
                          {
                              id: "api-overview",
                              kind: "derived-guidance",
                              topic: "tools",
                              decision: "accepted",
                              owner: "references/api-tools-overview.md",
                              summary: "Tools relationship",
                              evidence: [
                                  { category: "public-api", path: "proof.ts" },
                              ],
                          },
                      ]
                    : []),
            ],
            null,
            4,
        )}\n`,
    );
    write(
        join(skillSourcePath, "coverage.json"),
        `${JSON.stringify({ schemaVersion: options.schemaVersion ?? 1, dispositions: [{ id: "fixture", decision: "included", candidates: ["package:fixture"], topics: ["tools"], owners: ["references/api-tools.md"], summary: "Fixture capability", pluginTask: "Register a plugin tool", ownerSections: { "references/api-tools.md": apiSection } }], ...(options.schemaVersion >= 2 ? { taskPaths: options.taskPaths ?? [] } : {}), ...(options.schemaVersion === 3 ? { taskDiscoveries: options.taskDiscoveries ?? [] } : {}) }, null, 4)}\n`,
    );
    return { targetPath, checkoutPath, skillSourcePath };
}
