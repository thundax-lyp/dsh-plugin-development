export function withoutFencedCode(text) {
    return text.replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1[ \t]*$/gm, "");
}

export function markdownHeadings(text) {
    const body = withoutFencedCode(text);
    const headings = [];
    const counts = new Map();
    for (const match of body.matchAll(/^(#{1,6})\s+(.+?)\s*#*$/gm)) {
        const slug = match[2]
            .replace(/<[^>]*>/g, "")
            .toLowerCase()
            .split("")
            .filter((character) => /[\p{L}\p{N}\p{M} _-]/u.test(character))
            .join("")
            .replaceAll(" ", "-");
        const count = counts.get(slug) ?? 0;
        counts.set(slug, count + 1);
        headings.push({
            title: match[2],
            anchor: count === 0 ? slug : `${slug}-${count}`,
            level: match[1].length,
            start: match.index,
            contentStart: match.index + match[0].length,
        });
    }
    return { body, headings };
}

export function markdownAnchors(text) {
    return new Set(markdownHeadings(text).headings.map(({ anchor }) => anchor));
}

export function markdownSection(text, title, anchor) {
    const { body, headings } = markdownHeadings(text);
    const matches = headings.filter(
        (heading) =>
            heading.title === title && (!anchor || heading.anchor === anchor),
    );
    if (matches.length !== 1) return undefined;
    const heading = matches[0];
    const next = headings.find(
        (candidate) =>
            candidate.start > heading.start && candidate.level <= heading.level,
    );
    return {
        ...heading,
        content: body
            .slice(heading.contentStart, next?.start ?? body.length)
            .trim(),
    };
}
