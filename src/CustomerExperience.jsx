import React,{useEffect,useMemo,useState} from 'react'
import {supabase} from './lib/supabase'
import WealthIntelligence from './WealthIntelligence.jsx'
import WealthCreationMap from './WealthCreationMap.jsx'
import GuidedJourney from './GuidedJourney.jsx'

const CHANNELS=[
 {id:'daily_trading',title:'Daily Trading Brief',rhythm:'Trading days',description:'Your trading context, only when current and approved sources are available.'},
 {id:'weekly_investing',title:'Weekly Investment Story',rhythm:'Weekly',description:'A view of investing activity and relationship milestones.'},
 {id:'monthly_wealth',title:'Monthly Wealth Journey',rhythm:'Monthly',description:'A wider perspective on your declared financial journey.'}
]
const name=c=>(c?.alias||'Customer').replace(/ \(fictional\)$/i,'')
const date=v=>{if(!v)return 'Date unavailable';const d=new Date(v);return Number.isFinite(d.valueOf())?d.toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'}):'Date unavailable'}
const sourceLabel={transactions:'Transaction activity',product_subscriptions:'Your Geojit products',goals_preferences:'Goals and interests',human_touchpoints:'Relationship conversations',service_cases:'Service matters',digital_platform_events:'Digital activity',engagement_tool_events:'Tools explored',consent_preferences:'Your preferences',communication_events:'Communications',story_contexts:'Earlier editorial context',customer_states:'Relationship context'}
const normalize=x=>String(x||'').toLowerCase()
const editionLabel=id=>CHANNELS.find(c=>c.id===id)?.title||'Wealth Story'

function ContextCard({item}) {
 return <div className="cxContextCard">
   <div className="cxContextSource">{sourceLabel[item.domain]||'Relationship context'} <span>{item.observed_at?date(item.observed_at):'Timing not established'}</span></div>
   <p>{item.observation}</p>
   <small>Fictional source record · {item.freshness||'Freshness unknown'} · {item.caution||'Review before relying on the observation'}</small>
 </div>
}

export default function CustomerExperience({clients=[],initialClientId,onChooseClient,onBack,onOpenStudio}){
 const [clientId,setClientId]=useState(initialClientId||'C012')
 const [editionType,setEditionType]=useState('weekly_investing')
 const [view,setView]=useState('story')
 const [data,setData]=useState({status:'loading',subscriptions:[],editions:[],events:[]})
 const [refreshKey,setRefreshKey]=useState(0)
 const [notice,setNotice]=useState('')
 const [error,setError]=useState('')
 const [working,setWorking]=useState(false)
 const [expandedExplore,setExpandedExplore]=useState(null)
 const client=clients.find(c=>c.client_id===clientId)||clients[0]
 useEffect(()=>{
  if(!clientId&&clients[0])setClientId(clients[0].client_id)
 },[clients,clientId])
 useEffect(()=>{
  if(!supabase||!clientId){setData({status:'empty',subscriptions:[],editions:[],events:[]});return}
  let active=true
  setData(old=>({...old,status:'loading',editions:[],subscriptions:[],events:[]}))
  async function fetchData(){
   try{
    const [subs,editions,events]=await Promise.all([
      supabase.from('poc_edition_subscriptions').select('*').eq('client_id',clientId),
      supabase.from('poc_story_editions').select('id,client_id,edition_type,title,body,stage,created_at,generation_method,evidence_trace').eq('client_id',clientId).eq('stage','published_in_app').order('created_at',{ascending:false}).limit(60),
      supabase.from('poc_studio_events').select('id,client_id,edition_type,edition_id,event_type,created_at').eq('client_id',clientId).eq('event_type','in_app_view_demo').order('created_at',{ascending:false}).limit(100)
    ])
    if(subs.error||editions.error||events.error)throw(subs.error||editions.error||events.error)
    if(active)setData({status:'ready',subscriptions:subs.data||[],editions:editions.data||[],events:events.data||[]})
   }catch(e){if(active)setData({status:'error',message:e.message||'Unable to load the fictional customer preview.',subscriptions:[],editions:[],events:[]})}
  }
  fetchData();return()=>{active=false}
 },[clientId,refreshKey])
 const published=useMemo(()=>data.editions.filter(e=>e.edition_type===editionType),[data.editions,editionType])
 // Existing pre-2.7.1 stories remain available in the internal Studio for review.
 // Do not expose an earlier, possibly intrusive draft to a customer preview.
 const edition=published.find(e=>e.evidence_trace?.editorial?.version==='story_framework_v2_7_1')
 const hasLegacyPublished=published.length>0&&!edition
 const editorial=edition?.evidence_trace?.editorial
 const subscription=data.subscriptions.find(s=>s.edition_type===editionType)
 const cited=edition?.evidence_trace?.version==='evidence_v2_5'?(edition.evidence_trace.selected||[]).filter(x=>edition.evidence_trace.used_ids?.includes(x.id)&&x.evidence_kind!=='prior_editorial_context'):[]
 const allContext=edition?.evidence_trace?.version==='evidence_v2_5'?(edition.evidence_trace.selected||[]).filter(x=>x.evidence_kind!=='prior_editorial_context'):[]
 const readEvent=data.events.find(e=>e.edition_id===edition?.id)
 const intro=edition?.body?.split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean)||[]
 const serviceFirst=!!edition?.evidence_trace?.service_first
 const withheld=!!edition?.evidence_trace?.optional_outbound_withheld
 const financialFigures=editorial?.verified_figures||[]
 const subscribedCount=data.subscriptions.filter(s=>s.status==='subscribed').length
 const availableCount=data.editions.length
 function chooseCustomer(id){
  setClientId(id);onChooseClient?.(id);setView('story');setNotice('');setError('');setExpandedExplore(null)
 }
 function chooseEdition(id){setEditionType(id);setView('story');setNotice('');setError('');setExpandedExplore(null)}
 async function changePreference(next,requestedEdition=editionType){
  if(!client||working||data.status!=='ready')return
  setWorking(true);setError('');setNotice('')
  try{
   const {error:upError}=await supabase.from('poc_edition_subscriptions').update({status:next,updated_at:new Date().toISOString()}).eq('client_id',clientId).eq('edition_type',requestedEdition)
   if(upError)throw upError
   setNotice('Fictional '+editionLabel(requestedEdition)+' preference set to '+next+'. This is a reviewer-operated simulation, not real customer consent.')
   setRefreshKey(x=>x+1)
  }catch(e){setError(e.message||'The fictional preference could not be updated.')}
  finally{setWorking(false)}
 }
 async function changeWindow(next){
  if(working||editionType!=='daily_trading'||!subscription)return
  setWorking(true);setError('');setNotice('')
  try{
   const {error:upError}=await supabase.from('poc_edition_subscriptions').update({delivery_window:next,updated_at:new Date().toISOString()}).eq('client_id',clientId).eq('edition_type',editionType)
   if(upError)throw upError
   setNotice('Fictional delivery window updated. No email has been scheduled.')
   setRefreshKey(x=>x+1)
  }catch(e){setError(e.message||'Could not update delivery preference.')}
  finally{setWorking(false)}
 }
 async function markRead(){
  if(!edition||working||readEvent)return
  setWorking(true);setError('');setNotice('')
  try{
   const {error:writeError}=await supabase.from('poc_studio_events').insert({
     client_id:clientId,edition_type:editionType,edition_id:edition.id,
     event_type:'in_app_view_demo',channel:'in_app',
     details:{simulation:true,action:'customer_preview_mark_read',source:'poc_2_7'}
   })
   if(writeError)throw writeError
   setNotice('Fictional in-app reading recorded. Marketing Studio will reflect this demo event.')
   setRefreshKey(x=>x+1)
  }catch(e){setError(e.message||'Could not record the simulated reading event.')}
  finally{setWorking(false)}
 }
 return <div className="cxExperience">
   <div className="cxPreviewBar"><div><strong>Customer view · Reviewer simulation</strong><span>Only fictional accounts · No real customer login, email or financial advice</span></div><button type="button" onClick={onBack}>← Back to workspace</button></div>
   <div className="cxIdentityBar"><div className="cxIdentityLabel"><span className="cxMark">WS</span><div><strong>My Wealth Story</strong><small>YOUR WEALTH JOURNEY, MADE CLEARER</small></div></div>
     <label>Preview as fictional client<select aria-label="Preview as fictional client" value={client?.client_id||''} onChange={e=>chooseCustomer(e.target.value)}>{clients.map(c=><option key={c.client_id} value={c.client_id}>{name(c)} · {c.client_id}</option>)}</select></label>
   </div>
   <section className="cxHero"><div className="cxEyebrow">A MORE CONNECTED VIEW OF YOUR FINANCIAL JOURNEY</div><h1>Welcome, {name(client)}.<br/><em>Your story continues here.</em></h1>
     <p>Explore useful context from your relationship with Geojit—at your own pace, with clarity on what we know and what still needs checking.</p>
     <div className="cxHeroStats"><span><b>{availableCount}</b> published fictional editions</span><span><b>{subscribedCount}</b> optional editions subscribed</span></div>
   </section>
   {error&&<div className="cxAlert" role="alert">{error}</div>}
   {notice&&<div className="cxNotice" role="status">{notice}</div>}
   <div className="cxChannelChooser" role="group" aria-label="Choose your story edition">
     {CHANNELS.map(ch=><button type="button" key={ch.id} className={editionType===ch.id?'selected':''} aria-pressed={editionType===ch.id} onClick={()=>chooseEdition(ch.id)}><small>{ch.rhythm}</small><strong>{ch.title}</strong><span>{ch.description}</span></button>)}
   </div>
   <div className="cxBody">
    <nav className="cxNav" aria-label="Customer experience sections">{[['story','Your story'],['pilot','Guided pilot'],['intelligence','Your financial picture'],['wealthmap','Your Wealth Map'],['context','About this story'],['preferences','Your preferences']].map(([id,label])=><button type="button" key={id} className={view===id?'selected':''} aria-current={view===id?'page':undefined} onClick={()=>setView(id)}>{label}</button>)}</nav>
    {view==='pilot'?<GuidedJourney onOpenWealthMap={()=>setView('wealthmap')}/>:
     data.status==='loading'?<div className="cxEmpty"><h2>Bringing your story together…</h2><p>Retrieving approved fictional editions and subscription preferences.</p></div>:
     data.status==='error'?<div className="cxEmpty"><h2>We couldn't load this preview.</h2><p>{data.message}</p><button className="cxMainButton" type="button" onClick={()=>setRefreshKey(x=>x+1)}>Try again</button></div>:
     view==='intelligence'?<WealthIntelligence clientId={clientId} editionType={editionType} onShowStory={()=>setView('story')}/>:
     view==='wealthmap'?<WealthCreationMap clientId={clientId} client={client} onOpenFinancialPicture={()=>setView('intelligence')}/>:
     view==='story'?<div className="cxStoryLayout">
      <article className="cxStoryMain">
       {edition?<><div className="cxStoryMeta"><span>{editionLabel(editionType).toUpperCase()}</span><span>{date(edition.created_at)}</span></div>
         <h2>{edition.title}</h2>
         <div className="cxChapterIntro"><span className="cxEyebrow">YOUR CHAPTER</span><p>{editorial.chapter}</p></div>
         {financialFigures.length>0&&<section className="cxFinancialPicture" aria-label="Your financial picture"><div className="cxEyebrow">YOUR FINANCIAL PICTURE</div><h3>Numbers that add perspective</h3><div className="cxFigureGrid">{financialFigures.map(m=><div key={m.key} className="cxFigureCard"><span>{m.label}</span><b>{m.display}</b><small>{m.scope} · As of {m.as_of}</small></div>)}</div><p className="cxFigureNote">Only figures explicitly verified and dated in the fictional data appear here. Values are not estimates from AI, and may not include assets elsewhere.</p></section>}
         <div className="wmStoryInvite"><span className="cxEyebrow">YOUR WEALTH CREATION MAP</span><h3>See your journey beyond this week's numbers.</h3><p>Explore financial foundations, protection, growing wealth and goals with guidance that does not assume what you need.</p><button type="button" onClick={()=>setView('wealthmap')}>Explore your Wealth Map →</button></div>
         {editionType==='weekly_investing'&&<div className="cxPilotInvite"><span className="cxEyebrow">CONNECTED JOURNEY · FICTIONAL PILOT</span><h3>From a weekly insight to a goal picture</h3><p>Try a separate synthetic example with an article, short video storyboard, guided assistant and provisional plan. It is not calculated from this selected account.</p><button type="button" onClick={()=>setView('pilot')}>Explore the guided pilot</button></div>}
         <div className="cxIntelligenceInvite"><div><span className="cxEyebrow">YOUR FINANCIAL PICTURE</span><strong>See the week in context—and your wider journey.</strong><p>Explore a fictional market comparison, cash-flow-adjusted portfolio movement and a longer-term trend, with the assumptions clearly explained.</p></div><button type="button" onClick={()=>setView('intelligence')}>Explore my financial picture →</button></div>
         <section className="cxPerspective"><div className="cxEyebrow">A PERSPECTIVE WORTH CONSIDERING</div><h3>A little more perspective</h3><p>{editorial.perspective}</p></section>
         <section className="cxNextStep"><div className="cxEyebrow">YOUR NEXT STEP</div><h3>Explore at your pace</h3><p>{editorial.next_step}</p><button type="button" className="cxMainButton" onClick={()=>setView('context')}>Explore this perspective →</button></section>
         {(serviceFirst||withheld)&&<div className="cxServiceNote">{serviceFirst?'An important service matter deserves attention first.':'Optional email updates are currently paused under your preview preferences.'} You can still access available in-app information.</div>}
         <div className="cxStoryActions"><button type="button" onClick={()=>setView('context')}>About this update</button>
          <button type="button" disabled={!!readEvent||working} onClick={markRead}>{readEvent?'Marked as read · demo':'Mark as read · demo'}</button></div>
        </>:<div className="cxEmpty"><span className="cxEmptyIcon">◇</span><h2>{hasLegacyPublished?'A refreshed chapter is being prepared.':'Nothing new for this chapter yet.'}</h2>
         <p>{hasLegacyPublished?'Earlier editions need to be reviewed against the updated helpful, customer-first editorial standard. The older content stays in the internal reviewer Studio and is not displayed here.':'We only publish a chapter when there is something genuinely useful and approved to share. There is no pressure to create an update just to fill a schedule.'}</p>
         <button type="button" className="cxMainButton" onClick={onOpenStudio}>Open Story Studio · reviewer →</button></div>}
      </article>
      <aside className="cxSideNote"><span className="cxEyebrow">YOUR STORY, YOUR PACE</span><h3>What this experience is for</h3><p>To bring meaningful financial information together and offer a thoughtful perspective when you need one.</p><div className="cxSideDivider"/><strong>One customer. Different rhythms.</strong><p>Trading, investing and longer-term wealth journeys may call for different updates. You can control each optional edition separately.</p><button type="button" onClick={()=>setView('preferences')}>Manage your editions →</button></aside>
     </div>:
     view==='context'?<section className="cxContextArea"><div className="cxEyebrow">ABOUT THIS UPDATE</div><h2>A clearer view, with your privacy in mind.</h2>
       <p>This chapter draws on relevant information available from your Geojit relationship and any preferences you've chosen to share. It may not include investments held elsewhere. Your choices remain yours.</p>
       {edition?<><div className="cxAboutPanel"><strong>How this chapter was prepared</strong><p>We chose a useful financial perspective supported by available account context. You won't see a list of every action you took or every interaction with Geojit. Specific figures are shown only when verified and dated.</p><p>This is a fictional preview, not personal investment advice or a complete financial statement.</p>
         <button type="button" onClick={()=>setView('preferences')}>Manage optional updates →</button></div>
       <div className="cxDiscover"><h3>Explore a little further</h3><p>Choose what you'd like to understand. This is a guided preview, not a live account service.</p>
          <div className="cxDiscoverGrid">{[
           ['activity','Understand investment activity','See how different investment types can contribute to your wider picture.'],
           ['goals','Reflect on your priorities','Explore how to review your own stated priorities over time.'],
           ['human','Guidance when you want it','Understand how a conversation with Geojit may help clarify a question.']
          ].map(([id,title,description])=><button type="button" key={id} className={expandedExplore===id?'active':''} onClick={()=>setExpandedExplore(expandedExplore===id?null:id)}><b>{title}</b><span>{description}</span><em>{expandedExplore===id?'Close −':'Explore →'}</em></button>)}</div>
          {expandedExplore&&<div className="cxExploreDetail">{expandedExplore==='activity'?'Equity purchases and mutual fund contributions are different types of activity. Consider how each relates to your financial plans. Your current value or returns need separately verified figures.':expandedExplore==='goals'?'Your priorities are yours to define. If you have not chosen to share a goal, we will not assume one.':'If you would like a clearer view, you can request a conversation with Geojit through an approved service channel. No request is sent from this demo.'}</div>}
         </div>
       </>:<div className="cxContextEmpty">There is no published story to explain yet. Marketing reviewers can prepare and publish a demo edition in the Studio.</div>}
       <button type="button" className="cxTextLink" onClick={()=>setView('story')}>← Return to your story</button>
     </section>:
     <section className="cxPreferences"><div className="cxEyebrow">COMMUNICATION PREFERENCES</div><h2>Your story, on your terms.</h2><p>Each edition has a separate optional email preference. Turning off an email edition does not remove access to a published in-app story. In this POC, these controls update fictional data under the reviewer's demonstration account—not actual consent.</p>
       <div className="cxPreferenceList">{CHANNELS.map(ch=>{const row=data.subscriptions.find(x=>x.edition_type===ch.id);return <div className="cxPreferenceRow" key={ch.id}>
         <div><small>{ch.rhythm}</small><strong>{ch.title}</strong><p>{ch.description}</p></div>
         <div className="cxPreferenceActions"><span className={'cxPrefStatus '+(row?.status==='subscribed'?'on':'')}>{row?.status||'Not configured'}</span>
           <button type="button" disabled={!row||working||row.status==='subscribed'} onClick={()=>changePreference('subscribed',ch.id)}>Subscribe</button>
           <button type="button" disabled={!row||working||row.status==='paused'} onClick={()=>changePreference('paused',ch.id)}>Pause</button>
           <button type="button" disabled={!row||working||row.status==='unsubscribed'} onClick={()=>changePreference('unsubscribed',ch.id)}>Unsubscribe</button>
         </div>
       </div>})}</div>
       {editionType==='daily_trading'&&subscription&&<label className="cxWindow">Daily Trading Brief timing (fictional)<select value={subscription.delivery_window||'pre_market'} onChange={e=>changeWindow(e.target.value)} disabled={working}><option value="pre_market">Before the market opens</option><option value="after_market">After the market closes</option></select></label>}
       <div className="cxConsentNote"><b>A note about essential communications</b><p>Account, transaction, security and regulatory messages are managed separately from optional Wealth Story editions.</p></div>
     </section>}
   </div>
   <footer className="cxFooter"><span>Geojit Wealth Story · Fictional customer experience preview</span><span>Not a live investment service · No real customer information or communication</span></footer>
 </div>
}
