// @vitest-environment jsdom
import { readFile } from 'node:fs/promises'
import * as React from 'react'
import * as JsxRuntime from 'react/jsx-runtime'
import { act, fireEvent, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { SlotTestRuntime } from '@deepseek-ai/dsh-client-test-runtime'
import * as primitives from '@deepseek-ai/dsh-client-ui-primitives'
import { ClientModuleSystem } from '@deepseek-ai/dsh-client-modules/client'
import type { ClientModuleLoaderTarget } from '@deepseek-ai/dsh-client-modules/client'
import type { Plugin } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'

it('imports built external consumer factory, mounts public overlay and Modal, and unloads its fiber', async () => {
  const facade: ClientModuleLoaderTarget = {
    mode: 'queue', pendingQueue: [],
    load(registration) { this.pendingQueue.push(registration) },
    create() { throw new Error('scenario constructs the production module system directly') },
  }
  const system = new ClientModuleSystem({
    manifest: { rev: 'local-verification', modules: [], plugins: [] },
    staticModules: { react: React, 'react/jsx-runtime': JsxRuntime,
      '@deepseek-ai/dsh-client-ui-primitives': primitives },
    registrationTarget: facade, bootstrapModule: { id: '@deepseek-ai/dsh-client-modules', exports: {} },
    loadBundle: async () => { throw new Error('network transport is forbidden in this scenario') },
  })
  Object.assign(window, { __ModuleLoader__: facade })
  const bundle = await readFile(process.env.DSH_CLIENT_CONSUMER_BUNDLE!, 'utf8')
  expect(bundle).toContain('window.__ModuleLoader__.load')
  new Function('window', bundle)(window)
  expect(system.loadCache.has('acme-dsh-overlay')).toBe(false)
  const plugin = await system.import('acme-dsh-overlay') as Plugin
  expect(system.loadCache.has('acme-dsh-overlay')).toBe(true)
  const runtime = await SlotTestRuntime.create()
  try {
    await runtime.declare({ 'shell.overlay': { kind: 'list', scope: 'root' } })
    const feature = await runtime.mount(plugin)
    runtime.renderSlot('shell.overlay', {})
    expect(screen.getAllByRole('button', { name: '插件状态' })).toHaveLength(1)
    await act(async () => { screen.getByRole('button', { name: '插件状态' }).focus(); fireEvent.click(screen.getByRole('button', { name: '插件状态' })) })
    expect(screen.getByRole('dialog', { name: '插件状态' })).toBeTruthy()
    expect(document.activeElement?.textContent).toBe('完成')
    await act(async () => { fireEvent.keyDown(document, { key: 'Escape' }) })
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(document.activeElement).toBe(screen.getByRole('button', { name: '插件状态' }))
    await act(async () => { screen.getByRole('button', { name: '插件状态' }).focus(); fireEvent.click(screen.getByRole('button', { name: '插件状态' })) })
    await feature.dispose()
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.queryByRole('button', { name: '插件状态' })).toBeNull()
    expect(runtime.slots.entries('shell.overlay')).toHaveLength(0)
    const second = await runtime.mount(plugin)
    expect(screen.getAllByRole('button', { name: '插件状态' })).toHaveLength(1)
    await second.dispose()
    expect(runtime.slots.entries('shell.overlay')).toHaveLength(0)
  } finally {
    await runtime.dispose()
    Reflect.deleteProperty(window, '__ModuleLoader__')
  }
})
