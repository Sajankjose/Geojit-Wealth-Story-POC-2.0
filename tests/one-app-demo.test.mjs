import {test} from 'node:test'
import assert from 'node:assert/strict'
import {freshOneApp,cleanOneApp,PRICING_CONCEPTS,STARTER_TOPICS,mayActivateOneApp,buildOneAppRoadmap,valueOfOneApp} from '../src/lib/oneAppDemo.js'
const draft=(extras={})=>({...freshOneApp(),focus:['goals'],plan:'plus',scopeReviewed:true,agreedSimulation:true,...extras})
test('W is discoverable but is not activated by default',()=>{
 const s=freshOneApp()
 assert.equal(s.activated,false)
 assert.equal(s.plan,'essential')
 assert.equal(s.consentMarketing,false)
 assert.equal(mayActivateOneApp(s),false)
 assert.equal(valueOfOneApp(s).isPaid,false)
})
test('indicative price selection alone does not grant activation or a paid entitlement',()=>{
 const s=cleanOneApp({...freshOneApp(),plan:'plus'})
 assert.equal(s.plan,'plus')
 assert.equal(s.activated,false)
 assert.equal(mayActivateOneApp(s),false)
 assert.ok(PRICING_CONCEPTS.find(x=>x.id==='plus').per.includes('hypothetical'))
})
test('W menu can activate only after scope review, interest choice and demo acknowledgment',()=>{
 assert.equal(mayActivateOneApp(draft()),true)
 assert.equal(mayActivateOneApp(draft({scopeReviewed:false})),false)
 assert.equal(mayActivateOneApp(draft({focus:[]})),false)
 assert.equal(mayActivateOneApp(draft({agreedSimulation:false})),false)
})
test('roadmap is derived from interests, not a fabricated portfolio or product gap',()=>{
 const x=buildOneAppRoadmap(draft({focus:['goals','foundation']}))
 assert.ok(x.length>=2)
 assert.ok(x.every(s=>s.requires_purchase===false))
 assert.ok(x.every(s=>s.reason_code==='DECLARED_TOPIC_ONLY'))
 assert.ok(!x.some(s=>/buy now|sell shares|recommended fund/i.test(s.title+' '+s.reason)))
})
test('new customer with no record never gets an imaginary portfolio',()=>{
 const x=buildOneAppRoadmap(draft({focus:['understand']}))
 assert.match(x[0].reason,/no investments are recorded/i)
 assert.equal(x[0].destination,'learning')
})
test('state parser discards unsupported data, fake marketing permission and unknown steps',()=>{
 const x=cleanOneApp({...draft(),activated:true,focus:['goals','goals','stock_buy'],stepsDone:['goals','fake'],consentMarketing:true})
 assert.deepEqual(x.focus,['goals'])
 assert.deepEqual(x.stepsDone,['goals'])
 assert.equal(x.consentMarketing,false)
 assert.equal(x.activated,true)
 assert.equal(valueOfOneApp(x).isPaid,false)
})
test('marking an educational action does not imply goal achievement',()=>{
 const x=cleanOneApp({...draft(),stepsDone:['goals']})
 const items=buildOneAppRoadmap(x)
 assert.equal(items.find(t=>t.id==='goals').state,'completed')
 assert.equal(valueOfOneApp(x).advice,false)
})
test('service choice contains transparent fictional price conditions',()=>{
 assert.equal(STARTER_TOPICS.length,4)
 assert.equal(PRICING_CONCEPTS.length,2)
 assert.ok(PRICING_CONCEPTS.every(x=>x.benefits.length>=3))
})
