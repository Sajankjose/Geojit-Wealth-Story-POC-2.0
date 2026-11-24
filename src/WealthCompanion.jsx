import React,{useEffect,useMemo,useState} from 'react'
import {
 FOCUS_AREAS,REVIEW_RHYTHMS,PLAN_EXPERIENCES,
 blankCompanion,sanitiseCompanion,createLearningRoadmap,
 selectNextHelpfulAction,actionSummary,shouldOfferProactiveCheckIn
} from './lib/wealthCompanion.js'
import {fixtureIntelligence} from './lib/wealthIntelligence.js'

const storageKey=id=>'geojit-wealth-companion-poc3-'+id
function readSession(id){
 try{return sanitiseCompanion(JSON.parse(sessionStorage.getItem(storageKey(id))||'null'))}
 catch{return blankCompanion()}
}
function ChapterIcon({type}){return <span className="wcStepSymbol" aria-hidden="true">{type==='picture'?'◫':type==='story'?'◈':type==='protection'?'♧':type==='goals'?'◎':type==='foundation'?'◇':'◌'}</span>}
export default function WealthCompanion({clientId='C012',client,onNavigate}){
 const [profile,setProfile]=useState(()=>readSession(clientId))
 const [stage,setStage]=useState('home')
 const [notice,setNotice]=useState('')
 const model=useMemo(()=>fixtureIntelligence(clientId),[clientId])
 useEffect(()=>{setProfile(readSession(clientId));setStage('home');setNotice('')},[clientId])
 const roadmap=useMemo(()=>createLearningRoadmap(profile),[profile])
 const next=selectNextHelpfulAction(profile)
 const summary=actionSummary(profile)
 const proactivity=shouldOfferProactiveCheckIn({profile,materialChangeVerified:false,permission:false})
 const title=String(client?.alias||'Your').replace(/ \(fictional\)$/i,'')
 function save(next,message='Your fictional choices are saved for this browser session.'){
  const safe=sanitiseCompanion({...next,saved_at:new Date().toISOString()})
  setProfile(safe)
  try{sessionStorage.setItem(storageKey(clientId),JSON.stringify(safe));setNotice(message)}
  catch{setNotice('Changes are available only until this page closes. Browser session storage is unavailable.')}
 }
 function changeFocus(id){save({...profile,focus:profile.focus.includes(id)?profile.focus.filter(x=>x!==id):[...profile.focus,id]},'Focus updated. Nothing was sent or recommended.')}
 function setDecision(id,state){save({...profile,decisions:{...profile.decisions,[id]:state}},state==='completed'?'You marked this learning step complete. This is not a financial milestone.':state==='later'?'You can return to this optional step whenever you wish.':'The step is available to explore again.')}
 function begin(){if(!profile.focus.length){setNotice('Choose at least one area you would like to explore.');return}save({...profile,started:true},'Your self-directed educational roadmap is ready. There is no product commitment or real subscription.');setStage('home')}
 return <div className="wcCompanion">
  <div className="wcDemo"><span>GE0JIT WEALTH COMPANION · PRODUCT CONCEPT POC 3.0</span><b>Fictional reviewer experience · Not an advisory service or active subscription</b></div>
  <header className="wcHero">
   <div><div className="wcKicker">MY WEALTH JOURNEY</div><h2>{profile.started?'A clearer financial journey, '+title+'.':'A more thoughtful way to navigate your financial future.'}</h2>
    <p>{profile.started?'Explore the questions that matter to you. Your roadmap stays in your control and changes only when you choose.':'Understand your investments, explore goals and keep useful financial information together—without being told what to buy.'}</p>
    {profile.started?<div className="wcHeroActions"><button type="button" className="wcMainBtn" onClick={()=>setStage('roadmap')}>View my roadmap →</button><button type="button" onClick={()=>setStage('setup')}>Update what matters to me</button></div>:
     <div className="wcHeroActions"><button type="button" className="wcMainBtn" onClick={()=>setStage('setup')}>Build my learning roadmap →</button><button type="button" onClick={()=>setStage('plans')}>Explore service options</button></div>}
   </div><div className="wcHeroArt" aria-hidden="true"><div className="wcOrbit one"/><div className="wcOrbit two"/><div className="wcHeroCompass">◇</div><span>Understanding</span><span>Perspective</span><span>Progress</span></div>
  </header>
  {notice&&<div className="wcNotice" role="status">{notice}</div>}
  {stage==='setup'&&<section className="wcPanel wcSetup"><div className="wcSectionTop"><div><span className="wcKicker">START WITH YOU</span><h3>What would you like to understand better?</h3><p>Select only what feels useful. These choices are not an assessment of your finances, and you can change them.</p></div><button type="button" onClick={()=>setStage('home')}>Close ×</button></div>
   <div className="wcFocusGrid">{FOCUS_AREAS.map(x=><button type="button" key={x.id} aria-pressed={profile.focus.includes(x.id)} className={'wcFocus '+(profile.focus.includes(x.id)?'active':'')} onClick={()=>changeFocus(x.id)}>
     <span>{profile.focus.includes(x.id)?'✓':'+'}</span><strong>{x.title}</strong><small>{x.description}</small></button>)}</div>
   <div className="wcSetupGrid"><label><span>How often would you like to review?</span><select value={profile.cadence} onChange={e=>save({...profile,cadence:e.target.value})}>{REVIEW_RHYTHMS.map(r=><option key={r.id} value={r.id}>{r.label}</option>)}</select></label><div className="wcConsent"><b>Optional future check-ins</b><label><input type="checkbox" checked={profile.reminders} onChange={e=>save({...profile,reminders:e.target.checked})}/> I may want relevant check-ins when they become available</label><small>This is a preference simulation only. No message will be scheduled or sent, and it is not legal marketing consent.</small></div></div>
   <div className="wcSetupBottom"><p>Your roadmap contains educational steps chosen from your topics—not personalised securities recommendations.</p><button className="wcMainBtn" type="button" onClick={begin}>Create my roadmap →</button></div>
  </section>}
  {stage==='plans'&&<section className="wcPanel wcPlanSection"><div className="wcSectionTop"><div><span className="wcKicker">POTENTIAL VALUE-ADDED SERVICE</span><h3>What kind of ongoing support would you value?</h3><p>These are pricing and entitlement concepts, not purchase offers. No payment, billing, or advisory engagement is available.</p></div><button type="button" onClick={()=>setStage('home')}>Close ×</button></div>
   <div className="wcPlanGrid">{PLAN_EXPERIENCES.map(p=><article key={p.id} className={profile.plan===p.id?'chosen':''}><div className="wcPlanHead"><strong>{p.name}</strong><span>{p.tag}</span></div><h4>{p.price}</h4><p>{p.description}</p><ul>{p.features.map(f=><li key={f}>{f}</li>)}</ul><button type="button" onClick={()=>save({...profile,plan:p.id},p.name+' selected for the concept preview. No charge or entitlement has been created.')}>{profile.plan===p.id?'Selected for demo':'Explore this concept'}</button></article>)}</div>
   <div className="wcCaution"><b>Commercial and regulatory boundary</b><p>Any paid service would require Geojit Compliance/Legal approval of content, fees and entitlements. Personalised investment advice, specific buy/sell/hold instructions and distribution conflict management are outside this POC.</p></div>
  </section>}
  {stage==='roadmap'&&profile.started&&<section className="wcPanel wcRoadmap"><div className="wcSectionTop"><div><span className="wcKicker">YOUR SELF-CHOSEN ACTION PLAN</span><h3>Small, useful steps. Your pace.</h3><p>These tasks help you understand and explore. Completing them doesn't mean you are financially ahead or behind.</p></div><button type="button" onClick={()=>setStage('home')}>Back to overview</button></div>
    <div className="wcRoadmapSummary"><span>{summary.total} optional learning steps</span><span>{summary.completed} marked complete</span><span>{summary.deferred} for later</span></div>
    <div className="wcTaskList">{roadmap.map((x,i)=><article key={x.id} className={x.state==='completed'?'done':''}>
     <div className="wcTaskIcon"><ChapterIcon type={x.id}/></div><div className="wcTaskContent"><div className="wcTaskMeta">STEP {i+1} · {x.state==='completed'?'MARKED COMPLETE':x.state==='later'?'SAVED FOR LATER':'OPTIONAL'}</div><h4>{x.title}</h4><p>{x.reason}</p><div className="wcTaskControls"><button type="button" className="wcStepExplore" onClick={()=>onNavigate?.(x.destination)}>{x.action} →</button><button type="button" onClick={()=>setDecision(x.id,x.state==='completed'?'suggested':'completed')}>{x.state==='completed'?'Reopen':'Mark explored'}</button><button type="button" onClick={()=>setDecision(x.id,x.state==='later'?'suggested':'later')}>{x.state==='later'?'Show again':'Maybe later'}</button></div></div>
    </article>)}</div><div className="wcCaution"><b>No financial score</b><p>These labels track what you choose to explore, not your actual savings progress, financial preparedness, suitability or investment performance.</p></div>
  </section>}
  {stage==='home'&&<div className="wcHome">
    {profile.started?<><div className="wcHomeGrid"><section className="wcPanel wcFocusPanel"><div className="wcKicker">YOUR CURRENT FOCUS</div><h3>{next?next.title:'Nothing urgent to do right now.'}</h3><p>{next?next.reason:'You have explored the optional learning steps in this roadmap. Return when something matters to you.'}</p>
      {next?<button type="button" className="wcMainBtn" onClick={()=>onNavigate?.(next.destination)}>{next.action} →</button>:<button type="button" onClick={()=>setStage('setup')}>Explore another topic</button>}<div className="wcFocusFoot">Why this? {next?'You selected a related educational topic. No product need has been inferred.':'No automatic action is required.'}</div></section>
     <section className="wcPanel wcMiniMap"><div className="wcKicker">YOUR ROADMAP</div><h3>Progress at your pace</h3><div className="wcStatRow"><div><strong>{summary.completed}</strong><span>Explored</span></div><div><strong>{summary.available}</strong><span>Available</span></div><div><strong>{summary.deferred}</strong><span>Later</span></div></div><p>Educational activity only—not a financial fitness score.</p><button type="button" onClick={()=>setStage('roadmap')}>See all steps →</button></section></div>
      <div className="wcInsights"><section className="wcPanel"><div className="wcKicker">YOUR FINANCIAL PICTURE</div><h3>See the investments in your wider story.</h3><p>{model?'The fictional Geojit in-scope view is '+model.valuation+'. Your financial life may include assets and responsibilities that are not visible here.':'You can explore your account information when it becomes available.'}</p><button type="button" onClick={()=>onNavigate?.('intelligence')}>Explore financial intelligence →</button></section>
       <section className="wcPanel"><div className="wcKicker">YOUR WEALTH STORY</div><h3>One useful chapter at a time.</h3><p>Understand what changed, why it may matter and what you might choose to explore next. Stories remain subject to editorial review and publication.</p><button type="button" onClick={()=>onNavigate?.('story')}>Read my Wealth Story →</button></section>
       <section className="wcPanel"><div className="wcKicker">WEALTH CREATION MAP</div><h3>Explore beyond investments.</h3><p>Financial flexibility, protection, growing wealth and goals—all without suggesting you are missing a Geojit product.</p><button type="button" onClick={()=>onNavigate?.('wealthmap')}>Explore the Wealth Map →</button></section></div>
      <div className="wcCheckIn"><div><span className="wcKicker">PROACTIVE GUIDANCE, WHEN THERE IS A REASON</span><h3>No new action is needed just for the sake of it.</h3><p>{proactivity.reason} The POC has no verified event feed that warrants initiating a client communication.</p></div><button type="button" onClick={()=>setStage('setup')}>Review my choices</button></div>
     </>:<section className="wcPanel wcIntroCard"><div className="wcKicker">AN EXPERIENCE BUILT AROUND YOUR QUESTIONS</div><h3>Start with clarity—not a product.</h3><p>Choose one or more questions you'd like to explore. We'll turn them into a simple educational roadmap, with the freedom to change your mind or do nothing.</p><div className="wcInitialAreas">{FOCUS_AREAS.slice(0,3).map(x=><span key={x.id}>{x.title}</span>)}</div><button className="wcMainBtn" type="button" onClick={()=>setStage('setup')}>Choose what matters →</button></section>}
   <div className="wcServiceFooter"><div><strong>About this concept</strong><p>Essential and Journey Plus are illustrative service tiers; neither is available for purchase. No money is collected. This experience is a synthetic educational companion, not a personalised investment plan, investment advice or an authorised service enrolment.</p></div><button type="button" onClick={()=>setStage('plans')}>View service concepts →</button></div>
  </div>}
 </div>
}
