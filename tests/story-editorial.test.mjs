import {test} from 'node:test'
import assert from 'node:assert/strict'
import {selectVerifiedFigures,planStory,validateEditorialDraft} from '../netlify/functions/lib/story-editorial.mjs'
const now=new Date('2026-11-22T15:00:00Z')
const record=(id,payload,source_id='DEMO_VALUATION')=>({record_id:id,source_id,domain:'product_subscriptions',payload})
const valid=(metric_type,value)=>({metric_type,value,currency:'INR',verified:true,source_verified:true,scope:'geojit_accounts',as_of:'2026-11-20',demo_fixture:true})
test('figure selector displays only explicit dated verified Geojit-scoped amounts',()=>{
 const figures=selectVerifiedFigures([
  record('a',valid('equity_value',324000)),
  record('b',{...valid('current_value',999000),source_verified:false}),
  record('c',{...valid('mutual_fund_value',218000),scope:'external'}),
  record('d',{...valid('goal_target',430000),as_of:'2026-08-01'}),
  record('e',{...valid('sip_contributions',78000),currency:'USD'}),
  record('f',{...valid('current_value',542000),as_of:'2026-12-25'})
 ],now)
 assert.equal(figures.length,1)
 assert.equal(figures[0].key,'equity_value')
 assert.match(figures[0].display,/3,24,000/)
 assert.equal(figures[0].record_id,'a')
})
test('unverified numeric fields cannot turn into chart or metric content',()=>{
 const figures=selectVerifiedFigures([record('x',{value:500000,product_type:'Equity',verified:false}),record('y',{metric_type:'current_value',value:'400000',verified:true,source_verified:true,scope:'geojit',currency:'INR',as_of:'2026-11-20'})],now)
 assert.deepEqual(figures,[])
})
test('editorial plan prioritises useful relationship context and service first',()=>{
 const basic={selected:[{domain:'transactions',evidence_kind:'source_record'},{domain:'goals_preferences',evidence_kind:'source_record'}],service_first:false}
 assert.equal(planStory(basic,[],'weekly_investing',now).angle,'connecting_activity_and_goals')
 assert.equal(planStory({...basic,service_first:true},[],'weekly_investing',now).angle,'service_first')
 assert.equal(planStory(basic,[],'daily_trading',now).angle,'trading_context')
})
const good={headline:'Your investments, in perspective',narrative:'Your recorded equity activity offers a useful place to review your wider investments. It can help you think about the different ways you participate in the markets, while leaving your future priorities entirely up to you.',context_hint:'Different investments can play different roles within a financial plan.',next_step:'Explore your investments when you are ready.'}
test('guiding customer-first copy passes editorial checks',()=>{
 assert.equal(validateEditorialDraft(good).ok,true)
})
test('behavioural surveillance language and third-person narratives fail',()=>{
 for(const text of ['We noticed you visited the calculator.','You clicked on Goal Explorer.','Thomas has recently engaged with tools.','We tracked your digital activity.']){
  const result=validateEditorialDraft({...good,narrative:text})
  assert.equal(result.ok,false,text)
 }
})
test('invented amounts, financial recommendations and unsupported intent are rejected',()=>{
 for(const text of ['Your portfolio is worth ₹5,42,000.','You should buy mutual funds now.','Your risk appetite is high.','You want to retire soon.']){
  assert.equal(validateEditorialDraft({...good,narrative:text}).ok,false,text)
 }
})
