import {test} from 'node:test'
import assert from 'node:assert/strict'
import {mobileCustomerFigures,demoGoalFigures} from '../src/lib/mobileWealthStory.js'
import {fictionalFinancialInput,fixtureIntelligence} from '../src/lib/wealthIntelligence.js'
import {freshOneApp} from '../src/lib/oneAppDemo.js'
test('Thomas mobile customer story figures come from the same synthetic POC inputs',()=>{
 const data=fictionalFinancialInput('C012'),model=fixtureIntelligence('C012'),story=mobileCustomerFigures('thomas')
 assert.equal(story.kind,'portfolio')
 assert.equal(story.total,model.value_numeric)
 assert.equal(story.total,542000)
 assert.equal(story.allocation[0].value,data.end_equity_value)
 assert.equal(story.allocation[1].value,data.end_mf_value)
 assert.equal(story.allocation.reduce((n,a)=>n+a.value,0),story.total)
 assert.equal(story.journey.length,7)
 assert.deepEqual(story.journey.map(x=>x.value),model.journey.map(x=>x.value))
 assert.equal(story.asOf,'2026-11-20')
})
test('cash flow reconciliation never confuses additions with investment returns',()=>{
 const story=mobileCustomerFigures('thomas')
 const w=story.week
 assert.equal(w.cashFlow,3000)
 assert.equal(w.change,w.end-w.start)
 assert.equal(w.changeExFlows,w.end-w.start-w.cashFlow)
 assert.equal(w.portfolioReturn,fixtureIntelligence('C012').weekly_return)
 assert.match(story.warnings,/modelled|estimate/i)
 assert.match(story.warnings,/not matched to the portfolio/i)
})
test('a new customer has no invented portfolio value or return',()=>{
 const a=mobileCustomerFigures('new')
 assert.equal(a.kind,'empty')
 assert.equal(a.total,null)
 assert.deepEqual(a.allocation,[])
 assert.match(a.warnings,/no verified holdings/i)
})
test('goal figures are customer-controlled and are simple zero-return arithmetic',()=>{
 const g=demoGoalFigures({target:600000,years:5,monthly:5000})
 assert.equal(g.months,60)
 assert.equal(g.savings,300000)
 assert.equal(g.shortfall,300000)
 assert.equal(g.zeroReturnRequired,10000)
 assert.equal(g.percentOfTarget,50)
 assert.match(g.assumption,/0% growth/i)
 assert.match(g.assumption,/not recommended/i)
})
test('changing inputs changes figure-led customer narrative without inventing returns',()=>{
 const a=demoGoalFigures({target:600000,years:5,monthly:5000})
 const b=demoGoalFigures({target:600000,years:10,monthly:5000})
 assert.equal(b.savings,600000)
 assert.equal(b.shortfall,0)
 assert.equal(b.zeroReturnRequired,5000)
 assert.notEqual(a.savings,b.savings)
})
test('management starts with the figure-backed demo but supports new customer switching',()=>{
 assert.equal(freshOneApp().persona,'thomas')
 assert.equal(mobileCustomerFigures('new').kind,'empty')
 assert.equal(demoGoalFigures({target:0}),null)
})
