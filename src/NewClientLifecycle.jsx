import React,{useEffect,useMemo,useState} from 'react'
import {LIFECYCLE_PHASES,STARTING_CHOICES,FIRST_ACTIONS,newClientState,sanitiseLifecycle,lifecycleSnapshot,advanceLifecycle} from './lib/newClientLifecycle.js'
import {calculateGoalScenario} from './lib/genuineGuidance.js'
import './new-client-lifecycle.css'

const key='geojit-new-client-lifecycle-v3_2'
function load(){try{return sanitiseLifecycle(JSON.parse(sessionStorage.getItem(key)||'null'))}catch{return newClientState()}}
const INR=new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0});
export default function NewClientLifecycle({onReturn,onExploreWealthMap}){
 const [state,setState]=useState(load)
 const [phase,setPhase]=useState('entry')
 const [target,setTarget]=useState(500000)
 const [years,setYears]=useState(8)
 const [goalName,setGoalName]=useState('A future milestone')
 const [showReason,setShowReason]=useState(false)
 const [notice,setNotice]=useState('')
 const insight=useMemo(()=>lifecycleSnapshot(state),[state])
 useEffect(()=>{try{sessionStorage.setItem(key,JSON.stringify(state))}catch{}},[state])
 const calc=calculateGoalScenario({target,current:0,years,annualRate:0});
 function update(next,message=''){setState(sanitiseLifecycle(next));setNotice(message)}
 function setMoment(moment){update(advanceLifecycle(state,moment),'The fictional scenario has moved to '+(LIFECYCLE_PHASES.find(x=>x.id===moment)?.label||moment)+'. No real customer or transaction was changed.');setPhase('journey');setShowReason(false)}
 function chooseStarting(id){update({...state,selected:id});setPhase('firstvalue')}
 function markStep(id){update({...state,completed:state.completed.includes(id)?state.completed.filter(x=>x!==id):[...state.completed,id]},'Educational activity updated. This does not measure financial progress.')}
 function saveGoal(){
  const goal={label:goalName.trim()||'A future milestone',target,years};
  update({...advanceLifecycle(state,'goal'),declaredGoal:goal},'Fictional goal details saved for this browser session. No investment recommendation was generated.')
  setPhase('journey')
 }
 function reset(){setState(newClientState());setPhase('entry');setNotice('Scenario reset. No live account was changed.')}
 return <div className="nlRoot">
  <div className="nlTop"><div><span className="nlEyebrow">WEALTH COMPANION · POC 3.2</span><h2>A journey that begins before the first investment.</h2><p>Meet Arun, a fictional newly onboarded customer with a Geojit account but no transactions, holdings or declared financial goal.</p></div>
   <button type="button" onClick={onReturn}>← Existing customer view</button></div>
  <div className="nlManager"><div><b>Management simulation</b><p>Move through the same customer's lifecycle. These are manually invented stages, not elapsed time or inferred activity.</p></div>
   <div className="nlTimeline" role="group" aria-label="Simulate lifecycle stage">{LIFECYCLE_PHASES.map((x,i)=><button key={x.id} type="button" aria-pressed={state.stage===x.id} className={state.stage===x.id?'active':''} onClick={()=>setMoment(x.id)}><small>{x.moment}</small><strong>{x.label}</strong></button>)}</div>
   <button type="button" className="nlReset" onClick={reset}>Restart demo</button>
  </div>
  {notice&&<div className="nlNotice" role="status">{notice}</div>}
  {phase==='entry'&&<section className="nlIntro">
   <div className="nlHeroArt" aria-hidden="true">◈<span>BEGIN</span></div>
   <div className="nlEyebrow">A GENUINELY FRESH START</div><h3>Welcome, Arun.<br/><em>Your financial journey can begin with a question.</em></h3>
   <p>No investments to show yet? That's fine. We can start by exploring what matters to you and build a simple learning roadmap—without needing to buy anything.</p>
   <div className="nlKnown"><div><span>✓</span> New fictional Geojit account</div><div><span>?</span> No investments recorded in this scenario</div><div><span>?</span> No goals or external assets assumed</div></div>
   <button type="button" className="nlPrimary" onClick={()=>setPhase('choose')}>Discover where to begin →</button>
  </section>}
  {phase==='choose'&&<section className="nlPage"><span className="nlEyebrow">STEP 1 · YOUR QUESTIONS</span><h3>What would you like to explore first?</h3><p>The best starting point is the one you choose. None of these options means a product is needed.</p>
   <div className="nlChoices">{STARTING_CHOICES.map(x=><button type="button" key={x.id} className={state.selected===x.id?'active':''} onClick={()=>chooseStarting(x.id)}><span>◇</span><strong>{x.label}</strong><small>{x.description}</small><em>Explore →</em></button>)}</div>
  </section>}
  {phase==='firstvalue'&&<section className="nlPage nlFirst"><span className="nlEyebrow">YOUR FIRST VALUE MOMENT</span><h3>{FIRST_ACTIONS[state.selected].title}</h3><p>{FIRST_ACTIONS[state.selected].learning}</p><div className="nlInsight"><span>WHY THIS MAY BE USEFUL</span><p>{FIRST_ACTIONS[state.selected].why}</p></div>
   <div className="nlMicro"><div><span>01</span><strong>One clearer understanding</strong><p>A useful concept connected to what you selected.</p></div><div><span>02</span><strong>A short roadmap</strong><p>A few educational steps, not mandatory financial tasks.</p></div><div><span>03</span><strong>One next action</strong><p>Explore, defer or revisit. You decide.</p></div></div>
   <button type="button" className="nlPrimary" onClick={()=>{setMoment(state.stage==='new'?'new':state.stage);setPhase('journey')}}>Show my starting roadmap →</button>
  </section>}
  {phase==='goal'&&<section className="nlPage"><span className="nlEyebrow">YOUR CHOSEN MILESTONE · FICTIONAL EXAMPLE</span><h3>Give a goal a clearer shape.</h3><p>Only you can define this goal. The illustration below uses a zero-growth saving scenario, not an investment forecast.</p><div className="nlGoalForm">
   <label>What shall we call your goal?<input value={goalName} maxLength={60} onChange={e=>setGoalName(e.target.value)}/></label>
   <label>Illustrative target <strong>{INR.format(target)}</strong><input type="range" min="100000" max="3000000" step="50000" value={target} onChange={e=>setTarget(Number(e.target.value))}/></label>
   <label>Time to explore <strong>{years} years</strong><input type="range" min="1" max="25" step="1" value={years} onChange={e=>setYears(Number(e.target.value))}/></label>
   <div className="nlGoalResult"><span>Illustrative monthly saving at 0% growth</span><strong>{calc?INR.format(calc.monthly):'Not available'}</strong><p>Nominal goal, no inflation, taxes or costs, end-of-month saving. This is arithmetic, not a recommendation about how much to invest.</p></div></div>
   <div className="nlActions"><button type="button" className="nlPrimary" onClick={saveGoal}>Add this fictional goal to my journey →</button><button type="button" onClick={()=>setPhase('journey')}>Maybe later</button></div>
  </section>}
  {phase==='journey'&&<section className="nlJourney"><div className="nlJourneyHero"><span className="nlEyebrow">{insight.phase.moment.toUpperCase()} · {insight.phase.label.toUpperCase()}</span><h3>{insight.title}</h3><p>Your educational roadmap evolves as you explicitly explore and as fictional account facts are added. It doesn't treat an empty account as an empty financial life.</p></div>
   <div className="nlJourneyGrid"><section className="nlBoard"><span className="nlEyebrow">YOUR STARTING PICTURE</span><h4>{insight.hasInvestment?'A first fictional contribution is recorded.':'No investment values to display yet.'}</h4>
     {insight.hasInvestment?<div className="nlMoney"><span>Illustrative transaction</span><strong>{insight.fictionalInvestment.display}</strong><small>One synthetic mutual fund contribution. No current value, gain, benchmark or return can be calculated.</small></div>:<div className="nlNoData"><span>◇</span><p>There is no portfolio chart because no holdings or verified transactions exist in this scenario. That doesn't tell us anything about assets outside Geojit.</p></div>}
     {insight.goal?<div className="nlGoalBadge"><b>Goal shared in this demo: {insight.goal.label}</b><span>{INR.format(insight.goal.target)} · {insight.goal.years} years</span><p>Goal adequacy or investment alignment has not been assessed.</p></div>:<div className="nlGoalBlank">No goal has been shared. You can choose one at any time.</div>}
   </section><section className="nlBoard"><span className="nlEyebrow">YOUR EDUCATIONAL ROADMAP</span><h4>Small steps. Your pace.</h4><div className="nlTaskList">{insight.items.map((x,i)=><div key={x.id}><span>{state.completed.includes(x.id)?'✓':String(i+1).padStart(2,'0')}</span><div><b>{x.title}</b><p>{x.why}</p><button type="button" onClick={()=>markStep(x.id)}>{state.completed.includes(x.id)?'Reopen':'Mark explored'} →</button></div></div>)}</div><p className="nlSmall">{insight.educationalProgress} educational step(s) explored. This is not a wealth-progress score.</p></section></div>
   <section className="nlStory"><div><span className="nlEyebrow">YOUR WEALTH STORY · EVOLVES WITH THE JOURNEY</span><h4>{state.stage==='new'?'A new chapter begins':state.stage==='learning'?'Understanding comes first':state.stage==='goal'?'Your goals, your terms':'A first step, with a clearer picture'}</h4><p>{insight.story}</p><button type="button" onClick={()=>setShowReason(x=>!x)}>How was this story selected? {showReason?'−':'+'}</button>{showReason&&<div className="nlReason">This is prewritten editorial content selected by the manually simulated lifecycle stage. No behavioural monitoring, live AI inference, actual portfolio analysis or personalised investment recommendation occurs here.</div>}</div></section>
   <div className="nlProactive"><div><span className="nlEyebrow">ONE HELPFUL NEXT STEP</span><h4>{insight.next?insight.next.title:'Nothing else is needed right now.'}</h4><p>{insight.next?insight.next.why:'You can return whenever there is something you would like to explore.'}</p></div><div className="nlActions">{state.stage!=='goal'&&state.stage!=='invested'&&<button type="button" className="nlPrimary" onClick={()=>setPhase('goal')}>Explore a goal scenario →</button>}{onExploreWealthMap&&<button type="button" onClick={onExploreWealthMap}>Open Wealth Map →</button>}</div></div>
   <p className="nlFoot">Management demo: the stage selector advances synthetic scenario facts. Nothing is saved to a real client account or used to contact customers. No product is recommended. A real Wealth Story requires verified data, editorial approval and appropriately authorised distribution.</p>
  </section>}
 </div>
}
