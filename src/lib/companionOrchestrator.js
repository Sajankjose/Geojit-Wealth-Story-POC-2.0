// Wealth Companion 4.0 — deterministic, synthetic-only orchestration.
// Missing portfolio, suitability, service, and consent evidence must never be inferred.
import {composeWealthStory} from './wealthStoryOrchestrator.js'
export const COMPANION_PEOPLE=[
 ['C001','Arun','New explorer','new'],['C002','Anu','First SIP explorer','learn'],['C003','Meera','Regular SIP investor','investor'],
 ['C004','Dev','Failed SIP scenario','service'],['C005','Fathima','Paused SIP scenario','service'],['C006','Rahul','Mutual fund explorer','investor'],
 ['C007','Lakshmi','Equity explorer','learn'],['C008','Meera','Service continuity scenario','service'],['C009','Kiran','F&O beginner','learn'],
 ['C010','Suresh','Experienced F&O trader','trader'],['C011','Nisha','Commodity trader','trader'],['C012','Thomas','Investor and trader','investor'],
 ['C013','Priya','SIP and protection explorer','goal'],['C014','George','Retirement goal','goal'],['C015','Rehan','NRI prospect','new'],
 ['C016','Divya','Multi-product explorer','investor'],['C017','Joseph','Branch relationship','service'],['C018','Sneha','Re-engaging customer','new'],
 ['C019','Manoj','Open service query scenario','service'],['C020','Isha','Prefers fewer communications','new']
].map(([id,name,scenario,mode])=>({id,name,scenario,mode}))
export const FOCUS_AREAS=[
 {id:'foundation',title:'Foundation',description:'Explore everyday financial flexibility',prompt:'What does an emergency fund help with?'},
 {id:'protection',title:'Protection',description:'Understand protection options and terminology',prompt:'How does insurance fit into a financial plan?'},
 {id:'growth',title:'Growth',description:'Understand investments, risk and diversification',prompt:'What does diversification mean?'},
 {id:'goals',title:'Goals',description:'Explore a target you choose',prompt:'How do I think about a long-term goal?'},
 {id:'review',title:'Review',description:'Revisit your questions and progress',prompt:'When should a financial plan be reviewed?'}
]
const valid=new Set(COMPANION_PEOPLE.map(x=>x.id))
export const validClient=id=>valid.has(id)?id:'C012'
export function companionContext(inputId='C012'){
 const id=validClient(inputId),person=COMPANION_PEOPLE.find(x=>x.id===id)
 // Only the four explicitly composed story personas have narrative and verified synthetic fixtures.
 const story=composeWealthStory(id)
 const isService=!!story?.service||['C004','C005','C017','C019'].includes(id)
 const type=story?.next?.topic|| (isService?'service':person.mode==='goal'?'goal':person.mode==='trader'?'movement':person.mode==='new'?'learning':'learning')
 const focusByType={service:'support',movement:'money',goal:'goals',learning:'learning'}
 const focus=focusByType[type]||'learning'
 const lead=story?.next?.label|| (isService?'Review the service scenario and available support routes':
   person.mode==='trader'?'Understand investment movement before looking at returns':
   person.mode==='goal'?'Start with a goal you choose':
   'Choose one financial topic to explore at your own pace')
 const reason=story?.next?.reason|| (isService?'This fictional persona is associated with a service scenario. No current ticket status is established.':
   person.mode==='trader'?'Trading interest does not establish financial suitability or current portfolio holdings.':
   'Your demo scenario identifies an interest, not a verified personal financial need.')
 return {id,person,story,mode:person.mode,isService,focus,lead,reason,
  headline:story?.headline || (person.mode==='trader'?'Know what matters before the next trade.':person.mode==='goal'?'Make room for your goals.':person.mode==='service'?'Support belongs in your financial journey.':'Your journey starts with your questions.'),
  intro:story?.intro || 'Explore your financial journey with transparent, educational guidance. Your real holdings, external assets and needs are not established here.',
  figure:story?.model?.valuation||null,asOf:story?.model?.as_of||null,
  source:story?.source_scope||'Fictional persona label only; no validated portfolio or financial-need data for this scenario.'
 }
}
export function resolveCompanionFocus(id,requested){
 const ctx=companionContext(id)
 return ['money','journey','goals','learning','guide','support','explore'].includes(requested)?requested:ctx.focus
}
export function companionSteps(context){
 const first=context.isService?'review':context.mode==='goal'?'goals':context.mode==='trader'||context.mode==='investor'?'growth':'foundation'
 return [...FOCUS_AREAS].sort((a,b)=>Number(b.id===first)-Number(a.id===first))
}
export function companionExplanation(context){
 return {
  evidence:context.story?.signal?.evidence||['Fictional persona: '+context.person.scenario,'No further account data or financial objective is verified for this scenario.'],
  source:context.story?.signal?.source||context.source,
  caution:context.isService?'Any service status must be verified through authorised systems before taking action.':
   'Educational exploration only. No suitability, complete wealth picture or investment recommendation is established.'
 }
}
