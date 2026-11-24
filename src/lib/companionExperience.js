// POC 3.3 — one educational experience engine for new and established clients.
// Source of truth: customer-selected topics + explicit lifecycle facts.
// Never use missing products as a diagnosis, calculate wealth progress from
// learning actions, or manufacture an authorised recommendation.
import {createLearningRoadmap,sanitiseCompanion} from './wealthCompanion.js'
import {sanitiseLifecycle,lifecycleSnapshot} from './newClientLifecycle.js'
export const EXPERIENCE_VERSION='experience_engine_v3_3'
const TOPIC_FOR={goal:'goals',investing:'understand',habits:'foundation',unsure:'review'}
export function composeExperience({kind='existing',profile,lifecycle,portfolioAvailable=false,approvedStoryAvailable=false}={}){
 if(kind==='new'){
  const l=sanitiseLifecycle(lifecycle),snap=lifecycleSnapshot(l)
  const topics=[TOPIC_FOR[l.selected]]
  const educational={version:'companion_v3_0',started:true,focus:topics,cadence:'on_demand',plan:'essential',reminders:false,decisions:{}}
  const action=createLearningRoadmap(educational)
  const hasActualGoal=!!l.declaredGoal
  // Use the same canonical roadmap rule set as existing accounts; the new
  // customer view adds stage-specific explanations and a verified-unknown state.
  const roadmap=action.map(x=>({...x,source:'explicit_new_customer_choice',status:'educational'}))
  return {version:EXPERIENCE_VERSION,kind:'new',stage:l.stage,topics,
    title:snap.title,story:snap.story,roadmap,
    next:roadmap.find(x=>x.state==='suggested')||null,
    insight:snap,financialPicture:!!snap.hasInvestment,
    portfolioPerformanceAvailable:false,declaredGoal:hasActualGoal,
    reason:'Your chosen area of interest, not a missing product or inferred financial need.',
    storyStatus:'Illustrative editorial chapter — not AI-generated or published',
    recommendedProduct:null,externalAccountData:false}
 }
 const p=sanitiseCompanion(profile),roadmap=createLearningRoadmap(p)
 return {version:EXPERIENCE_VERSION,kind:'existing',stage:'relationship',topics:p.focus,
  title:'Understand your financial journey with clarity.',
  story:'Your Wealth Story combines approved, context-aware insights with optional next steps.',
  roadmap:roadmap.map(x=>({...x,source:'explicit_companion_choice',status:'educational'})),
  next:roadmap.find(x=>x.state==='suggested')||null,
  financialPicture:portfolioAvailable,
  portfolioPerformanceAvailable:portfolioAvailable,declaredGoal:false,
  reason:'Selected priorities and limited in-scope data. No outside assets or needs inferred.',
  storyStatus:approvedStoryAvailable?'Approved fictional edition available':'No approved edition available',
  recommendedProduct:null,externalAccountData:false}
}
export function valueSignals({journey,events=[],currentVisit=false}={}){
 const safe=Array.isArray(events)?events.filter(x=>x&&typeof x==='object'&&['learning_explored','roadmap_revisited','story_read','scenario_explored','question_clarified'].includes(x.type)):[]
 const unique=(type)=>safe.filter(x=>x.type===type).length
 return {version:'customer_value_v3_3',
  learningActions:unique('learning_explored'),revisited:unique('roadmap_revisited'),
  approvedStoryReads:unique('story_read'),goalScenarios:unique('scenario_explored'),
  clarifiedQuestions:unique('question_clarified'),
  currentVisit:!!currentVisit,customerReportedUsefulness:null,
  needsValidation:true,commercialLeads:0,
  explanation:'Activity counts demonstrate demo interactions, not wealth creation, retained customers, learning outcomes, investment advice or sales.',
  stage:journey?.stage||'unknown'}
}
export function recordValueEvent(events,type,at){
 const allowed=['learning_explored','roadmap_revisited','story_read','scenario_explored','question_clarified']
 if(!allowed.includes(type))return events
 return [...(events||[]),{type,at:typeof at==='string'?at:'synthetic-session'}].slice(-100)
}
