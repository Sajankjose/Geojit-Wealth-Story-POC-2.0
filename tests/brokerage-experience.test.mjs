import test from 'node:test'
import assert from 'node:assert/strict'
import {brokerageSnapshot,shouldShowBrokerageCard,brokerageIsToday,evaluateBrokerageScenario,BROKERAGE_INQUIRY_TYPES,COST_DEMO_AS_OF} from '../src/lib/brokerageExperience.js'

test('brokerage card is shown only when an explicit fictional ledger is present',()=>{
 assert.ok(brokerageSnapshot('C012'))
 assert.equal(brokerageSnapshot('C001'),null)
 assert.equal(shouldShowBrokerageCard('C001'),false)
 assert.equal(shouldShowBrokerageCard('C012'),true)
})
test('a dated static fixture cannot be mistaken for a live daily feed',()=>{
 assert.ok(brokerageIsToday(brokerageSnapshot('C012'),COST_DEMO_AS_OF))
 assert.equal(brokerageIsToday(brokerageSnapshot('C012'),'2026-12-01'),false)
})
test('enquiries include separate information, review and discount requests',()=>{
 assert.equal(new Set(BROKERAGE_INQUIRY_TYPES.map(x=>x.id)).size,BROKERAGE_INQUIRY_TYPES.length)
 assert.ok(BROKERAGE_INQUIRY_TYPES.some(x=>x.id==='discount'))
})
test('business model never automatically approves a brokerage discount',()=>{
 const a=evaluateBrokerageScenario({proposedDiscountPct:10})
 assert.ok(a)
 assert.equal(a.retainedRevenue,2205)
 assert.equal(a.outcome,'Requires an authorised relationship review')
 const b=evaluateBrokerageScenario({proposedDiscountPct:60})
 assert.equal(b.clearsFloor,false)
 assert.equal(b.outcome,'No change currently available')
})
test('invalid pricing scenarios fail safely',()=>{
 assert.equal(evaluateBrokerageScenario({proposedDiscountPct:-1}),null)
 assert.equal(evaluateBrokerageScenario({proposedDiscountPct:90}),null)
 assert.equal(evaluateBrokerageScenario({serviceCost:NaN}),null)
})
