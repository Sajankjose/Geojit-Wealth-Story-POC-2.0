import React,{useMemo,useState} from 'react'
import {meaningfulMoments,MOMENT_REVIEW_DATE} from './lib/momentsThatMatter.js'
import {rupees,demoGoalFigures} from './lib/mobileWealthStory.js'
import {STORY_PEOPLE,composeWealthStory,STORY_TOPICS,storyInsightOrder} from './lib/wealthStoryOrchestrator.js'
import WealthIntelligence from './WealthIntelligence.jsx'
import IllustrativeWealthMap from './IllustrativeWealthMap.jsx'
import MomentsThatMatter,{ProtectionExplorer} from './MomentsThatMatter.jsx'
import {WealthJourneySnapshot,StoryGuide,RMContactCard} from './WealthStoryHub.jsx'
import {DEMO_PATHS} from './lib/demoRoutes.js'
import {BrokerageStoryCard,StoryFeedback} from './BrokerageExperience.jsx'
import './standalone-experiences.css'

const formatDate=date=>new Date(date+'T12:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})
function Icon({name}){return <span className="srMomentIcon" aria-hidden="true">{name==='service'?'◉':name==='goal'?'◎':name==='money'?'↗':name==='new'?'◇':'✦'}</span>}
function FigureSummary({story}){
 if(!story.model)return null
 const m=story.model
 return <section className="srFinancialSummary" aria-label="Fictional investment snapshot">
  <div className="srChapterHeading"><span className="srEyebrow">YOUR MONEY AT A GLANCE</span><small>As of {formatDate(m.as_of)}</small></div>
  <div className="srBigValue"><span>Recorded investment value</span><strong>{m.valuation}</strong></div>
  <div className="srAllocation" aria-label="Equity and mutual fund distribution" role="img"><span style={{width:m.allocation[0].percent+'%'}}/><span style={{width:m.allocation[1].percent+'%'}}/></div>
  <div className="srSplitFigures"><div><span><b className="srDot equity"/> Equity · {m.allocation[0].percent.toFixed(1)}%</span><strong>{m.equity_value}</strong></div><div><span><b className="srDot mf"/> Mutual funds · {m.allocation[1].percent.toFixed(1)}%</span><strong>{m.mutual_fund_value}</strong></div></div>
  <p className="srScope">Only the fictional in-scope Geojit holdings. Assets elsewhere, financial suitability and overall wealth are not established.</p>
 </section>
}
function Surprise({story}){
 const [open,setOpen]=useState(false)
 const x=story.signal
 return <section className="srMoment srMomentFeatured"><div className="srMomentLead"><Icon name={x.type}/><div><span className="srEyebrow">{x.eyebrow}</span><h2>{x.headline}</h2></div></div><p>{x.description}</p>
  <button type="button" className="srInlineAction" onClick={()=>setOpen(!open)} aria-expanded={open}>{open?'Hide the source details −':'Why am I seeing this? +'}</button>
  {open&&<div className="srSourceDetail"><b>What the demo evidence shows</b><ul>{x.evidence.map(a=><li key={a}>{a}</li>)}</ul><small>Source: {x.source}</small></div>}
 </section>
}
function GoalExplorer({story}){
 const [target,setTarget]=useState(story.model?.goal?.target||600000)
 const [years,setYears]=useState(10)
 const [monthly,setMonthly]=useState(5000)
 const g=demoGoalFigures({target,years,monthly})
 return <div className="srTool"><span className="srEyebrow">INTERACTIVE · EDUCATIONAL SCENARIO</span><h3>What could a saving habit add up to?</h3>
  <p>Choose your own inputs. To keep the arithmetic transparent, this example assumes <b>0% investment growth</b> and does not count existing portfolio holdings towards your goal.</p>
  <div className="srSliders"><label><span>Illustrative target <b>{rupees(target)}</b></span><input type="range" min="100000" max="2000000" step="50000" value={target} onChange={e=>setTarget(Number(e.target.value))}/></label>
   <label><span>Years <b>{years}</b></span><input type="range" min="1" max="20" value={years} onChange={e=>setYears(Number(e.target.value))}/></label>
   <label><span>Monthly hypothetical saving <b>{rupees(monthly)}</b></span><input type="range" min="1000" max="30000" step="500" value={monthly} onChange={e=>setMonthly(Number(e.target.value))}/></label></div>
  {g&&<><div className="srToolBig"><span>Illustrative accumulated saving</span><strong>{g.savingsText}</strong><small>over {g.months} months with zero growth</small></div><div className="srGoalBar"><span style={{width:g.percentOfTarget+'%'}}/></div><div className="srToolStats"><div><span>Remaining to target</span><b>{g.shortfallText}</b></div><div><span>Monthly arithmetic at 0%</span><b>{g.requiredText}</b></div></div><p className="srScope">{g.assumption}</p></>}
 </div>
}
function ServiceFollowUp({story}){
 const [show,setShow]=useState(false)
 const caseFile=story.service
 if(!caseFile)return null
 return <section className="srMoment srService"><div className="srMomentLead"><Icon name="service"/><div><span className="srEyebrow">WE REMEMBER YOUR LAST INTERACTION</span><h2>Your request is still part of your story.</h2></div></div>
  <div className="srCaseTop"><span>DEMO REQUEST · {caseFile.case_reference}</span><span className="srCaseStatus">{caseFile.status}</span></div>
  <h3>{caseFile.category}</h3><p>{caseFile.update_text}</p>
  <div className="srCaseTimeline"><div><b>18 Nov</b><span>Request raised</span></div><div><b>20 Nov</b><span>Acknowledged in fictional record</span></div><div><b>Not confirmed</b><span>Next update</span></div></div>
  <button type="button" className="srInlineAction" onClick={()=>setShow(x=>!x)} aria-expanded={show}>{show?'Hide service details −':'Review the interaction +'}</button>
  {show&&<div className="srSourceDetail"><b>What can be said reliably?</b><p>The fictional case has not been marked resolved. There is no verified update date or evidence that the issue is preventing any financial action.</p><small>{caseFile.note}</small></div>}
 </section>
}
function NextStep({story}){
 const [open,setOpen]=useState(false)
 const [topic,setTopic]=useState('goals')
 const n=story.next
 return <section className="srNext"><div className="srNextIntro"><span className="srEyebrow">JUST ONE USEFUL NEXT STEP</span><h2>{n.label}</h2><p>{n.reason}</p><button type="button" onClick={()=>setOpen(x=>!x)} aria-expanded={open}>{open?'Close this exploration −':n.cta+' →'}</button></div>
  {open&&<div className="srNextExpanded">
    {n.topic==='goal'?<GoalExplorer key={story.client_id} story={story}/>:
     n.topic==='movement'?<div><h3>Why the distinction matters</h3><div className="srToolStats"><div><span>Net contribution</span><b>{story.model.weekly_net_flow}</b></div><div><span>Value change excluding flows</span><b>{story.model.weekly_investment_effect}</b></div></div><p>Portfolio movements include cash-flow effects and changes in valuation. The estimated weekly return requires assumptions about cash-flow timing, so it should not be treated as independently verified performance.</p></div>:
     n.topic==='service'?<div><h3>Would you still like help?</h3><p>A production service could offer an authorised follow-up channel for the outstanding request. For now, this POC only shows what the service handoff could look like; nothing is submitted.</p><div className="srPreviewNote">Demo only · No CRM ticket is created, updated or closed.</div></div>:
     <div><h3>Pick a starting question</h3><div className="srTopicOptions">{[['goals','What could a savings goal look like?'],['investments','How do different investment types work?'],['service','How do I get account support?']].map(([id,title])=><button type="button" key={id} className={topic===id?'selected':''} onClick={()=>setTopic(id)}>{title}</button>)}</div>{topic==='goals'?<GoalExplorer story={story}/>:<p>{topic==='investments'?'Start with how diversification, risk and investment time horizons work. This is education, not a recommendation to invest.':'Learn where account queries, transaction matters and service requests should go. No support request is submitted here.'}</p>}</div>}
  </div>}
 </section>
}
function ContactCard({story}){
 const [expanded,setExpanded]=useState(false)
 return <section className="srSupport"><div className="srSupportAvatar" aria-hidden="true">G</div><div className="srSupportBody"><span className="srEyebrow">A HUMAN CONNECTION, WHEN NEEDED</span><h3>Your Geojit servicing contact</h3><p>{story.contact.description}</p><button type="button" className="srInlineAction" onClick={()=>setExpanded(x=>!x)} aria-expanded={expanded}>{expanded?'Hide contact details −':'How would this work? +'}</button>
  {expanded&&<div className="srSourceDetail"><b>Future integrated experience</b><p>Show the verified assigned RM, or the appropriate customer care team when no RM is assigned, with contact method and hours sourced from approved systems.</p><small>Not connected here: RM directory, appointment availability, service-routing workflow or callback submission.</small></div>}</div></section>
}
function Feedback({clientId}){
 const [interest,setInterest]=useState('')
 const [helpful,setHelpful]=useState('')
 const [saved,setSaved]=useState(false)
 return <section className="srFeedback"><span className="srEyebrow">HELP SHAPE YOUR NEXT STORY</span><h2>What should we focus on next time?</h2><p>One simple preference could make the next edition more useful. In this demo it is kept only in the current page state, not sent anywhere.</p>
  <div className="srTopicOptions">{STORY_TOPICS.map(t=><button key={t.id} type="button" className={interest===t.id?'selected':''} onClick={()=>{setInterest(t.id);setSaved(false)}} aria-pressed={interest===t.id}>{t.label}</button>)}</div>
  <div className="srFeedbackBottom"><div><span>Was this story useful?</span><div><button className={helpful==='yes'?'selected':''} type="button" onClick={()=>{setHelpful('yes');setSaved(false)}} aria-pressed={helpful==='yes'}>Yes</button><button className={helpful==='no'?'selected':''} type="button" onClick={()=>{setHelpful('no');setSaved(false)}} aria-pressed={helpful==='no'}>Not yet</button></div></div><button className="srSavePref" type="button" disabled={!interest&&!helpful} onClick={()=>setSaved(true)}>Preview my preference ✓</button></div>
  {saved&&<p className="srSaved" role="status">Demo preference for {clientId} captured on this screen only. No CRM preference, communication consent or customer profile was updated.</p>}
 </section>
}
function StoryOpening({story,onMoments,onNext}){
 const moments=meaningfulMoments(story)
 const occasion=moments?.events.find(x=>x.kind==='delight')
 const role=story.person.role
 const next=role==='service'?'Review my service update':role==='goal'?'Explore my retirement goal':role==='new'?'Explore my first financial topic':'Explore my protection options'
 const highlight=occasion?.id==='anniversary'?{large:occasion.value+' years',label:'Together on your Geojit journey',copy:'Your fictional relationship began on 26 November 2014. A milestone worth remembering.'}:
   occasion?.id==='birthday'?{large:'Happy birthday!',label:'A moment worth celebrating',copy:'Wishing you a wonderful year ahead. Your financial goals can evolve with you.'}:
   story.service?{large:'In progress',label:'Your last service request',copy:'We remember your fictional statement request. The next update is not yet confirmed.'}:
   story.model?{large:story.model.valuation,label:'Your investments with Geojit',copy:'A factual snapshot—not a claim about your overall wealth.'}:
   {large:'Your first chapter',label:'The journey begins with your questions',copy:'No portfolio holdings or personal goals are confirmed in this fictional account.'}
 return <div className="srOpeningMoments">
   <div className="srOpeningPersonal"><span className="srOpeningEyebrow">{occasion?'A MOMENT JUST FOR YOU':'A MOMENT IN YOUR JOURNEY'}</span>
    <strong>{highlight.large}</strong><b>{highlight.label}</b><p>{highlight.copy}</p><button type="button" onClick={onMoments}>See your personal story <span aria-hidden="true">↗</span></button>
   </div>
   <div className="srOpeningAction"><span className="srOpeningEyebrow">ONE USEFUL NEXT STEP</span><h2>{next}</h2><p>{role==='service'?'See what is known about the request before exploring more products.':role==='goal'?'Your declared goal deserves an exploration based on your own assumptions.':role==='new'?'Choose a subject that interests you. There is no obligation to buy anything.':'We have no confirmed picture of your insurance arrangements. Explore what you already have, if you wish.'}</p><button type="button" onClick={onNext}>{next} <span aria-hidden="true">→</span></button>
   </div>
 </div>
}
export default function WealthStoryExperience(){
 const [clientId,setClientId]=useState(()=>{
  try{const id=new URLSearchParams(window.location.search).get('client');return STORY_PEOPLE.some(p=>p.id===id)?id:'C012'}catch{return 'C012'}
 })
 const [detail,setDetail]=useState(false)
 const [mapGoalOpen,setMapGoalOpen]=useState(false)
 const [mapChapter,setMapChapter]=useState(null)
 const [protectionOpen,setProtectionOpen]=useState(false)
 const story=useMemo(()=>composeWealthStory(clientId),[clientId])
 const order=storyInsightOrder(story)
 const switchClient=id=>{setClientId(id);setDetail(false);setMapGoalOpen(false);setMapChapter(null);setProtectionOpen(false);try{window.history.replaceState(null,'',DEMO_PATHS.story+'?client='+encodeURIComponent(id))}catch{}}
 const goToSection=(destination)=>{
  if(['foundation','protection','growth','goals','review'].includes(destination)){setMapChapter(destination);window.requestAnimationFrame(()=>document.getElementById('wealth-creation-map')?.scrollIntoView({behavior:'smooth',block:'start'}))}
  else if(destination==='protection-explorer'){setProtectionOpen(true);window.requestAnimationFrame(()=>document.getElementById('wealth-story-protection')?.scrollIntoView({behavior:'smooth',block:'start'}))}
  else if(destination==='service'){window.requestAnimationFrame(()=>document.querySelector('.srService')?.scrollIntoView({behavior:'smooth',block:'center'}))}
  else if(destination==='moments'){window.requestAnimationFrame(()=>document.getElementById('wealth-story-moments')?.scrollIntoView({behavior:'smooth',block:'start'}))}
  else if(destination==='map'){window.requestAnimationFrame(()=>document.getElementById('wealth-creation-map')?.scrollIntoView({behavior:'smooth',block:'start'}))}
  else if(destination==='contact'){window.requestAnimationFrame(()=>document.getElementById('wealth-story-contact')?.scrollIntoView({behavior:'smooth',block:'center'}))}
 }
 if(!story)return <div className="srPage"><p>Fictional story unavailable.</p></div>
 const {person,model}=story
 return <div className="srPage">
  <header className="srHeader"><div className="srBrand"><span className="srLogo">WS</span><div><strong>Geojit Wealth Story</strong><small>ONE STORY. WHAT MATTERS NEXT.</small></div></div><div className="srHeaderLinks"><a href={DEMO_PATHS.companion+'?client='+encodeURIComponent(clientId)+'&focus='+(story.next.topic==='movement'?'money':story.next.topic==='goal'?'goals':story.next.topic==='service'?'support':'learning')}>Phase 2 · Wealth Companion</a><a href={DEMO_PATHS.lab}>Review workspace</a></div></header>
  <main className="srMain">
   <div className="srIssue"><span>PHASE 1 · PERSONALISED RELATIONSHIP EXPERIENCE</span><span>FICTIONAL REVIEW DEMONSTRATION</span></div>
   <div className="srPersonaNav" aria-label="Preview different customer stories">{STORY_PEOPLE.map(p=><button key={p.id} type="button" className={clientId===p.id?'selected':''} onClick={()=>switchClient(p.id)} aria-pressed={clientId===p.id}><strong>{p.name}</strong><small>{p.description}</small></button>)}</div>
   <section className="srCover srCoverEditorial srCoverCompact"><div className="srCoverTop"><span className="srEyebrow">YOUR WEALTH STORY · {formatDate(MOMENT_REVIEW_DATE)}</span><span>INVESTMENT FIGURES AS AT {formatDate(story.as_of)}</span></div>
    <div className="srCoverHeadline"><div><h1>Hello, {person.name}.<br/><em>{story.headline}</em></h1><p>{story.intro}</p></div><span className="srCoverChapter">YOUR JOURNEY<br/>CONTINUES <span aria-hidden="true">✦</span></span></div>
    <StoryOpening key={clientId+'opening'} story={story} onMoments={()=>goToSection('moments')} onNext={()=>goToSection(story.service?'service':person.role==='goal'?'goals':person.role==='new'?'foundation':'protection-explorer')}/>
    <div className="srCoverFoot"><span>Made from fictional customer records. Each story is different.</span><a className="srMapJump" href="#wealth-creation-map">Explore my wealth map ↗</a></div>
   </section>
   <div className="srJourneyRibbon"><span>YOUR WEALTH CREATION JOURNEY</span><div><b>01</b> Understand your starting point <i>→</i> <b>02</b> Discover what matters <i>→</i> <b>03</b> Explore your next chapter</div></div>
   <MomentsThatMatter key={clientId+'moments'} story={story} onExploreProtection={()=>goToSection('protection-explorer')}/>
   <WealthJourneySnapshot key={clientId+'snapshot'} story={story} onExplore={goToSection} onExploreProtection={()=>goToSection('protection-explorer')} onExploreMoments={()=>goToSection('moments')}/>
   {protectionOpen&&<ProtectionExplorer key={clientId+'protection'} story={story}/>}
   <div className="srContentGrid">
    <div className="srContentMain">
     {order.includes('service')&&<ServiceFollowUp key={clientId+'service'} story={story}/>}
     {order.includes('financial')&&<FigureSummary story={story}/>}
     <Surprise key={clientId+'signal'} story={story}/>
     <NextStep key={clientId+'next'} story={story}/>
     {person.role==='goal'&&model?.goal&&<section className="srEditorialNote"><span className="srEyebrow">IMPORTANT DISTINCTION</span><h3>A goal is not the same as a portfolio.</h3><p>The fictional retirement target is declared, but no holding is verified as earmarked for it. We will not claim this account is a particular percentage of the way to retirement.</p></section>}
     {person.role==='service'&&<section className="srEditorialNote"><span className="srEyebrow">SERVICE FIRST</span><h3>Useful follow-up before promotion.</h3><p>When a customer has an unresolved matter, a relevant service update takes priority over unrelated product messaging.</p></section>}
     {person.role==='new'&&<section className="srEditorialNote"><span className="srEyebrow">NO ASSUMPTIONS</span><h3>Your story can begin without a portfolio.</h3><p>There is no basis to infer investments elsewhere, savings capacity or financial responsibilities. Your first preference can guide future educational stories.</p></section>}
     {model&&<section className="srSecondary"><div><span className="srEyebrow">IF YOU'D LIKE TO EXPLORE DEEPER</span><h3>Your full financial picture</h3><p>Explore seven-week fictional valuations and the documented limitations of the cash-flow-adjusted comparison. Not required to enjoy the story.</p></div><button type="button" onClick={()=>setDetail(x=>!x)} aria-expanded={detail}>{detail?'Hide analysis −':'Show detailed analysis +'}</button>{detail&&<div className="srEvidence"><WealthIntelligence key={clientId} clientId={clientId}/></div>}</section>}
    </div>
    <aside className="srSideRail"><RMContactCard key={clientId+'rm'} story={story}/><div className="srEditorialCard"><span className="srEyebrow">SELECTED FOR YOUR STORY</span><h3>{story.content.title}</h3><p>{story.content.body}</p><small>Educational context · Based on the fictional scenario, not a recommendation.</small></div><div className="srSourceStamp"><b>How this edition was made</b><p>Evidence-linked synthetic account facts and editorial scenario rules. Only sections relevant to this fictional customer are prioritised.</p><details><summary>Sources & limitations</summary><p>{story.source_scope}</p><p>{story.signal.source}</p><p>No real Data Lake, CRM case, RM assignment, outbound newsletter or consent update is connected.</p></details></div></aside>
   </div>
   <div id="wealth-creation-map" className="srMapSection"><IllustrativeWealthMap key={clientId+'map-'+(mapChapter||'default')} initialChapter={mapChapter} story={story} onExploreProtection={()=>{setProtectionOpen(true);window.requestAnimationFrame(()=>document.getElementById('wealth-story-protection')?.scrollIntoView({behavior:'smooth',block:'start'}))}} onExploreGoal={()=>setMapGoalOpen(v=>!v)}/>{mapGoalOpen&&<div className="srMapGoalExplorer"><GoalExplorer key={clientId+'map-goal'} story={story}/></div>}</div>
   <BrokerageStoryCard key={clientId+'brokerage'} clientId={clientId}/>
   <StoryFeedback key={clientId+'rating'} clientId={clientId}/>
   <section className="srTomorrow"><span className="srEyebrow">AND YOUR JOURNEY CONTINUES</span><h2>Your journey does not end with this story.</h2><p>This is one chapter of your wealth creation journey. Keep exploring the topics that matter to you, and return as your questions and circumstances evolve. Wealth Companion is a separate, proposed Phase 2 service.</p><a href={DEMO_PATHS.companion+'?client='+encodeURIComponent(clientId)+'&focus='+(story.next.topic==='movement'?'money':story.next.topic==='goal'?'goals':story.next.topic==='service'?'support':'learning')}>Continue this story in Wealth Companion →</a></section>
   <StoryGuide key={clientId+'guide'} story={story} onNavigate={goToSection}/>
   <footer className="srFooter">All customers, financial figures, service records and scenarios are fictional. Investment valuations dated 20 November 2026. Product relationship labels are explicitly invented demo fixtures, not live subscription records. No live market, Data Lake, customer care integration, assigned RM, outbound message or financial advice.</footer>
  </main></div>
}
