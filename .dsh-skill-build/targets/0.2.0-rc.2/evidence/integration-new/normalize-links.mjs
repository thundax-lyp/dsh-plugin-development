import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const target = process.argv[2];
if (!target) throw new Error("Pass the target directory.");
let changed = 0;
for (const directory of ["api-guardrails", "how-to", "examples"]) {
    const root = join(target, "skill-source", directory);
    for (const name of readdirSync(root).filter((item) => item.endsWith(".md"))) {
        const path = join(root, name);
        const before = readFileSync(path, "utf8");
        const after = before.replaceAll("](./api-", "](api-").replaceAll("](./how-to-", "](how-to-").replaceAll("](./example-", "](example-");
        if (after !== before) {
            writeFileSync(path, after);
            changed++;
        }
    }
}
process.stdout.write(`${changed} source Markdown files normalized\n`);
