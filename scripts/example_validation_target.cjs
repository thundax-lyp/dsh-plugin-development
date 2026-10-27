const fs = require("node:fs");
const path = require("node:path");

// A generated Skill owns its frozen target; formal/copied Skills use the
// repository's matching version. The runtime checkout never selects evidence.
function resolveValidationTarget(repo, skill, version) {
    const parent = path.dirname(skill);
    const provenance = path.join(parent, "provenance.json");
    if (fs.existsSync(provenance)) {
        const identity = JSON.parse(fs.readFileSync(provenance, "utf8"));
        if (identity.version !== version)
            throw new Error(
                "Selected Skill target version does not match source map",
            );
        return parent;
    }
    return path.join(repo, ".dsh-skill-build", "targets", version);
}
module.exports = { resolveValidationTarget };
