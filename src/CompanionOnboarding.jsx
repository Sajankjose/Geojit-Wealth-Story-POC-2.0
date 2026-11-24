import React,{useEffect,useMemo,useState} from 'react'
import {supabase} from './lib/supabase'
import {fixtureIntelligence} from './lib/wealthIntelligence.js'
import {FOCUS_AREAS,REVIEW_RHYTHMS,createLearningRoadmap,blankCompanion} from './lib/wealthCompanion.js'
import {summarisePrefill,onboardingReadiness,personalisedWelcome} from './lib/companionOnboarding.js'
import './companion-onboarding.css'

const SCENES=[
 {id:'discover',label:'Discover'},
 {id:'promise',label:'Explore service'},
 {id:'prefill',label:'Connect context'},
 {id:'confirm',label:'Review data'},
 {id:'profile',label:'Your priorities'},
 {id:'preview',label:'Your roadmap'}
];
const labelOf=c=>String(c?.alias||'Customer').replace(/ \(fictional\)$/i,'')
const dates=v=>v?new Date(v+'T12:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}):'Date not available'
const PILLARS=[
 ['◫','A clearer financial picture','Understand visible holdings and what they mean, with transparent limitations.'],
 ['◎','A roadmap you shape','Choose priorities and explore educational next steps.'],
 ['◈','A story that continues','Receive approved, meaningful perspectives as your journey develops.']
]
export default function CompanionOnboarding({clientId,client,onComplete,onExit}){
 const [scene,setScene]=useState('discover')
 const [context,setContext]=useState({status:'not_requested',snapshot:null,error:null})
 const [scopeAccepted,setScopeAccepted]=useState(false)
 const [reviewed,setReviewed]=useState(false)
 const [focus,setFocus]=useState([])
 const [cadence,setCadence]=useState('on_demand')
 const [checkins,setCheckins]=useState(false)
 const [showRationale,setShowRationale]=useState(false)
 const model=useMemo(()=>fixtureIntelligence(clientId),[clientId])
 useEffect(()=>{setScene('discover');setContext({status:'not_requested',snapshot:null,error:null});
   setScopeAccepted(false);setReviewed(false);setFocus([]);setCadence('on_demand');setCheckins(false);setShowRationale(false)},[clientId])
 const name=labelOf(client)
 const index=SCENES.findIndex(s=>s.id===scene)
 const draft={...blankCompanion(),started:true,focus,cadence,reminders:checkins}
 const steps=createLearningRoadmap(draft)
 const readiness=onboardingReadiness({reviewed,confirmedScope:scopeAccepted,choices:focus})
 const welcome=personalisedWelcome({alias:name,focus,snapshot:context.snapshot})
 function change(next){if(SCENES.some(s=>s.id===next))setScene(next)}
 async function connect(){
  if(!supabase){setContext({status:'unavailable',snapshot:null,error:'The demonstration Supabase connection is not configured. You can proceed without prefill.'});return}
  setContext({status:'loading',snapshot:null,error:null})
  try{
   const {data,error}=await supabase.from('poc_records')
     .select('record_id,client_id,domain,source_id,event_at,payload')
     .eq('client_id',clientId)
     .in('domain',['product_subscriptions','transactions','goals_preferences','service_cases'])
     .limit(500)
   if(error)throw error
   setContext({status:'ready',snapshot:summarisePrefill(data||[],clientId),error:null})
  }catch(e){setContext({status:'unavailable',snapshot:null,error:'We could not load the fictional relationship context. You can continue without it. '+(e.message||'')})}
 }
 function skipPrefill(){setContext({status:'skipped',snapshot:null,error:null});setReviewed(true);setScopeAccepted(true);change('profile')}
 function acceptReview(){setReviewed(true);change('profile')}
 function toggle(id){setFocus(old=>old.includes(id)?old.filter(x=>x!==id):[...old,id])}
 function finish(){
  if(!readiness.canPreview)return
  onComplete?.({...draft,started:true}, {prefill_status:context.status,
   prefill_sources:context.snapshot?.sources?.filter(x=>x.count>0).map(x=>x.id)||[],
   scope_confirmed:true,customer_selected:true})
 }
 return <div className="obExperience">
   <div className="obTopline"><div><span className="obLogo">G</span><span>ONE APP</span><span className="obSep">/</span><strong>Wealth Companion</strong></div><span>Fictional app walkthrough · Management POC</span></div>
   {scene==='discover'?<section className="obOneApp">
    <div className="obAppHeader"><div><small>ONE APP · PERSONAL FINANCE</small><h2>Good to see you, {name}.</h2><p>Your investments and financial tools, in one place.</p></div><div className="obAvatar">{name[0]?.toUpperCase()||'G'}</div></div>
    <div className="obFakeSearch"><span>⌕</span> Search accounts, tools and insights <span>⌘</span></div>
    <div className="obAppSectionName"><h3>Explore your financial tools</h3><span>For you</span></div>
    <div className="obAppTiles"><div><b>◫</b><span>My investments</span><small>Portfolio</small></div><div><b>◎</b><span>Goal tools</span><small>Planning</small></div><div><b>◈</b><span>Research</span><small>Insights</small></div></div>
    <button type="button" className="obFeatureTile" onClick={()=>change('promise')}>
      <span className="obFeatureIcon">◇</span><div><small>NEW · VALUE-ADDED EXPERIENCE</small><strong>My Wealth Companion</strong><p>Understand where you stand. Explore your own roadmap. Find helpful perspectives along the way.</p><span>Discover the experience <b>→</b></span></div>
    </button>
    <div className="obAppBottom"><span>⌂ Home</span><span>◫ Invest</span><span>◎ Explore</span><span>☰ More</span></div>
    <div className="obDemoNote">This is a fictional One App entry screen created to demonstrate feature discovery. Other tiles are visual context, not working app navigation.</div>
   </section>:<div className="obGuided">
    <div className="obSteps" aria-label="Onboarding progress">{SCENES.slice(1).map((s,i)=><div key={s.id} className={index>i?'passed':index===i+1?'current':''}><span>{index>i?'✓':i+1}</span><small>{s.label}</small></div>)}</div>
    {scene==='promise'&&<section className="obPage">
     <div className="obEyebrow">WELCOME TO YOUR WEALTH COMPANION</div>
     <h2>More than a portfolio view.<br/><em>A clearer journey forward.</em></h2>
     <p className="obLead">A place to understand your financial picture, clarify what matters to you and explore meaningful educational next steps. Wealth Story keeps you connected to the journey.</p>
     <div className="obPillarGrid">{PILLARS.map(([icon,title,text])=><div key={title}><b>{icon}</b><strong>{title}</strong><p>{text}</p></div>)}</div>
     <div className="obPromise"><b>A promise you can hold us to</b><p>We won't turn missing Geojit products into a diagnosed financial need. We won't make securities recommendations here. You decide which questions to explore and whether to act.</p></div>
     <div className="obControls"><button className="obPrimary" type="button" onClick={()=>change('prefill')}>Start my journey →</button><button type="button" onClick={()=>change('discover')}>Back to One App</button></div>
     <p className="obFoot">No fee, payment, advisory relationship or actual service subscription is created in this POC.</p>
    </section>}
    {scene==='prefill'&&<section className="obPage">
     <div className="obEyebrow">PERSONALISATION WITH YOUR KNOWLEDGE</div><h2>Start with what we already have—only if you choose.</h2>
     <p className="obLead">Your Geojit relationship may give you a useful starting picture. We can check which fictional account information is available, then let you confirm what's relevant. We won't assume we know your complete financial life.</p>
     <div className="obConsentPanel"><div className="obConsentIcon">◫</div><div><strong>Review available Geojit information</strong><p>We'll look for recorded product relationships, investment activity, goals you've previously shared, and unresolved service matters. In this demo, the information comes from fictional Supabase records.</p>
       <div className="obPrivacyTags"><span>Read-only</span><span>Only this fictional account</span><span>Review before use</span></div></div></div>
     {context.status==='not_requested'?<div className="obControls"><button className="obPrimary" type="button" onClick={connect}>Review my available information →</button><button type="button" onClick={skipPrefill}>Continue without prefill</button></div>:
      context.status==='loading'?<div className="obLoading" role="status"><div className="obSpinner"/> Checking available fictional account domains…</div>:
      <div className="obResults"><b>{context.status==='ready'?'Your account context is ready to review':'Prefill is unavailable'}</b><p>{context.status==='ready'?'This shows what is present, not what is missing from your finances.':context.error}</p><div className="obControls"><button type="button" className="obPrimary" onClick={()=>change('confirm')}>{context.status==='ready'?'Review and confirm →':'Review the limits →'}</button><button type="button" onClick={skipPrefill}>Continue without prefill</button></div></div>}
     <p className="obFoot">Not retrieved: bank accounts, external investments, family information, insurance cover outside Geojit or confidential CRM conversations. None is inferred.</p>
    </section>}
    {scene==='confirm'&&<section className="obPage">
     <div className="obEyebrow">WHAT WE KNOW · WHAT WE DON'T</div><h2>Your starting picture, clearly explained.</h2>
     <p className="obLead">Please review what is available. A record's presence doesn't prove that your investments are suitable, your protection is adequate or your goals are on track.</p>
     <div className="obSourceList">{context.snapshot?.sources?.map(s=><div key={s.id}><span className={s.count?'obAvailable':'obUnknown'}>{s.count?'Available':'Unknown'}</span><div><strong>{s.label}</strong><p>{s.meaning}</p><small>{s.count?'Recorded entries: '+s.count+' · Last dated '+dates(s.last_recorded):'No verified record available for this demo'}</small></div></div>)||<div><span className="obUnknown">Unknown</span><div><strong>No imported relationship context</strong><p>You can still create an educational roadmap based on topics you select.</p></div></div>}</div>
     <div className="obValuation"><span className="obEyebrow">ILLUSTRATIVE FINANCIAL PICTURE</span><strong>{model?.valuation||'Not available'}</strong><small>Derived from a separate synthetic illustration, not the account-domain prefill above. Not a live valuation or complete wealth statement.</small></div>
     <label className="obCheck"><input type="checkbox" checked={scopeAccepted} onChange={e=>setScopeAccepted(e.target.checked)}/><span>I understand that Geojit-visible information is incomplete and that I choose what to explore next.</span></label>
     <div className="obControls"><button className="obPrimary" disabled={!scopeAccepted} type="button" onClick={acceptReview}>Continue with my choices →</button><button type="button" onClick={()=>change('prefill')}>Back</button></div>
     <p className="obFoot">In production, accurate source reconciliation, identity-based entitlements and privacy controls would be required before any prefill.</p>
    </section>}
    {scene==='profile'&&<section className="obPage">
     <div className="obEyebrow">YOUR PRIORITIES · YOUR DECISION</div><h2>What would you like to understand better?</h2>
     <p className="obLead">Tell us which parts of your financial journey feel useful to explore. Choose as many as you like. These are interests—not an assessment of your needs or risk profile.</p>
     <div className="obFocusGrid">{FOCUS_AREAS.map(x=><button type="button" key={x.id} className={focus.includes(x.id)?'selected':''} aria-pressed={focus.includes(x.id)} onClick={()=>toggle(x.id)}><span>{focus.includes(x.id)?'✓':'+'}</span><strong>{x.title}</strong><small>{x.description}</small></button>)}</div>
     <div className="obPreferenceRow"><label><span>How would you like to revisit this?</span><select value={cadence} onChange={e=>setCadence(e.target.value)}>{REVIEW_RHYTHMS.map(r=><option key={r.id} value={r.id}>{r.label}</option>)}</select></label><label className="obOpt"><input type="checkbox" checked={checkins} onChange={e=>setCheckins(e.target.checked)}/><span>I'm interested in optional future check-ins when this service is available.<small>No notifications or emails are sent; this is not consent to marketing.</small></span></label></div>
     <div className="obControls"><button className="obPrimary" type="button" disabled={!focus.length} onClick={()=>change('preview')}>Build my roadmap preview →</button><button type="button" onClick={()=>change('confirm')}>Back</button></div>
     <p className="obFoot">For the POC, a short educational roadmap is generated using your chosen topics only. It does not assess financial adequacy.</p>
    </section>}
    {scene==='preview'&&<section className="obPage">
     <div className="obEyebrow">YOUR WEALTH COMPANION IS COMING TOGETHER</div><h2>{welcome.headline}</h2><p className="obLead">{welcome.summary}</p>
     <div className="obPersonalSummary"><div><span>YOU CHOSE TO EXPLORE</span><strong>{focus.length} topic{focus.length===1?'':'s'}</strong><small>{focus.map(id=>FOCUS_AREAS.find(x=>x.id===id)?.title).join(' · ')}</small></div><div><span>YOUR REVIEW RHYTHM</span><strong>{REVIEW_RHYTHMS.find(x=>x.id===cadence)?.label}</strong><small>No outreach is activated in the POC</small></div><div><span>YOUR STARTING CONTEXT</span><strong>{context.status==='ready'?'Reviewed':'Self-directed'}</strong><small>Only authorised fictional account information</small></div></div>
     <div className="obPreviewRoadmap"><div className="obSectionHeading"><span className="obEyebrow">YOUR FIRST ROADMAP</span><h3>Here's where you could begin.</h3><p>Every step is optional. You can learn, postpone or change your focus.</p></div>{steps.slice(0,4).map((a,i)=><div key={a.id} className="obRoadmapItem"><span>{String(i+1).padStart(2,'0')}</span><div><strong>{a.title}</strong><p>{a.reason}</p></div><small>Explore →</small></div>)}</div>
     <button className="obWhy" type="button" onClick={()=>setShowRationale(v=>!v)} aria-expanded={showRationale}>Why these steps? {showRationale?'−':'+'}</button>
     {showRationale&&<div className="obWhyPanel">Each step is based on a topic you selected, not a product you haven't bought. No personal goal, risk appetite, insurance need or investment recommendation has been inferred. You can return to your Wealth Map or Story at any time.</div>}
     {!readiness.canPreview&&<p className="obError" role="alert">{readiness.errors.join(' ')}</p>}
     <div className="obControls"><button type="button" className="obPrimary" disabled={!readiness.canPreview} onClick={finish}>Enter my Wealth Companion →</button><button type="button" onClick={()=>change('profile')}>Refine my choices</button></div>
     <p className="obFoot">Activation here means saving a fictional educational profile in this browser session. No subscription entitlement, payment, real consent or advice is created.</p>
    </section>}
   </div>}
 </div>
}
