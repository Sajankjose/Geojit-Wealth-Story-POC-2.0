import {test} from 'node:test'
import assert from 'node:assert/strict'
import {fictionalFinancialInput,fixtureIntelligence,dietzReturn,computeWealthIntelligence,DEMO_MARKET} from '../src/lib/wealthIntelligence.js'
test('Modified Dietz-style estimate excludes external contribution from investment result',()=>{
 assert.equal(dietzReturn(100000,112000,10000,0.5),2000/105000)
 assert.equal(dietzReturn(0,100,0),null)
 assert.equal(dietzReturn(100,-10,0),-1.1)
})
test('Thomas illustrative portfolio values and market comparison reconcile',()=>{
 const f=fictionalFinancialInput('C012')
 const x=fixtureIntelligence('C012')
 assert.equal(x.value_numeric,542000)
 assert.equal(f.end_equity_value+f.end_mf_value,542000)
 assert.equal(x.market_verified,false)
 assert.equal(x.synthetic,true)
 assert.equal(x.as_of,'2026-11-20')
 assert.equal(x.relative_pp,Math.round((x.weekly_return-x.benchmark_return)*100)/100)
 assert.equal(x.journey.length,7)
 assert.equal(x.source_records.portfolio,'DEMO_VALUATION_SERIES_C012')
 assert.equal(x.goal,null)
})
test('all twenty fictional profiles have well-formed deterministic distinct snapshots',()=>{
 const totals=[]
 for(let i=1;i<=20;i++){
  const x=fixtureIntelligence('C'+String(i).padStart(3,'0'))
  assert.ok(x)
  assert.equal(x.allocation[0].value+x.allocation[1].value,x.value_numeric)
  assert.ok(x.comparison.every(e=>Number.isFinite(e.value)))
  totals.push(x.value_numeric)
 }
 assert.ok(new Set(totals).size>10)
 assert.equal(fixtureIntelligence('C050'),null)
})
test('weekly gap is not presented as holdings-level attribution',()=>{
 const x=fixtureIntelligence('C012')
 assert.match(x.attribution,/cannot be reliably assigned/)
 assert.match(x.comparison_caveat,/not a validated/)
 assert.equal(x.market_source,'POC fictional market fixture')
})
test('rejects malformed, missing, or purported live financial figures',()=>{
 const good=fictionalFinancialInput('C012')
 assert.equal(computeWealthIntelligence({...good,synthetic:false}),null)
 assert.equal(computeWealthIntelligence({...good,valuations:[12]}),null)
 assert.equal(computeWealthIntelligence({...good,market:{...DEMO_MARKET,proxy:[1]}}),null)
})
test('declared goal is shown only for the explicitly tagged fictional goal case',()=>{
 assert.equal(fixtureIntelligence('C012').goal,null)
 assert.ok(fixtureIntelligence('C014').goal.progress>0)
})
