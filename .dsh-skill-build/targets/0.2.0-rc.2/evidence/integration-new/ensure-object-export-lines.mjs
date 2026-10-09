import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { markdownSection } from '../../../../../.agents/skills/create-dsh-skill/scripts/markdown-structure.mjs'

const target = process.argv[2]
if (!target) throw new Error('Pass the target directory.')
const read = (path) => JSON.parse(readFileSync(join(target, path), 'utf8'))
const manifest = read('skill-source/manifest.json')
const surface = read('skill-source/api-surface.json')
const byOwner = new Map()
for (const object of surface.objects.filter((item) => item.decision === 'included')) {
  const list = byOwner.get(object.owner) ?? []
  list.push(object)
  byOwner.set(object.owner, list)
}
let count = 0
for (const [owner, objects] of byOwner) {
  const file = manifest.files.find((item) => item.output === owner)
  if (!file) throw new Error(`Unknown owner: ${owner}`)
  const path = join(target, 'skill-source', file.source)
  let body = readFileSync(path, 'utf8')
  for (const object of objects) {
    const section = markdownSection(body, object.section)
    if (!section) throw new Error(`Unknown section: ${owner}#${object.section}`)
    if (section.content.includes(object.symbol)) continue
    const match = object.entry.match(/^export:(.+):(\.|\.\/.+)$/)
    if (!match) throw new Error(`Invalid entry: ${object.entry}`)
    const specifier = `${match[1]}${match[2] === '.' ? '' : match[2].slice(1)}`
    const marker = `## ${object.section}\n`
    const index = body.indexOf(marker)
    if (index < 0 || body.indexOf(marker, index + marker.length) >= 0) throw new Error(`Duplicate heading: ${owner}#${object.section}`)
    body = `${body.slice(0, index + marker.length)}\n**公开导出**：\`${object.symbol}\` 来自 \`${specifier}\`。${body.slice(index + marker.length)}`
    count++
  }
  writeFileSync(path, body)
}
process.stdout.write(`${count} API object sections given explicit export lines\n`)
