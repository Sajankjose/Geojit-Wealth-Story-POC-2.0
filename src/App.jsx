import React, { useEffect, useMemo, useState } from 'react'
import { configured, supabase, loadClients, loadClientRecords } from './lib/supabase'

const sample = [
 ['C001','Arun','New explorer','Explore'],['C002','Anu','First SIP','Guide'],['C003','Meera','Regular SIP investor','Guide'],
 ['C004','Dev','Failed SIP','Resolve'],['C005','Fathima','Paused SIP','Resolve'],['C006','Rahul','MF intermediate','Inform'],
 ['C007','Lakshmi','MF to equity explorer','Explore'],['C008','Vikram','Active equity trader','Inform'],['C009','Kiran','F&O beginner','Educate'],
 ['C010','Suresh','Experienced F&O trader','Inform'],['C011','Nisha','Commodity trader','Inform'],['C012','Thomas','Trader and investor','Guide'],
 ['C013','Priya','SIP and insurance','Guide'],['C014','George','Retirement planning','Guide'],['C015','Rehan','NRI prospect','Explore'],
 ['C016','Divya','Multi-product wealth client','Guide'],['C017','Joseph','Digital-to-branch journey','Assist'],['C018','Sneha','Inactive customer','Reconnect'],
 ['C019','Manoj','Open service complaint','Resolve'],['C020','Isha','Learner; opted out','Respect preferences']
]
const preview = sample.map(([client_id,alias,persona_scenario,starting_mode])=>({client_id,alias:alias+' (fictional)',persona_scenario,starting_mode,profile:{region:'Not loaded'}}))
const domainLabels = {
 product_subscriptions:'Products',holdings_snapshot:'Holdings',transactions:'Transactions',
 digital_platform_events:'Platform activity',engagement_tool_events:'Engagement tools',communication_events:'Communications',
 human_touchpoints:'Branch & RM',service_cases:'Service cases',goals_preferences:'Goals & preferences',
 consent_preferences:'Consent rules',customer_states:'Derived states',story_contexts:'Story context',
 story_decisions:'Story decisions',decision_audit:'Decision audit',unified_events:'Unified timeline',
 opportunities:'Opportunities',content_interactions:'Content engagement'
}
const formatDate = v => v ? new Date(v).toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short'}) : 'Not recorded'
const money = n => typeof n==='number' ? '₹'+n.toLocaleString('en-IN',{maximumFractionDigits:0}) : '—'
const titleCase = v => String(v || 'Unknown').replaceAll('_',' ').replace(/\b\w/g,c=>c.toUpperCase())
const byDomain = (rows,domain) => rows.filter(r=>r.domain===domain).map(r=>r.payload)
const latest = (rows,domain) => byDomain(rows,domain)[0]
const sortEvents = rows => byDomain(rows,'unified_events').sort((a,b)=>String(b.event_at||'').localeCompare(String(a.event_at||'')))
const restricted = p => p?.marketing_permission===false
function Alert({children}) {return <div className="foundation-alert">{children}</div>}
function Login({onLogin,error,working}) {
 const [email,setEmail]=useState('');const [password,setPassword]=useState('')
 return <div className="loginPage"><div className="loginCard">
 <div className="brand"><div className="brand-symbol" aria-hidden="true">WS</div><div><strong>Geojit</strong><small>WEALTH STORY / EXPERIENCE LAB</small></div></div>
 <div className="eyebrow">PRIVATE REVIEW ENVIRONMENT</div><h1>Welcome to the<br/><i>intelligence lab.</i></h1>
 <p>Sign in with an approved Supabase demonstration account. Only fictional client records are available.</p>
 <form onSubmit={e=>{e.preventDefault();onLogin(email,password)}}>
 <label>Email address<input type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="reviewer@example.com"/></label>
 <label>Password<input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your demo password"/></label>
 <button className="primaryAction" disabled={working}>{working?'Signing in…':'Sign in →'}</button>
 </form>{error&&<Alert>{error}</Alert>}
 <p className="micro">Ask the project administrator to create your reviewer account in Supabase Authentication. Registration is not publicly available from this app.</p>
 </div></div>
}
function Evidence({records}){
 const groups=Object.entries(domainLabels).map(([id,label])=>({id,label,rows:byDomain(records,id)})).filter(x=>x.rows.length)
 return <div><div className="eyebrow">SOURCE EVIDENCE</div><h3 className="serif subheading">Many sources. One customer context.</h3><p className="supportText">All records are fictional and linked by the same synthetic client ID. Counts are based on actual imported rows.</p>
 <div className="domain-grid">{groups.map(g=><div className="domain-card" key={g.id}><strong>{g.rows.length}</strong><span>{g.label}</span></div>)}</div>
 <div className="sourceHeader">Inspect source records <span className="sourceHelp">Expand only the data you need</span></div>
 {groups.filter(g=>!['unified_events','story_contexts','story_decisions','decision_audit'].includes(g.id)).slice(0,9).map(g=><details key={g.id} className="evidenceDetail"><summary>{g.label}<span>{g.rows.length} records</span></summary><pre>{JSON.stringify(g.rows.slice(0,3),null,2)}</pre></details>)}
 </div>
}
function Timeline({records}){
 const events=sortEvents(records)
 return <div><div className="eyebrow">RELATIONSHIP MEMORY</div><h3 className="serif subheading">The relationship over time.</h3><p className="supportText">Events from products, platforms, human touchpoints and communications, ordered by event time. Observed actions are not proof of customer intent.</p>
 {events.length?<div className="event-list">{events.slice(0,60).map((e,i)=><div className="event" key={e.unified_event_id||i}>
 <div className="eventRail"><i/></div><div><span className="eventDate">{formatDate(e.event_at)}</span><h4>{e.event_label||titleCase(e.event_type)}</h4><p>{titleCase(e.event_category)} · Source {e.source_id||'not specified'} · Evidence {titleCase(e.evidence_type)}</p>
 <small>{e.do_not_treat_as_suitability_signal?'Not a suitability signal': 'Review permitted purpose before any use'}</small></div></div>)}</div>:<Alert>No unified events have been loaded for this customer.</Alert>}
 {events.length>60&&<p className="micro">Showing 60 of {events.length} events for clarity.</p>}</div>
}
function Story({records}){
 const story=latest(records,'story_contexts'),decision=latest(records,'story_decisions'),state=latest(records,'customer_states'),services=byDomain(records,'service_cases')
 const open=services.some(s=>s.suppress_optional_promotions&&s.status!=='resolved'),noMarketing=restricted(state)
 return <div><div className="eyebrow">CUSTOMER WEALTH STORY</div><h3 className="serif subheading">A narrative grounded in evidence.</h3>
 <p className="supportText">This is the original pre-approved synthetic story from the dataset—not a live AI response. OpenAI generation will be connected in the next phase.</p>
 {story?<div className="story-card">
 <div className="story-edition">A PERSONAL CHAPTER <span>· SYNTHETIC DATA</span></div>
 <h2>{story.headline}</h2><p className="storyNarrative">{story.narrative}</p>
 <div className="story-separator"/><div className="eyebrow">ONE RELEVANT OBSERVATION</div><p>{story.portfolio_or_attention_hint||'No suitable context available.'}</p>
 <div className="actionSummary"><span>Suggested next step</span><strong>{story.next_action}</strong></div>
 </div>:<Alert>No story context has been imported for this client.</Alert>}
 <div className="trace-box"><h4>Why this story?</h4><p>{story?.why_this_story||decision?.winning_reason||'No decision trace available.'}</p>
 <div className="trace-stat"><span>Primary priority</span><b>{titleCase(decision?.priority)}</b></div>
 <div className="trace-stat"><span>Optional outbound</span><b>{open||noMarketing?'Suppressed':titleCase(decision?.optional_outbound_decision)}</b></div>
 <div className="trace-stat"><span>Service notices</span><b>Independently governed</b></div></div>
 {(open||noMarketing)&&<Alert>{open?'Service comes first: optional promotional outreach is suppressed.':'Customer preference: optional marketing outreach is withheld.'}</Alert>}
 </div>
}
export default function App(){
 const [session,setSession]=useState(null),[authLoading,setAuthLoading]=useState(configured),[authError,setAuthError]=useState('')
 const [clients,setClients]=useState(configured?[]:preview),[records,setRecords]=useState([]),[loading,setLoading]=useState(configured)
 const [error,setError]=useState(''),[selected,setSelected]=useState('C012'),[query,setQuery]=useState(''),[tab,setTab]=useState('overview')
 useEffect(()=>{
  if(!supabase) return
  let active=true
  supabase.auth.getSession().then(({data,error})=>{if(active){setSession(data?.session??null);setAuthError(error?.message||'');setAuthLoading(false)}})
  const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,s)=>{if(active){setSession(s);setAuthLoading(false)}})
  return ()=>{active=false;subscription.unsubscribe()}
 },[])
 useEffect(()=>{
  if(!configured||!session){if(configured){setClients([]);setRecords([]);setLoading(false)}return}
  let active=true;setLoading(true);setError('')
  loadClients().then(data=>{if(active){setClients(data);setSelected(old=>data.some(c=>c.client_id===old)?old:data[0]?.client_id??'')}}).catch(e=>{if(active)setError(e.message)}).finally(()=>{if(active)setLoading(false)})
  return ()=>{active=false}
 },[session])
 useEffect(()=>{
  if(!configured||!session||!selected)return
  let active=true;setLoading(true);setRecords([]);setError('')
  loadClientRecords(selected).then(data=>{if(active)setRecords(data)}).catch(e=>{if(active)setError(e.message)}).finally(()=>{if(active)setLoading(false)})
  return ()=>{active=false}
 },[session,selected])
 const filtered=useMemo(()=>clients.filter(c=>(c.client_id+' '+c.alias+' '+c.persona_scenario).toLowerCase().includes(query.toLowerCase())),[clients,query])
 const client=clients.find(c=>c.client_id===selected),state=latest(records,'customer_states'),holdings=byDomain(records,'holdings_snapshot'),products=byDomain(records,'product_subscriptions'),services=byDomain(records,'service_cases')
 const value=holdings.reduce((sum,h)=>sum+(Number(h.market_value_inr)||0),0)
 const openService=services.some(s=>s.status!=='resolved'&&s.status!=='closed')
 async function login(email,password){setAuthLoading(true);setAuthError('');const {error}=await supabase.auth.signInWithPassword({email,password});if(error)setAuthError(error.message);setAuthLoading(false)}
 if(configured&&authLoading&&!session)return <div className="loadingPage">Checking reviewer access…</div>
 if(configured&&!session)return <Login onLogin={login} error={authError} working={authLoading}/>
 return <div className="shell">
 <aside className="sidebar">
 <div className="brand"><div className="brand-symbol" aria-hidden="true">WS</div><div><strong>Geojit</strong><small>WEALTH STORY / EXPERIENCE LAB</small></div></div>
 <div className="side-heading">REVIEW WORKSPACE</div><div className="menu-item active"><span className="icon">◫</span> Customer intelligence</div>
 <div className="menu-item muted"><span className="icon">◇</span> AI story generation <em>Next</em></div>
 <div className="side-bottom"><span className="status-dot"/> {configured?'Supabase connected':'Local preview mode'}<div className="tiny">{configured?'Authenticated synthetic dataset':'Configure Netlify Supabase variables to activate live data'}</div>{session&&<button className="signout" onClick={()=>supabase.auth.signOut()}>Sign out</button>}</div>
 </aside><main className="main">
 <header className="topline"><div className="breadcrumb">WEALTH STORY <span>/</span> CUSTOMER INTELLIGENCE <span>/</span> POC 2.0</div><div className="environment"><span className="environmentDot"/> SYNTHETIC DATA ONLY</div></header>
 <section className="heading"><div className="eyebrow">CUSTOMER RELATIONSHIP INTELLIGENCE</div><h1>A clearer picture of<br/><i>every customer journey.</i></h1><p>Bring together product relationships, transactions, digital behaviour and human interactions to understand what matters next.</p></section>
 {!configured&&<Alert><b>Preview mode:</b> The live Supabase connection has not been configured. The 20 client labels are placeholders; no imported data or story is shown.</Alert>}
 {error&&<Alert><b>Data loading issue:</b> {error}. Confirm the SQL import, reviewer permissions and Netlify environment variables.</Alert>}
 <div className="workspaceMeta"><span>CLIENT UNIVERSE <b>{clients.length} fictional profiles</b></span><span>DATA SOURCES <b>{configured?'Supabase connected':'Preview only'}</b></span><span>STORY STATUS <b>Approved synthetic examples</b></span></div><div className="layout">
 <section className="client-panel"><div className="panel-title"><div><h2>Client universe</h2><p>{configured?'Live synthetic records from Supabase':'20 illustrative client scenarios'}</p></div><span className="count">{clients.length}</span></div>
 <label className="search"><span aria-hidden="true">⌕</span><input aria-label="Search fictional clients" placeholder="Find a client or scenario" value={query} onChange={e=>setQuery(e.target.value)}/>{query&&<button className="clearSearch" type="button" aria-label="Clear client search" onClick={()=>setQuery('')}>×</button>}</label>
 <div className="client-list" aria-label="Select a fictional customer">{filtered.map(c=><button type="button" key={c.client_id} aria-current={selected===c.client_id?'true':undefined} className={'client '+(selected===c.client_id?'selected':'')} onClick={()=>{setSelected(c.client_id);setTab('overview')}}><span className="avatar">{c.alias.replace(' (fictional)','').slice(0,1)}</span><span className="client-identity"><strong>{c.alias.replace(' (fictional)','')}</strong><small>{c.persona_scenario}</small></span><span className="client-id">{c.client_id}</span></button>)}
 {!filtered.length&&<p className="noresult">{loading?'Loading…':'No matching clients.'}</p>}</div></section>
 <section className="detail">{client?<><div className="detail-top"><span className="eyebrow">CLIENT PROFILE / {client.client_id}</span><span className="outline-pill"><span className="statusDot"/> Fictional client</span></div>
 <h2>{client.alias.replace(' (fictional)','')}'s relationship</h2><p className="lead">{client.persona_scenario} <span className="leadSeparator">·</span> {client.profile?.region||'Location unavailable'}</p><div className="relationshipHint">An evolving picture across products, platforms and human interactions—not a fixed investor persona.</div>
 <div className="tabs" role="tablist" aria-label="Customer information">{[['overview','Overview'],['evidence','Source evidence'],['timeline','Relationship timeline'],['story','Wealth Story']].map(([v,label])=><button type="button" key={v} role="tab" aria-selected={tab===v} className={tab===v?'active':''} onClick={()=>setTab(v)}>{label}</button>)}</div>
 {loading?<p className="supportText">Loading customer records…</p>:tab==='overview'?<><div className="focus-card"><span className="eyebrow">CURRENT RELATIONSHIP CONTEXT</span>
 <h3>{state?.story_type?titleCase(state.story_type):'The intelligence state is awaiting database import.'}</h3><p className="supportText">Priority: <b>{titleCase(state?.primary_priority||client.starting_mode)}</b> · Goal: {titleCase(state?.goal_type)} · Relationship confidence: {titleCase(state?.relationship_confidence)}</p>
 <div className="divider"/><div className="hint"><span className="hint-circle">i</span><span>Data from Geojit accounts is not a complete picture of the customer's external assets or needs. No inferred intent is a suitability decision.</span></div></div>
 <div className="data-grid"><div><span>Product records</span><strong>{products.length}</strong><small>Known Geojit relationship</small></div><div><span>Holdings snapshot</span><strong>{holdings.length?money(value):'Not assessed'}</strong><small>Fictional values, not live</small></div><div><span>Relationship events</span><strong>{byDomain(records,'unified_events').length}</strong><small>Across connected data domains</small></div></div>
 {openService&&<Alert>An open service issue exists. Review its status before optional promotional content.</Alert>}
 <button className="next navNext" onClick={()=>setTab('story')}><div><span className="eyebrow">NEXT</span><strong>See the evidence-grounded Wealth Story</strong><p>Follow the selected customer context and governance decision.</p></div><span>→</span></button>
 </>:tab==='evidence'?<Evidence records={records}/>:tab==='timeline'?<Timeline records={records}/>:<Story records={records}/>}
 </>:<div className="focus-card"><h3>{loading?'Loading customers…':'No customer data available'}</h3><p>Run the supplied Supabase SQL import to populate the synthetic dataset.</p></div>}</section></div>
 <footer><span>Geojit Wealth Story · Experience Lab</span><span>Fictional dataset · No investment recommendation · No live customer data or outbound messaging</span></footer>
 </main></div>
}
