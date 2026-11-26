// POC 3.6 financial storytelling: all numeric facts come from existing synthetic
// fixture data or explicitly customer-adjusted hypothetical arithmetic.
// No real portfolio, market quote, XIRR, suitability or financial plan is inferred.
import {fictionalFinancialInput,fixtureIntelligence} from './wealthIntelligence.js'
import {calculateGoalScenario} from './genuineGuidance.js'
const formatINR=n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n)
const percent=n=>Number(n).toFixed(1)+'%'
export function mobileCustomerFigures(persona='new'){
 if(persona==='thomas'){
  const raw=fictionalFinancialInput('C012'),model=fixtureIntelligence('C012')
  if(!raw||!model||raw.synthetic!==true||model.synthetic!==true)return null
  const start=model.journey[model.journey.length-2]
  const end=model.journey[model.journey.length-1]
  const equityPct=raw.end_equity_value/model.value_numeric*100
  const mfPct=raw.end_mf_value/model.value_numeric*100
  return {persona:'thomas',name:'Thomas',kind:'portfolio',asOf:raw.as_of,
    total:model.value_numeric,totalText:model.valuation,allocation:[
     {id:'equity',label:'Equity',value:raw.end_equity_value,text:formatINR(raw.end_equity_value),percent:equityPct},
     {id:'mf',label:'Mutual funds',value:raw.end_mf_value,text:formatINR(raw.end_mf_value),percent:mfPct}
    ],
    week:{start:start.value,end:end.value,cashFlow:raw.external_net_flows.at(-1),
     change:end.value-start.value,changeExFlows:end.value-start.value-raw.external_net_flows.at(-1),
     portfolioReturn:model.weekly_return,proxyReturn:model.benchmark_return,relative:model.relative_pp},
    journey:model.journey.map(x=>({label:x.label,value:x.value})),
    contributionDescription:'The fictional account also records a net contribution this week. Changes in value are not the same as investment returns.',
    source:'Synthetic C012 equity/MF holdings, 7-week valuations and modelled flows; as of '+raw.as_of,
    warnings:'Market proxy is invented and not matched to the portfolio. Weekly return is a Modified Dietz-style estimate, not verified performance. External holdings and personal goals are unknown.'}
 }
 return {persona:'new',name:'Arun',kind:'empty',asOf:null,total:null,allocation:[],
  source:'Fictional new account, with no recorded in-scope investments',
  warnings:'No verified holdings, returns, investment needs or financial goals are available. A hypothetical scenario must be controlled by the customer.'}
}
export function demoGoalFigures({target=600000,years=5,monthly=5000}={}){
 if(![target,years,monthly].every(Number.isFinite)||years<1||years>30||monthly<500||monthly>100000||target<50000||target>20000000)return null
 const months=years*12
 const savings=monthly*months
 const percentOfTarget=Math.min(100,100*savings/target)
 const required=calculateGoalScenario({target,current:0,years,annualRate:0})
 if(!required)return null
 return {target,years,months,monthly,savings,percentOfTarget,zeroReturnRequired:required.monthly,
  shortfall:Math.max(0,target-savings),targetText:formatINR(target),
  monthlyText:formatINR(monthly),savingsText:formatINR(savings),
  requiredText:formatINR(required.monthly),shortfallText:formatINR(Math.max(0,target-savings)),
  assumption:'Illustrative savings arithmetic only: 0% growth, no inflation, taxes, charges or investment returns. The amounts were chosen in a demo slider—not recommended by Geojit.'}
}
export const roundPct=x=>percent(x)
export const rupees=formatINR
