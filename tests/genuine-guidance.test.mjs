import {test} from 'node:test'
import assert from 'node:assert/strict'
import {MAP_AREAS,calculateGoalScenario,dimensionState,evaluateGenuineGuidance} from '../src/lib/genuineGuidance.js'

test('Wealth Map dimensions are need-neutral and never use a product gap score',()=>{
 assert.equal(MAP_AREAS.length,5)
 assert.ok(MAP_AREAS.every(x=>x.question&&x.summary))
 assert.equal(dimensionState('protection','C012',false).state,'Not assessed')
 assert.equal(dimensionState('goals','C012',false).state,'Not assessed')
 assert.equal(dimensionState('goals','C014',true).state,'Declared in demo')
})
test('planning scenario returns correct zero-rate contribution without inventing return',()=>{
 const s=calculateGoalScenario({target:1200000,current:0,years:10,annualRate:0})
 assert.equal(s.monthly,10000)
 assert.equal(s.months,120)
 assert.equal(s.totalContributed,1200000)
})
test('illustrative scenario accounts for existing savings but never prescribes a product',()=>{
 const zero=calculateGoalScenario({target:1800000,current:200000,years:10,annualRate:0})
 const growth=calculateGoalScenario({target:1800000,current:200000,years:10,annualRate:0.04})
 assert.equal(zero.monthly,13334)
 assert.ok(growth.monthly<zero.monthly)
 assert.match(growth.caveat,/not a product recommendation/)
})
test('invalid targets and out-of-range rates are not calculated',()=>{
 assert.equal(calculateGoalScenario({target:-1}),null)
 assert.equal(calculateGoalScenario({target:1000,years:0}),null)
 assert.equal(calculateGoalScenario({target:1000,annualRate:.75}),null)
})
test('no proactive product pitch before customer-initiated exploration',()=>{
 const gate=evaluateGenuineGuidance({area:'protection',customerAsked:false,requestedProductInfo:true})
 assert.equal(gate.allowEducation,false)
 assert.equal(gate.allowProductInformation,false)
 assert.equal(gate.noSalesRequired,true)
})
test('an unknown financial gap does not become a diagnosis',()=>{
 const gate=evaluateGenuineGuidance({area:'protection',customerAsked:true,requestedProductInfo:false,knownNeed:false})
 assert.equal(gate.allowEducation,true)
 assert.equal(gate.allowProductInformation,false)
})
test('customer-requested general product information is possible without a suitability claim',()=>{
 const gate=evaluateGenuineGuidance({area:'growth',customerAsked:true,requestedProductInfo:true,knownNeed:false})
 assert.equal(gate.allowProductInformation,true)
 assert.equal(gate.eligibilityVerified,false)
 assert.match(gate.reason,/no suitability/)
})
test('service-first blocks product discovery but not neutral education',()=>{
 const gate=evaluateGenuineGuidance({area:'goals',customerAsked:true,requestedProductInfo:true,serviceFirst:true})
 assert.equal(gate.allowEducation,true)
 assert.equal(gate.allowProductInformation,false)
})
test('a declined customer cannot receive guided product information',()=>{
 const gate=evaluateGenuineGuidance({area:'growth',customerAsked:true,requestedProductInfo:true,customerDeclined:true})
 assert.equal(gate.allowProductInformation,false)
})
