import {test} from 'node:test'
import assert from 'node:assert/strict'
import {newClientState,sanitiseLifecycle,lifecycleSnapshot,advanceLifecycle,LIFECYCLE_PHASES,STARTING_CHOICES} from '../src/lib/newClientLifecycle.js'

test('new client is genuinely zero-data, not the Thomas valuation fixture',()=>{
 const p=newClientState(),s=lifecycleSnapshot(p)
 assert.equal(p.stage,'new')
 assert.equal(s.hasInvestment,false)
 assert.equal(s.fictionalInvestment,null)
 assert.equal(s.goal,null)
 assert.match(s.story,/no investment performance/i)
 assert.equal(s.educationalProgress,0)
})
test('life stage progression does not invent a goal or performance',()=>{
 const joined=newClientState()
 const learning=advanceLifecycle(joined,'learning')
 assert.equal(lifecycleSnapshot(learning).hasInvestment,false)
 const goal=advanceLifecycle(learning,'goal')
 assert.equal(lifecycleSnapshot(goal).goal,null)
 assert.match(lifecycleSnapshot(goal).story,/not yet shared a target/i)
 const invested=advanceLifecycle(goal,'invested')
 assert.equal(lifecycleSnapshot(invested).fictionalInvestment.amount,3000)
 assert.equal(lifecycleSnapshot(invested).fictionalInvestment.return_available,false)
 assert.match(lifecycleSnapshot(invested).story,/contribution does not establish returns/i)
})
test('simulated investment stays invented and clearly scoped',()=>{
 const p=advanceLifecycle(newClientState(),'invested')
 const s=lifecycleSnapshot(p)
 assert.equal(s.fictionalInvestment.source,'MANAGEMENT_SCENARIO_ONLY')
 assert.match(s.limitation,/manually simulated/)
 assert.equal(s.goal,null)
})
test('declared goal requires explicit valid label, amount and horizon',()=>{
 const base=advanceLifecycle(newClientState(),'goal')
 assert.equal(sanitiseLifecycle({...base,declaredGoal:{label:'',target:500000,years:8}}).declaredGoal,null)
 assert.equal(sanitiseLifecycle({...base,declaredGoal:{label:'Education',target:0,years:8}}).declaredGoal,null)
 const confirmed=sanitiseLifecycle({...base,declaredGoal:{label:'Education',target:500000,years:8}})
 assert.equal(lifecycleSnapshot(confirmed).goal.target,500000)
})
test('navigating back to a pre-investment scenario erases fictional future holdings',()=>{
 const invested=advanceLifecycle(newClientState(),'invested')
 const earlier=advanceLifecycle(invested,'new')
 assert.equal(earlier.illustrativeInvestment,false)
 assert.equal(lifecycleSnapshot(earlier).hasInvestment,false)
 assert.equal(earlier.declaredGoal,null)
})
test('marking educational progress is not a financial health score',()=>{
 const p=sanitiseLifecycle({...newClientState(),completed:['learn','financial_picture','fake']})
 const snap=lifecycleSnapshot(p)
 assert.equal(snap.educationalProgress,2)
 assert.equal(snap.hasInvestment,false)
})
test('lifecycle represents four different moments without automatic product suggestions',()=>{
 assert.equal(LIFECYCLE_PHASES.length,4)
 assert.equal(STARTING_CHOICES.length,4)
 for(const phase of LIFECYCLE_PHASES){
  const data=lifecycleSnapshot(advanceLifecycle(newClientState(),phase.id))
  assert.ok(data.items.length>0)
  assert.ok(data.items.every(x=>!/(buy|sell|subscribe to (a|this) fund)/i.test(x.title+' '+x.why)))
 }
})
