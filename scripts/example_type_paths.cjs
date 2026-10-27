// Match the pinned upstream checker's supported workspace alias forms.
function builtDeclarationPath(candidate) {
    if (candidate.endsWith("/src")) {
        return `${candidate.slice(0, -4)}/lib/types`;
    }
    if (candidate.endsWith("/src/*")) {
        return `${candidate.slice(0, -6)}/lib/types/*`;
    }
    if (candidate.includes("/examples/")) return candidate;
    const sourceFile = /^(.*)\/src\/(.+)\.ts$/.exec(candidate);
    if (sourceFile) {
        return `${sourceFile[1]}/lib/types/${sourceFile[2]}.d.ts`;
    }
    const sourceDirectory = /^(.*)\/src\/(.+)$/.exec(candidate);
    if (sourceDirectory) {
        return `${sourceDirectory[1]}/lib/types/${sourceDirectory[2]}`;
    }
    throw new Error(`Unsupported declaration mapping: ${candidate}`);
}

module.exports = { builtDeclarationPath };
