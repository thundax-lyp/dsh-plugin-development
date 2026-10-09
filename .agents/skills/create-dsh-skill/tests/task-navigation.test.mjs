import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { buildSkill } from "../scripts/build-dsh-plugin-development-skill.mjs";
import { syncTaskNavigation } from "../scripts/sync-task-navigation.mjs";
import {
    renderEntrypointTasks,
    renderTaskNavigation,
} from "../scripts/task-navigation.mjs";
import { validateSkillSource } from "../scripts/validate-skill-source.mjs";
import { verifyTaskScenarios } from "../scripts/verify-task-scenarios.mjs";
import { createFixture, write } from "./fixture.mjs";

test("entrypoint groups tasks and shows each task name once", () => {
    const rows = [
        {
            task: {
                id: "tool",
                outcome: "注册工具",
                userIntents: ["让 Agent 调用工具"],
                entry: {
                    output: "references/host/how-to/how-to-host-tool.md",
                    anchor: "注册工具",
                },
                destinations: [
                    { output: "references/host/how-to/how-to-host-tool.md" },
                ],
            },
            links: [
                "[注册工具](references/host/how-to/how-to-host-tool.md#注册工具)",
            ],
        },
        ...[
            ["Host 任务", "references/host/how-to/how-to-host-service.md"],
            ["Client 任务", "references/client/how-to/how-to-client-slot.md"],
            ["配置任务", "references/infra/how-to/how-to-infra-profile.md"],
        ].map(([outcome, output]) => ({
            task: { outcome, destinations: [{ output }] },
            links: [`[${outcome}](${output}#任务)`],
        })),
        {
            task: {
                outcome: "Host Registry",
                navigationGroup: "host",
                destinations: [
                    {
                        output: "references/client/how-to/how-to-client-workspace.md",
                    },
                ],
            },
            links: [
                "[Host Registry](references/client/how-to/how-to-client-workspace.md#任务)",
            ],
        },
    ];
    const rendered = renderEntrypointTasks(rows);
    assert.match(rendered, /### 常用入口/);
    assert.match(rendered, /### Host 与 Agent/);
    assert.match(rendered, /### Web Client 与跨侧交互/);
    assert.match(rendered, /### 配置、运行时与 Provider/);
    assert.equal((rendered.match(/让 Agent 调用工具/g) ?? []).length, 1);
    assert.equal((rendered.match(/Host 任务/g) ?? []).length, 1);
    assert.equal((rendered.match(/\| 开发任务 \|/g) ?? []).length, 3);
    assert.doesNotMatch(rendered, /实现与验证|操作步骤/);
    assert.match(
        rendered,
        /\| \[Host 任务\]\(references\/host\/how-to\/how-to-host-service\.md#任务\) \|/,
    );
    assert.match(
        rendered,
        /### Host 与 Agent[\s\S]*Host Registry[\s\S]*### Web Client/,
    );
});

test("generated navigation routes a featured task to its own exact section", (t) => {
    const task = {
        id: "register-tool",
        outcome: "Plugin tool can be called",
        userIntents: ["Register a callable tool"],
        decision: "covered",
        candidates: ["package:fixture"],
        apiObjects: ["fixture"],
        destinations: [
            { output: "references/how-to.md", section: "Complete task" },
        ],
        entry: {
            output: "references/how-to.md",
            section: "Complete task",
            anchor: "complete-task",
        },
    };
    const fixture = createFixture(t, {
        schemaVersion: 3,
        taskNavigation: "generated",
        taskPaths: [task],
        taskDiscoveries: [
            {
                candidate: "task:docs/how-to.md:1",
                decision: "included",
                taskId: "register-tool",
            },
        ],
        entrypoint:
            "---\nname: dsh-plugin-development\ndescription: Fixture Skill\n---\n# @deepseek-ai/dsh-agent@9.9.9-rc.9\n\n<!-- BEGIN GENERATED TASK NAVIGATION -->\n<!-- END GENERATED TASK NAVIGATION -->\n",
        routing:
            "# Routing\n\n[Tool contract](api-tools.md)\n[How-to](how-to.md)\n\n<!-- BEGIN GENERATED TASK NAVIGATION -->\n<!-- END GENERATED TASK NAVIGATION -->\n",
    });
    const scenarioPath = join(
        fixture.targetPath,
        "evidence/task-scenarios.json",
    );
    const scriptPath = join(
        fixture.targetPath,
        "evidence/scenarios/register-tool.mjs",
    );
    write(
        scenarioPath,
        `${JSON.stringify({
            schemaVersion: 1,
            scenarios: [
                {
                    taskId: "register-tool",
                    script: "scenarios/register-tool.mjs",
                    checks: ["profile-load", "tool-call"],
                },
            ],
        })}\n`,
    );
    write(
        scriptPath,
        'console.log(JSON.stringify({taskId:"register-tool",checks:{"profile-load":true,"tool-call":true}}));\n',
    );
    syncTaskNavigation(fixture.targetPath);
    const entrypoint = readFileSync(
        join(fixture.skillSourcePath, "entrypoint/SKILL.md"),
        "utf8",
    );
    assert.match(
        entrypoint,
        /Register a callable tool.*references\/how-to\.md#complete-task/,
    );
    validateSkillSource(fixture.targetPath, { freeze: true });
    buildSkill(fixture.targetPath);
    assert.doesNotMatch(
        readFileSync(
            join(fixture.targetPath, "generated-skill/SKILL.md"),
            "utf8",
        ),
        /<!--/,
    );
    assert.equal(verifyTaskScenarios(fixture.targetPath).passed.length, 1);
    write(
        scriptPath,
        'console.log(JSON.stringify({taskId:"register-tool",checks:{"profile-load":true,"tool-call":false}}));\n',
    );
    assert.throws(
        () => verifyTaskScenarios(fixture.targetPath),
        /hash mismatch/,
    );
    const manifestPath = join(fixture.skillSourcePath, "manifest.json");
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    manifest.status = "draft";
    write(manifestPath, `${JSON.stringify(manifest, null, 4)}\n`);
    validateSkillSource(fixture.targetPath, { freeze: true });
    assert.throws(
        () => verifyTaskScenarios(fixture.targetPath),
        /did not pass tool-call/,
    );
});

test("entrypoint navigation contains every task and a linked API object index", (t) => {
    const fixture = createFixture(t, {
        schemaVersion: 3,
        taskNavigation: "entrypoint",
        creationContract: "entrypoint",
        taskPaths: [
            {
                id: "register-tool",
                outcome: "Plugin tool can be called",
                decision: "covered",
                candidates: ["package:fixture"],
                apiObjects: ["fixture"],
                destinations: [
                    {
                        output: "references/how-to.md",
                        section: "Complete task",
                    },
                ],
                entry: {
                    output: "references/how-to.md",
                    section: "Complete task",
                    anchor: "complete-task",
                },
                userIntents: ["Register a callable tool"],
            },
        ],
        taskDiscoveries: [
            {
                candidate: "task:docs/how-to.md:1",
                decision: "included",
                taskId: "register-tool",
            },
        ],
        entrypoint:
            "---\nname: dsh-plugin-development\ndescription: Fixture Skill\n---\n# @deepseek-ai/dsh-agent@9.9.9-rc.9\n\n## 适用范围\n\n仅适用于此版本。\n\n## 插件形态\n\n| 形态 | 用途 | 呈现 | 使用 | 指南 |\n| --- | --- | --- | --- | --- |\n| 工具插件 | 注册工具 | Agent 可调用 | Profile 装载 | [实现](references/how-to.md#complete-task) |\n\n## 开发任务\n\n<!-- BEGIN GENERATED TASK NAVIGATION -->\n<!-- END GENERATED TASK NAVIGATION -->\n\n## 关键对象索引\n\n详细契约见[完整对象索引](references/object-index.md)。\n\n<!-- BEGIN GENERATED OBJECT INDEX -->\n<!-- END GENERATED OBJECT INDEX -->\n\n## 术语与边界\n\n- **Plugin**：由 Profile 装载的扩展包。\n\n## 关键词索引\n\n- Fixture：[对象契约](references/api-tools.md#fixture)。\n\n## 跨主题不变量\n\n保留资源所有权。\n\n## 完成边界\n\n核查装载和卸载。\n",
    });
    write(
        join(fixture.targetPath, "evidence/task-scenarios.json"),
        `${JSON.stringify({ schemaVersion: 1, scenarios: [{ taskId: "register-tool", script: "scenarios/register-tool.mjs", checks: ["profile-load"] }] })}\n`,
    );
    write(
        join(fixture.targetPath, "evidence/scenarios/register-tool.mjs"),
        'console.log(JSON.stringify({taskId:"register-tool",checks:{"profile-load":true}}));\n',
    );
    syncTaskNavigation(fixture.targetPath);
    const entrypoint = readFileSync(
        join(fixture.skillSourcePath, "entrypoint/SKILL.md"),
        "utf8",
    );
    assert.match(
        entrypoint,
        /Register a callable tool.*references\/how-to\.md#complete-task/,
    );
    assert.match(entrypoint, /### 其他[\s\S]*`Fixture`/);
    const names = entrypoint
        .split("<!-- BEGIN GENERATED OBJECT INDEX -->")[1]
        .split("<!-- END GENERATED OBJECT INDEX -->")[0];
    assert.doesNotMatch(names, /fixture\)|api-tools\.md/);
    const objectIndex = readFileSync(
        join(fixture.skillSourcePath, "indexes/object-index.md"),
        "utf8",
    );
    assert.match(objectIndex, /\| \[\`Fixture\`\]\(api-tools\.md#fixture\) \|/);
    assert.doesNotMatch(objectIndex, /export:|\| 关键对象 \|/);
    assert.doesNotThrow(() =>
        validateSkillSource(fixture.targetPath, { freeze: true }),
    );
    buildSkill(fixture.targetPath);
    assert.doesNotMatch(
        readFileSync(
            join(fixture.targetPath, "generated-skill/SKILL.md"),
            "utf8",
        ),
        /<!--/,
    );
    assert.doesNotMatch(
        readFileSync(
            join(
                fixture.targetPath,
                "generated-skill/references/object-index.md",
            ),
            "utf8",
        ),
        /<!--/,
    );
    assert.equal(verifyTaskScenarios(fixture.targetPath).passed.length, 1);
    assert.equal(
        existsSync(
            join(
                fixture.targetPath,
                "generated-skill/references/plugin-development-routing.md",
            ),
        ),
        false,
    );
    for (const output of ["keyword-index.md", "terminology.md"]) {
        assert.equal(
            existsSync(
                join(fixture.targetPath, "generated-skill/references", output),
            ),
            false,
        );
    }
    const manifestPath = join(fixture.skillSourcePath, "manifest.json");
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    manifest.status = "draft";
    write(manifestPath, `${JSON.stringify(manifest, null, 4)}\n`);
    const objectIndexPath = join(
        fixture.skillSourcePath,
        "indexes/object-index.md",
    );
    write(objectIndexPath, objectIndex.replace("[`Fixture`]", "[Fixture]"));
    assert.throws(
        () => validateSkillSource(fixture.targetPath, { freeze: true }),
        /Object index differs from api-surface.json/,
    );
    write(objectIndexPath, objectIndex);
    delete manifest.taskNavigation;
    write(manifestPath, `${JSON.stringify(manifest, null, 4)}\n`);
    assert.throws(
        () => validateSkillSource(fixture.targetPath, { freeze: true }),
        /Newly prepared targets require schema v3 taskNavigation=entrypoint/,
    );
    manifest.taskNavigation = "generated";
    write(manifestPath, `${JSON.stringify(manifest, null, 4)}\n`);
    assert.throws(
        () => validateSkillSource(fixture.targetPath, { freeze: true }),
        /Newly prepared targets require schema v3 taskNavigation=entrypoint/,
    );
    manifest.taskNavigation = "entrypoint";
    write(manifestPath, `${JSON.stringify(manifest, null, 4)}\n`);
    const coveragePath = join(fixture.skillSourcePath, "coverage.json");
    const coverage = JSON.parse(readFileSync(coveragePath, "utf8"));
    coverage.taskPaths[0].destinations.unshift({
        output: "references/api-tools.md",
        section: "Fixture",
    });
    write(coveragePath, `${JSON.stringify(coverage, null, 4)}\n`);
    assert.throws(
        () => validateSkillSource(fixture.targetPath, { freeze: true }),
        /output must point to a HOW-TO/,
    );
    coverage.taskPaths[0].destinations.shift();
    write(coveragePath, `${JSON.stringify(coverage, null, 4)}\n`);
    const howToPath = join(fixture.skillSourcePath, "how-to/example.md");
    const howTo = readFileSync(howToPath, "utf8");
    write(
        howToPath,
        howTo.replace("[Fixture](api-tools.md#fixture)", "Fixture"),
    );
    assert.throws(
        () => validateSkillSource(fixture.targetPath, { freeze: true }),
        /HOW-TO does not link API reference for fixture/,
    );
    write(
        howToPath,
        `${howTo.replace("[Fixture](api-tools.md#fixture)", "Fixture")}\n## Other task\n\n[Fixture](api-tools.md#fixture) belongs to another task.\n`,
    );
    assert.throws(
        () => validateSkillSource(fixture.targetPath, { freeze: true }),
        /HOW-TO does not link API reference for fixture/,
    );
    write(howToPath, howTo);
    const examplePath = join(
        fixture.skillSourcePath,
        "examples/example-fixture.md",
    );
    const exampleBody =
        "# Fixture example\n\n```ts\nexport const fixture = true;\n```\n";
    write(examplePath, exampleBody);
    manifest.files.push({
        source: "examples/example-fixture.md",
        output: "references/host/examples/example-fixture.md",
        kind: "example",
    });
    write(manifestPath, `${JSON.stringify(manifest, null, 4)}\n`);
    const linkedHowTo = `${howTo}\nRead the [complete example](host/examples/example-fixture.md).\n`;
    write(howToPath, howTo);
    assert.throws(
        () => validateSkillSource(fixture.targetPath, { freeze: true }),
        /Example must be linked from a task HOW-TO section/,
    );
    write(howToPath, linkedHowTo);
    write(examplePath, "# Fixture example\n\nNo code.\n");
    assert.throws(
        () => validateSkillSource(fixture.targetPath, { freeze: true }),
        /Example must include a fenced code block/,
    );
    write(examplePath, exampleBody);
    manifest.files.at(-1).output = "references/examples/example-fixture.md";
    write(manifestPath, `${JSON.stringify(manifest, null, 4)}\n`);
    assert.throws(
        () => validateSkillSource(fixture.targetPath, { freeze: true }),
        /Example must be a grouped references\/<side>\/examples\/example-\*\.md/,
    );
    manifest.files.at(-1).output =
        "references/host/examples/example-fixture.md";
    write(manifestPath, `${JSON.stringify(manifest, null, 4)}\n`);
    assert.doesNotThrow(() =>
        validateSkillSource(fixture.targetPath, { freeze: true }),
    );
    buildSkill(fixture.targetPath);
    assert.equal(
        existsSync(
            join(
                fixture.targetPath,
                "generated-skill/references/host/examples/example-fixture.md",
            ),
        ),
        true,
    );
    manifest.status = "draft";
    manifest.files.pop();
    write(manifestPath, `${JSON.stringify(manifest, null, 4)}\n`);
    write(howToPath, howTo);
    const entryPath = join(fixture.skillSourcePath, "entrypoint/SKILL.md");
    write(
        entryPath,
        entrypoint.replace(
            "[对象契约](references/api-tools.md#fixture)",
            "对象契约",
        ),
    );
    assert.throws(
        () => validateSkillSource(fixture.targetPath, { freeze: true }),
        /keyword index must link to a reference/,
    );
    write(entryPath, entrypoint);
    write(entryPath, entrypoint.replace("## 插件形态\n\n", "## 形态概览\n\n"));
    assert.throws(
        () => validateSkillSource(fixture.targetPath, { freeze: true }),
        /ordered entrypoint section: 插件形态/,
    );
    write(
        entryPath,
        entrypoint.replace(
            "[实现](references/how-to.md#complete-task)",
            "实现",
        ),
    );
    assert.throws(
        () => validateSkillSource(fixture.targetPath, { freeze: true }),
        /plugin forms must link to a HOW-TO/,
    );
    write(entryPath, entrypoint);
    write(join(fixture.skillSourcePath, "indexes/extra.md"), "# Extra index\n");
    manifest.files.push({
        source: "indexes/extra.md",
        output: "references/extra.md",
        kind: "index",
    });
    write(manifestPath, `${JSON.stringify(manifest, null, 4)}\n`);
    assert.throws(
        () => validateSkillSource(fixture.targetPath, { freeze: true }),
        /only references\/object-index\.md as a separate index file/,
    );
    manifest.files.pop();
    write(manifestPath, `${JSON.stringify(manifest, null, 4)}\n`);
    const surfacePath = join(fixture.skillSourcePath, "api-surface.json");
    const surface = JSON.parse(readFileSync(surfacePath, "utf8"));
    surface.objects[0].section = "Generic objects";
    write(surfacePath, `${JSON.stringify(surface, null, 4)}\n`);
    assert.throws(
        () => validateSkillSource(fixture.targetPath, { freeze: true }),
        /section must name its API object/,
    );
    surface.objects[0].section = "Fixture";
    write(surfacePath, `${JSON.stringify(surface, null, 4)}\n`);
    write(
        join(fixture.skillSourcePath, "api-guardrails/tools-overview.md"),
        "# Tools\n\n## 对象关系\n\nFixture 是工具契约对象。\n\n## 选型与使用\n\n插件注册工具。\n",
    );
    assert.throws(
        () => validateSkillSource(fixture.targetPath, { freeze: true }),
        /must link API subject/,
    );
    write(
        join(fixture.skillSourcePath, "api-guardrails/tools-overview.md"),
        "# Tools\n\n## 对象关系\n\nFixture 是工具契约对象。\n\n## 选型与使用\n\n插件使用 [Fixture](api-tools.md#fixture) 注册工具。\n",
    );
    surface.objects[0].owner = "references/api-tools-overview.md";
    write(surfacePath, `${JSON.stringify(surface, null, 4)}\n`);
    assert.throws(
        () => validateSkillSource(fixture.targetPath, { freeze: true }),
        /owner must be an API subject reference/,
    );
});

test("generated navigation rejects a generic section shared by two tasks", (t) => {
    const fixture = createFixture(t);
    const destination = {
        output: "references/how-to.md",
        section: "Complete task",
    };
    assert.throws(
        () =>
            renderTaskNavigation(
                {
                    taskPaths: [
                        {
                            id: "one",
                            decision: "covered",
                            outcome: "First outcome",
                            destinations: [destination],
                            entry: { ...destination, anchor: "complete-task" },
                            userIntents: ["First intent"],
                        },
                        {
                            id: "two",
                            decision: "covered",
                            outcome: "Second outcome",
                            destinations: [destination],
                        },
                    ],
                },
                [
                    {
                        source: "how-to/example.md",
                        output: "references/how-to.md",
                    },
                ],
                fixture.skillSourcePath,
                {
                    entrypoint:
                        "<!-- BEGIN GENERATED TASK NAVIGATION -->\n<!-- END GENERATED TASK NAVIGATION -->",
                    routing:
                        "<!-- BEGIN GENERATED TASK NAVIGATION -->\n<!-- END GENERATED TASK NAVIGATION -->",
                },
            ),
        /shares the same destination section/,
    );
});
