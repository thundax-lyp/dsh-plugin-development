import assert from 'node:assert/strict'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
const target=resolve(dirname(fileURLToPath(import.meta.url)),'../..')
const { SettingsFormModel, settingsNumberField } = await import(pathToFileURL(join(target,'checkout/packages/client/ui-primitives/lib/types/settings-form/form-model.js')))
let snapshot={status:'ready',value:{retries:3},base:{retries:3},user:{},writable:true,revision:10}
const listeners=new Set()
const calls=[]
let pending
const scope={getSnapshot:()=>snapshot,subscribe:fn=>{listeners.add(fn);return()=>listeners.delete(fn)},mutate:async(ops,revision)=>{calls.push({ops,revision}); return pending ? await pending.promise : false}}
const model=new SettingsFormModel(scope,[settingsNumberField('retries')])
const store=model.bind(()=>({...model.shell(),retries:model.field('retries')}))
let published=0;const off=store.subscribe(()=>published++)
model.actions().edit('retries','4')
snapshot={...snapshot,revision:11,value:{retries:7},user:{retries:7}}
for(const fn of listeners)fn()
await model.save()
assert.equal(calls[0].revision,10)
assert.deepEqual(calls[0].ops,[{op:'set',path:['retries'],value:4}])
assert.equal(model.field('retries').text,'4')
assert.equal(model.shell().failed,true)
model.actions().discard();model.actions().edit('retries','8')
pending=Promise.withResolvers()
const save=model.save();await Promise.resolve()
assert.equal(calls.at(-1).revision,11)
const atDispose=published
model.dispose();assert.equal(listeners.size,0)
pending.resolve(true);await save
assert.equal(published,atDispose)
off()
console.log(JSON.stringify({taskId:'client-ui-settings',hostBlocks:0,clientBlocks:0,checks:{'first-edit-baseline-revision':true,'conflict-preserves-draft':true,'discard-new-baseline':true,'dispose-unsubscribes':true,'late-save-no-ui-publication':true}}))
