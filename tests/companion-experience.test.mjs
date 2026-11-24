import {test} from 'node:test'
import assert from 'node:assert/strict'
import {composeExperience,valueSignals,recordValueEvent} from '../src/lib/companionExperience.js'
import {newClientState,advanceLifecycle} from '../src/lib/newClientLifecycle.js'
import {blankCompanion} from '../src/lib/wealthCompanion.js'
test('new and existing customers share customer-selected canonical roadmap actions',()=>{
 const n=composeExperience({kind:'new',lifecycle:{...newClientState(),selected:'investing'}})
 const e=composeExperience({kind:'existing',profile:{...blankCompanion(),started:true,focus:['understand']}})
 assert.equal(n.version,e.version)
 assert.equal(n.roadmap[0].id,e.roadmap[0].id)
 assert.ok(n.roadmap.every(x=>x.requires_purchase===false))
 assert.ok(e.roadmap.every(x=>x.requires_purchase===false))
 assert.equal(n.recommendedProduct,null)
 assert.equal(e.recommendedProduct,null)
})
test('new zero-investment client never receives a portfolio performance claim',()=>{
 for(const stage of ['new','learning','goal']){
  const result=composeExperience({kind:'new',lifecycle:advanceLifecycle(newClientState(),stage)})
  assert.equal(result.financialPicture,false)
  assert.equal(result.portfolioPerformanceAvailable,false)
  assert.equal(result.declaredGoal,false)
 }
})
test('explicit goal is not manufactured by lifecycle stage',()=>{
 const goal=advanceLifecycle(newClientState(),'goal')
 assert.equal(composeExperience({kind:'new',lifecycle:goal}).declaredGoal,false)
 const declared= {...goal,declaredGoal:{label:'Education',target:500000,years:8}}
 assert.equal(composeExperience({kind:'new',lifecycle:declared}).declaredGoal,true)
})
test('new-client education action completion is reflected in shared engine next step',()=>{
 const p={...newClientState(),selected:'investing',completed:['picture']}
 const result=composeExperience({kind:'new',lifecycle:p})
 assert.equal(result.roadmap.find(x=>x.id==='picture').state,'completed')
 assert.notEqual(result.next?.id,'picture')
})
test('recorded first contribution does not establish returns or advice',()=>{
 const x=composeExperience({kind:'new',lifecycle:advanceLifecycle(newClientState(),'invested')})
 assert.equal(x.financialPicture,true)
 assert.equal(x.portfolioPerformanceAvailable,false)
 assert.equal(x.insight.fictionalInvestment.amount,3000)
 assert.equal(x.recommendedProduct,null)
})
test('value signals distinguish engagement proxy from genuine outcome validation',()=>{
 let events=[]
 events=recordValueEvent(events,'learning_explored','demo')
 events=recordValueEvent(events,'question_clarified','demo')
 events=recordValueEvent(events,'bought_product','demo')
 const s=valueSignals({journey:{stage:'new'},events})
 assert.equal(s.learningActions,1)
 assert.equal(s.clarifiedQuestions,1)
 assert.equal(s.commercialLeads,0)
 assert.equal(s.needsValidation,true)
 assert.equal(s.customerReportedUsefulness,null)
 assert.equal(events.length,2)
})
