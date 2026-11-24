// POC 3.1 onboarding: privacy-conscious, fictional prefill summary.
// Reads only approved synthetic domain presence and dates. Does not infer wealth
// adequacy, goals, insurance gaps, risk profile or consent from behavioural events.
export const PREFILL_DOMAINS=[
 {id:'product_subscriptions',label:'Geojit product relationships',meaning:'May help describe which account types are visible here.'},
 {id:'transactions',label:'Recorded investment activity',meaning:'Can help explain recorded contributions separately from performance.'},
 {id:'goals_preferences',label:'Previously shared goal information',meaning:'Requires direct confirmation before being used in your roadmap.'},
 {id:'service_cases',label:'Service matters',meaning:'Open concerns take priority over optional product discovery.'}
];
const allowed=new Set(PREFILL_DOMAINS.map(x=>x.id));
const dateOf=x=>{if(!x)return null;const d=new Date(x);return Number.isFinite(d.valueOf())?d.toISOString().slice(0,10):null};
export function summarisePrefill(rows,clientId){
 if(!/^C\d{3}$/.test(String(clientId)))return null;
 if(!Array.isArray(rows))return null;
 const domainRows=rows.filter(x=>x?.client_id===clientId&&allowed.has(x.domain)&&typeof x.record_id==='string');
 const sources=PREFILL_DOMAINS.map(d=>{
  const matching=domainRows.filter(x=>x.domain===d.id);
  const dates=matching.map(x=>dateOf(x.event_at)).filter(Boolean).sort();
  return {id:d.id,label:d.label,meaning:d.meaning,count:matching.length,
    last_recorded:dates.at(-1)||null,status:matching.length?'Available for review':'Not established'};
 });
 const servicePriority=domainRows.filter(x=>x.domain==='service_cases').some(x=>{
  const p=x.payload||{};
  return p.suppress_optional_promotions===true&&!['resolved','closed'].includes(String(p.status||'').toLowerCase());
 });
 return {version:'onboarding_prefill_v3_1',client_id:clientId,synthetic:true,
  sources,servicePriority,
  known:sources.filter(x=>x.count>0).length,
  unknown:sources.filter(x=>x.count===0).length,
  limitations:'Domain presence is not evidence of total wealth, suitability, goal confirmation or adequate protection. Unconnected outside assets are unknown.'};
}
export function onboardingReadiness({reviewed=false,choices=[],confirmedScope=false,profileSaved=false}={}){
 const errors=[];
 if(!reviewed)errors.push('The customer must review or explicitly skip available information.');
 if(!confirmedScope)errors.push('The limits of Geojit-visible information must be acknowledged.');
 if(!Array.isArray(choices)||choices.length===0)errors.push('At least one learning topic should be selected.');
 return {canPreview:errors.length===0,errors,canActivate:errors.length===0&&profileSaved};
}
export function personalisedWelcome({alias,focus=[],snapshot}={}){
 const safeName=String(alias||'Customer').replace(/ \(fictional\)$/i,'').slice(0,45);
 const main=focus.includes('goals')?'a goal you choose':focus.includes('understand')?'your investment picture':
  focus.includes('protection')?'financial protection':'your financial priorities';
 const reason=snapshot?.known?'We can start with the limited synthetic Geojit relationship context you have chosen to review.':
  'We can start with your own selected questions, without assuming anything about your finances.';
 return {headline:safeName+', your journey starts with clarity.',summary:'We will begin by exploring '+main+'. '+reason,
  next_step:'Your first action is educational, voluntary and can be changed or deferred.'};
}
