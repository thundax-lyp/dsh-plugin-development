import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { buildTaskCandidates } from "../scripts/inventory-dsh-surface.mjs";
import {
    documentedSharedUiComponents,
    validateSharedUiCoverage,
} from "../scripts/shared-ui-coverage.mjs";
import { write } from "./fixture.mjs";

const packageName = "@deepseek-ai/dsh-client-ui-primitives";
const candidateId = `task:package:${packageName}:component-reuse`;
const objectId = `export:${packageName}:.:Pill`;
const owner = "references/client/api/api-client-shared-ui.md";

function fixture(t) {
    const root = mkdtempSync(join(tmpdir(), "dsh-shared-ui-test-"));
    t.after(() => rmSync(root, { recursive: true, force: true }));
    const checkoutRoot = join(root, "checkout");
    const sourceRoot = join(root, "skill-source");
    const manifestPath = "packages/client/ui-primitives/package.json";
    const readmePath = "packages/client/ui-primitives/README.md";
    write(
        join(checkoutRoot, readmePath),
        "# Shared UI\n\n| Export | What it is |\n|---|---|\n| `Pill` | Selectable control |\n| `Tag` | Read-only label |\n",
    );
    write(
        join(sourceRoot, "how-to/client-shared-ui.md"),
        "# Reuse controls\n\nRead [the UI contract](../api/api-client-shared-ui.md#pill).\n",
    );
    const inventory = {
        packageManifests: [
            {
                path: manifestPath,
                name: packageName,
                private: false,
                exports: { ".": "./lib/index.js" },
            },
        ],
        readmes: [{ path: readmePath }],
        documentation: [],
        website: [],
    };
    const taskCandidates = {
        candidates: [
            { id: candidateId, kind: "shared-ui-component-selection" },
        ],
    };
    const coverage = {
        taskDiscoveries: [
            {
                candidate: candidateId,
                decision: "included",
                taskId: "reuse-ui",
            },
        ],
        taskPaths: [
            {
                id: "reuse-ui",
                decision: "covered",
                kind: "shared-ui-component-selection",
                apiObjects: [objectId],
                destinations: [
                    {
                        output: "references/client/how-to/how-to-client-shared-ui.md",
                    },
                ],
            },
        ],
    };
    const apiSurface = {
        objects: [
            { id: objectId, symbol: "Pill", decision: "included", owner },
            {
                id: `export:${packageName}:.:Tag`,
                symbol: "Tag",
                decision: "excluded",
                reason: "只读标签在此版本的插件公开使用路径尚未确认；核查了包入口与调用方。",
            },
        ],
    };
    const files = [
        {
            output: "references/client/how-to/how-to-client-shared-ui.md",
            source: "how-to/client-shared-ui.md",
        },
    ];
    const entrypointBody = `## 关键词索引\n\n| Web UI 组件 | [共享控件](${owner}) |\n\n## 完成边界\n`;
    return {
        inventory,
        taskCandidates,
        coverage,
        apiSurface,
        files,
        sourceRoot,
        checkoutRoot,
        entrypointBody,
    };
}

test("public shared UI package creates a component selection task candidate", (t) => {
    const options = fixture(t);
    const candidates = buildTaskCandidates(
        options.inventory,
        options.checkoutRoot,
    );
    assert(candidates.candidates.some((item) => item.id === candidateId));
    options.inventory.packageManifests[0].private = true;
    assert(
        !buildTaskCandidates(
            options.inventory,
            options.checkoutRoot,
        ).candidates.some((item) => item.id === candidateId),
    );
});

test("shared UI catalog reads documented controls in Chinese and English", () => {
    assert.deepEqual(
        [
            ...documentedSharedUiComponents(
                "| 导出 | 是什么 |\n|---|---|\n| `Pill`、`Tag` | 标签 |\n",
            ),
        ],
        ["Pill", "Tag"],
    );
    assert.deepEqual(
        [
            ...documentedSharedUiComponents(
                "| Export | What it is |\n|---|---|\n| `Tooltip` | Hint |\n",
            ),
        ],
        ["Tooltip"],
    );
});

test("shared UI freeze gate requires a task and an entrypoint keyword route", (t) => {
    const options = fixture(t);
    assert.doesNotThrow(() => validateSharedUiCoverage(options));
    options.coverage.taskDiscoveries[0].decision = "excluded";
    assert.throws(
        () => validateSharedUiCoverage(options),
        /covered plugin task/,
    );
    options.coverage.taskDiscoveries[0].decision = "included";
    options.coverage.taskPaths[0].kind = undefined;
    assert.throws(
        () => validateSharedUiCoverage(options),
        /component selection task/,
    );
    options.coverage.taskPaths[0].kind = "shared-ui-component-selection";
    options.entrypointBody =
        "## 关键词索引\n\n- Other: [other](references/other.md)\n";
    assert.throws(() => validateSharedUiCoverage(options), /keyword route/);
});

test("shared UI freeze gate rejects blanket exclusion of a documented control", (t) => {
    const options = fixture(t);
    options.apiSurface.objects[1].reason =
        "Tag 不是本入口已核实插件任务直接调用、实现或挂载的对象；本次任务由同入口的已纳入对象承担。";
    assert.throws(
        () => validateSharedUiCoverage(options),
        /component-specific exclusion reason/,
    );
});
