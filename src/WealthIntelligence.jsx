import React,{useState} from 'react'
import {fixtureIntelligence} from './lib/wealthIntelligence.js'
const fmt=x=>(x>0?'+':'')+x.toFixed(2)+'%'
const Signed=({value,unit='%'})=><span className={value>=0?'wiPositive':'wiNegative'}>{value>0?'+':''}{Number(value).toFixed(2)}{unit}</span>
function Trend({items=[]}){
 if(items.length<2)return null
 const values=items.map(x=>x.value),lo=Math.min(...values)*.995,hi=Math.max(...values)*1.005;
 const project=(x,i)=>[12+i*(436/Math.max(1,items.length-1)),126-(x-lo)/Math.max(1,hi-lo)*105];
 const points=items.map((x,i)=>project(x.value,i).join(',')).join(' ');
 return <div className="wiTrend"><svg role="img" aria-label="Illustrative portfolio value by week" viewBox="0 0 460 150" preserveAspectRatio="xMidYMid meet">
  <path d="M12 22H448M12 74H448M12 126H448" fill="none" stroke="currentColor" strokeOpacity=".13" strokeDasharray="3 5"/>
  <polyline points={points} fill="none" stroke="#117f70" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  {items.map((x,i)=>{const [cx,cy]=project(x.value,i);return <circle key={x.date} cx={cx} cy={cy} r={i===items.length-1?5:3} fill={i===items.length-1?'#117f70':'#b0cfc5'} />})}
 </svg><div className="wiTimeline">{items.map((x,i)=><span key={x.date}>{i%2===0||i===items.length-1?x.label:''}</span>)}</div>
 </div>
}
export default function WealthIntelligence({clientId='C012',editionType='weekly_investing',onShowStory}){
 const [detail,setDetail]=useState('drivers'),[tool,setTool]=useState(null);
 const model=fixtureIntelligence(clientId)
 if(!model)return <div className="wiUnavailable">No verified financial intelligence is available for this client. No results have been estimated.</div>
 const figure=[{label:'Illustrative portfolio value',value:model.valuation,note:'Fictional Geojit-scoped holdings'},
  {label:'Weekly cash-flow-adjusted return',value:<Signed value={model.weekly_return}/>,note:'Illustrative method · not live performance'},
  {label:'Illustrative market proxy',value:<Signed value={model.benchmark_return}/>,note:'Fictional index · same dates'},
  {label:'Difference vs proxy',value:<Signed value={model.relative_pp} unit=" pp"/>,note:'Not a validated benchmark comparison'}]
 return <div className="wiExperience">
   <div className="wiLabelRow"><span className="wiEyebrow">PERSONAL WEALTH INTELLIGENCE · POC 2.7.2</span><span className="wiDemoPill">Synthetic illustration</span></div>
   <div className="wiHeading"><div><h2>See what changed. Understand the bigger picture.</h2><p>A guided look at portfolio movement, relevant market context and the journey over time.</p></div><span className="wiDate">As of 20 Nov 2026</span></div>
   <div className="wiFigures">{figure.map(x=><div className="wiFigure" key={x.label}><span>{x.label}</span><strong>{x.value}</strong><small>{x.note}</small></div>)}</div>
   <div className="wiSplit">
     <section className="wiPanel"><div className="wiEyebrow">THE WEEK IN CONTEXT</div><h3>How did your investments move?</h3>
       <p>{model.gap_text}</p><p className="wiDisclaimer">The broad-equity market comparison is deliberately fictional and is not matched to your portfolio's mix.</p>
       <div className="wiComparison"><div><span>Modelled portfolio</span><b><Signed value={model.weekly_return}/></b></div><div><span>Hypothetical market proxy</span><b><Signed value={model.benchmark_return}/></b></div></div>
       <div className="wiScope">{model.attribution}</div>
       <button type="button" className="wiTextButton" onClick={()=>setDetail(detail==='method'?'drivers':'method')}>{detail==='method'?'Hide calculation methodology':'How was this calculated?'} →</button>
       {detail==='method'&&<div className="wiExplanation">{model.calculation_note}<p>{model.comparison_caveat}</p></div>}
     </section>
     <section className="wiPanel wiMarket"><div className="wiEyebrow">MARKET PERSPECTIVE</div><h3>What was happening around your investments?</h3>
       <p>{model.context}</p><div className="wiScope"><b>Source:</b> {model.market_source}. No real market feed or research call is connected.</div>
       <div className="wiInsight"><span>Worth remembering</span><p>A different result from a broad market index does not necessarily mean something is wrong. Allocation, timing, flows and investment types matter.</p></div>
     </section>
   </div>
   <div className="wiJourneyArea"><div className="wiJourneyTop"><div><div className="wiEyebrow">YOUR LONGER-TERM PICTURE</div><h3>Your journey, not just this week</h3><p>A view of how fictional contributions and valuations relate over time.</p></div></div>
     <Trend items={model.journey}/>
     <div className="wiJourneyNumbers"><div><span>Starting illustrated value</span><b>{model.since_start_value}</b></div><div><span>Net contributions during period</span><b>{model.period_net_flow}</b></div><div><span>Change excluding net flows</span><b>{model.period_gain}</b></div></div>
     {model.goal?<div className="wiGoal"><div><span>Fictional declared goal · {model.goal.label}</span><strong>{model.goal.progress.toFixed(1)}% of illustrative target</strong></div><div className="wiProgress"><span style={{width:Math.min(100,model.goal.progress)+'%'}}/></div><p>{model.goal.note}</p></div>:<div className="wiGoalBlank">No explicit financial goal is available in this fictional illustration. We won't invent a target or say you're ahead or behind.</div>}
     <p className="wiDisclaimer">{model.journey_note}</p>
   </div>
   <div className="wiToolArea"><div className="wiEyebrow">A USEFUL NEXT STEP</div><h3>Explore what matters to you</h3>
     <div className="wiTools">{model.tools.map(t=><button key={t.id} type="button" onClick={()=>setTool(tool===t.id?null:t.id)} aria-expanded={tool===t.id}><strong>{t.label}</strong><span>Explore →</span></button>)}</div>
     {tool&&<div className="wiToolDetail"><b>{model.tools.find(t=>t.id===tool)?.label}</b><p>{model.tools.find(t=>t.id===tool)?.detail}</p><small>This is an illustrative handoff, not a functioning Geojit calculator, trading link or service request.</small></div>}
   </div>
   <div className="wiFootnote"><b>About this illustration</b><p>All portfolio values, market levels, percentage changes and goal progress displayed here come from synthetic fixtures and deterministic calculations. They do not represent any real customer, current NSE data, investment recommendation, approved research or independently verified returns. A production version requires authorised valuation feeds, cash-flow dates, appropriate benchmark assignment and audit-approved methodologies.</p></div>
   {onShowStory&&<button type="button" className="wiBack" onClick={onShowStory}>← Back to your Wealth Story</button>}
 </div>
}
