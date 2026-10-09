import { readFileSync } from "node:fs";
import { resolveInside } from "./skill-build-contract.mjs";
import { markdownSection } from "./markdown-structure.mjs";

export const navigationStart = "<!-- BEGIN GENERATED TASK NAVIGATION -->";
export const navigationEnd = "<!-- END GENERATED TASK NAVIGATION -->";
export const objectIndexStart = "<!-- BEGIN GENERATED OBJECT INDEX -->";
export const objectIndexEnd = "<!-- END GENERATED OBJECT INDEX -->";

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
    const objectRows = ["| 关键对象 | 权威契约 |", "| --- | --- |"];
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
        objectRows.push(
            `| ${cell(object.symbol)} (${cell(object.id)}) | [${cell(object.section)}](${object.owner}#${section.anchor}) |`,
        );
    }
    return {
        entrypoint: replaceBlock(
            replaceBlock(bodies.entrypoint, routingRows.join("\n"), "SKILL.md"),
            objectRows.join("\n"),
            "SKILL.md object index",
            objectIndexStart,
            objectIndexEnd,
        ),
        featuredIds: featured.map((task) => task.id),
    };
}
