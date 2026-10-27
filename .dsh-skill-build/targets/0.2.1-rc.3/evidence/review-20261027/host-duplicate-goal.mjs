import assert from 'node:assert/strict'
import { Context } from '../../checkout/vendor/cordis/lib/index.js'
import { GoalService } from '../../checkout/packages/goal/goal/lib/index.js'
// 仅验证同一scope的真实GoalService注册冲突；非完整Profile装载。
const ctx = new Context()
ctx.provide('sessionProjections', { register() { return () => {} } })
try {
  new GoalService(ctx)
  assert.throws(() => new GoalService(ctx), /service "goals" has been registered/)
  console.log(JSON.stringify({ duplicateGoalRejected: true, scope: 'same', projectionRegistry: 'stub' }))
} finally {
  await ctx.fiber.dispose()
}
