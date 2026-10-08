export function withoutFencedCode(text) {
    return text.replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1[ \t]*$/gm, "");
}

export function markdownAnchors(text) {
    const anchors = new Set();
    const counts = new Map();
    for (const match of withoutFencedCode(text).matchAll(
        /^#{1,6}\s+(.+?)\s*#*$/gm,
    )) {
        const slug = match[1]
            .replace(/<[^>]*>/g, "")
            .toLowerCase()
            .split("")
            .filter((character) => /[\p{L}\p{N}\p{M} _-]/u.test(character))
            .join("")
            .replaceAll(" ", "-");
        const count = counts.get(slug) ?? 0;
        counts.set(slug, count + 1);
        anchors.add(count === 0 ? slug : `${slug}-${count}`);
    }
    return anchors;
}
