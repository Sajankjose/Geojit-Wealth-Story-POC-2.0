import React,{useMemo,useState} from 'react'
import {fixtureIntelligence} from './lib/wealthIntelligence.js'
import {mobileCustomerFigures,rupees} from './lib/mobileWealthStory.js'
import WealthIntelligence from './WealthIntelligence.jsx'
import {DEMO_PATHS} from './lib/demoRoutes.js'
import './standalone-experiences.css'
const PEOPLE=[
 {id:'C012',name:'Thomas',description:'Equity and mutual fund investor'},
 {id:'C014',name:'George',description:'Investor with a fictional declared retirement goal'},
 {id:'C001',name:'Arun',description:'New investor exploring the possibilities'}
]
const shortDate=d=>new Date(d+'T12:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})
function StoryNumbers({model}){
 return <div className="srNumbers">
  <article><small>Recorded Geojit value</small><strong>{model.valuation}</strong><span>Fictional holdings only</span></article>
  <article><small>Equity</small><strong>{model.equity_value}</strong><span>{model.allocation[0].percent.toFixed(1)}% of recorded value</span></article>
  <article><small>Mutual funds</small><strong>{model.mutual_fund_value}</strong><span>{model.allocation[1].percent.toFixed(1)}% of recorded value</span></article>
 </div>
}
export default function WealthStoryExperience(){
 const [clientId,setClientId]=useState(()=>{
  try{const id=new URLSearchParams(window.location.search).get('client');return PEOPLE.some(c=>c.id===id)?id:'C012'}catch{return 'C012'}
 })
 const [details,setDetails]=useState(false)
 const person=PEOPLE.find(x=>x.id===clientId)||PEOPLE[0]
 const model=useMemo(()=>fixtureIntelligence(clientId),[clientId])
 const noHoldings=clientId==='C001'
 return <div className="srPage">
  <header className="srHeader"><div className="srBrand"><span className="srLogo">WS</span><div><strong>Geojit Wealth Story</strong><small>YOUR JOURNEY, MADE CLEARER</small></div></div><div className="srHeaderLinks"><a href={DEMO_PATHS.companion}>Explore Phase 2 · Wealth Companion</a><a href={DEMO_PATHS.lab}>Review workspace</a></div></header>
  <main className="srMain">
   <div className="srIssue"><span>PHASE 1 · A PERSONAL STORY FOR EVERY CLIENT</span><span>FICTIONAL REVIEW DEMONSTRATION</span></div>
   <div className="srSelector"><label htmlFor="sr-client">Preview an example Wealth Story</label><select id="sr-client" value={clientId} onChange={e=>setClientId(e.target.value)}>{PEOPLE.map(c=><option key={c.id} value={c.id}>{c.name} · {c.description}</option>)}</select></div>
   <section className="srCover"><span className="srEyebrow">YOUR WEALTH STORY · {model?shortDate(model.as_of):'A NEW BEGINNING'}</span><h1>Hi {person.name}.<br/><em>{noHoldings?'Every financial journey starts with a question.':'Your investments have a story beyond the numbers.'}</em></h1><p>{noHoldings?'There are no investments recorded in this fictional Geojit account. That doesn’t tell us about savings elsewhere or your goals. Let’s start with financial questions you choose.':'Here is a clearer look at the investments visible in this fictional Geojit account, what changed recently, and a useful perspective worth exploring. No promotional overload.'}</p></section>
   {!noHoldings&&model?<><StoryNumbers model={model}/><section className="srChapter"><span className="srEyebrow">CHAPTER 01 · YOUR FINANCIAL PICTURE</span><h2>What do your holdings actually tell you?</h2><div className="srAllocation"><span style={{width:model.allocation[0].percent+'%'}}/><span style={{width:model.allocation[1].percent+'%'}}/></div><div className="srLegend"><span><b className="srDot equity"/>Equity · {model.allocation[0].percent.toFixed(1)}%</span><span><b className="srDot mf"/>Mutual funds · {model.allocation[1].percent.toFixed(1)}%</span></div><p>These figures tell us how the investments recorded here are distributed across two broad categories. They don't describe your holdings elsewhere or establish what you should own.</p></section>
    <section className="srChapter"><span className="srEyebrow">CHAPTER 02 · WHAT CHANGED</span><h2>A change in value is not always an investment gain.</h2><div className="srMiniMetrics"><div><span>This week's net contribution</span><b>{model.weekly_net_flow}</b></div><div><span>Change excluding net flows</span><b>{model.weekly_investment_effect}</b></div><div><span>Latest fictional value</span><b>{model.valuation}</b></div></div><p>Your value changed alongside recorded cash movements. The distinction matters when understanding your journey; neither a deposit nor a short-term difference from an index proves investment success.</p></section>
    <section className="srChapter"><span className="srEyebrow">CHAPTER 03 · A DIFFERENT PERSPECTIVE</span><h2>How does your week compare with the market context?</h2><div className="srMiniMetrics"><div><span>Illustrative portfolio return</span><b>{model.weekly_return>0?'+':''}{model.weekly_return.toFixed(2)}%</b></div><div><span>Invented market proxy</span><b>{model.benchmark_return>0?'+':''}{model.benchmark_return.toFixed(2)}%</b></div></div><p>The market proxy is completely hypothetical and is not matched to the equity/mutual-fund mix. It is presented to demonstrate an explanation—not a performance verdict.</p></section>
    {model.goal&&<section className="srChapter"><span className="srEyebrow">A GOAL THE FICTIONAL CLIENT DECLARED</span><h2>{model.goal.label}</h2><div className="srGoalNumber">{rupees(model.goal.target)} <small>illustrative target</small></div><div className="srGoalBar"><span style={{width:Math.min(100,model.goal.progress)+'%'}}/></div><p>{model.goal.progress.toFixed(1)}% of the illustrative target is represented by the in-scope current valuation. This is not a forecast or claim of actual goal achievement.</p></section>}
    <section className="srChapter srValue"><span className="srEyebrow">A USEFUL NEXT STEP</span><h2>Look beyond this week's numbers.</h2><p>Explore what asset allocation means, how contributions affect reported values and which financial goals you would like to understand. Nothing here assumes a need to buy, sell or switch investments.</p><button type="button" onClick={()=>setDetails(x=>!x)}>{details?'Hide the methodology':'Explore the detailed financial picture →'}</button>{details&&<div className="srEvidence"><WealthIntelligence clientId={clientId}/></div>}</section>
   </>:<><section className="srChapter srEmpty"><span className="srEyebrow">YOUR STARTING POINT</span><h2>No recorded holdings. No fabricated investment story.</h2><p>Even without a portfolio, you can explore how goal amounts, time horizons and saving habits work. The next step is simply to choose what you want to understand—not to purchase a product.</p><a href={DEMO_PATHS.companion}>Explore the guided Wealth Companion concept →</a></section></>}
   <section className="srTomorrow"><span className="srEyebrow">AND THE JOURNEY CONTINUES</span><h2>One relevant story. One meaningful next step.</h2><p>Wealth Story is the Phase 1 proposal: data-informed, curated communications instead of unrelated promotional messages. Phase 2 extends this into a continuing educational relationship.</p><a href={DEMO_PATHS.companion}>Discover My Wealth Companion →</a></section>
   <footer className="srFooter">Synthetic demonstration only · 20 November 2026 valuation fixture · No live prices, actual client data, financial advice or customer communication.</footer>
  </main></div>
}
