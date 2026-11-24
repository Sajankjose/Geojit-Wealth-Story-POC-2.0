import {test} from 'node:test'
import assert from 'node:assert/strict'
import {
 COMPANION_VERSION,FOCUS_AREAS,PLAN_EXPERIENCES,blankCompanion,
 sanitiseCompanion,createLearningRoadmap,selectNextHelpfulAction,
 actionSummary,shouldOfferProactiveCheckIn
} from '../src/lib/wealthCompanion.js'

const started=(p={})=>({...blankCompanion(),started:true,focus:['understand','goals'],...p})
test('blank profile does not create a commercial or financial plan',()=>{
 const p=blankCompanion()
 assert.equal(p.started,false)
 assert.equal(p.plan,'essential')
 assert.equal(p.reminders,false)
 assert.deepEqual(createLearningRoadmap(p),[])
 assert.equal(selectNextHelpfulAction(p),null)
})
test('roadmap only uses topics explicitly selected, not missing products',()=>{
 const list=createLearningRoadmap(started({focus:['foundation']}))
 assert.deepEqual(list.map(x=>x.id),['foundation'])
 assert.ok(list.every(x=>x.reason_code==='DECLARED_TOPIC_ONLY'&&x.requires_purchase===false))
 assert.ok(!list.some(x=>/buy|sell|purchase|switch fund|recommended portfolio/i.test(x.action)))
})
test('selected goal and investment focus yields meaningful educational steps, never a product recommendation',()=>{
 const p=started()
 const list=createLearningRoadmap(p)
 assert.ok(list.some(x=>x.id==='picture'))
 assert.ok(list.some(x=>x.id==='goals'))
 assert.ok(list.every(x=>x.reason_code==='DECLARED_TOPIC_ONLY'&&x.requires_purchase===false))
 assert.ok(list.length<=6)
})
test('roadmap completion marks a learning action, not financial progress',()=>{
 const p=started({decisions:{picture:'completed',goals:'later'}})
 const result=actionSummary(p)
 assert.ok(result.completed>=1)
 assert.ok(result.deferred>=1)
 assert.match(result.label,/NOT|not/i)
 assert.notEqual(selectNextHelpfulAction(p)?.id,'picture')
})
test('incoming profile data is strictly allowlisted',()=>{
 const p=sanitiseCompanion({version:COMPANION_VERSION,started:true,
  focus:['goals','goals','bad-topic'],cadence:'weekly',plan:'premium_advisory',
  decisions:{goals:'completed',picture:'buy_now',unknown:'completed'},reminders:true})
 assert.deepEqual(p.focus,['goals'])
 assert.equal(p.cadence,'on_demand')
 assert.equal(p.plan,'essential')
 assert.deepEqual(p.decisions,{goals:'completed'})
})
test('check-ins are never triggered without permission and a verified event',()=>{
 const p=started({reminders:true,cadence:'monthly'})
 assert.equal(shouldOfferProactiveCheckIn({profile:p,permission:false,materialChangeVerified:true}).offer,false)
 assert.equal(shouldOfferProactiveCheckIn({profile:p,permission:true,materialChangeVerified:false}).offer,false)
 assert.equal(shouldOfferProactiveCheckIn({profile:p,permission:true,materialChangeVerified:true,servicePriority:true}).offer,false)
 assert.equal(shouldOfferProactiveCheckIn({profile:p,permission:true,materialChangeVerified:true}).offer,true)
})
test('on-demand preference does not create unsolicited contact even with full permission',()=>{
 const p=started({reminders:true,cadence:'on_demand'})
 assert.equal(shouldOfferProactiveCheckIn({profile:p,permission:true,materialChangeVerified:true}).offer,false)
})
test('concept tier is not priced or enabled for purchase',()=>{
 assert.equal(FOCUS_AREAS.length,5)
 assert.equal(PLAN_EXPERIENCES.length,2)
 assert.ok(PLAN_EXPERIENCES.every(x=>/not approved|no fee/i.test(x.price)))
 assert.ok(PLAN_EXPERIENCES.every(x=>!x.features.some(y=>/recommend.*fund|invest.*in.*stock/i.test(y))))
})
