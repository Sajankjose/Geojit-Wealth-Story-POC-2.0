import React,{useMemo,useState} from 'react'
import {illustrativeMapForStory,mayShowOptionalProductDiscovery} from './lib/illustrativeWealthMap.js'
import './illustrative-wealth-map.css'
export default function IllustrativeWealthMap({story,onExploreGoal,onExploreProtection,initialChapter}){
 const map=useMemo(()=>illustrativeMapForStory(story),[story])
 const [chosen,setChosen]=useState(initialChapter||null)
 const [showProducts,setShowProducts]=useState(false)
 const [selectedProduct,setSelectedProduct]=useState(null)
 const [saved,setSaved]=useState(false)
 if(!map)return null
 const active=map.chapters.find(x=>x.id===(chosen||map.active))||map.chapters[0]
 const unexplored=active.products.filter(x=>x.relationship==='not_subscribed')
 const choose=id=>{setChosen(id);setShowProducts(false);setSelectedProduct(null);setSaved(false)}
 return <section className="wmSExperience" aria-label="Illustrative Wealth Creation Map">
  <div className="wmSHero">
   <div className="wmSHeroText"><span className="wmSEyebrow">EXPLORE YOUR WEALTH CREATION MAP</span><h2>Your wealth creation journey has more than one chapter.</h2><p>{map.journeyLine}</p><p className="wmSJourneyHook">One interesting question: have you explored all the possibilities that matter to you?</p></div>
   <span className="wmSExploreLabel">Your journey · 5 chapters <span aria-hidden="true">✦</span></span>
  </div>
  <div className="wmSMap" role="group" aria-label="Choose a financial learning dimension">
   <svg viewBox="0 0 920 240" className="wmSRoute" aria-hidden="true" preserveAspectRatio="none"><path d="M60 151 C160 52 225 50 295 124 S453 220 520 136 S694 52 854 110" fill="none" stroke="var(--ds-border-primary)" strokeWidth="3" strokeDasharray="7 10" strokeLinecap="round"/></svg>
   {map.chapters.map((node,i)=><button key={node.id} type="button" className={'wmSNode wmSNode-'+node.color+' '+((chosen||map.active)===node.id?'wmSNodeActive':'')} onClick={()=>choose(node.id)} aria-pressed={(chosen||map.active)===node.id}>
    <span className="wmSNodeCircle"><span className="wmSNodeSymbol">{node.icon}</span></span>
    <span className="wmSNodeStep">YOUR JOURNEY · {node.step}/05</span><strong>{node.title}</strong><small>{node.short}</small>
    {node.known&&<span className="wmSNodeKnown">Recorded context</span>}
   </button>)}
  </div>
  <div className={'wmSDetail wmSDetail-'+active.color}>
   <div className="wmSDetailTop"><span className="wmSEyebrow">YOUR JOURNEY · CHAPTER {active.step} · {active.title.toUpperCase()}</span><span className="wmSStatus">{active.evidence}</span></div>
   <h3>{active.question}</h3><p>{active.body}</p>
   <div className="wmSFocus"><span>YOUR NEXT DISCOVERY</span><strong>{active.learn}</strong></div>
   {!map.serviceFirst&&unexplored.length>0&&<div className="wmSUnexplored"><span className="wmSUnexploredIcon">✦</span><div><strong>There is more you could discover.</strong><p>{unexplored.map(x=>x.name).join(' and ')} {unexplored.length===1?'is':'are'} not subscribed to in this fictional Geojit account. Have you explored how {unexplored.length===1?'it works':'these approaches work'}?</p><small>Not subscribed ≠ missing out on returns. Suitability, external relationships and needs are not established.</small></div></div>}
   {active.id==='protection'&&<button type="button" className="wmSGoalLink" onClick={onExploreProtection}>Explore your insurance coverage →</button>}
   {active.id==='goals'&&<button type="button" className="wmSGoalLink" onClick={onExploreGoal}>Explore the illustrative goal calculator →</button>}
   {map.serviceFirst?<p className="wmSPrivacy">Your fictional service request is still in progress. Optional product discovery is held back in this scenario; support takes priority.</p>:
    <div className="wmSProductArea">
     <button type="button" className="wmSDiscover" onClick={()=>{setShowProducts(v=>!v);setSelectedProduct(null);setSaved(false)}} aria-expanded={showProducts}>
      {showProducts?'Hide related opportunities −':'See what else you could explore →'}
     </button>
     {mayShowOptionalProductDiscovery(map,showProducts)&&<div className="wmSProducts"><div className="wmSOpportunityIntro"><strong>There may be more to your journey.</strong><p>Discover financial approaches you may not have explored through Geojit. Your recorded subscriptions are shown only where this fictional demo explicitly confirms them—not as proof that you need anything.</p></div>
      {active.products.map(item=><button type="button" key={item.id} className={selectedProduct===item.id?'on':''} onClick={()=>{setSelectedProduct(selectedProduct===item.id?null:item.id);setSaved(false)}} aria-expanded={selectedProduct===item.id}><span className="wmSProductTitle"><strong>{item.name}</strong><small className={'wmSRelationship wmSRelationship-'+item.relationship}>{item.relationshipLabel}</small></span><b>{selectedProduct===item.id?'−':'Discover +'}</b></button>)}
      {active.products.filter(x=>x.id===selectedProduct).map(item=><div key={item.id} className="wmSProductDetails"><strong>{item.name}</strong><p>{item.relationship==='not_subscribed'?'This example shows no Geojit subscription to this offering. That could be a topic worth learning about—not evidence that you are missing a financial opportunity. ':''}{item.description}</p><button type="button" onClick={()=>setSaved(true)}>{saved?'Marked explored in this preview ✓':'Mark as interesting in this preview'}</button>{saved&&<small>Only this screen is updated. No marketing permission, lead or customer profile has been created.</small>}</div>)}
     </div>}
    </div>}
  </div>
  <div className="wmSFoot"><span>◈ A continuing wealth creation journey, not a financial health score</span><span>Chapters are not deficiencies or missed investment opportunities</span></div>
 </section>
}
