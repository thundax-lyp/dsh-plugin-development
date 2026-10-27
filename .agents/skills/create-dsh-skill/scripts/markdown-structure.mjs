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

// API contracts live in code fences. Keep their content while ignoring
// headings inside those fences when locating the owning Markdown section.
export function markdownSectionWithCode(text, title) {
    const lines = text.split("\n");
    let fence,
        start,
        level,
        end = lines.length,
        matches = 0;
    for (let index = 0; index < lines.length; index++) {
        const marker = lines[index].match(/^(`{3,}|~{3,})/);
        if (marker) {
            if (!fence) fence = marker[1];
            else if (marker[1] === fence) fence = undefined;
            continue;
        }
        if (fence) continue;
        const heading = lines[index].match(/^(#{1,6})\s+(.+?)\s*#*$/);
        if (!heading) continue;
        if (
            start !== undefined &&
            end === lines.length &&
            heading[1].length <= level
        )
            end = index;
        if (heading[2] === title) {
            matches++;
            if (start === undefined) {
                start = index + 1;
                level = heading[1].length;
            }
        }
    }
    return matches === 1
        ? { level, content: lines.slice(start, end).join("\n").trim() }
        : undefined;
}
