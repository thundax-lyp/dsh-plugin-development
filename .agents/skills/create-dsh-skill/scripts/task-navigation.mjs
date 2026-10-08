import { readFileSync } from "node:fs";
import { resolveInside } from "./skill-build-contract.mjs";
import { markdownSection } from "./markdown-structure.mjs";

export const navigationStart = "<!-- BEGIN GENERATED TASK NAVIGATION -->";
export const navigationEnd = "<!-- END GENERATED TASK NAVIGATION -->";

function cell(value) {
    return value.replaceAll("|", "\\|").replaceAll(/\s+/g, " ").trim();
}

function replaceBlock(body, rows, label) {
    const start = body.indexOf(navigationStart);
    const end = body.indexOf(navigationEnd);
    if (
        start < 0 ||
        end < start ||
        body.indexOf(navigationStart, start + 1) >= 0 ||
        body.indexOf(navigationEnd, end + 1) >= 0
    ) {
        throw new Error(`${label} needs exactly one task navigation block.`);
    }
    return (
        body.slice(0, start) +
        `${navigationStart}\n<!-- prettier-ignore -->\n${rows}\n\n${navigationEnd}` +
        body.slice(end + navigationEnd.length)
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

export function renderTaskNavigation(coverage, files, sourceRoot, bodies) {
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
    for (const task of tasks) {
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
            links.push(
                `[${cell(destination.section)}](${destination.output.replace(/^references\//, "")}#${section.anchor})`,
            );
        }
        routingRows.push(`| ${cell(taskLabel(task))} | ${links.join("、")} |`);
        if (task.entry) {
            featuredRows.push(
                `| ${cell(taskLabel(task))} | [${cell(task.entry.section)}](${task.entry.output}#${task.entry.anchor}) |`,
            );
        }
    }
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
