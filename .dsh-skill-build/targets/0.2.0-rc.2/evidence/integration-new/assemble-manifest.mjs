import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const target = process.argv[2];
if (!target) throw new Error("Pass the target directory.");
const root = join(target, "skill-source");
const manifestPath = join(root, "manifest.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
if (manifest.status !== "draft" || manifest.taskNavigation !== "entrypoint") {
    throw new Error("Expected a draft entrypoint target.");
}
const infra = JSON.parse(
    readFileSync(join(target, "evidence/infra-runtime-new/recommendations.json"), "utf8"),
);
const infraFiles = new Map(infra.files.map((file) => [file.source, file]));
const profile = JSON.parse(readFileSync(join(target, "evidence/integration-new/profile-recommendations.json"), "utf8"));
const profileFiles = new Map(profile.files.map((file) => [file.source, file]));
let providerFiles = new Map();
try {
    const provider = JSON.parse(readFileSync(join(target, "evidence/infra-runtime-new/provider-recommendations.json"), "utf8"));
    providerFiles = new Map((provider.files ?? []).map((file) => [file.source, file]));
} catch (error) {
    if (error.code !== "ENOENT") throw error;
}
const files = [
    { source: "entrypoint/SKILL.md", output: "SKILL.md", kind: "entrypoint" },
    { source: "metadata/openai.yaml", output: "agents/openai.yaml", kind: "metadata" },
];
for (const name of readdirSync(join(root, "api-guardrails")).filter((name) => name.endsWith(".md")).sort()) {
    const source = `api-guardrails/${name}`;
    if (name.startsWith("infra-")) {
        const entry = infraFiles.get(source) ?? providerFiles.get(source) ?? profileFiles.get(source)
            ?? (name.startsWith("infra-provider-") ? {
                source,
                output: `references/api-${name}`,
                kind: "api-guardrail",
                topic: "infra-integration",
                role: "subject",
                subject: name.replace(/^infra-/, "").replace(/\.md$/, ""),
            } : null);
        if (!entry) throw new Error(`Infra mapping missing: ${source}`);
        files.push(entry);
        continue;
    }
    const topic = name.startsWith("host-") ? "host-core" : name.startsWith("client-") ? "client-web" : null;
    if (!topic) throw new Error(`API topic missing: ${source}`);
    const role = name.endsWith("-topic.md") ? "topic" : "subject";
    files.push({
        source,
        output: `references/api-${name}`,
        kind: "api-guardrail",
        topic,
        role,
        ...(role === "subject" ? { subject: name.replace(/^(host|client)-/, "").replace(/\.md$/, "") } : {}),
    });
}
for (const [directory, kind, prefix] of [
    ["how-to", "how-to", "how-to-"],
    ["examples", "example", ""],
]) {
    for (const name of readdirSync(join(root, directory)).filter((name) => name.endsWith(".md")).sort()) {
        const source = `${directory}/${name}`;
        const infraEntry = infraFiles.get(source) ?? providerFiles.get(source) ?? profileFiles.get(source);
        files.push(infraEntry ?? { source, output: `references/${prefix}${name}`, kind });
    }
}
for (const name of ["source-map.md", "skill-maintenance.md"]) {
    files.push({ source: `maintenance/${name}`, output: `maintenance/${name}`, kind: "maintenance" });
}
manifest.topics = ["host-core", "client-web", ...Object.keys(infra.topics)];
manifest.files = files;
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 4)}\n`);
process.stdout.write(`${files.length} files; topics: ${manifest.topics.join(", ")}\n`);
