import {test} from 'node:test'
import assert from 'node:assert/strict'
import {openingInsight,COMPANION_SERVICES,educationalCoachAnswer,DEMO_PERSONAS} from '../src/lib/companionMarketing.js'
import {freshOneApp,cleanOneApp,buildOneAppRoadmap} from '../src/lib/oneAppDemo.js'
test('new fictional customer receives no invented portfolio facts, goal or inferred needs',()=>{
 const x=openingInsight('new')
 assert.equal(x.kind,'verified_unknowns')
 assert.match(x.highlight,/no investments recorded/i)
 assert.match(x.sources,/no confirmed holdings/i)
 assert.doesNotMatch(x.body,/you need to buy|your goal is|portfolio returned/i)
})
test('existing fictional client hook only uses dated, in-scope synthetic holdings',()=>{
 const x=openingInsight('thomas')
 assert.equal(x.kind,'dated_fictional_facts')
 assert.match(x.highlight,/5,42,000/)
 assert.match(x.sources,/2026-11-20/)
 assert.match(x.sources,/outside Geojit are unknown/)
 assert.doesNotMatch(x.body,/buy|sell|suitable for you/i)
})
test('persona selector changes knowledge scope, not advisory risk or marketing permission',()=>{
 const old=freshOneApp()
 const change=cleanOneApp({...old,persona:'thomas'})
 assert.equal(change.persona,'thomas')
 assert.equal(change.activated,false)
 assert.equal(change.consentMarketing,false)
 const x=buildOneAppRoadmap({...change,focus:['understand']})
 assert.match(x[0].reason,/equity and mf holdings/i)
 assert.ok(x.every(s=>!s.requires_purchase))
})
test('four service promises explicitly distinguish proposed expert access and demo coach',()=>{
 assert.equal(COMPANION_SERVICES.length,4)
 assert.deepEqual(COMPANION_SERVICES.map(x=>x.id),['roadmap','expert','story','coach'])
 const expert=COMPANION_SERVICES.find(x=>x.id==='expert')
 assert.equal(expert.kind,'proposed')
 assert.match(expert.availability,/not yet approved/)
 assert.match(COMPANION_SERVICES.find(x=>x.id==='coach').availability,/scripted educational/i)
 assert.equal(DEMO_PERSONAS.length,2)
})
test('coach never promises a human connection or personalised trading recommendation',()=>{
 for(const question of ['roadmap','goal','investment','story','expert','unknown']){
  const ans=educationalCoachAnswer(question,'thomas')
  assert.equal(ans.live,false)
  assert.equal(ans.advice,false)
  assert.equal(ans.contactCreated,false)
  assert.ok(ans.answer.length>40)
 }
 assert.match(educationalCoachAnswer('expert').answer,/cannot connect you to a live expert/)
 assert.match(educationalCoachAnswer('investment').answer,/cannot tell you which fund or security/)
})
