import React,{useState} from 'react'
import {GUIDE_PROMPTS,guideResponse} from './lib/wealthStoryGuide.js'
import {illustrativeMapForStory} from './lib/illustrativeWealthMap.js'
import './wealth-story-hub.css'
export function WealthJourneySnapshot({story,onExplore,onExploreProtection,onExploreMoments}){
 const map=illustrativeMapForStory(story)
 const hasInvestment=!!story.model
 const hasGoal=!!story.model?.goal&&story.person.role==='goal'
 const openCount=map.chapters.filter(x=>!x.known).length
 const caseOpen=map.serviceFirst
 const nextLabel=caseOpen?'Understand my service request':hasGoal?'Explore my retirement goal':hasInvestment?'Review my protection picture':'Choose my first financial topic'
 const nextChapter=caseOpen?'review':hasGoal?'goals':hasInvestment?'protection':'foundation'
 const nextAction=()=>nextChapter==='protection'?onExploreProtection():onExplore(nextChapter)
 return <section className="wshSnapshot" aria-label="What your Wealth Story tells you">
  <div className="wshSnapshotIntro"><span className="srEyebrow">YOUR WEALTH JOURNEY · WHERE YOU ARE TODAY</span>
   <h2>{caseOpen?'Let’s take care of what matters first.':hasGoal?'You have a goal. Let’s give the next step some meaning.':hasInvestment?'You’ve started investing. What else matters to your financial life?':'Every wealth journey starts somewhere. Choose what matters to you.'}</h2>
   <p>{caseOpen?'Your fictional service request is still open. Let’s understand its status before exploring anything else.':hasGoal?'We can see your declared goal and some investments, but we cannot assume those investments are set aside for it.':hasInvestment?'We can see your investments with Geojit, but we haven’t established your protection arrangements, financial reserves or personal goals. You can explore these when you choose.':'We haven’t confirmed any investments or goals in this fictional account. You can start by choosing one financial question.'}</p></div>
  <div className="wshPersonalPicture">
   <div className="wshKnownPicture"><span className="wshPictureLabel">WHAT WE KNOW IN THIS DEMO</span>
    {hasInvestment?<><strong className="wshPictureNumber">{story.model.valuation}</strong><p>Investments recorded in this fictional Geojit account</p></>:<><strong className="wshPictureNumber">Your starting point</strong><p>No investments or goals confirmed in this fictional scenario</p></>}
    <small>Only the records shown here; investments and protection elsewhere are unknown</small>
   </div>
   <div className="wshNextPicture"><span className="wshPictureLabel">{caseOpen?'YOUR SERVICE PRIORITY':'ONE USEFUL NEXT STEP'}</span><strong>{nextLabel}</strong><p>{caseOpen?'An unresolved request deserves a clear answer.':hasInvestment?'Not because we know you need insurance—because we don’t yet know what protection you already have.':hasGoal?'Explore your own assumptions rather than guessing which investments fund your goal.':'Start with a topic, not a product purchase.'}</p>
    <button type="button" onClick={nextAction}>{nextLabel} <span aria-hidden="true">→</span></button></div>
  </div>
  <div className="wshExploreChapters"><div><b>There’s more to your journey</b><p>These five areas are questions worth exploring, not a checklist of products to buy. We have some information; the rest is simply not yet understood.</p></div>
   <div className="wshSnapshotChapters">{map.chapters.map(ch=><button type="button" key={ch.id} onClick={()=>onExplore(ch.id)} className={ch.known?'isKnown':'isOpen'} aria-label={'Explore '+ch.title+' · '+(ch.known?'Some information recorded':'Not yet reviewed')}><span className="wshChapterIcon">{ch.icon}</span><span><b>{ch.title}</b><small>{ch.known?'We have some information':'Not yet reviewed'}</small></span><span aria-hidden="true">↗</span></button>)}</div>
  </div>
  <div className="wshJourneyFoot"><span>{openCount} areas without enough information to assess · Not a score</span><button type="button" onClick={onExploreMoments}>See the moments that make your story personal →</button></div>
 </section>
}
export function StoryGuide({story,onNavigate}){
 const [open,setOpen]=useState(false)
 const [selected,setSelected]=useState(null)
 const result=selected?guideResponse(story,selected):null
 function ask(id){setSelected(id)}
 return <div className={'wshGuide '+(open?'wshGuideOpen':'')} aria-label="Personalised Wealth Story guide">
   {open&&<section className="wshChatPanel" aria-label="Story guide conversation">
    <header><div><span className="wshChatOrb">✦</span><span><b>Your Wealth Story guide</b><small>Scripted educational preview · Not a live adviser</small></span></div><button type="button" onClick={()=>setOpen(false)} aria-label="Close story guide">×</button></header>
    <div className="wshChatBody" aria-live="polite"><div className="wshChatBubble">Hi {story.person.name}, I can help you understand your story, explore wealth journey chapters or find the proposed human-support section. What would you like to explore?</div>
    {result&&<><div className="wshChatUser">{GUIDE_PROMPTS.find(x=>x.id===selected)?.label}</div><div className="wshChatBubble"><b>{result.title}</b><p>{result.text}</p>{result.action&&<button type="button" onClick={()=>onNavigate(result.action)}>Show me this section →</button>}</div></>}</div>
    <div className="wshChatPrompts">{GUIDE_PROMPTS.map(p=><button type="button" key={p.id} onClick={()=>ask(p.id)} aria-pressed={selected===p.id}>{p.label}</button>)}</div>
    <footer>Fictional customer data · No chat message is transmitted or saved · No advice or RM contact created</footer>
   </section>}
   <button type="button" className="wshChatLauncher" onClick={()=>setOpen(x=>!x)} aria-expanded={open} aria-label={open?'Close personalised wealth story guide':'Ask your Wealth Story guide'}><span>✦</span><span>{open?'Close guide':'Ask about my story'}</span></button>
  </div>
}
function Portrait(){return <svg className="wshPortrait" viewBox="0 0 112 112" role="img" aria-label="Illustrative staff portrait silhouette, not an actual relationship manager" xmlns="http://www.w3.org/2000/svg"><rect width="112" height="112" rx="16" fill="#E7F7F5"/><circle cx="56" cy="43" r="19" fill="#D3AB8D"/><path d="M35 42c0-20 12-29 26-27 12 2 18 13 16 30-5-5-7-11-9-18-7 8-17 10-33 15Z" fill="#224E49"/><path d="M17 112c0-29 16-46 39-46s39 17 39 46Z" fill="#09877B"/><path d="m45 70 11 17 11-17" fill="#FFF"/></svg>}
export function RMContactCard({story}){
 const [open,setOpen]=useState(false)
 return <section className="wshRM" id="wealth-story-contact">
  <div className="wshRMHeading"><span className="srEyebrow">A HUMAN CONNECTION</span><span className="wshDemoLabel">Illustrative service concept</span></div>
  <div className="wshRMTop"><Portrait/><div><h3>Geojit servicing team</h3><p>Here to support your wealth creation journey</p><small>Assigned RM: Not verified in this demo</small></div></div>
  <div className="wshRMContacts"><div><span>Direct RM phone</span><b>Not connected</b></div><div><span>Direct RM email</span><b>Not connected</b></div><div><span>Branch / team</span><b>Pending CRM verification</b></div></div>
  <button type="button" className="wshRMAction" onClick={()=>setOpen(x=>!x)} aria-expanded={open}>{open?'Hide how support would work −':'Explore speaking to Geojit →'}</button>
  {open&&<div className="wshRMDisclosure"><b>What production integration would enable</b><p>Show the customer's confirmed RM name, authentic photo, current telephone number, email, branch and working hours. Without an assigned RM, direct the customer to an approved support channel.</p><small>This prototype does not place calls, send messages, book appointments or create service requests.</small></div>}
 </section>
}
