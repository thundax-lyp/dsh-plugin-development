"""Validate repository Markdown and optional exact-tag DSH source evidence.

Only tracked and non-ignored working-tree files participate, so temporary
checkouts cannot contaminate a local run. No third-party Python modules required.
"""
import argparse
import json
import re
import subprocess
import unicodedata
from pathlib import Path
from urllib.parse import unquote

FENCES = re.compile(r'^```[^\n]*\n.*?^```\s*$', re.M | re.S)
SOURCE_PATHS = re.compile(
    r'`((?:packages|docs|scripts|vendor|apps|snapshots|examples|python|native)/[^`]+'
    r'|package.json|AGENTS.md|tsconfig.client.json|tsconfig.host.json|[^`]*config\.ts)`'
)


def headings(path):
    text = FENCES.sub('', path.read_text())
    anchors = set(re.findall(r'(?:id|name)=["\']([^"\']+)', text))
    counts = {}
    for heading in re.findall(r'^#{1,6}\s+(.+?)\s*#*$', text, re.M):
        heading = re.sub(r'<[^>]*>', '', heading).lower()
        slug = ''.join(char for char in heading
                       if char in ' -_' or unicodedata.category(char)[0] in 'LNM')
        slug = slug.replace(' ', '-')
        count = counts.get(slug, 0)
        counts[slug] = count + 1
        anchors.add(slug + (f'-{count}' if count else ''))
    return anchors


def validate(root, dsh=None):
    skill = root / '.agents/skills/dsh-plugin-development'
    listed = subprocess.check_output(
        ['git', 'ls-files', '--cached', '--others', '--exclude-standard'],
        cwd=root, text=True,
    ).splitlines()
    files = sorted({root / name for name in listed if (root / name).is_file()})
    markdown = [path for path in files if path.suffix == '.md']
    errors = []
    links = fences = 0
    for path in markdown:
        text = path.read_text()
        for block in re.findall(r'^```json\s*\n(.*?)^```\s*$', text, re.M | re.S):
            fences += 1
            try:
                json.loads(block)
            except ValueError as error:
                errors.append(f'{path.relative_to(root)}: JSON {error}')
        for url in re.findall(r'\]\(([^)]+)\)', FENCES.sub('', text)):
            if re.match(r'\w+://|mailto:', url):
                continue
            links += 1
            filename, separator, anchor = unquote(url).partition('#')
            target = (path.parent / filename).resolve() if filename else path
            if not target.exists():
                errors.append(f'{path.relative_to(root)}: missing {url}')
            elif separator and anchor and target.suffix == '.md' and anchor not in headings(target):
                errors.append(f'{path.relative_to(root)}: missing anchor {url}')
    for path in files:
        if path.suffix in ('.md', '.yml', '.yaml') and re.search(r'[\t ]+$', path.read_text(), re.M):
            errors.append(f'trailing whitespace: {path.relative_to(root)}')
    for path in skill.rglob('*'):
        if path.is_file() and re.search(r'https?://|/Volumes/|/Users/', path.read_text()):
            errors.append(f'offline/local-path violation: {path.relative_to(root)}')

    source_map = (skill / 'references/source-map.md').read_text()
    paths = set(SOURCE_PATHS.findall(source_map))
    if dsh:
        tag = re.search(r'`(dsh-v[^`]+)`', source_map)[1]
        sha = re.search(r'commit `([0-9a-f]{40})`', source_map)[1]
        for ref in ('HEAD', tag):
            actual = subprocess.check_output(
                ['git', 'rev-parse', ref + '^{commit}'], cwd=dsh, text=True,
            ).strip()
            if actual != sha:
                errors.append(f'baseline mismatch: {ref} is {actual}, expected {sha}')
        for filename in paths:
            if not (dsh / filename).exists():
                errors.append(f'source map missing {filename}')
    print(f'{len(markdown)} Markdown files; {links} local links/anchors; {fences} JSON fences')
    print(f'{len(paths)} source paths checked' if dsh else 'Source path validation NOT RUN (pass --dsh)')
    print('\n'.join(errors) if errors else 'PASS')
    return bool(errors)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--dsh', type=Path, help='Exact baseline checkout; omit for offline structural checks')
    args = parser.parse_args()
    return validate(Path(__file__).resolve().parents[1], args.dsh.resolve() if args.dsh else None)


if __name__ == '__main__':
    raise SystemExit(main())
