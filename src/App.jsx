import React, { useMemo, useState } from 'react'

const people = [
 ['C001','Arun','New investor','Explore'],['C002','Anu','First SIP','Guide'],['C003','Meera','Regular SIP investor','Guide'],
 ['C004','Dev','Failed SIP','Resolve'],['C005','Fathima','Paused SIP','Resolve'],['C006','Rahul','MF intermediate','Inform'],
 ['C007','Lakshmi','MF to equity explorer','Explore'],['C008','Vikram','Active equity trader','Inform'],['C009','Kiran','F&O beginner','Educate'],
 ['C010','Suresh','Experienced F&O trader','Inform'],['C011','Nisha','Commodity trader','Inform'],['C012','Thomas','Trader and investor','Guide'],
 ['C013','Priya','SIP and insurance','Guide'],['C014','George','Retirement planning','Guide'],['C015','Rehan','NRI prospect','Explore'],
 ['C016','Divya','Multi-product wealth client','Guide'],['C017','Joseph','Digital-to-branch journey','Assist'],['C018','Sneha','Inactive customer','Reconnect'],
 ['C019','Manoj','Open service complaint','Resolve'],['C020','Isha','Learner; opted out','Respect preference']
]
const notes = {
 C001:'Customer is exploring foundational financial concepts; no products should be presumed.',
 C003:'Regular investing history may support a progress story after verifying source records.',
 C004:'A failed SIP takes priority over any optional product communication.',
 C008:'Market and research context requires authorised, current, approved source content.',
 C012:'Trading and long-term investment activities can coexist in one relationship.',
 C014:'A declared retirement goal may support a guided, customer-led planning journey.',
 C019:'An open complaint calls for a service-first experience, not promotion.',
 C020:'Optional outbound communication is suppressed where permission is withheld.'
}
function Icon({name}) {return <span aria-hidden="true" className="icon">{name}</span>}
export default function App() {
 const [query,setQuery]=useState('')
 const [selected,setSelected]=useState('C012')
 const [view,setView]=useState('overview')
 const visible=useMemo(()=>people.filter(p=>p.join(' ').toLowerCase().includes(query.toLowerCase())),[query])
 const client=people.find(p=>p[0]===selected)||people[0]
 return <div className="shell">
   <aside className="sidebar">
    <div className="brand"><div className="brand-symbol">G<span>.</span></div><div><strong>Geojit</strong><small>WEALTH STORY / POC 2.0</small></div></div>
    <div className="side-heading">WORKSPACE</div>
    <div className="menu-item active"><Icon name="◫"/> Customer intelligence</div>
    <div className="menu-item muted"><Icon name="◇"/> Story studio <em>Next</em></div>
    <div className="menu-item muted"><Icon name="◷"/> Unified event timeline <em>Next</em></div>
    <div className="side-bottom"><span className="status-dot"/> Synthetic environment<div className="tiny">No live customer data or AI connected</div></div>
   </aside>
   <main className="main">
    <header className="topline"><div>INTELLIGENCE LAB <span>/ Foundation release</span></div><div className="environment">FICTIONAL DATA ONLY</div></header>
    <section className="heading"><div className="eyebrow">WELCOME TO POC 2.0</div><h1>One customer.<br/><i>A richer understanding.</i></h1><p>Explore how product, behavioural and relationship signals can eventually become one clear, meaningful financial narrative.</p></section>
    <div className="layout">
     <section className="client-panel"><div className="panel-title"><div><h2>Client universe</h2><p>20 deliberately different customer scenarios</p></div><span className="count">20</span></div>
      <label className="search"><span>⌕</span><input aria-label="Search fictional customers" placeholder="Search clients or scenarios" value={query} onChange={e=>setQuery(e.target.value)}/></label>
      <div className="client-list">{visible.length?visible.map(p=><button key={p[0]} className={'client '+(selected===p[0]?'selected':'')} onClick={()=>{setSelected(p[0]);setView('overview')}}><span className="avatar">{p[1].slice(0,1)}</span><span className="client-identity"><strong>{p[1]}</strong><small>{p[2]}</small></span><span className="client-id">{p[0]}</span></button>):<p className="noresult">No fictional clients match that search.</p>}</div>
     </section>
     <section className="detail">
      <div className="detail-top"><span className="eyebrow">CLIENT CONTEXT / {client[0]}</span><span className="outline-pill">Illustrative scenario</span></div>
      <h2>{client[1]}'s relationship</h2><p className="lead">{client[2]}</p>
      <div className="tabs" role="tablist" aria-label="Client information"><button role="tab" aria-selected={view==='overview'} className={view==='overview'?'active':''} onClick={()=>setView('overview')}>Overview</button><button role="tab" aria-selected={view==='evidence'} className={view==='evidence'?'active':''} onClick={()=>setView('evidence')}>Data foundation</button></div>
      {view==='overview'?<><div className="focus-card"><span className="eyebrow">FIRST INTELLIGENCE HYPOTHESIS</span><h3>{notes[client[0]]||'Understand the current relationship before selecting a relevant next experience.'}</h3><div className="divider"/><div className="hint"><span className="hint-circle">i</span><span>Scenario guidance is static until the actual 20-client dataset and governance rules are connected.</span></div></div>
      <div className="data-grid"><div><span>Experience priority</span><strong>{client[3]}</strong></div><div><span>Data status</span><strong>Awaiting import</strong></div><div><span>Generated story</span><strong>Not enabled</strong></div></div>
      </>:<><div className="focus-card"><span className="eyebrow">DATA UNIVERSE / UPCOMING INTEGRATION</span><h3>Multiple systems. One governed customer context.</h3><p className="feature-desc">Products, holdings, transactions, digital behaviour, channel engagement, RM and branch visits, declared goals, service and consent will be linked through a customer ID and an auditable event timeline.</p><div className="divider"/><div className="hint"><span className="hint-circle">i</span><span>Only synthetic client labels are in this release. Database records and derived decisions are not yet connected.</span></div></div></>}
      <div className="next"><div><span className="eyebrow">NEXT MILESTONE</span><strong>Connect Supabase and import the full synthetic universe</strong><p>Then validate customer evidence before adding OpenAI-powered storytelling.</p></div><span>→</span></div>
     </section>
    </div>
    <footer>Geojit Wealth Story · Concept prototype · No financial advice, personalised recommendations or live integrations</footer>
   </main>
  </div>
}
