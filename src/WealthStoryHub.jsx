import React,{useState} from 'react'
import {GUIDE_PROMPTS,guideResponse} from './lib/wealthStoryGuide.js'
import {illustrativeMapForStory} from './lib/illustrativeWealthMap.js'
import './wealth-story-hub.css'
export function WealthJourneySnapshot({story,onExplore}){
 const map=illustrativeMapForStory(story)
 const evidenced=map.chapters.filter(x=>x.known).length
 const unknown=map.chapters.length-evidenced
 return <section className="wshSnapshot" aria-label="Your wealth journey snapshot">
  <div className="wshSnapshotIntro"><span className="srEyebrow">YOUR WEALTH CREATION JOURNEY</span><h2>Every chapter you understand moves your story forward.</h2><p>Here's what this fictional Geojit record can show—and what you can still explore at your own pace.</p></div>
  <div className="wshSnapshotStats"><div><strong>{evidenced}</strong><span>Chapters with known context</span></div><div><strong>{unknown}</strong><span>Open to understand</span></div></div>
  <div className="wshSnapshotChapters">{map.chapters.map(ch=><button type="button" key={ch.id} onClick={()=>onExplore(ch.id)} className={ch.known?'isKnown':'isOpen'}><span className="wshChapterIcon">{ch.icon}</span><span><b>{ch.title}</b><small>{ch.known?'Recorded context':'Open for exploration'}</small></span><span aria-hidden="true">↗</span></button>)}</div>
  <p className="wshSnapshotNote">This is a visibility snapshot, not an actual wealth-progress score. Unknown chapters do not mean missing cover, financial deficiencies, or required investments.</p>
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
