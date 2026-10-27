import assert from 'node:assert/strict'
import { Context } from '@deepseek-ai/cordis'
import LlmRuntime from '@deepseek-ai/dsh-llm'
import SkillRegistry from '@deepseek-ai/dsh-skill'
import * as localLlm from './runtime-llm.ts'
import * as localSkill from './runtime-skill.ts'
const ctx = new Context()
try {
  await ctx.plugin(LlmRuntime)
  await ctx.plugin(SkillRegistry)
  const lf = ctx.plugin(localLlm)
  const sf = ctx.plugin(localSkill)
  await lf
  await sf
  assert(ctx.llm.listProviders().some(x => x.id === 'local-scripted'))
  assert((await ctx.llm.listModels('local-scripted')).some(x => x.id === 'local-fixed'))
  const chunks = []
  for await (const c of ctx.llm.stream({provider:'local-scripted',model:'local-fixed',messages:[]})) chunks.push(c)
  assert.equal(chunks.filter(c=>c.type==='finish').length,1)
  assert.equal(chunks.at(-1)?.type,'finish')
  assert(chunks.some(c=>c.type==='text-delta'&&c.text==='离线提供方已接入'))
  const aborted = []
  for await (const c of ctx.llm.stream({provider:'local-scripted',model:'local-fixed',messages:[],signal:AbortSignal.abort('test')})) aborted.push(c)
  assert(aborted.some(c=>c.type==='finish'&&c.reason.kind==='aborted'))
  assert.equal((await ctx.skills.get('check-evidence'))?.content,'先读取原始材料。把已验证事实、推断和未验证项分别写清。')
  await lf.dispose()
  await sf.dispose()
  assert(!ctx.llm.listProviders().some(x=>x.id==='local-scripted'))
  assert.equal(await ctx.skills.get('check-evidence'),undefined)
  console.log(JSON.stringify({pluginLoad:true,llmCall:true,llmCancel:true,skillGet:true,unload:true}))
} finally { await ctx.fiber.dispose() }
