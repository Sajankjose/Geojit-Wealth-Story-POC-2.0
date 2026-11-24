import {test} from 'node:test'
import assert from 'node:assert/strict'
import {summarisePrefill,onboardingReadiness,personalisedWelcome,PREFILL_DOMAINS} from '../src/lib/companionOnboarding.js'

const item=(id,domain,extra={})=>({record_id:id,client_id:'C012',domain,event_at:'2026-11-20T10:00:00Z',payload:{},...extra})
test('onboarding prefill only includes four allowed customer data categories',()=>{
 const rows=[item('p1','product_subscriptions'),item('t1','transactions'),item('s1','service_cases'),
  item('d1','digital_platform_events'),item('r1','human_touchpoints'),
  {...item('bad','goals_preferences'),client_id:'C014'}]
 const result=summarisePrefill(rows,'C012')
 assert.equal(result.sources.length,4)
 assert.equal(result.known,3)
 assert.equal(result.unknown,1)
 assert.equal(result.sources.find(x=>x.id==='goals_preferences').status,'Not established')
 assert.equal(result.sources.some(x=>x.id==='digital_platform_events'),false)
 assert.equal(result.sources.some(x=>x.id==='human_touchpoints'),false)
})
test('prefill cannot treat absent financial records as financial shortfalls',()=>{
 const result=summarisePrefill([],'C012')
 assert.equal(result.known,0)
 assert.equal(result.unknown,4)
 assert.match(result.limitations,/not evidence of total wealth/)
})
test('prefill client scope and service-first control are preserved',()=>{
 const rows=[item('s1','service_cases',{payload:{status:'open',suppress_optional_promotions:true}})]
 assert.equal(summarisePrefill(rows,'C012').servicePriority,true)
 assert.equal(summarisePrefill([item('s2','service_cases',{payload:{status:'closed',suppress_optional_promotions:true}})],'C012').servicePriority,false)
 assert.equal(summarisePrefill(rows,'C014').known,0)
 assert.equal(summarisePrefill(rows,'invalid'),null)
})
test('roadmap cannot preview without confirmed scope, review and customer-selected topics',()=>{
 assert.equal(onboardingReadiness({reviewed:true,confirmedScope:true,choices:[]}).canPreview,false)
 assert.equal(onboardingReadiness({reviewed:false,confirmedScope:true,choices:['goals']}).canPreview,false)
 assert.equal(onboardingReadiness({reviewed:true,confirmedScope:false,choices:['goals']}).canPreview,false)
 assert.equal(onboardingReadiness({reviewed:true,confirmedScope:true,choices:['goals']}).canPreview,true)
})
test('welcome is educational and avoids pretending a product gap exists',()=>{
 const result=personalisedWelcome({alias:'Thomas',focus:['goals'],snapshot:summarisePrefill([item('p1','product_subscriptions')],'C012')})
 assert.match(result.headline,/Thomas/)
 assert.match(result.summary,/goal you choose/)
 assert.doesNotMatch(result.summary,/need to buy|missing product|underinsured|underperforming/i)
})
test('prefill categories are not marketing surveillance dimensions',()=>{
 assert.equal(PREFILL_DOMAINS.length,4)
 assert.equal(PREFILL_DOMAINS.some(x=>/digital_platform_events|engagement_tool_events|human_touchpoints/.test(x.id)),false)
})
