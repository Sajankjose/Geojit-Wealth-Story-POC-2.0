import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase, loadClientRecords } from './lib/supabase'

export const EDITIONS = [
  { id:'daily_trading', label:'Daily Trading Brief', cadence:'Trading days', description:'Trading context and approved, valid research only.', icon:'↗' },
  { id:'weekly_investing', label:'Weekly Investment Story', cadence:'Weekly', description:'Investment activity, habits and relevant education.', icon:'◫' },
  { id:'monthly_wealth', label:'Monthly Wealth Journey', cadence:'Monthly', description:'Long-term goals, relationship milestones and planning.', icon:'◇' }
]
const EDITION_LABELS = Object.fromEntries(EDITIONS.map(e=>[e.id,e.label]))
const TYPES = ['daily_trading','weekly_investing','monthly_wealth']
const displayName = client => (client?.alias || 'Client').replace(/ \(fictional\)$/i,'')
const formatDate = iso => iso ? new Date(iso).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) : '—'
const lower = val => String(val||'').toLowerCase()
const syntheticStatus = (clientId,type) => {
 if(clientId==='C020')return 'unsubscribed'
 if(type==='daily_trading')return ['C008','C010','C011','C012','C016'].includes(clientId)?'subscribed':'unsubscribed'
 if(type==='weekly_investing')return ['C001','C015'].includes(clientId)?'unsubscribed':['C018'].includes(clientId)?'paused':'subscribed'
 return ['C003','C006','C012','C013','C014','C016','C017'].includes(clientId)?'subscribed':'unsubscribed'
}
function initialSubscriptions(clients){return clients.flatMap(client=>TYPES.map(edition_type=>({client_id:client.client_id,edition_type,status:syntheticStatus(client.client_id,edition_type),delivery_window:edition_type==='daily_trading'?'pre_market':'standard',updated_at:null})))}
function Chip({children,tone='neutral'}){return <span className={'wsChip '+tone}>{children}</span>}
function Empty({title,children}){return <div className="wsEmpty"><strong>{title}</strong><p>{children}</p></div>}
function countUnique(rows){return new Set(rows.map(row=>row.client_id)).size}
function safeContext(records,edition,client){
 const get = domain => records.filter(r=>r.domain===domain).map(r=>r.payload)
 const story=get('story_contexts')[0], service=get('service_cases')
 const state=get('customer_states')[0]||{}
 const serviceBlock=service.some(s=>s.suppress_optional_promotions&& !['resolved','closed'].includes(lower(s.status)))
 const preferenceBlock=state.marketing_permission===false || client.client_id==='C020'
 const reason = serviceBlock?'Service-first priority: an unresolved service issue requires attention.':preferenceBlock?'Optional communication is withheld under the fictional preference state.':'Any optional outbound requires edition-level subscription and current eligibility.'
 if(edition==='daily_trading') return {
   title:'Your trading context — '+displayName(client),
   body:'This daily brief is a non-live demonstration. Current market data, valid research calls and position-level alerts are not connected. An approved research source and freshness checks are required before publishing live trading information.',
   why:'Trading context is illustrated without fabricating prices, research calls, P&L or recommendations. '+reason,
   blocked:serviceBlock||preferenceBlock, evidence_count:0
 }
 const title = typeof story?.headline==='string' ? story.headline : (edition==='monthly_wealth'?'A broader view of your financial journey':'Your investment journey, made clearer')
 const body=typeof story?.narrative==='string' ? story.narrative : 'A relevant customer insight will appear when its supporting facts and editorial modules have been validated.'
 return {title,body,why:'An illustrative edition composed from the existing synthetic story context. '+reason,blocked:serviceBlock||preferenceBlock,evidence_count:story?1:0}
}
export default function OperatingStudio({clients=[],onBack,onOpenClient}){
 const [tab,setTab]=useState('overview')
 const [subscriptions,setSubscriptions]=useState([])
 const [editions,setEditions]=useState([])
 const [events,setEvents]=useState([])
 const [persisted,setPersisted]=useState(false)
 const [busy,setBusy]=useState(false)
 const [notice,setNotice]=useState('')
 const [error,setError]=useState('')
 const [selected,setSelected]=useState('C012')
 const [type,setType]=useState('weekly_investing')
 const [search,setSearch]=useState('')
 const [filter,setFilter]=useState('all')
 const [draft,setDraft]=useState(null)
 const [aiBusy,setAiBusy]=useState(false)
 const [generationResult,setGenerationResult]=useState(null)
 const [aiStatus,setAiStatus]=useState(null)
 const [diagnosticBusy,setDiagnosticBusy]=useState(false)
 const [reviewChecks,setReviewChecks]=useState({})
 const [evidencePreview,setEvidencePreview]=useState({status:'idle',clientId:null,editionType:null})
 const refresh=useCallback(async()=>{
   if(!supabase){setPersisted(false);setSubscriptions(initialSubscriptions(clients));return}
   try{
     const [a,b,c]=await Promise.all([
       supabase.from('poc_edition_subscriptions').select('*').order('client_id'),
       supabase.from('poc_story_editions').select('*').order('created_at',{ascending:false}).limit(1000),
       supabase.from('poc_studio_events').select('*').order('created_at',{ascending:false}).limit(1000)
     ])
     if(a.error||b.error||c.error)throw (a.error||b.error||c.error)
     setSubscriptions(a.data||[]);setEditions(b.data||[]);setEvents(c.data||[]);setPersisted(true);setError('')
   }catch(e){setPersisted(false);setSubscriptions(initialSubscriptions(clients));setError('The POC 2.1 studio tables are not yet available. Run the new SQL migration in Supabase to enable persistent workflows. '+(e.message||''))}
 },[clients])
 useEffect(()=>{refresh()},[refresh])
 useEffect(()=>{
   if(!supabase||!persisted||!selected)return
   let cancelled=false
   const clientId=selected,edition=type
   setEvidencePreview({status:'loading',clientId,editionType:edition})
   async function load(){
     try{
       const {data:{session},error:sessionError}=await supabase.auth.getSession()
       if(sessionError||!session?.access_token)throw Error('Reviewer session unavailable.')
       const url='/.netlify/functions/generate-wealth-story?client_id='+encodeURIComponent(clientId)+'&edition_type='+encodeURIComponent(edition)
       const res=await fetch(url,{headers:{authorization:'Bearer '+session.access_token}})
       const data=await res.json().catch(()=>({}))
       if(!res.ok)throw Error(data.error||'Could not load source evidence.')
       if(!cancelled)setEvidencePreview({status:'ready',clientId,editionType:edition,evidence:data.evidence})
     }catch(e){if(!cancelled)setEvidencePreview({status:'error',clientId,editionType:edition,message:e.message||'Evidence unavailable'})}
   }
   load()
   return ()=>{cancelled=true}
 },[selected,type,persisted])
 const client=clients.find(c=>c.client_id===selected)||clients[0]
 const subsFor=cid=>subscriptions.filter(s=>s.client_id===cid)
 const sub= subscriptions.find(s=>s.client_id===selected&&s.edition_type===type)
 const editionRows=editions.filter(e=>e.client_id===selected)
 const currentEdition=editionRows.find(e=>e.edition_type===type)
 const visibleGeneration=generationResult?.clientId===selected&&generationResult?.editionType===type?generationResult:null
 const visibleEvidence=evidencePreview.clientId===selected&&evidencePreview.editionType===type?evidencePreview:{status:'loading'}
 const storyTrace=currentEdition?.evidence_trace?.version==='evidence_v2_5'?currentEdition.evidence_trace:null
 const lastEvent=events.find(e=>e.client_id===selected&&e.edition_type===type&&e.event_type==='email_delivery_simulated')
 const inApp=events.filter(e=>e.event_type==='in_app_view_demo').length
 const eligible = subscriptions.filter(s=>s.status==='subscribed')
 const enabledClients = countUnique(eligible)
 const subscriptionCounts = TYPES.map(edition=>({edition,count:subscriptions.filter(s=>s.edition_type===edition&&s.status==='subscribed').length}))
 const candidates = useMemo(()=>clients.filter(c=>{
   const text=(c.client_id+' '+c.alias+' '+c.persona_scenario).toLowerCase()
   if(!text.includes(search.toLowerCase()))return false
   if(filter==='subscribed')return subsFor(c.client_id).some(s=>s.status==='subscribed')
   if(filter==='unsubscribed')return !subsFor(c.client_id).some(s=>s.status==='subscribed')
   return true
 }),[clients,search,filter,subscriptions])
 async function patchSubscription(status){
   if(!persisted||!client)return
   setBusy(true);setNotice('');setError('')
   const {error:upError}=await supabase.from('poc_edition_subscriptions').update({status,updated_at:new Date().toISOString()}).eq('client_id',selected).eq('edition_type',type)
   if(upError)setError(upError.message);else{setNotice('Fictional subscription state updated. This does not record real customer consent.');await refresh()}
   setBusy(false)
 }
 async function updateWindow(windowValue){
   if(!persisted||!client||type!=='daily_trading')return
   setBusy(true);setError('');setNotice('')
   const {error:upError}=await supabase.from('poc_edition_subscriptions').update({delivery_window:windowValue,updated_at:new Date().toISOString()}).eq('client_id',selected).eq('edition_type',type)
   if(upError)setError(upError.message);else{setNotice('Fictional daily delivery preference updated; no scheduling or emails were activated.');await refresh()}
   setBusy(false)
 }
 async function generateCandidate(){
   if(!persisted||!client)return
   setBusy(true);setNotice('');setError('')
   try{
     const records=await loadClientRecords(selected)
     const context=safeContext(records,type,client)
     const {data,error:writeError}=await supabase.from('poc_story_editions').insert({
       client_id:selected,edition_type:type,title:context.title,body:context.body,
       decision_note:context.why,stage:'candidate',generation_method:'synthetic_template',
       evidence_count:context.evidence_count
     }).select().single()
     if(writeError)throw writeError
     setDraft(data);setNotice('A fictional story candidate was prepared using existing records. No AI model was called.')
     await refresh()
   }catch(e){setError(e.message||String(e))}
   setBusy(false)
 }
 async function checkAIStatus(){
   if(!supabase||diagnosticBusy)return
   setDiagnosticBusy(true);setAiStatus(null)
   try{
     const {data:{session},error:sessionError}=await supabase.auth.getSession()
     if(sessionError||!session?.access_token)throw Error('Please sign in again.')
     const result=await fetch('/.netlify/functions/generate-wealth-story',{headers:{authorization:'Bearer '+session.access_token}})
     const payload=await result.json().catch(()=>({error:'Invalid status response'}))
     if(!result.ok)throw Error(payload.error||'AI configuration check failed')
     setAiStatus(payload)
   }catch(e){setAiStatus({error:e.message||'Could not verify AI configuration'})}
   finally{setDiagnosticBusy(false)}
 }
 function toggleReview(field,checked){
   if(!currentEdition)return
   setReviewChecks(old=>({...old,[currentEdition.id]:{...(old[currentEdition.id]||{}),[field]:checked}}))
 }
 async function generateAIDraft(){
   if(!persisted||!client||busy||aiBusy)return
   const requestClient=selected,requestEdition=type
   setAiBusy(true);setNotice('');setError('')
   setGenerationResult({clientId:requestClient,editionType:requestEdition,status:'generating',startedAt:new Date().toISOString()})
   try{
     const {data:{session},error:sessionError}=await supabase.auth.getSession()
     if(sessionError||!session?.access_token)throw Error('Your reviewer session is unavailable. Sign in again.')
     const res=await fetch('/.netlify/functions/generate-wealth-story',{
       method:'POST',
       headers:{'content-type':'application/json','authorization':'Bearer '+session.access_token},
       body:JSON.stringify({client_id:selected,edition_type:type})
     })
     const result=await res.json().catch(()=>({error:'The AI server returned an invalid response.'}))
     if(!res.ok){const failure=new Error(result.error||'AI generation failed');failure.code=result.code||('HTTP_'+res.status);throw failure}
     if(!result?.synthetic||result?.candidate?.generation_method!=='openai_draft'||result?.candidate?.stage!=='candidate')throw Error('AI draft did not pass the expected format check.')
     const {data,error:writeError}=await supabase.from('poc_story_editions').insert({
       client_id:selected,edition_type:type,
       title:result.candidate.title,body:result.candidate.body,
       decision_note:result.candidate.decision_note,stage:'candidate',
       generation_method:'openai_draft',
       evidence_trace:result.candidate.evidence_trace,
       evidence_count:result.candidate.evidence_count||0
     }).select().single()
     if(writeError)throw Error(writeError.message+(writeError.message.includes('evidence_trace')?' — Run the POC 2.5 evidence-trace SQL migration in Supabase.':writeError.message.includes('generation_method')?' — Run the POC 2.2 SQL migration in Supabase.':''))
     setDraft(data)
     await refresh()
     setGenerationResult({clientId:requestClient,editionType:requestEdition,status:'saved',model:result.model,editionId:data.id,completedAt:new Date().toISOString()})
     setNotice('An AI-assisted fictional draft was saved as a candidate. A reviewer must validate facts before approval or in-app publication; nothing was emailed.')
   }catch(e){
     const msg=e?.message||'AI generation is unavailable. Check Netlify Functions configuration.'
     setGenerationResult({clientId:requestClient,editionType:requestEdition,status:'failed',message:msg,code:e?.code||'REQUEST_FAILED',completedAt:new Date().toISOString()})
     setError('')
   }finally{setAiBusy(false)}
 }
 async function updateStage(edition,stage){
   if(!persisted||!edition)return
   if(stage==='approved'&&!['sources','claims','purpose'].every(k=>reviewChecks[edition.id]?.[k])){setError('Complete all three editorial review checks before demo approval.');return}
   setBusy(true);setError('');setNotice('')
   const {error:upError}=await supabase.from('poc_story_editions').update({stage,updated_at:new Date().toISOString()}).eq('id',edition.id)
   if(upError)setError(upError.message);else{setNotice('Edition moved to '+stage.replaceAll('_',' ')+'. This is a synthetic review workflow.');await refresh()}
   setBusy(false)
 }
 async function recordEvent(edition,event_type){
   if(!persisted||!edition)return
   setBusy(true);setError('');setNotice('')
   if(edition.stage!=='published_in_app'){setError('Publish the approved edition in-app before recording engagement or delivery.');setBusy(false);return}
   if(event_type==='email_delivery_simulated'){
     if(sub?.status!=='subscribed'){setError('Email simulation blocked: this customer is not subscribed to this edition.');setBusy(false);return}
     if(selected==='C020'||['C004','C019'].includes(selected)){setError('Email simulation blocked by fictional customer preferences or service-first safeguards.');setBusy(false);return}
     const records=await loadClientRecords(selected).catch(()=>[])
     if(safeContext(records,type,client).blocked){setError('Email simulation blocked by customer context.');setBusy(false);return}
   }
   const {error:writeError}=await supabase.from('poc_studio_events').insert({client_id:selected,edition_type:type,edition_id:edition.id,event_type,channel:event_type==='email_delivery_simulated'?'email':'in_app',details:{simulation:true}})
   if(writeError)setError(writeError.message);else{setNotice(event_type==='email_delivery_simulated'?'Simulated email delivery recorded. No email was actually sent.':'Simulated in-app reading event recorded.');await refresh()}
   setBusy(false)
 }
 const pipeline = [['Candidates',editions.filter(e=>e.stage==='candidate').length],['Reviewed',editions.filter(e=>e.stage==='reviewed').length],['Approved',editions.filter(e=>e.stage==='approved').length],['Published in-app',editions.filter(e=>e.stage==='published_in_app').length]]
 const generatedCount=countUnique(editions)
 return <div className="wsStudio">
   <div className="wsStudioTop"><button type="button" className="wsTextButton" onClick={onBack}>← Customer Intelligence</button><div className="wsStudioVersion"><span className="statusDot"/> POC 2.5 · Evidence-led narrative</div></div>
   <section className="wsStudioIntro"><div className="eyebrow">GEOJIT WEALTH STORY STUDIO</div><h1>One relationship.<br/><span>Multiple meaningful editions.</span></h1><p>Manage the fictional subscription lifecycle, editorial workflow, in-app availability and optional email eligibility for 20 synthetic customers.</p></section>
   <div className="wsNotice"><strong>Fictional data · No real messages</strong><span>POC 2.2 can create AI-assisted drafts for review when an OpenAI API key is configured. Subscription, approval and delivery states remain demonstration-only; no emails are sent.</span></div>
   {error&&<div role="alert" className="wsError">{error}</div>}
   {notice&&<div role="status" className="wsSuccess">{notice}</div>}
   <div className="wsKpiGrid">
     <div><small>Unique subscribed clients</small><strong>{enabledClients}<span> / {clients.length}</span></strong><em>Across all optional editions</em></div>
     <div><small>Clients with prepared stories</small><strong>{generatedCount}</strong><em>Simulated preparation only</em></div>
     <div><small>Published in-app</small><strong>{editions.filter(e=>e.stage==='published_in_app').length}</strong><em>Edition records</em></div>
     <div><small>In-app engagement events</small><strong>{inApp}</strong><em>Explicit POC simulation</em></div>
     <div><small>Email delivery simulations</small><strong>{events.filter(e=>e.event_type==='email_delivery_simulated').length}</strong><em>No actual messages sent</em></div>
   </div>
   <nav className="wsStudioNav" aria-label="Studio sections">
     {[['overview','Overview'],['subscribers','Subscription centre'],['production','Story production'],['activity','Delivery & engagement']].map(([id,label])=>
       <button type="button" key={id} className={tab===id?'active':''} aria-current={tab===id?'page':undefined} onClick={()=>setTab(id)}>{label}</button>)}
   </nav>
   {tab==='overview'&&<div className="wsStudioGrid">
     <section className="wsSurface"><div className="wsSurfaceHeading"><div className="eyebrow">EDITION SUBSCRIPTIONS</div><h2>Choose the rhythm that fits the customer.</h2></div>
       <div className="wsEditionGrid">{EDITIONS.map(e=><article key={e.id} className="wsEditionCard"><div className="wsEditionIcon">{e.icon}</div><span>{e.cadence}</span><h3>{e.label}</h3><p>{e.description}</p><strong>{subscriptionCounts.find(c=>c.edition===e.id)?.count||0} <small>fictional subscribers</small></strong><button type="button" onClick={()=>{setType(e.id);setTab('subscribers')}}>Manage edition →</button></article>)}</div>
       <div className="wsCallout"><b>One client can subscribe to multiple editions.</b> Combined subscriber totals count unique customer IDs; email and in-app experiences remain independent.</div>
     </section>
     <aside className="wsSurface"><div className="eyebrow">EDITORIAL PIPELINE</div><h2>From evidence to publication</h2><div className="wsPipeline">{pipeline.map(([label,count])=><div key={label}><span>{label}</span><b>{count}</b></div>)}</div>
       <button className="wsPrimary" type="button" onClick={()=>setTab('production')}>Open story production →</button><p className="wsSmall">Preparation does not automatically approve, publish or send content.</p>
     </aside></div>}
   {tab==='subscribers'&&<div className="wsStudioGrid">
     <section className="wsSurface"><div className="wsSurfaceHeading"><div className="eyebrow">SUBSCRIPTION CENTRE</div><h2>Who receives what?</h2><p>All preferences below are synthetic test settings—not actual customer permissions.</p></div>
       <div className="wsFilters"><input aria-label="Search subscriber list" placeholder="Search name, ID or scenario" value={search} onChange={e=>setSearch(e.target.value)}/><select aria-label="Filter by subscription" value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">All clients</option><option value="subscribed">Any edition subscribed</option><option value="unsubscribed">No active edition</option></select></div>
       <div className="wsSubscriberList">{candidates.map(c=><button type="button" key={c.client_id} className={'wsSubscriberRow '+(selected===c.client_id?'selected':'')} onClick={()=>setSelected(c.client_id)}><div><b>{displayName(c)}</b><small>{c.client_id} · {c.persona_scenario}</small></div><span>{subsFor(c.client_id).filter(s=>s.status==='subscribed').length} active</span></button>)}</div>
     </section>
     <aside className="wsSurface"><div className="eyebrow">FICTIONAL CUSTOMER PREFERENCES</div><h2>{displayName(client)}</h2><p className="wsSmall">{client?.persona_scenario||'Select a client'}</p>
       <div className="wsPreferenceList">{EDITIONS.map(e=>{const row=subscriptions.find(s=>s.client_id===selected&&s.edition_type===e.id);return <div key={e.id}><b>{e.label}</b><Chip tone={row?.status==='subscribed'?'success':row?.status==='paused'?'warning':'neutral'}>{row?.status||'Not set'}</Chip></div>})}</div>
       <label className="wsFieldLabel" htmlFor="wsEditionPicker">Manage edition</label><select id="wsEditionPicker" value={type} onChange={e=>setType(e.target.value)}>{EDITIONS.map(e=><option key={e.id} value={e.id}>{e.label}</option>)}</select>
       {type==='daily_trading'&&<><label className="wsFieldLabel" htmlFor="wsTradingWindow">Trading-day delivery window (demo)</label><select id="wsTradingWindow" value={sub?.delivery_window||'pre_market'} disabled={!persisted||busy} onChange={e=>updateWindow(e.target.value)}><option value="pre_market">Pre-market brief</option><option value="after_market">After-market recap</option></select></>}
       <div className="wsActions"><button type="button" disabled={busy||!persisted||sub?.status==='subscribed'} onClick={()=>patchSubscription('subscribed')}>Subscribe (demo)</button><button type="button" disabled={busy||!persisted||sub?.status==='paused'} onClick={()=>patchSubscription('paused')}>Pause</button><button type="button" disabled={busy||!persisted||sub?.status==='unsubscribed'} onClick={()=>patchSubscription('unsubscribed')}>Unsubscribe</button></div>
       <p className="wsSmall">Daily Trading Brief is for trading days; market-sensitive notices and essential service alerts have separate communication governance.</p>
     </aside></div>}
   {tab==='production'&&<div className="wsStudioGrid">
     <section className="wsSurface"><div className="eyebrow">STORY STUDIO</div><h2>Prepare an evidence-led edition.</h2>
       <p>Choose a client and edition, then prepare a grounded AI-assisted draft or use the existing synthetic template. AI drafts are never automatically approved or sent. A previously saved template may remain visible if generation fails.</p>
       <div className="wsFormRow"><label>Client<select value={selected} onChange={e=>{setSelected(e.target.value);setDraft(null)}}>{clients.map(c=><option key={c.client_id} value={c.client_id}>{displayName(c)} · {c.client_id}</option>)}</select></label><label>Edition<select value={type} onChange={e=>{setType(e.target.value);setDraft(null)}}>{EDITIONS.map(e=><option key={e.id} value={e.id}>{e.label}</option>)}</select></label></div>
       <div className="wsAiDiagnostic"><button type="button" onClick={checkAIStatus} disabled={!persisted||diagnosticBusy}>{diagnosticBusy?'Checking server configuration…':'Check AI connection'}</button>
       {aiStatus&&<div role="status" className={aiStatus.error?'wsAiDiagnosticError':'wsAiDiagnosticStatus'}>{aiStatus.error?<span>{aiStatus.error}</span>:<><strong>{aiStatus.openai_key_configured?'Server key detected':'Server key not detected'}</strong><span>Reviewer authenticated · Model: {aiStatus.model} · Live model response not yet tested</span></>}</div>}</div>
       <div className="wsActions"><button type="button" className="wsPrimary" disabled={!persisted||busy||aiBusy} onClick={generateAIDraft}>{aiBusy?'Generating AI draft…':'Generate with AI →'}</button><button type="button" disabled={!persisted||busy||aiBusy} onClick={generateCandidate}>Use synthetic template</button><button type="button" onClick={()=>onOpenClient(selected,'story')}>Inspect source story</button></div>
       {visibleGeneration&&<div className={'wsGenerationResult '+(visibleGeneration.status==='failed'?'isFailed':visibleGeneration.status==='saved'?'isSaved':'isGenerating')} role="status" aria-live="polite">
         <span className="wsGenerationIndicator" aria-hidden="true">{visibleGeneration.status==='generating'?'◌':visibleGeneration.status==='saved'?'✓':'!'}</span>
         <div><strong>{visibleGeneration.status==='generating'?'Preparing AI story draft…':visibleGeneration.status==='saved'?'AI story generated and saved':'AI generation could not complete'}</strong>
           <p>{visibleGeneration.status==='generating'?'Checking synthetic client context and requesting an AI draft. The existing edition below is unchanged until a new draft is saved.':visibleGeneration.status==='saved'?('New AI-assisted candidate saved in Supabase'+(visibleGeneration.model?' · '+visibleGeneration.model:'')+'. Review its evidence and approve separately.'):(visibleGeneration.message||'An error occurred.')}</p>
           {visibleGeneration.status==='failed'&&<small>Error category: {visibleGeneration.code}. The earlier saved story below has not changed. You can retry after correcting the issue.</small>}
         </div>
       </div>}
       <section className="wsEvidencePanel" aria-label="Source evidence selected for AI">
         <div className="wsEvidenceHeader"><div><div className="eyebrow">EVIDENCE SELECTION · POC 2.5</div><h3>What can this story responsibly say?</h3></div><span>Source → Observation → Story</span></div>
         {visibleEvidence.status==='loading'&&<p className="wsSmall">Selecting attributable customer records…</p>}
         {visibleEvidence.status==='error'&&<div className="wsEvidenceWarning">{visibleEvidence.message}</div>}
         {visibleEvidence.status==='ready'&&<>
           <div className="wsEvidenceStats"><span><b>{visibleEvidence.evidence?.source_record_count||0}</b> source records checked</span><span><b>{visibleEvidence.evidence?.selected?.length||0}</b> selected observations</span><span><b>Up to 3</b> source references per draft</span></div>
           {visibleEvidence.evidence?.selected?.length?<div className="wsEvidenceList">{visibleEvidence.evidence.selected.map(e=><div className="wsEvidenceItem" key={e.id}>
             <div className="wsEvidenceItemTop"><strong>{e.label}</strong><span>{e.freshness} · {e.observed_at||'Date unavailable'}</span></div>
             <p>{e.observation}</p><small>Source: {e.source_id} · Record: {e.id}</small><em>{e.caution}</em>
           </div>)}</div>:<div className="wsEvidenceWarning">No safely attributable observations found for this edition. AI generation is not recommended.</div>}
           <p className="wsEvidenceDisclaimer">All records are synthetic. This selection is a source map, not proof of financial goals, advice suitability or independently verified account figures. Marketing must review each claim.</p>
         </>}
       </section>
       <div className="wsAiHelp"><b>AI creates a candidate, not a customer communication.</b> Netlify checks the reviewer session, selects synthetic context, invokes OpenAI server-side and rejects unsafe claims. Read and verify the output before using the existing review steps. If the AI key is not configured, the synthetic-template option remains available.</div>
       {currentEdition?<div className="wsDraft"><div className="wsDraftProvenance"><span>STORY SOURCE</span><b>{currentEdition.generation_method==='openai_draft'?'AI-generated candidate':'Synthetic template · Not generated by AI'}</b><span>CREATED</span><b>{formatDate(currentEdition.created_at)}</b><span>EDITORIAL STATE</span><b>{currentEdition.stage.replaceAll('_',' ')}</b></div><div className="wsDraftTop"><span>Latest {EDITION_LABELS[currentEdition.edition_type]} edition · {currentEdition.generation_method==='openai_draft'?'AI-assisted draft':'Synthetic template'}</span><Chip tone={currentEdition.stage==='published_in_app'?'success':'neutral'}>{currentEdition.stage.replaceAll('_',' ')}</Chip></div><h3>{currentEdition.title}</h3><p>{currentEdition.body}</p><details><summary>Why was this prepared?</summary><p>{currentEdition.decision_note}</p></details>
         <details className="wsStoryTrace" open={!!storyTrace}><summary>Source records → selected insights → generated narrative</summary>
           {storyTrace?<div className="wsTraceContent">
             <div className="wsTraceNote">This edition references {storyTrace.used_ids?.length||0} selected source records. References are checked against available synthetic IDs, but narrative claims still require human verification.</div>
             {storyTrace.selected?.map(e=><div key={e.id} className={'wsTraceItem '+(storyTrace.used_ids?.includes(e.id)?'cited':'')}><div><b>{e.label}</b><span>{storyTrace.used_ids?.includes(e.id)?'Cited by AI':'Context available · not cited'}</span></div><p>{e.observation}</p><small>{e.id} · {e.source_id} · {e.freshness}</small></div>)}
             <p className="wsSmall">Narrative above was drafted from this evidence package; source references do not automatically prove each sentence. Approval must remain a human decision.</p>
           </div>:<p className="wsSmall">This older edition has no persisted evidence trace. Generate a new POC 2.5 AI draft to compare its source observations.</p>}
         </details>
         <div className="wsReviewChecklist"><div className="eyebrow">EDITORIAL QUALITY GATE · DEMO</div>
           <p>Before approving this edition, verify the source records and read every claim. These are reviewer attestations in this browser session, not a production approval audit.</p>
           <label><input type="checkbox" checked={!!reviewChecks[currentEdition.id]?.sources} onChange={e=>toggleReview('sources',e.target.checked)}/> Source evidence and dates reviewed</label>
           <label><input type="checkbox" checked={!!reviewChecks[currentEdition.id]?.claims} onChange={e=>toggleReview('claims',e.target.checked)}/> No invented returns, financial figures, research calls or misleading claims</label>
           <label><input type="checkbox" checked={!!reviewChecks[currentEdition.id]?.purpose} onChange={e=>toggleReview('purpose',e.target.checked)}/> Appropriate tone, purpose and service-first context confirmed</label>
         </div>
         <div className="wsActions"><button disabled={!persisted||busy||currentEdition.stage!=='candidate'} onClick={()=>updateStage(currentEdition,'reviewed')}>Mark reviewed</button><button disabled={!persisted||busy||currentEdition.stage!=='reviewed'||!['sources','claims','purpose'].every(k=>reviewChecks[currentEdition.id]?.[k])} onClick={()=>updateStage(currentEdition,'approved')}>Approve (demo)</button><button className="wsPrimary" disabled={!persisted||busy||currentEdition.stage!=='approved'} onClick={()=>updateStage(currentEdition,'published_in_app')}>Publish in-app (demo)</button></div>
       </div>:<Empty title="No prepared edition yet">Create a fictional candidate to begin the review and publication workflow.</Empty>}
       <div className="wsEditionLedger"><div className="eyebrow">PREPARED EDITION REGISTER</div><h3>Who has a story, and where is it in the workflow?</h3>
         {editions.length?<div className="wsLedgerList">{editions.slice(0,35).map(e=><button type="button" key={e.id} onClick={()=>{setSelected(e.client_id);setType(e.edition_type);setDraft(null)}}><div><b>{displayName(clients.find(c=>c.client_id===e.client_id))} · {e.client_id}</b><small>{EDITION_LABELS[e.edition_type]} · {formatDate(e.created_at)}</small></div><Chip tone={e.stage==='published_in_app'?'success':'neutral'}>{e.stage.replaceAll('_',' ')}</Chip></button>)}</div>:<Empty title="No editions prepared yet">Candidates appear here as they are generated, reviewed and published.</Empty>}
       </div>
     </section>
     <aside className="wsSurface"><div className="eyebrow">PUBLISHING GATES</div><h2>Approval before distribution.</h2><div className="wsGateList"><div><b>01 · Context</b><span>Select only permitted and relevant evidence.</span></div><div><b>02 · Review</b><span>Verify story claims and source freshness.</span></div><div><b>03 · Approval</b><span>A designated reviewer authorises this fictional edition.</span></div><div><b>04 · Publication</b><span>Expose the approved edition in the POC only.</span></div><div><b>05 · Delivery</b><span>Check edition subscription, service priority and communications eligibility separately.</span></div></div><p className="wsSmall">This is a POC simulation, not a production compliance approval workflow.</p></aside></div>}
   {tab==='activity'&&<div className="wsStudioGrid">
     <section className="wsSurface"><div className="eyebrow">DELIVERY CENTRE</div><h2>Delivery is a separate decision.</h2><p>Email is deliberately not connected. The actions below only record simulated delivery or in-app engagement events.</p>
       <div className="wsFormRow"><label>Client<select value={selected} onChange={e=>setSelected(e.target.value)}>{clients.map(c=><option key={c.client_id} value={c.client_id}>{displayName(c)} · {c.client_id}</option>)}</select></label><label>Edition<select value={type} onChange={e=>setType(e.target.value)}>{EDITIONS.map(e=><option key={e.id} value={e.id}>{e.label}</option>)}</select></label></div>
       <div className="wsDeliveryCheck"><div><span>Subscription</span><Chip tone={sub?.status==='subscribed'?'success':'neutral'}>{sub?.status||'No preference'}</Chip></div><div><span>Edition state</span><Chip>{currentEdition?.stage?.replaceAll('_',' ')||'No edition prepared'}</Chip></div><div><span>Last email simulation</span><b>{formatDate(lastEvent?.created_at)}</b></div></div>
       <div className="wsEmailPreview"><div className="eyebrow">EMAIL PREVIEW · NON-SENDING DEMO</div><h3>One safe invitation into the authenticated story</h3>
       <div className="wsEmailFrame"><div className="wsEmailHeader"><span>From</span><b>Geojit · Wealth Story (illustration)</b></div>
         <div className="wsEmailHeader"><span>Subject</span><b>Your Wealth Story is ready to explore</b></div>
         <div className="wsEmailBody"><div className="wsEmailLogo">WEALTH STORY</div><h4>A new chapter is here.</h4><p>Hello {displayName(client)},</p><p>Your latest {EDITION_LABELS[type]?.toLowerCase()} can be explored securely when you sign in to your account.</p><div className="wsEmailCta">View Wealth Story · Demo only</div><small>No private holdings, prices, account values or sensitive financial details appear in this email preview.</small></div>
       </div><p className="wsSmall">This preview is not an actual sendable template. Verified links, required footer, unsubscribe, legal entity details and email compliance must be configured before live delivery.</p></div>
       <div className="wsActions"><button className="wsPrimary" type="button" disabled={!persisted||busy||currentEdition?.stage!=='published_in_app'||sub?.status!=='subscribed'||['C020','C004','C019'].includes(selected)} onClick={()=>recordEvent(currentEdition,'email_delivery_simulated')}>Simulate email delivery →</button><button type="button" disabled={!persisted||busy||currentEdition?.stage!=='published_in_app'} onClick={()=>recordEvent(currentEdition,'in_app_view_demo')}>Mark in-app viewed (demo)</button></div>
       <div className="wsCallout">A simulated email is never sent to an address. The production system must re-check explicit consent, send eligibility, content validity, frequency limits and unsubscribe status at send time.</div>
     </section>
     <aside className="wsSurface"><div className="eyebrow">OPERATIONAL EVENT LEDGER</div><h2>What happened in the POC?</h2>{events.length?<div className="wsRecentEvents">{events.slice(0,20).map(e=><div key={e.id}><b>{e.event_type.replaceAll('_',' ')}</b><span>{e.client_id} · {EDITION_LABELS[e.edition_type]||e.edition_type} · {formatDate(e.created_at)}</span></div>)}</div>:<Empty title="No activity events recorded">Simulate an in-app view or email delivery after publishing an edition.</Empty>}</aside></div>}
   {!persisted&&<div className="wsMigrationHint"><strong>Studio preview mode</strong><p>The subscription table values are illustrative defaults. To activate persistent story, subscription and activity records, run <code>supabase/migrations/20261122_002_story_studio.sql</code> in Supabase SQL Editor, then refresh the page.</p></div>}
 </div>
}
