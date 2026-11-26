import React,{useMemo,useState} from 'react'
import {meaningfulMoments,illustrativeTermCover,protectionEngagement} from './lib/momentsThatMatter.js'
import {rupees} from './lib/mobileWealthStory.js'
import './moments-that-matter.css'
const fmtDate=date=>new Date(date+'T12:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})
export default function MomentsThatMatter({story,onExploreProtection}){
 const moments=useMemo(()=>meaningfulMoments(story),[story])
 const [openSource,setOpenSource]=useState(false)
 if(!moments)return null
 return <section className="mtmSection" id="wealth-story-moments" aria-label="Moments that matter">
  <div className="mtmHead"><div><span className="srEyebrow">MOMENTS THAT MATTER</span><h2>More than investments. A journey worth remembering.</h2><p>A few meaningful moments drawn from the fictional information Geojit could one day connect.</p></div><span className="mtmReviewDate">Edition preview · {fmtDate(moments.reviewDate)}</span></div>
  <div className="mtmCards">
   {moments.events.filter(x=>x.kind==='delight').map(event=><article className={'mtmCard mtmCard-'+event.id} key={event.id}><span className="mtmEventIcon">{event.id==='birthday'?'✦':'♡'}</span><span className="mtmEventEyebrow">{event.label}</span>{event.id==='anniversary'&&<strong className="mtmNumber">{event.value}<small> years</small></strong>}<h3>{event.id==='anniversary'?'We have come a long way together.':event.title}</h3><p>{event.message}</p><small className="mtmFootnote">Demo-only relationship date</small></article>)}
   {moments.events.filter(x=>x.kind==='figure').map(event=><article className="mtmCard mtmCard-figure" key={event.id}><span className="mtmEventIcon">↗</span><span className="mtmEventEyebrow">YOUR INVESTMENT CHAPTER</span><strong className="mtmNumber">{rupees(event.value)}</strong><h3>A number with context</h3><p>{event.message}</p><small className="mtmFootnote">{event.source}</small></article>)}
   <article className="mtmCard mtmCard-protection"><span className="mtmEventIcon">◇</span><span className="mtmEventEyebrow">A LIFE-STAGE QUESTION</span>{moments.age!==null&&<strong className="mtmNumber">{moments.age}<small> years</small></strong>}<h3>Would you like to understand your protection picture?</h3><p>{moments.age!==null?'We have a fictional age record, but age alone cannot establish insurance needs.':'We have no DOB on record for this fictional scenario. You can still explore protection at your pace.'}</p><button type="button" onClick={onExploreProtection}>Explore protection →</button><small className="mtmFootnote">No coverage gap inferred</small></article>
  </div>
  <button type="button" className="mtmEvidenceButton" onClick={()=>setOpenSource(x=>!x)} aria-expanded={openSource}>{openSource?'Hide source details −':'How were these moments selected? +'}</button>
  {openSource&&<div className="mtmEvidence"><p>Relationship dates are deliberately invented for the management POC. Ages and anniversary years are calculated against {fmtDate(moments.reviewDate)}. Portfolio values come from the existing synthetic valuation fixture as of 20 November 2026. No genuine DOB, client relationship date, insurance status or purchase history was accessed.</p></div>}
 </section>
}
export function ProtectionExplorer({story}){
 const [answer,setAnswer]=useState('unsure')
 const [annualExpense,setAnnualExpense]=useState(600000)
 const [years,setYears]=useState(10)
 const [liabilities,setLiabilities]=useState(0)
 const [assets,setAssets]=useState(0)
 const [cover,setCover]=useState(0)
 const [health,setHealth]=useState('')
 const [type,setType]=useState('term')
 const [interest,setInterest]=useState(false)
 const [permission,setPermission]=useState(false)
 const [preview,setPreview]=useState(false)
 const [calculator,setCalculator]=useState(false)
 const safeAnswer=protectionEngagement(answer)
 const result=illustrativeTermCover({annualFamilyExpense:annualExpense,supportYears:years,liabilities,earmarkedAssets:assets,existingTermCover:safeAnswer==='has_cover'?cover:0})
 const serviceFirst=!!story.service&&story.service.status==='In progress'
 const choose=v=>{setAnswer(v);setPreview(false);setInterest(false);setPermission(false)}
 return <div className="mtmProtection" id="wealth-story-protection" aria-label="Insurance coverage exploration">
   <div className="mtmProtectionIntro"><span className="srEyebrow">YOUR PROTECTION CHAPTER</span><h3>Would you like to take a closer look at your financial protection?</h3><p>Knowing a customer's age does not tell us the right health or term insurance cover. Start with what you know—without assuming anything is missing.</p></div>
   <fieldset className="mtmAnswerGroup"><legend>What best describes your current insurance arrangements?</legend>
    {[['has_cover','I already have insurance'],['no_cover','I have no cover that I know of'],['unsure','I am not sure'],['later','I would rather explore later']].map(([value,label])=><label key={value} className={answer===value?'selected':''}><input type="radio" name={'protection-state-'+story.client_id} checked={answer===value} onChange={()=>choose(value)}/>{label}</label>)}</fieldset>
   {answer!=='later'&&<><div className="mtmProtectionRoutes"><button type="button" className={type==='term'?'selected':''} onClick={()=>{setType('term');setPreview(false)}}>Term-life cover</button><button type="button" className={type==='health'?'selected':''} onClick={()=>{setType('health');setPreview(false)}}>Health cover</button></div>
    {type==='health'?<div className="mtmScenario"><h4>Health cover: start with your existing arrangement</h4><label>Optional existing health cover amount, if known (₹)<input type="number" min="0" max="100000000" step="100000" placeholder="Enter cover amount, if known" value={health} onChange={e=>setHealth(e.target.value)} /></label><p>{health!==''&&Number(health)>=0?'You entered '+rupees(Number(health))+'. This is a customer-declared illustration, not verified policy coverage. ':'Without medical, household, provider, deductible, exclusions and policy data we cannot determine an appropriate cover amount from age alone.'}Explore policy terms and ask for an authorised review if you wish.</p></div>:
    <div className="mtmScenario"><h4>Explore a hypothetical term-cover scenario</h4><p>This is a simple illustration, not an age-based coverage recommendation. You control all the assumptions.</p>
     <div className="mtmScenarioInputs"><label>Annual family expenses (₹)<input type="number" min="0" max="100000000" step="50000" value={annualExpense} onChange={e=>setAnnualExpense(Number(e.target.value))}/></label><label>Years of support<input type="number" min="1" max="40" value={years} onChange={e=>setYears(Number(e.target.value))}/></label><label>Outstanding liabilities (₹)<input type="number" min="0" max="1000000000" step="100000" value={liabilities} onChange={e=>setLiabilities(Number(e.target.value))}/></label><label>Earmarked assets (₹)<input type="number" min="0" max="1000000000" step="100000" value={assets} onChange={e=>setAssets(Number(e.target.value))}/></label>{answer==='has_cover'&&<label>Existing term cover (₹), if known<input type="number" min="0" max="1000000000" step="100000" value={cover} onChange={e=>setCover(Number(e.target.value))}/></label>}</div>
     {result?<><button type="button" className="mtmCalcToggle" onClick={()=>setCalculator(x=>!x)} aria-expanded={calculator}>{calculator?'Hide the illustration −':'Show the numbers →'}</button>{calculator&&<div className="mtmScenarioResults"><div><span>Illustrative expense-and-obligation amount</span><strong>{rupees(result.hypotheticalNeed)}</strong></div><div><span>Difference after entered term cover</span><strong>{rupees(result.unaddressed)}</strong></div><p>{result.assumption}</p></div>}</>:<p className="mtmValidation">Enter valid non-negative amounts and 1–40 years to explore the arithmetic.</p>}</div>}
    <div className="mtmInterest"><h4>Would you like to revisit this topic?</h4><p>Interest in learning about insurance is different from permission to contact you.</p><label><input type="checkbox" checked={interest} onChange={e=>{setInterest(e.target.checked);setPreview(false)}}/> I am interested in understanding my existing cover or options.</label><label><input type="checkbox" checked={permission} onChange={e=>{setPermission(e.target.checked);setPreview(false)}}/> I agree that Geojit may contact me about a protection review using my registered details. (Demonstration only; no request will be sent.)</label>
     {serviceFirst&&<p className="mtmServiceNote">Your fictional service request is still open. Product-related follow-up is suppressed in this demo.</p>}
     <button type="button" disabled={!interest||!permission||serviceFirst} onClick={()=>setPreview(true)}>Preview my follow-up interest</button>
     {preview&&<p role="status" className="mtmSuccess">Preview captured on this page only: {safeAnswer==='has_cover'?'existing insurance declared':safeAnswer==='no_cover'?'no current cover declared':'coverage uncertain'}, topic {type==='term'?'term-life':'health'}. No CRM record, lead, consent or actual contact has been submitted.</p>}
    </div>
   </>}
   {answer==='later'&&<p className="mtmLater">You can keep this chapter open for another time. No follow-up request or insurance assumption has been created.</p>}
   <p className="mtmLegal">Internal fictional demonstration. These user-entered cover figures are unverified. Insurance decisions require appropriate product disclosures, underwriting and authorised needs assessment. Nothing here calculates suitable coverage or constitutes a recommendation.</p>
 </div>
}
