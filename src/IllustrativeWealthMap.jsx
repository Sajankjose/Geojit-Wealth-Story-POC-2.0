import React,{useMemo,useState} from 'react'
import {illustrativeMapForStory,mayShowOptionalProductDiscovery} from './lib/illustrativeWealthMap.js'
import './illustrative-wealth-map.css'
export default function IllustrativeWealthMap({story,onExploreGoal}){
 const map=useMemo(()=>illustrativeMapForStory(story),[story])
 const [chosen,setChosen]=useState(null)
 const [showProducts,setShowProducts]=useState(false)
 const [selectedProduct,setSelectedProduct]=useState(null)
 const [saved,setSaved]=useState(false)
 if(!map)return null
 const active=map.chapters.find(x=>x.id===(chosen||map.active))||map.chapters[0]
 const choose=id=>{setChosen(id);setShowProducts(false);setSelectedProduct(null);setSaved(false)}
 return <section className="wmSExperience" aria-label="Illustrative Wealth Creation Map">
  <div className="wmSHero">
   <div className="wmSHeroText"><span className="wmSEyebrow">EXPLORE YOUR WEALTH CREATION MAP</span><h2>Your investments are only one part of the picture.</h2><p>There may be more chapters worth discovering. Pick a direction and see what it means for you—without being told something is missing.</p></div>
   <span className="wmSExploreLabel">5 areas to explore <span aria-hidden="true">✦</span></span>
  </div>
  <div className="wmSMap" role="group" aria-label="Choose a financial learning dimension">
   <svg viewBox="0 0 920 240" className="wmSRoute" aria-hidden="true" preserveAspectRatio="none"><path d="M60 151 C160 52 225 50 295 124 S453 220 520 136 S694 52 854 110" fill="none" stroke="var(--ds-border-primary)" strokeWidth="3" strokeDasharray="7 10" strokeLinecap="round"/></svg>
   {map.chapters.map((node,i)=><button key={node.id} type="button" className={'wmSNode wmSNode-'+node.color+' '+((chosen||map.active)===node.id?'wmSNodeActive':'')} onClick={()=>choose(node.id)} aria-pressed={(chosen||map.active)===node.id}>
    <span className="wmSNodeCircle"><span className="wmSNodeSymbol">{node.icon}</span></span>
    <span className="wmSNodeStep">CHAPTER {node.step}</span><strong>{node.title}</strong><small>{node.short}</small>
    {node.known&&<span className="wmSNodeKnown">Recorded context</span>}
   </button>)}
  </div>
  <div className={'wmSDetail wmSDetail-'+active.color}>
   <div className="wmSDetailTop"><span className="wmSEyebrow">CHAPTER {active.step} · {active.title.toUpperCase()}</span><span className="wmSStatus">{active.evidence}</span></div>
   <h3>{active.question}</h3><p>{active.body}</p>
   <div className="wmSFocus"><span>ONE USEFUL THING TO EXPLORE</span><strong>{active.learn}</strong></div>
   {active.id==='goals'&&<button type="button" className="wmSGoalLink" onClick={onExploreGoal}>Explore the illustrative goal calculator →</button>}
   {map.serviceFirst?<p className="wmSPrivacy">Your fictional service request is still in progress. Optional product discovery is held back in this scenario; support takes priority.</p>:
    <div className="wmSProductArea">
     <button type="button" className="wmSDiscover" onClick={()=>{setShowProducts(v=>!v);setSelectedProduct(null);setSaved(false)}} aria-expanded={showProducts}>
      {showProducts?'Hide related learning options −':'Curious about related financial solutions? +'}
     </button>
     {mayShowOptionalProductDiscovery(map,showProducts)&&<div className="wmSProducts"><p>These are general educational options, not identified financial gaps or personalised recommendations.</p>
      {active.products.map(item=><button type="button" key={item.id} className={selectedProduct===item.id?'on':''} onClick={()=>{setSelectedProduct(selectedProduct===item.id?null:item.id);setSaved(false)}} aria-expanded={selectedProduct===item.id}><span>{item.name}</span><b>{selectedProduct===item.id?'−':'Explore +'}</b></button>)}
      {active.products.filter(x=>x.id===selectedProduct).map(item=><div key={item.id} className="wmSProductDetails"><strong>{item.name}</strong><p>{item.description}</p><button type="button" onClick={()=>setSaved(true)}>{saved?'Marked explored in this preview ✓':'Mark as interesting in this preview'}</button>{saved&&<small>Only this screen is updated. No marketing permission, lead or customer profile has been created.</small>}</div>)}
     </div>}
    </div>}
  </div>
  <div className="wmSFoot"><span>◈ Illustrative roadmap, not a financial health score</span><span>Chapters are not deficiencies or missed investment opportunities</span></div>
 </section>
}
