import {test} from 'node:test'
import assert from 'node:assert/strict'
import {composeWealthStory} from '../src/lib/wealthStoryOrchestrator.js'
import {MAP_CHAPTERS,illustrativeMapForStory,mayShowOptionalProductDiscovery} from '../src/lib/illustrativeWealthMap.js'
test('wealth map has five distinct educational chapters without a score or missing-product diagnosis',()=>{
 assert.deepEqual(MAP_CHAPTERS.map(x=>x.id),['foundation','protection','growth','goals','review'])
 assert.equal(new Set(MAP_CHAPTERS.map(x=>x.color)).size,5)
 assert.ok(MAP_CHAPTERS.every(x=>x.question&&x.learn&&x.body))
 assert.ok(MAP_CHAPTERS.every(x=>!/(your gap|you need to buy|missing product|underperforming)/i.test(x.body)))
})
test('Thomas shows investment evidence but does not infer insurance or goal inadequacy',()=>{
 const m=illustrativeMapForStory(composeWealthStory('C012'))
 assert.equal(m.active,'growth')
 assert.equal(m.hasPortfolio,true)
 assert.equal(m.hasVerifiedGoal,false)
 assert.equal(m.chapters.find(x=>x.id==='growth').known,true)
 assert.equal(m.chapters.find(x=>x.id==='protection').known,false)
 assert.equal(m.chapters.find(x=>x.id==='goals').known,false)
 assert.equal(m.serviceFirst,false)
})
test('George is invited to explore explicitly declared goal without treating portfolio as allocated to it',()=>{
 const m=illustrativeMapForStory(composeWealthStory('C014'))
 assert.equal(m.active,'goals')
 assert.equal(m.hasVerifiedGoal,true)
 assert.match(m.chapters.find(x=>x.id==='goals').evidence,/explicitly declared/i)
 assert.match(m.chapters.find(x=>x.id==='goals').body,/not automatically earmarked/i)
})
test('service-first client gets no cross sell even when interactive discovery opened',()=>{
 const m=illustrativeMapForStory(composeWealthStory('C008'))
 assert.equal(m.serviceFirst,true)
 assert.equal(m.active,'review')
 assert.equal(mayShowOptionalProductDiscovery(m,true),false)
})
test('new client has no holdings or inferred gaps and product topics are user initiated',()=>{
 const m=illustrativeMapForStory(composeWealthStory('C001'))
 assert.equal(m.hasPortfolio,false)
 assert.equal(m.hasVerifiedGoal,false)
 assert.ok(m.chapters.every(x=>x.known===false))
 assert.equal(mayShowOptionalProductDiscovery(m,false),false)
 assert.equal(mayShowOptionalProductDiscovery(m,true),true)
 assert.equal(illustrativeMapForStory({synthetic:false}),null)
})
