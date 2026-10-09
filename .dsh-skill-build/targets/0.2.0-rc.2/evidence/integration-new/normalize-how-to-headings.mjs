import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const target = process.argv[2];
if (!target) throw new Error("Pass the target directory.");
const root = join(target, "skill-source/how-to");
let changed = 0;
for (const name of readdirSync(root).filter((item) => item.endsWith(".md"))) {
    const path = join(root, name);
    let before = readFileSync(path, "utf8");
    const headingOne = before.match(/^# (.+)$/m)?.[1];
    if (headingOne && new RegExp(`^## ${headingOne.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "m").test(before)) {
        before = before.replace(/^# (.+)$/m, `# ${headingOne}：任务指南`);
        writeFileSync(path, before);
        changed++;
    }
    if (!/^## 目标与前置$/m.test(before)) continue;
    const title = before.match(/^# (.+)$/m)?.[1];
    if (!title) throw new Error(`No H1: ${name}`);
    const first = before.indexOf("\n## 目标与前置");
    if (first < 0) throw new Error(`No task boundary: ${name}`);
    const after = `${before.slice(0, first)}\n## ${title}${before.slice(first).replace(/^#{2,5} /gm, (match) => `#${match}`)}`;
    writeFileSync(path, after);
    changed++;
}
process.stdout.write(`${changed} HOW-TO pages given an exclusive task section\n`);
