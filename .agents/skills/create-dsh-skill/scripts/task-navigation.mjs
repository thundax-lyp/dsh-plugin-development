import { readFileSync } from "node:fs";
import { resolveInside } from "./skill-build-contract.mjs";
import { markdownSection } from "./markdown-structure.mjs";

export const navigationStart = "<!-- BEGIN GENERATED TASK NAVIGATION -->";
export const navigationEnd = "<!-- END GENERATED TASK NAVIGATION -->";
export const objectIndexStart = "<!-- BEGIN GENERATED OBJECT INDEX -->";
export const objectIndexEnd = "<!-- END GENERATED OBJECT INDEX -->";
export const objectTableStart = "<!-- BEGIN GENERATED OBJECT TABLE -->";
export const objectTableEnd = "<!-- END GENERATED OBJECT TABLE -->";

function cell(value) {
    return value.replaceAll("|", "\\|").replaceAll(/\s+/g, " ").trim();
}

function replaceBlock(
    body,
    rows,
    label,
    startMarker = navigationStart,
    endMarker = navigationEnd,
) {
    const start = body.indexOf(startMarker);
    const end = body.indexOf(endMarker);
    if (
        start < 0 ||
        end < start ||
        body.indexOf(startMarker, start + 1) >= 0 ||
        body.indexOf(endMarker, end + 1) >= 0
    ) {
        throw new Error(`${label} needs exactly one task navigation block.`);
    }
    return (
        body.slice(0, start) +
        `${startMarker}\n<!-- prettier-ignore -->\n${rows}\n\n${endMarker}` +
        body.slice(end + endMarker.length)
    );
}

function taskLabel(task) {
    if (task.navigationLabel !== undefined) {
        if (
            typeof task.navigationLabel !== "string" ||
            !task.navigationLabel.trim()
        ) {
            throw new Error(`${task.id} needs a non-empty navigationLabel.`);
        }
        return task.navigationLabel;
    }
    if (task.entry) {
        if (
            !Array.isArray(task.userIntents) ||
            task.userIntents.length === 0 ||
            task.userIntents.some(
                (intent) => typeof intent !== "string" || !intent.trim(),
            )
        ) {
            throw new Error(`${task.id} needs non-empty userIntents.`);
        }
        return task.userIntents[0];
    }
    return task.outcome;
}

const taskGroups = [
    { id: "host", title: "Host 与 Agent", prefix: "references/host/how-to/" },
    {
        id: "client",
        title: "Web Client 与跨侧交互",
        prefix: "references/client/how-to/",
    },
    {
        id: "infra",
        title: "配置、运行时与 Provider",
        prefix: "references/infra/how-to/",
    },
];

function taskGroup(task) {
    if (task.navigationGroup) return task.navigationGroup;
    const output = task.destinations[0]?.output ?? "";
    return (
        taskGroups.find(({ prefix }) => output.startsWith(prefix))?.id ??
        "other"
    );
}

export function renderEntrypointTasks(rows) {
    const featured = rows.filter(({ task }) => task.entry);
    const other = rows.filter(({ task }) => !task.entry);
    const sections = [
        "### 常用入口",
        ...featured.map(
            ({ task }) =>
                `- [${cell(taskLabel(task))}](${task.entry.output}#${task.entry.anchor})`,
        ),
    ];
    for (const group of [
        ...taskGroups,
        { id: "other", title: "其他开发任务" },
    ]) {
        const matches = other.filter(
            ({ task }) => taskGroup(task) === group.id,
        );
        if (!matches.length) continue;
        sections.push(
            `### ${group.title}`,
            [
                "| 开发任务 |",
                "| --- |",
                ...matches.map(({ task, links }) =>
                    links.length === 1
                        ? `| ${links[0].replace(/^\[[^\]]+\]/, `[${cell(taskLabel(task))}]`)} |`
                        : `| ${cell(taskLabel(task))}：${links.join("、")} |`,
                ),
            ].join("\n"),
        );
    }
    return sections.join("\n\n");
}

export function renderTaskNavigation(
    coverage,
    files,
    sourceRoot,
    bodies,
    apiSurface,
) {
    const tasks = coverage.taskPaths.filter(
        (task) => task.decision === "covered",
    );
    const featured = tasks.filter((task) => task.entry);
    if (featured.length === 0) {
        throw new Error(
            "Generated task navigation needs a featured task entry.",
        );
    }
    const featuredRows = ["| 用户任务 | 先读 |", "| --- | --- |"];
    const routingRows = ["| 用户任务 | 起点 |", "| --- | --- |"];
    const entrypointRows = [];
    const destinationOwners = new Map();
    const orderedTasks = apiSurface
        ? [...featured, ...tasks.filter((task) => !task.entry)]
        : tasks;
    for (const task of orderedTasks) {
        const links = [];
        for (const destination of task.destinations) {
            const key = `${destination.output}#${destination.section}`;
            const prior = destinationOwners.get(key);
            if (prior && prior !== task.id) {
                throw new Error(
                    `${task.id} shares the same destination section with ${prior}: ${key}`,
                );
            }
            destinationOwners.set(key, task.id);
            const file = files.find(
                (item) => item.output === destination.output,
            );
            if (!file)
                throw new Error(
                    `${task.id} has unknown destination ${destination.output}.`,
                );
            const body = readFileSync(
                resolveInside(
                    sourceRoot,
                    file.source,
                    `${task.id} destination`,
                ),
                "utf8",
            );
            const section = markdownSection(body, destination.section);
            if (!section || !section.content) {
                throw new Error(
                    `${task.id} needs a unique non-empty task section: ${key}`,
                );
            }
            const output = apiSurface
                ? destination.output
                : destination.output.replace(/^references\//, "");
            links.push(
                `[${cell(destination.section)}](${output}#${section.anchor})`,
            );
        }
        routingRows.push(`| ${cell(taskLabel(task))} | ${links.join("、")} |`);
        if (apiSurface) entrypointRows.push({ task, links });
        if (task.entry) {
            featuredRows.push(
                `| ${cell(taskLabel(task))} | [${cell(task.entry.section)}](${task.entry.output}#${task.entry.anchor}) |`,
            );
        }
    }
    if (!apiSurface) {
        return {
            entrypoint: replaceBlock(
                bodies.entrypoint,
                featuredRows.join("\n"),
                "SKILL.md",
            ),
            routing: replaceBlock(
                bodies.routing,
                routingRows.join("\n"),
                "task routing",
            ),
            featuredIds: featured.map((task) => task.id),
        };
    }
    const objects = apiSurface.objects.filter(
        (object) => object.decision === "included",
    );
    const objectRows = ["| 权威契约 |", "| --- |"];
    const objectNames = new Map();
    const symbolCounts = new Map();
    for (const object of objects) {
        symbolCounts.set(
            object.symbol,
            (symbolCounts.get(object.symbol) ?? 0) + 1,
        );
    }
    for (const object of objects.sort(
        (a, b) => a.symbol.localeCompare(b.symbol) || a.id.localeCompare(b.id),
    )) {
        const owner = files.find((file) => file.output === object.owner);
        if (!owner || owner.kind !== "api-guardrail")
            throw new Error(`Missing API reference for ${object.id}.`);
        const body = readFileSync(
            resolveInside(sourceRoot, owner.source, object.id),
            "utf8",
        );
        const section = markdownSection(body, object.section);
        if (!section || !section.content)
            throw new Error(
                `Missing API section for ${object.id}: ${object.section}`,
            );
        let label = `\`${cell(object.symbol)}\``;
        if (symbolCounts.get(object.symbol) > 1) {
            const packageName = /^export:([^:]+):/.exec(object.entry)?.[1];
            if (!packageName)
                throw new Error(
                    `Cannot distinguish duplicate API symbol: ${object.id}`,
                );
            label += `（\`${cell(packageName)}\`）`;
        }
        objectRows.push(
            `| [${label}](${object.owner.replace(/^references\//, "")}#${section.anchor}) |`,
        );
        const candidateSide = object.owner.split("/")[1];
        const side = ["host", "client", "infra"].includes(candidateSide)
            ? candidateSide
            : "other";
        const names = objectNames.get(side) ?? new Set();
        names.add(object.symbol);
        objectNames.set(side, names);
    }
    const nameRows = [];
    for (const side of ["host", "client", "infra", "other"]) {
        const names = [...(objectNames.get(side) ?? [])];
        if (!names.length) continue;
        nameRows.push(
            `### ${side === "other" ? "其他" : side[0].toUpperCase() + side.slice(1)}`,
            "",
        );
        for (let index = 0; index < names.length; index += 12) {
            nameRows.push(
                `- ${names
                    .slice(index, index + 12)
                    .map((name) => `\`${name}\``)
                    .join("、")}`,
            );
        }
        nameRows.push("");
    }
    return {
        entrypoint: replaceBlock(
            replaceBlock(
                bodies.entrypoint,
                renderEntrypointTasks(entrypointRows),
                "SKILL.md",
            ),
            nameRows.join("\n").trimEnd(),
            "SKILL.md object index",
            objectIndexStart,
            objectIndexEnd,
        ),
        objectIndex: replaceBlock(
            bodies.objectIndex,
            objectRows.join("\n"),
            "object index",
            objectTableStart,
            objectTableEnd,
        ),
        featuredIds: featured.map((task) => task.id),
    };
}
