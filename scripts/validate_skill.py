"""Validate repository Markdown or an explicit Skill directory.

Default mode checks tracked and non-ignored working-tree files, whether or not
the generated Skill currently exists. --skill checks only that directory,
including ignored generated artifacts. No third-party Python modules required.
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


def offline_boundary_text(path, text):
    if path.suffix == '.md':
        text = FENCES.sub('', text)
        text = re.sub(r'`[^`\n]*`', '', text)
    return text


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


def validate(root, dsh=None, skill=None):
    explicit_skill = skill is not None
    skill = skill or root / 'skills/dsh-plugin-development'
    if explicit_skill and not skill.is_dir():
        raise ValueError(f'Skill directory does not exist: {skill}')
    if explicit_skill:
        files = sorted(path for path in skill.rglob('*') if path.is_file())
    else:
        listed = subprocess.check_output(
            ['git', 'ls-files', '--cached', '--others', '--exclude-standard'],
            cwd=root, text=True,
        ).splitlines()
        files = sorted({
            root / name for name in listed
            if not name.startswith('.dsh-skill-build/') and (root / name).is_file()
        })
    def display(path):
        return path.relative_to(skill if explicit_skill else root)
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
                errors.append(f'{display(path)}: JSON {error}')
        for url in re.findall(r'\]\(([^)]+)\)', FENCES.sub('', text)):
            if re.match(r'\w+://|mailto:', url):
                continue
            links += 1
            filename, separator, anchor = unquote(url).partition('#')
            target = (path.parent / filename).resolve() if filename else path
            if not target.exists():
                errors.append(f'{display(path)}: missing {url}')
            elif separator and anchor and target.suffix == '.md' and anchor not in headings(target):
                errors.append(f'{display(path)}: missing anchor {url}')
    for path in files:
        if path.suffix in ('.md', '.yml', '.yaml') and re.search(r'[\t ]+$', path.read_text(), re.M):
            errors.append(f'trailing whitespace: {display(path)}')
    if skill.is_dir():
        for path in skill.rglob('*'):
            if path.is_file() and re.search(r'https?://|/Volumes/|/Users/',
                                            offline_boundary_text(path, path.read_text())):
                errors.append(f'offline/local-path violation: {display(path)}')

    source_map_path = skill / 'maintenance/source-map.md'
    if explicit_skill and not source_map_path.is_file():
        errors.append(f'missing source map: {display(source_map_path)}')
    if dsh and not source_map_path.is_file():
        errors.append(f'cannot validate DSH checkout without a generated Skill source map: {display(source_map_path)}')
    source_map = source_map_path.read_text() if source_map_path.is_file() else ''
    paths = set(SOURCE_PATHS.findall(source_map))
    if dsh and source_map:
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
    print(f'{len(paths)} source paths checked' if dsh and source_map else 'Source path validation NOT RUN (pass --dsh with a generated Skill)')
    print('\n'.join(errors) if errors else 'PASS')
    return bool(errors)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--dsh', type=Path, help='Exact checkout for this generated Skill; omit for repository structural checks')
    parser.add_argument('--skill', type=Path, help='Validate this Skill directory alone; defaults to the repository Skill')
    args = parser.parse_args()
    return validate(
        Path(__file__).resolve().parents[1],
        args.dsh.resolve() if args.dsh else None,
        args.skill.resolve() if args.skill else None,
    )


if __name__ == '__main__':
    raise SystemExit(main())
