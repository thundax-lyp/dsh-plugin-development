import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-skill'

export const name = 'runtime-skill-demo'
export const inject = ['skills']
export function apply(ctx: Context): void {
  ctx.skills.register({
    name: 'check-evidence',
    description: '在写结论前核对原始证据和验证范围。',
    source: 'runtime',
    invocation: { modelInvocable: true, userInvocable: true },
    content: '先读取原始材料。把已验证事实、推断和未验证项分别写清。'
  })
}