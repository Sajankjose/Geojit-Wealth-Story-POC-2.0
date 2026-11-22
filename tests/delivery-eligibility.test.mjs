import { test } from 'node:test'
import assert from 'node:assert/strict'
import { evaluateDelivery } from '../src/lib/deliveryEligibility.js'

const now = new Date('2026-11-23T09:00:00+05:30') // Monday, Indian market day
const base = {
 clientId:'C012',editionType:'weekly_investing',
 subscription:{status:'subscribed',delivery_window:'standard'},
 edition:{id:'edition-a',client_id:'C012',edition_type:'weekly_investing',stage:'published_in_app',created_at:'2026-11-22T09:00:00+05:30'},
 events:[],serviceBlocked:false,permissionBlocked:false,now
}
test('simulated weekly email is eligible after publication and subscription',()=>{
 const value=evaluateDelivery(base)
 assert.equal(value.eligible,true)
 assert.equal(value.simulation_only,true)
 assert.equal(value.policy_version,'poc_2_6_delivery_v1')
})
test('unsubscribed clients and paused editions are withheld',()=>{
 for(const status of ['paused','unsubscribed']){
  const value=evaluateDelivery({...base,subscription:{status}})
  assert.equal(value.eligible,false)
  assert.match(value.blockers.join(' '),/subscription/)
 }
})
test('unapproved or mismatched customer edition is withheld',()=>{
 assert.equal(evaluateDelivery({...base,edition:{...base.edition,stage:'approved'}}).eligible,false)
 assert.equal(evaluateDelivery({...base,edition:{...base.edition,client_id:'C008'}}).eligible,false)
})
test('open service issues and opt-outs override a subscription',()=>{
 assert.equal(evaluateDelivery({...base,serviceBlocked:true}).eligible,false)
 assert.equal(evaluateDelivery({...base,permissionBlocked:true}).eligible,false)
 assert.equal(evaluateDelivery({...base,clientId:'C020',edition:{...base.edition,client_id:'C020'}}).eligible,false)
})
test('prevents duplicate deliveries and respects frequency across different editions',()=>{
 const same={client_id:'C012',edition_type:'weekly_investing',edition_id:'edition-a',event_type:'email_delivery_simulated',created_at:'2026-11-22T10:00:00+05:30'}
 assert.equal(evaluateDelivery({...base,events:[same]}).eligible,false)
 const different={...same,edition_id:'old-edition'}
 assert.equal(evaluateDelivery({...base,events:[different]}).eligible,false)
 const past={...different,created_at:'2026-11-10T10:00:00+05:30'}
 assert.equal(evaluateDelivery({...base,events:[past]}).eligible,true)
})
test('blocks stale story editions',()=>{
 assert.equal(evaluateDelivery({...base,edition:{...base.edition,created_at:'2026-09-01T00:00:00Z'}}).eligible,false)
})
test('does not simulate daily briefs on weekends',()=>{
 const daily={
  ...base,editionType:'daily_trading',
  edition:{...base.edition,edition_type:'daily_trading'},
  now:new Date('2026-11-22T09:00:00+05:30')
 }
 assert.equal(evaluateDelivery(daily).eligible,false)
 assert.equal(evaluateDelivery({...daily,now}).eligible,true)
})
