import React,{useEffect,useMemo,useState} from 'react'
import {supabase} from './lib/supabase'
import {fixtureIntelligence} from './lib/wealthIntelligence.js'
import {MAP_AREAS,GUIDANCE,calculateGoalScenario,dimensionState,evaluateGenuineGuidance} from './lib/genuineGuidance.js'

const inr=n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n)
const display=c=>String(c?.alias||'Customer').replace(/ \(fictional\)$/i,'')
export default function WealthCreationMap({clientId='C012',client,onOpenFinancialPicture}){
 const [area,setArea]=useState(null)
 const [optInfo,setOptInfo]=useState(null)
 const [goalTarget,setGoalTarget]=useState(1500000)
 const [years,setYears]=useState(15)
 const [current,setCurrent]=useState(0)
 const [rate,setRate]=useState(4)
 const [interestState,setInterestState]=useState({status:'idle',message:''})
 const [serviceFirst,setServiceFirst]=useState(false)
 const [saving,setSaving]=useState(false)
 const [gateOpen,setGateOpen]=useState(false)
 const model=useMemo(()=>fixtureIntelligence(clientId),[clientId])
 const selected=MAP_AREAS.find(x=>x.id===area)
 const guidance=GUIDANCE[area]
 const scenario=calculateGoalScenario({target:goalTarget,current,years,annualRate:rate/100})
 const intent=evaluateGenuineGuidance({area,customerAsked:!!area,requestedProductInfo:!!optInfo,serviceFirst})
 useEffect(()=>{setArea(null);setOptInfo(null);setInterestState({status:'idle',message:''});setGateOpen(false)},[clientId])
 useEffect(()=>{
  let active=true
  async function check(){
   if(!supabase){setServiceFirst(false);return}
   try{
    const {data,error}=await supabase.from('poc_records').select('domain,payload').eq('client_id',clientId).eq('domain','service_cases').limit(40)
    if(error)throw error
    if(active)setServiceFirst((data||[]).some(x=>x.payload?.suppress_optional_promotions===true&&!['closed','resolved'].includes(String(x.payload?.status||'').toLowerCase())))
   }catch{if(active)setServiceFirst(true)} // fail closed for product discovery; self-help always available
  }
  setServiceFirst(true)
  check();return()=>{active=false}
 },[clientId])
 function choose(id){setArea(id);setOptInfo(null);setInterestState({status:'idle',message:''});setGateOpen(false)}
 async function recordExplicit(eventType){
  if(!supabase||!area||saving)return
  if(eventType==='followup_request_demo'&&!intent.allowProductInformation)return
  setSaving(true);setInterestState({status:'saving',message:'Recording your explicit choice in the fictional reviewer workspace…'})
  try{
   const {error}=await supabase.from('poc_guidance_events').insert({
     client_id:clientId,topic:area,event_type:eventType,synthetic:true,
     details:{simulation:true,explicit_action:true,product_information_topic:optInfo||null,
       guidance_policy:intent.source,customer_requested_followup:eventType==='followup_request_demo'}
   })
   if(error)throw error
   setInterestState({status:'saved',message:eventType==='followup_request_demo'?
    'Your fictional request is recorded for the Marketing Studio demo. No RM was contacted, no lead was routed and no message was sent.':
    'Your fictional interest is saved for this demo. Nothing has been sent or scheduled.'})
  }catch(e){setInterestState({status:'error',message:'Interest could not be saved. Run the POC 2.7.3 Supabase migration if it is not yet installed. '+(e.message||'')})}
  finally{setSaving(false)}
 }
 return <div className="wmExperience">
  <div className="wmIntro"><span className="wmEyebrow">WEALTH STORY · ADAPTIVE WEALTH CREATION MAP</span><h2>Make space for the bigger picture.</h2>
   <p>Explore the parts of your financial journey that matter to you. We can help you ask useful questions; we won't assume something is missing simply because it isn't visible in your Geojit accounts.</p>
   <div className="wmPrivacyNote">Fictional reviewer preview · Your choices lead this experience · Nothing is a personalised product recommendation</div>
  </div>
  <div className="wmBody">
   <div className="wmMap"><div className="wmMapHead"><div><span className="wmEyebrow">YOUR FINANCIAL LANDSCAPE</span><h3>Where would you like to explore?</h3></div><small>There is no financial health score and no prescribed order.</small></div>
    <div className="wmDimensions">{MAP_AREAS.map(d=>{
     const status=dimensionState(d.id,clientId,!!model?.goal)
     return <button key={d.id} type="button" onClick={()=>choose(d.id)} aria-pressed={area===d.id} className={'wmArea '+(area===d.id?'selected':'')}>
      <div className="wmAreaTop"><span className="wmAreaIcon" aria-hidden="true">{d.icon}</span><span className="wmState">{status.state}</span></div>
      <strong>{d.title}</strong><span>{d.summary}</span><small>{status.detail}</small><em>{area===d.id?'Currently exploring':'Explore this dimension →'}</em>
     </button>
    })}</div>
   </div>
   <section className="wmGuide" aria-live="polite">
    {!selected?<div className="wmWelcome"><div className="wmGuideMark">◈</div><span className="wmEyebrow">GUIDANCE WHEN YOU WANT IT</span><h3>Your journey is yours to shape.</h3><p>Select any area to understand it, explore a planning scenario, or learn about possible financial approaches. You never need to choose a product.</p><button type="button" onClick={()=>choose('growth')}>Start with your investments →</button></div>:
     <><div className="wmGuideHeading"><span className="wmEyebrow">{selected.title.toUpperCase()}</span><button type="button" onClick={()=>choose(null)}>Close ×</button></div>
      <h3>{guidance.headline}</h3><p>{guidance.body}</p>
      <div className="wmQuestion"><b>One question worth considering</b><p>{selected.question}</p></div>
      {area==='goals'&&<div className="wmCalculator"><div className="wmEyebrow">ADJUSTABLE PLANNING SCENARIO</div><p>Set a target and your own assumptions. This illustrates the mathematics of saving; it doesn't select an investment product.</p>
       <label>Illustrative goal target <strong>{inr(goalTarget)}</strong><input type="range" min="100000" max="10000000" step="50000" value={goalTarget} onChange={e=>setGoalTarget(Number(e.target.value))}/></label>
       <label>Time available <strong>{years} years</strong><input type="range" min="1" max="35" step="1" value={years} onChange={e=>setYears(Number(e.target.value))}/></label>
       <label>Existing savings you choose to include <strong>{inr(current)}</strong><input type="range" min="0" max="3000000" step="25000" value={current} onChange={e=>setCurrent(Number(e.target.value))}/></label>
       <label>Hypothetical annual growth scenario <strong>{rate}%</strong><input type="range" min="0" max="8" step="1" value={rate} onChange={e=>setRate(Number(e.target.value))}/></label>
       {scenario&&<div className="wmCalculation"><span>Illustrative monthly amount</span><strong>{inr(scenario.monthly)}</strong><small>At a hypothetical {rate}% annual growth assumption; an alternative 0% scenario would require {inr(calculateGoalScenario({target:goalTarget,current,years,annualRate:0})?.monthly||0)} per month.</small></div>}
       <p className="wmFinePrint">Assumes end-of-month contributions and constant nominal returns. No tax, cost or inflation adjustment. Market returns are uncertain and figures are not recommendations. Inputs stay only in this browser session.</p>
      </div>}
      {area==='growth'&&<div className="wmKnownContext"><strong>What is known in this fictional example</strong><p>{model?('Illustrative in-scope value: '+model.valuation+'. This does not establish total financial wealth or the adequacy of allocation.'):'No verified in-scope values available.'}</p><button type="button" onClick={onOpenFinancialPicture}>Explore my financial picture →</button></div>}
      <div className="wmGuideActions"><p>{guidance.next}</p><button type="button" onClick={()=>setGateOpen(v=>!v)} aria-expanded={gateOpen}>Why this guidance? {gateOpen?'−':'+'}</button></div>
      {gateOpen&&<div className="wmGate"><b>Genuine Guidance Gate</b>{intent.checks.map(c=><div key={c.id}><span>{c.pass?'✓':'•'}</span>{c.detail}</div>)}<p>{intent.reason} Product suitability and full financial circumstances have not been established.</p></div>}
      <div className="wmLearning"><span className="wmEyebrow">MORE TO EXPLORE · ALWAYS OPTIONAL</span><p>These are educational topics, not detected gaps. You can understand this subject without purchasing anything.</p>
       {guidance.options.length?guidance.options.map(o=><div key={o.id} className="wmProductInfo"><button type="button" onClick={()=>setOptInfo(optInfo===o.id?null:o.id)} aria-expanded={optInfo===o.id}>{o.title} <span>{optInfo===o.id?'−':'Read about this →'}</span></button>
        {optInfo===o.id&&<div className="wmProductDetails"><p>{o.purpose}</p>{serviceFirst?<p>Optional product discovery is withheld while a service priority is unresolved. You can still explore the general educational information above.</p>:<p>Information only. Geojit has not determined your need, eligibility or suitability; non-Geojit alternatives may also be appropriate.</p>}
         <button type="button" disabled={!intent.allowProductInformation||saving} onClick={()=>recordExplicit('followup_request_demo')}>Request more information · demo</button>
        </div>}
       </div>):<p>There is no product suggestion for this topic. The guidance remains useful on its own.</p>}
      </div>
      <div className="wmActions"><button type="button" disabled={saving} onClick={()=>recordExplicit('topic_interest_demo')}>Save my interest · demo</button><button type="button" onClick={()=>choose(null)}>Not now</button></div>
      {interestState.message&&<div className={'wmMessage '+interestState.status} role="status">{interestState.message}</div>}
     </>}
   </section>
  </div>
  <div className="wmBottom"><b>Our promise in this POC</b><p>Proactive in understanding. Genuine in guidance. Respectful of every decision. The app does not infer a protection gap, goal or need to buy from a missing Geojit product. Marketing receives an interest only when the reviewer explicitly records it in this synthetic demo; no live lead is created.</p></div>
 </div>
}
