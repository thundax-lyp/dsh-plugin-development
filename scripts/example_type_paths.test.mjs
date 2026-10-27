import assert from "node:assert/strict";
import test from "node:test";
import mappings from "./example_type_paths.cjs";

test("maps the pinned checker aliases without treating example fixtures as declaration packages", () => {
    const cases = [
        ["./packages/*/*/src", "./packages/*/*/lib/types"],
        [
            "./packages/core/session/src/*",
            "./packages/core/session/lib/types/*",
        ],
        [
            "./packages/core/session/src/types.ts",
            "./packages/core/session/lib/types/types.d.ts",
        ],
        [
            "./packages/client/modules/src/client",
            "./packages/client/modules/lib/types/client",
        ],
        [
            "./packages/experimental/claude-code-mods/examples/*",
            "./packages/experimental/claude-code-mods/examples/*",
        ],
    ];
    for (const [source, expected] of cases) {
        assert.equal(mappings.builtDeclarationPath(source), expected);
    }
    assert.throws(
        () =>
            mappings.builtDeclarationPath(
                "./packages/core/session/source/index.ts",
            ),
        /Unsupported declaration mapping/,
    );
});
