import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const target = process.argv[2];
if (!target) throw new Error("Pass the target directory.");
const read = (path) => JSON.parse(readFileSync(join(target, path), "utf8"));
const surface = read("skill-source/api-surface.json");
const candidates = new Map(read("evidence/api-entry-candidates.json").candidates.map((candidate) => [candidate.id, candidate]));
const tracked = new Set(execFileSync("git", ["ls-files", "-z"], { cwd: join(target, "checkout"), encoding: "utf8" }).split("\0").filter(Boolean));
const rows = [];
for (const entry of surface.entries.filter((item) => item.decision === "included")) {
    const objects = surface.objects.filter((object) => object.entry === entry.candidate && object.decision === "included");
    const packageFile = candidates.get(entry.candidate)?.path;
    const byOwner = new Map();
    for (const object of objects) {
        const paths = byOwner.get(object.owner) ?? new Set();
        if (packageFile && tracked.has(packageFile)) paths.add(packageFile);
        if (tracked.has(object.source)) paths.add(object.source);
        byOwner.set(object.owner, paths);
    }
    for (const [owner, paths] of byOwner) rows.push({ owner, entry: entry.candidate, paths: [...paths] });
}
const lines = [
    "# 源码映射",
    "",
    "本页映射 `@deepseek-ai/dsh-agent@0.2.0-rc.2` 的公开入口与本文档对应的目标版本源码。路径相对于同版本 DSH checkout；包导出与声明证明可达性，行为仍需结合实现、门禁和测试核查。",
    "",
    "| 权威 API 页 | 公开入口 | 目标版本证据路径 |",
    "| --- | --- | --- |",
];
for (const row of rows.sort((a, b) => a.owner.localeCompare(b.owner) || a.entry.localeCompare(b.entry))) {
    const paths = [...new Set(row.paths)].sort().map((path) => `\`${path}\``).join("、");
    lines.push(`| [${row.owner.replace("references/", "")}](${`../${row.owner}`}) | \`${row.entry}\` | ${paths} |`);
}
lines.push("", "## 验证边界", "", "本页只提供定位路径。完整代码、装载顺序和结果判据由相应 HOW-TO 与 example 说明；对外部消费包、Client 构建或 Remote 组合，必须另做目标版本的实际验证。", "");
writeFileSync(join(target, "skill-source/maintenance/source-map.md"), lines.join("\n"));
process.stdout.write(`${rows.length} API entry/owner mappings\n`);
