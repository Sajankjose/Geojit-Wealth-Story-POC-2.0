// Geojit Wealth Companion POC 3.0 — educational, self-directed roadmap.
// This is not financial planning, personalised securities advice or a sale.
// No purchase, portfolio, fund or investment amount is selected by this engine.
export const COMPANION_VERSION='companion_v3_0';
export const FOCUS_AREAS=[
 {id:'understand',title:'Understand my investments',description:'See how the investments visible to Geojit fit together.'},
 {id:'goals',title:'Explore a financial goal',description:'Choose your own target and test transparent savings scenarios.'},
 {id:'protection',title:'Review financial protection',description:'Learn what to consider about responsibilities and existing cover.'},
 {id:'foundation',title:'Strengthen financial flexibility',description:'Explore liquidity and emergency savings without assuming a shortfall.'},
 {id:'review',title:'Make time for a wider review',description:'Bring questions and assumptions into one place, at your pace.'}
];
export const REVIEW_RHYTHMS=[
 {id:'monthly',label:'Monthly perspective'},
 {id:'quarterly',label:'Quarterly review'},
 {id:'on_demand',label:'Only when I choose'}
];
export const PLAN_EXPERIENCES=[
 {id:'essential',name:'Essential',tag:'Included concept',price:'No fee simulated',description:'Get clear financial information and educational guidance.',features:['Wealth Map and account context','Self-directed learning and calculators','Your selected educational next step']},
 {id:'plus',name:'Journey Plus',tag:'Premium concept · not for sale',price:'Price not approved',description:'Explore a continuing educational roadmap and more detailed Wealth Story experiences.',features:['Your saved, self-chosen roadmap','Illustrative progress reviews and check-ins','Enriched Wealth Story and guided learning']}
];
const ROADMAP=[
 {id:'picture',focus:'understand',title:'See your investment picture',reason:'Understanding what you hold and what remains unknown can help you make sense of your finances.',action:'Review the fictional in-scope investment picture',destination:'intelligence',needs:['understand','review']},
 {id:'goals',focus:'goals',title:'Give a personal goal a clearer shape',reason:'Choosing a target and timeline makes it easier to test alternative saving scenarios.',action:'Try an adjustable educational goal scenario',destination:'wealthmap',needs:['goals']},
 {id:'protection',focus:'protection',title:'Understand financial protection',reason:'A review of existing arrangements can be useful; Geojit does not know all the cover you may already hold.',action:'Explore general protection considerations',destination:'wealthmap',needs:['protection']},
 {id:'foundation',focus:'foundation',title:'Explore financial flexibility',reason:'Learn how accessible reserves can play a role in handling unexpected needs.',action:'Explore liquidity and reserves',destination:'wealthmap',needs:['foundation']},
 {id:'review',focus:'review',title:'Reflect on the wider picture',reason:'A short periodic review can help you keep your questions and assumptions current.',action:'Explore your Wealth Creation Map',destination:'wealthmap',needs:['review']},
 {id:'story',focus:'understand',title:'Read your next Wealth Story',reason:'Understand material developments with the right source context and a gentle next step.',action:'Read an approved customer-facing edition, if available',destination:'story',needs:['understand','goals','review']}
];
export const blankCompanion=()=>({
 version:COMPANION_VERSION,focus:[],cadence:'on_demand',plan:'essential',
 started:false,reminders:false,decisions:{},saved_at:null
});
const safeChoice=(id,items)=>items.some(x=>x.id===id);
export function sanitiseCompanion(raw){
 const base=blankCompanion();
 if(!raw||raw.version!==COMPANION_VERSION||typeof raw!=='object')return base;
 const decisions={};
 for(const [key,value] of Object.entries(raw.decisions||{})){
  if(ROADMAP.some(x=>x.id===key)&&['completed','later'].includes(value))decisions[key]=value;
 }
 return {...base,started:raw.started===true,
  focus:[...new Set(Array.isArray(raw.focus)?raw.focus.filter(x=>safeChoice(x,FOCUS_AREAS)):[])].slice(0,5),
  cadence:safeChoice(raw.cadence,REVIEW_RHYTHMS)?raw.cadence:'on_demand',
  plan:safeChoice(raw.plan,PLAN_EXPERIENCES)?raw.plan:'essential',
  reminders:raw.reminders===true,
  decisions,saved_at:typeof raw.saved_at==='string'?raw.saved_at:null};
}
export function createLearningRoadmap(profile){
 const p=sanitiseCompanion(profile);
 if(!p.started||p.focus.length===0)return [];
 const selected=ROADMAP.filter(x=>x.needs.some(y=>p.focus.includes(y)));
 // Never add product recommendations or a fabricated mandatory financial gap.
 const ordered=selected.sort((a,b)=>{
  const ai=p.focus.indexOf(a.focus),bi=p.focus.indexOf(b.focus);
  return (ai<0?99:ai)-(bi<0?99:bi);
 });
 return ordered.map(item=>({...item,
   state:p.decisions[item.id]||'suggested',
   framing:'Optional educational step — customer-selected interest',
   reason_code:'DECLARED_TOPIC_ONLY',requires_purchase:false}))
 .slice(0,6);
}
export function selectNextHelpfulAction(profile){
 const list=createLearningRoadmap(profile);
 return list.find(x=>x.state==='suggested')||null;
}
export function actionSummary(profile){
 const list=createLearningRoadmap(profile);
 return {total:list.length,completed:list.filter(x=>x.state==='completed').length,
  deferred:list.filter(x=>x.state==='later').length,
  available:list.filter(x=>x.state==='suggested').length,
  // This is action completion, NOT a financial health or goal probability score.
  label:'Educational roadmap activity, not wealth progress'};
}
export function shouldOfferProactiveCheckIn({profile,materialChangeVerified=false,servicePriority=false,permission=false}={}){
 const p=sanitiseCompanion(profile);
 if(!p.started||!p.reminders||p.cadence==='on_demand'||!permission||servicePriority)
  return {offer:false,reason:'No permission or an inappropriate context for an optional check-in.'};
 if(!materialChangeVerified)return {offer:false,reason:'No verified material change. Do not invent a proactive reason to contact.'};
 return {offer:true,reason:'Offer a neutral educational review within the customer-selected cadence. Never send without a separate authorised channel.'};
}
