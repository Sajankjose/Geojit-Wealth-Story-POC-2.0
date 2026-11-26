// Scripted, transparent POC answers grounded in the selected fictional Wealth Story.
// This is not a live AI model, advice, appointment booking or CRM interface.
import {illustrativeMapForStory,productRelationship,relationshipLabel} from './illustrativeWealthMap.js'
export const GUIDE_PROMPTS=[
 {id:'summary',label:'Explain my story'},
 {id:'chapters',label:'What can I explore next?'},
 {id:'products',label:'Which products are not subscribed?'},
 {id:'goals',label:'Help with a goal'},
 {id:'rm',label:'How can I reach my RM?'}
]
export function guideResponse(story,intent){
 if(!story?.synthetic)return null
 const map=illustrativeMapForStory(story)
 const name=story.person.name
 const safe={intent,live:false,advice:false,contactCreated:false,source:'Fictional review scenario'}
 if(intent==='summary'){
  if(story.service)return {...safe,title:name+' · Your story this week',text:'Your fictional statement request is in progress as of 20 November 2026. The next update is not confirmed. It is more helpful to follow up on that question than to introduce unrelated financial products.'}
  if(story.person.role==='new')return {...safe,title:name+' · Your starting point',text:'There are no confirmed holdings or goals in this new-account scenario. You can start by choosing a topic, then explore its place in the wider wealth creation journey.'}
  if(story.person.role==='goal')return {...safe,title:name+' · A goal-led story',text:'A ₹15,00,000 retirement target is explicitly declared in this fictional record. Its ₹9,68,000 investment value cannot be assumed to be assigned to that goal. You can try a separate zero-growth savings illustration.'}
  return {...safe,title:name+' · Your investment story',text:'The fictional Geojit holdings total '+story.model.valuation+'. The latest week included a net contribution of '+story.model.weekly_net_flow+'. Contributions and valuation movement are different; this does not establish overall wealth or investment suitability.'}
 }
 if(intent==='chapters')return {...safe,title:'Your next wealth journey chapter',text:'Your current story highlights '+map.chapters.find(x=>x.id===map.active).title.toLowerCase()+'. The five optional chapters cover financial foundations, protection, growing wealth, life goals and review. They are places to learn—not scores or required product purchases.',action:'map'}
 if(intent==='products'){
  if(map.serviceFirst)return {...safe,title:'Service comes first',text:'Your fictional service request remains in progress. Optional product-discovery prompts are withheld in this scenario. We can focus on understanding the outstanding request.'}
  const growth=['mf','smartfolios','bonds'].map(id=>({id,state:productRelationship(story.client_id,id)}))
  const known=growth.filter(x=>x.state==='not_subscribed')
  const phrase=known.length?known.map(x=>({mf:'mutual funds',smartfolios:'Smartfolios',bonds:'bonds'}[x.id])).join(' and ')+' are marked not subscribed in this fictional Geojit-only register. ':'No non-subscriptions are explicitly verified in this fictional register. '
  return {...safe,title:'Options you could explore',text:phrase+'An unknown status is not the same as not subscribed. You do not need to hold every product to pursue wealth creation; explore only topics that are relevant to your own interests.',action:'map'}
 }
 if(intent==='goals')return {...safe,title:'Explore a goal at your pace',text:story.model?.goal?'A fictional retirement goal has been declared, but the account does not establish which investments are earmarked for it. Adjust the goal amount, time and monthly savings in the map’s goal illustration.':'Choose your own target and timeline in the map’s goal calculator. The illustrative arithmetic assumes 0% growth and is not a recommended financial plan.',action:'map'}
 if(intent==='rm')return {...safe,title:'Your human support connection',text:'No individual relationship manager or direct contact has been verified for this synthetic customer. The contact card shows an illustrative servicing-team portrait and a future interaction design. No call, message or callback is created.',action:'contact'}
 return {...safe,title:'A guided learning experience',text:'You can explore the map chapters, see which data points support this fictional story, or ask how the figures were calculated. This is a scripted educational demo.'}
}
