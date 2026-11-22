import React,{useEffect,useState} from 'react'
import {supabase} from './lib/supabase'
import {MAP_AREAS} from './lib/genuineGuidance.js'
const topicName=id=>MAP_AREAS.find(x=>x.id===id)?.title||id
export default function GuidanceInsights({clients=[],onPreviewCustomer}){
 const [state,setState]=useState({status:'loading',rows:[]})
 const [filter,setFilter]=useState('all')
 const [version,setVersion]=useState(0)
 useEffect(()=>{
  let active=true
  async function load(){
   if(!supabase){setState({status:'error',error:'Supabase is not configured.',rows:[]});return}
   const {data,error}=await supabase.from('poc_guidance_events').select('id,client_id,topic,event_type,created_at,details').order('created_at',{ascending:false}).limit(500)
   if(!active)return
   if(error)setState({status:'error',error:'Guidance interest table is not yet available. Run the POC 2.7.3 SQL migration in Supabase, then refresh. '+error.message,rows:[]})
   else setState({status:'ready',rows:data||[]})
  }
  load();return()=>{active=false}
 },[version])
 const rows=state.rows.filter(x=>filter==='all'||x.event_type===filter)
 const distinct=(items)=>new Set(items.map(x=>x.client_id)).size
 const label=id=>clients.find(x=>x.client_id===id)?.alias||id
 const requests=state.rows.filter(x=>x.event_type==='followup_request_demo')
 const interests=state.rows.filter(x=>x.event_type==='topic_interest_demo')
 return <div className="giSpace">
  <div className="eyebrow">RELATIONSHIP OPPORTUNITIES · FICTIONAL</div><h2>Interest earned through useful guidance.</h2>
  <p>This is not a lead-generation dashboard. Only explicit fictional choices appear here; passive Wealth Map exploration is not treated as sales intent or consent to contact.</p>
  <div className="giMetrics"><div><small>Fictional clients expressing interest</small><strong>{distinct(state.rows)}</strong></div><div><small>Saved interests (demo)</small><strong>{interests.length}</strong></div><div><small>Follow-up requests (demo)</small><strong>{requests.length}</strong></div></div>
  <div className="giLegend"><b>Genuine Guidance Gate</b><span>Customer benefit first</span><span>Topic selected voluntarily</span><span>No inferred product gap</span><span>No CRM outreach</span></div>
  <div className="giControls"><label>View <select value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">All explicit choices</option><option value="topic_interest_demo">Saved interests</option><option value="followup_request_demo">Requested follow-ups</option></select></label><button type="button" onClick={()=>setVersion(v=>v+1)}>Refresh fictional activity</button></div>
  {state.status==='loading'?<p>Loading explicit interest events…</p>:state.status==='error'?<div className="wsError" role="alert">{state.error}</div>:rows.length===0?<div className="giEmpty"><b>Nothing to follow up yet—and that's fine.</b><p>Open the customer Wealth Map, explore a topic, then explicitly save a fictional interest. No lead is generated simply because someone explored a map.</p><button type="button" onClick={()=>onPreviewCustomer?.('C012')}>Preview Thomas's Wealth Map →</button></div>:
   <div className="giEvents">{rows.map(x=><article key={x.id}><div><strong>{label(x.client_id)} · {topicName(x.topic)}</strong><small>{x.client_id} · {new Date(x.created_at).toLocaleString('en-IN',{day:'numeric',month:'short',hour:'numeric',minute:'2-digit'})}</small></div><span>{x.event_type==='followup_request_demo'?'Follow-up requested · simulated':'Interest saved · simulated'}</span><button type="button" onClick={()=>onPreviewCustomer?.(x.client_id)}>Open fictional client →</button></article>)}</div>}
  <p className="giPolicy">Production conversion measurement would require verified consent, relevant eligibility, server-side audit trails, approved RM handoff and incremental outcome measurement. This POC does not send messages or create an actionable customer lead.</p>
 </div>
}
