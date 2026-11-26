// POC 3.4 One App wealth-companion activation is simulated locally.
// Never convert trial or plan selection into billing, advice or contact permission.
import {createLearningRoadmap,blankCompanion} from './wealthCompanion.js'
export const ONEAPP_DEMO_KEY='geojit_oneapp_companion_v3_4'
export const PRICING_CONCEPTS=[
 {id:'essential',title:'Essential',price:'Included',per:'Value-added feature concept',about:'A clearer financial starting point and useful learning tools.',benefits:['Customer-selected Wealth Map','Education and self-directed scenarios','One helpful next learning step']},
 {id:'plus',title:'Journey Plus',price:'₹999',per:'per year · hypothetical price',about:'Explore what a continuing digital companion might offer.',benefits:['Saved educational roadmap','Enriched Wealth Story concepts','Proactive review suggestions with customer controls']}
]
export const STARTER_TOPICS=[
 {id:'understand',name:'Understand investing',detail:'Get comfortable with investments, saving and risk'},
 {id:'goals',name:'Explore a future goal',detail:'Think about a target, time horizon and assumptions'},
 {id:'foundation',name:'Build financial flexibility',detail:'Learn about accessible savings and everyday readiness'},
 {id:'protection',name:'Understand protection',detail:'Explore relevant concepts without assuming a need'}
]
export function freshOneApp(){return {version:'oneapp_v3_4',activated:false,plan:'essential',focus:[],cadence:'on_demand',
 scopeReviewed:false,agreedSimulation:false,consentMarketing:false,stepsDone:[],openedAt:null}}
export function cleanOneApp(value){
 const base=freshOneApp()
 if(!value||value.version!==base.version)return base
 return {...base,activated:value.activated===true,
  plan:PRICING_CONCEPTS.some(x=>x.id===value.plan)?value.plan:base.plan,
  focus:[...new Set(Array.isArray(value.focus)?value.focus.filter(id=>STARTER_TOPICS.some(t=>t.id===id)):[])],
  cadence:['on_demand','monthly','quarterly'].includes(value.cadence)?value.cadence:'on_demand',
  scopeReviewed:value.scopeReviewed===true,agreedSimulation:value.agreedSimulation===true,
  // Marketing consent is intentionally not used by any demo journey.
  consentMarketing:false,
  stepsDone:[...new Set(Array.isArray(value.stepsDone)?value.stepsDone.filter(id=>['picture','goals','foundation','protection','review','story'].includes(id)):[])],
  openedAt:typeof value.openedAt==='string'?value.openedAt:null}
}
export function mayActivateOneApp(p){
 const x=cleanOneApp(p)
 return x.focus.length>0&&x.scopeReviewed&&x.agreedSimulation&&PRICING_CONCEPTS.some(a=>a.id===x.plan)
}
export function buildOneAppRoadmap(p){
 const x=cleanOneApp(p)
 const profile={...blankCompanion(),started:true,focus:x.focus,
  decisions:Object.fromEntries(x.stepsDone.map(k=>[k,'completed']))}
 const list=createLearningRoadmap(profile)
 return list.filter(item=>item.id!=='picture' || x.focus.includes('understand')).map(x=>({
  ...x,
  title:x.id==='picture'?'Understand your financial starting point':x.title,
  reason:x.id==='picture'?'No investments are recorded in this fictional new account. You can still learn about the possibilities.':x.reason,
  destination:x.id==='picture'?'learning':x.destination,
  state:profile.decisions[x.id]||'suggested'
 }))
}
export function valueOfOneApp(p){
 const x=cleanOneApp(p),list=buildOneAppRoadmap(x)
 return {activated:x.activated,selectedFocus:x.focus.length,steps:list.length,
  completed:list.filter(t=>t.state==='completed').length,
  isPaid:false,advice:false,marketingPermission:false,
  reason:'Educational roadmap selected by the customer; no financial needs inferred.'}
}
