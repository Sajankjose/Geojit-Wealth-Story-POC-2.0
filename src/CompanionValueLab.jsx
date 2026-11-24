import React,{useEffect,useMemo,useState} from 'react'
import {composeExperience,valueSignals,recordValueEvent} from './lib/companionExperience.js'
import {newClientState,advanceLifecycle} from './lib/newClientLifecycle.js'
import {blankCompanion} from './lib/wealthCompanion.js'
import './companion-value-lab.css'
const KEY='geojit_companion_value_lab_v3_3'
const read=()=>{try{const x=JSON.parse(sessionStorage.getItem(KEY)||'null');return Array.isArray(x)?x:[]}catch{return []}}
const TOPICS=[
 {type:'learning_explored',name:'Learned something useful',detail:'Customer explored an educational explanation'},
 {type:'question_clarified',name:'Clarified a question',detail:'Customer identified what is known and unknown'},
 {type:'scenario_explored',name:'Explored a goal scenario',detail:'Customer changed a self-directed financial assumption'},
 {type:'roadmap_revisited',name:'Returned to the roadmap',detail:'Customer revisited optional educational actions'},
 {type:'story_read',name:'Read an approved story',detail:'Fictional story-reading demonstration only'}
]
export default function CompanionValueLab({onPreviewCustomer}){
 const [events,setEvents]=useState(read)
 const [persona,setPersona]=useState('new')
 const [phase,setPhase]=useState('new')
 useEffect(()=>{try{sessionStorage.setItem(KEY,JSON.stringify(events))}catch{}},[events])
 const profile={...blankCompanion(),started:true,focus:['understand','goals']}
 const lifecycle=advanceLifecycle(newClientState(),phase)
 const experience=useMemo(()=>composeExperience(persona==='new'?{kind:'new',lifecycle}:{kind:'existing',profile,portfolioAvailable:true}),[persona,phase])
 const signals=valueSignals({journey:experience,events})
 function log(type){setEvents(old=>recordValueEvent(old,type,new Date().toISOString()))}
 return <section className="cvLab">
  <div className="eyebrow">WEALTH COMPANION · CONTINUING VALUE LAB · POC 3.3</div>
  <h2>Measure usefulness, not just engagement.</h2>
  <p className="cvIntro">Demonstrate how one experience engine adapts between a new client and an established customer. Record fictional customer-value interactions to discuss how we'd evaluate the service in a real pilot.</p>
  <div className="cvScenario"><label>Customer journey<select value={persona} onChange={e=>setPersona(e.target.value)}><option value="new">New client · No investment history</option><option value="existing">Existing client · In-scope investments</option></select></label>
  {persona==='new'&&<label>Scenario milestone<select value={phase} onChange={e=>setPhase(e.target.value)}><option value="new">Just joined</option><option value="learning">Exploring</option><option value="goal">Goal scenario</option><option value="invested">First fictional contribution</option></select></label>}</div>
  <div className="cvGrid">
   <article className="cvEngine"><span className="eyebrow">COMMON EXPERIENCE ENGINE</span><h3>{experience.title}</h3><p>{experience.reason}</p>
    <div className="cvFacts"><span><b>{experience.kind==='new'?'New client':'Existing client'}</b>Relationship context</span><span><b>{experience.financialPicture?'Some simulated account context':'No portfolio history'}</b>Available information</span><span><b>{experience.roadmap.length} educational steps</b>Customer-chosen roadmap</span></div>
    <h4>Suggested learning actions</h4>{experience.roadmap.slice(0,3).map(x=><div className="cvAction" key={x.id}><b>{x.title}</b><small>{x.reason}</small></div>)}
    <p className="cvFine">No product recommendation, suitability diagnosis or live financial data has been created. This preview does not alter the actual client dashboard.</p>
   </article>
   <article className="cvEvaluation"><span className="eyebrow">VALUE EVALUATION · DEMONSTRATION ONLY</span><h3>What did the customer gain?</h3>
    <div className="cvMetricGrid"><div><strong>{signals.learningActions}</strong><span>Learning actions</span></div><div><strong>{signals.clarifiedQuestions}</strong><span>Questions clarified</span></div><div><strong>{signals.goalScenarios}</strong><span>Goal scenarios</span></div><div><strong>{signals.revisited}</strong><span>Roadmap revisits</span></div></div>
    <p className="cvFine">These are manually simulated session events. A count is not proof of understanding, improved financial decisions, subscription retention or incremental revenue.</p>
    <h4>Simulate an explicit customer action</h4><div className="cvEventButtons">{TOPICS.map(e=><button key={e.type} type="button" onClick={()=>log(e.type)}><b>{e.name}</b><small>{e.detail}</small></button>)}</div>
    <button type="button" className="cvReset" onClick={()=>setEvents([])}>Clear demo events</button>
   </article>
  </div>
  <div className="cvPilot"><div><h3>What a real value-added service pilot must prove</h3><p>Can customers explain what they learned? Do they voluntarily return? Do they complete a meaningful, self-chosen action? Is the service useful even when no product is bought?</p></div><div><b>Before paid rollout</b><p>Introduce genuine customer-reported usefulness, client-authorised server-side measurements, a control group, retention cohorts, security/consent governance and a written compliance classification. This POC captures none of those production outcomes.</p></div></div>
  <div className="cvFoot"><button type="button" onClick={()=>onPreviewCustomer?.('C012')}>Explore the existing-customer journey →</button><span>Fictional 20-client preview remains separate from this simulation.</span></div>
 </section>
}
