import { readFileSync } from "node:fs";
import { posix } from "node:path";
import { markdownSection } from "./markdown-structure.mjs";
import { resolveInside } from "./skill-build-contract.mjs";

const packageName = "@deepseek-ai/dsh-client-ui-primitives";
const taskCandidateId = `task:package:${packageName}:component-reuse`;
const objectPrefix = `export:${packageName}:`;

export function documentedSharedUiComponents(readme) {
    const symbols = new Set();
    let inCatalog = false;
    for (const line of readme.split(/\r?\n/)) {
        if (/^\|\s*(?:导出|Export)\s*\|/i.test(line)) {
            inCatalog = true;
            continue;
        }
        if (!inCatalog) continue;
        if (!line.startsWith("|")) break;
        if (/^\|\s*[-:]+\s*\|/.test(line)) continue;
        const cell = line.split("|")[1] ?? "";
        for (const match of cell.matchAll(/`([A-Za-z_$][\w$]*)`/g)) {
            symbols.add(match[1]);
        }
    }
    return symbols;
}

export function validateSharedUiCoverage({
    inventory,
    taskCandidates,
    coverage,
    apiSurface,
    files,
    sourceRoot,
    checkoutRoot,
    entrypointBody,
}) {
    const manifest = inventory.packageManifests?.find(
        (item) => item.name === packageName && item.private !== true,
    );
    if (!manifest?.exports?.["."]) return;

    if (
        !taskCandidates.candidates.some((item) => item.id === taskCandidateId)
    ) {
        throw new Error(
            `${packageName} needs a shared UI component task candidate; rerun inventory for this target.`,
        );
    }
    const discovery = coverage.taskDiscoveries.find(
        (item) => item.candidate === taskCandidateId,
    );
    if (discovery?.decision !== "included") {
        throw new Error(
            `${packageName} component selection must have a covered plugin task.`,
        );
    }
    const task = coverage.taskPaths.find(
        (item) => item.id === discovery.taskId && item.decision === "covered",
    );
    const includedObjects = apiSurface.objects.filter(
        (item) =>
            item.id.startsWith(objectPrefix) && item.decision === "included",
    );
    const taskObjects = includedObjects.filter((item) =>
        task?.apiObjects?.includes(item.id),
    );
    if (
        !task ||
        task.kind !== "shared-ui-component-selection" ||
        taskObjects.length === 0
    ) {
        throw new Error(
            `${packageName} component selection task must use an included UI object.`,
        );
    }
    const destination = task.destinations.find((item) =>
        item.output.startsWith("references/client/how-to/"),
    );
    const howTo = files.find((item) => item.output === destination?.output);
    const owner = taskObjects[0].owner;
    if (!howTo || !owner) {
        throw new Error(
            `${packageName} component selection needs a Client HOW-TO and API owner.`,
        );
    }
    const body = readFileSync(
        resolveInside(sourceRoot, howTo.source, "shared UI HOW-TO"),
        "utf8",
    );
    const relativeOwner = posix.relative(posix.dirname(howTo.output), owner);
    if (!body.includes(`](${relativeOwner}`)) {
        throw new Error(
            `${packageName} component selection HOW-TO must link its UI API owner.`,
        );
    }
    const keywords =
        markdownSection(entrypointBody, "关键词索引")?.content ?? "";
    if (
        !keywords
            .split("\n")
            .some(
                (line) =>
                    /组件|控件|component|primitive/i.test(line) &&
                    line.includes(`](${owner}`),
            )
    ) {
        throw new Error(
            `${packageName} needs a keyword route to its shared UI API owner.`,
        );
    }

    const packageDir = posix.dirname(manifest.path);
    const readmePath =
        inventory.readmes
            ?.map((item) => item.path)
            .find((path) => path === `${packageDir}/README.zh.md`) ??
        inventory.readmes
            ?.map((item) => item.path)
            .find((path) => path === `${packageDir}/README.md`);
    if (!readmePath) return;
    const documented = documentedSharedUiComponents(
        readFileSync(
            resolveInside(checkoutRoot, readmePath, "shared UI README"),
            "utf8",
        ),
    );
    for (const object of apiSurface.objects) {
        if (
            !object.id.startsWith(objectPrefix) ||
            !documented.has(object.symbol) ||
            object.decision !== "excluded"
        )
            continue;
        if (
            /不是本入口已核实插件任务直接调用|由同入口的已纳入对象承担/.test(
                object.reason ?? "",
            )
        ) {
            throw new Error(
                `${object.id} needs a component-specific exclusion reason grounded in its use or public contract.`,
            );
        }
    }
}
