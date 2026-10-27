import type { Context } from '@deepseek-ai/cordis'
import { LlmAdapter, type GenerateOptions, type LlmModelInfo, type StreamChunk } from '@deepseek-ai/dsh-llm'

class LocalAdapter extends LlmAdapter {
  override async listModels(provider: string): Promise<readonly LlmModelInfo[]> {
    return [{ provider, id: 'local-fixed', name: '本地固定文本' }]
  }

  override async *stream(options: GenerateOptions): AsyncIterable<StreamChunk> {
    if (options.stop !== undefined || options.temperature !== undefined || options.maxTokens !== undefined || options.reasoningEffort !== undefined) {
      yield { type: 'finish', reason: { kind: 'error', failure: { code: 'UNSUPPORTED_OPTION', message: '本地固定提供方不接受生成控制参数' } } }
      return
    }
    if (options.signal?.aborted) {
      yield { type: 'finish', reason: { kind: 'aborted', failure: { code: 'ABORTED', message: '调用已取消' } } }
      return
    }
    yield { type: 'block-start', index: 0, blockType: 'text' }
    yield { type: 'text-delta', index: 0, text: '离线提供方已接入' }
    yield { type: 'block-end', index: 0, block: { type: 'text', text: '离线提供方已接入' } }
    yield { type: 'finish', reason: { kind: 'stop' } }
  }
}

export const name = 'local-scripted-llm'
export const inject = ['llm']
export function apply(ctx: Context): void {
  ctx.llm.registerAdapter(['local-scripted'], new LocalAdapter())
}