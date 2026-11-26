import test from 'node:test'
import assert from 'node:assert/strict'
import {COMPANION_PEOPLE,validClient,companionContext,resolveCompanionFocus,companionSteps,companionExplanation} from '../src/lib/companionOrchestrator.js'

test('all twenty fictional scenarios are available without duplicate IDs',()=>{
 assert.equal(COMPANION_PEOPLE.length,20)
 assert.equal(new Set(COMPANION_PEOPLE.map(x=>x.id)).size,20)
})
test('unknown client selection falls back to a known synthetic profile',()=>{
 assert.equal(validClient('C999'),'C012')
 assert.equal(validClient('C001'),'C001')
})
test('story-to-action respects evidence-based next steps',()=>{
 assert.equal(companionContext('C012').focus,'money')
 assert.equal(companionContext('C014').focus,'goals')
 assert.equal(companionContext('C008').focus,'support')
 assert.equal(companionContext('C001').focus,'learning')
})
test('no generic persona fabricates portfolio figures or source evidence',()=>{
 const context=companionContext('C015')
 assert.equal(context.figure,null)
 assert.equal(context.story,null)
 assert.match(companionExplanation(context).source,/Fictional persona/)
})
test('unverified service scenario prioritises support without claiming ticket status',()=>{
 const c=companionContext('C019')
 assert.equal(c.focus,'support')
 assert.equal(c.story,null)
 assert.match(c.reason,/no current ticket status/i)
})
test('chosen valid destination overrides scenario, unknown focus falls back safely',()=>{
 assert.equal(resolveCompanionFocus('C014','learning'),'learning')
 assert.equal(resolveCompanionFocus('C014','not-real'),'goals')
})
test('journey displays each educational area once',()=>{
 const ids=companionSteps(companionContext('C012')).map(x=>x.id)
 assert.equal(ids.length,5)
 assert.equal(new Set(ids).size,5)
})
