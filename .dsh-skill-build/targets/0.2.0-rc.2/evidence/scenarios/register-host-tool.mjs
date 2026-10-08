import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const checkout = process.env.DSH_TARGET_CHECKOUT;
if (!checkout || process.env.DSH_TASK_VERIFICATION_OFFLINE !== "1") {
    throw new Error("This scenario requires the offline target checkout runner.");
}

const evidence = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const howTo = readFileSync(join(evidence, "../skill-source/how-to/host-core.md"), "utf8");
const host = howTo.match(/```ts\n([\s\S]*?)\n```/)?.[1];
const verification = howTo.match(/```js\n([\s\S]*?)\n```/)?.[1];
if (!host || !verification) throw new Error("Host Tool task needs both complete code blocks.");

const scratch = mkdtempSync(join(checkout, "apps/cli/scratch-plugin-scenario-"));
try {
    mkdirSync(join(scratch, "src"));
    writeFileSync(join(scratch, "src/my-plugin.ts"), host + "\n");
    writeFileSync(join(scratch, "verify.mjs"), verification + "\n");
    const result = spawnSync(process.execPath, ["--import", "tsx", join(scratch, "verify.mjs")], {
        cwd: checkout,
        env: process.env,
        encoding: "utf8",
        timeout: 120_000,
    });
    if (result.error || result.status !== 0) {
        throw new Error(`Host Tool verification failed: ${result.error?.message ?? result.stderr ?? result.stdout}`);
    }
    if (!result.stdout.includes("Tool success, failure, cancellation, and unload verified")) {
        throw new Error(`Expected verification assertion output was absent: ${result.stdout}`);
    }
    process.stdout.write(JSON.stringify({
        taskId: "register-host-tool",
        checks: { "package-resolution": true, "tool-call": true, unload: true },
    }) + "\n");
} finally {
    rmSync(scratch, { recursive: true, force: true });
}
