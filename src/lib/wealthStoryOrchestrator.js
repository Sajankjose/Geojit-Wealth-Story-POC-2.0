// Wealth Story 3.8: deterministic, evidence-aware editorial orchestration.
// Portfolio metrics MUST come from wealthIntelligence fixture calculations.
// Service and human-touchpoint records below are separately invented examples
// for the fictional C008 persona. No claim of an actual CRM or RM connection.
import {fixtureIntelligence,fictionalFinancialInput,DEMO_AS_OF} from './wealthIntelligence.js'
import {rupees} from './mobileWealthStory.js'

export const STORY_PEOPLE=[
 {id:'C012',name:'Thomas',label:'Thomas · Portfolio perspective',description:'Understand contributions and financial movement',role:'investor'},
 {id:'C014',name:'George',label:'George · Goal exploration',description:'Connect an explicitly stated goal to learning',role:'goal'},
 {id:'C008',name:'Meera',label:'Meera · Service continuity',description:'See a fictional customer-care interaction followed through',role:'service'},
 {id:'C001',name:'Arun',label:'Arun · New customer',description:'Begin with questions instead of fabricated portfolio insights',role:'new'}
]

export const SERVICE_DEMO={
 client_id:'C008',synthetic:true,as_of:'2026-11-20',
 case_reference:'DEMO-SVC-008',category:'Investment statement request',
 opened_at:'2026-11-18',status:'In progress',last_update:'2026-11-20',
 update_text:'The fictional service team has acknowledged the statement request. The next update has not been confirmed.',
 next_update:null,
 note:'Invented case for service-design demonstration; not connected to D365 CRM, a ticketing system or a real customer.',
 contact:{assigned:false,team:'Geojit customer service',contact_verified:false,
  message:'A dedicated RM assignment cannot be verified. The correct servicing contact should appear here when sourced from an approved CRM system.'}
}

function findPerson(clientId){return STORY_PEOPLE.find(p=>p.id===clientId)||null}
export function composeWealthStory(clientId){
 const person=findPerson(clientId)
 if(!person)return null
 const isNew=person.role==='new'
 // The C001 financial fixture is not used: this narrative explicitly represents
 // a new customer with no confirmed holdings in the scenario.
 const model=isNew?null:fixtureIntelligence(clientId)
 const raw=isNew?null:fictionalFinancialInput(clientId)
 if(!isNew&&(!model||!raw||!model.synthetic||!raw.synthetic))return null
 const service=person.role==='service'?SERVICE_DEMO:null
 const base={
  version:'wealth_story_v3_8',synthetic:true,client_id:clientId,
  person,as_of:DEMO_AS_OF,model,service,
  verified_assigned_rm:false,can_submit_service_request:false,
  source_scope:isNew?'New customer scenario; no in-scope financial records verified':
   'Existing synthetic holdings/valuation fixture, not a live data-lake record',
  preview_only:true,
  contact:{name:null,role:'Customer service team',verified:false,
   description:'The assigned relationship manager and direct contact have not been verified. No live contact request is sent from this POC.'}
 }
 if(person.role==='investor'){
  const flow=raw.external_net_flows.at(-1)
  const prior=raw.valuations.at(-2)
  const now=raw.valuations.at(-1)
  const movement=now-prior-flow
  return {...base,headline:'Your money moved. Here is what actually changed.',
   intro:'One clear look at the investments visible to Geojit, what changed, and an insight worth understanding.',
   signal:{type:'money',eyebrow:'SOMETHING YOU MAY NOT HAVE NOTICED',
    headline:rupees(flow)+' was added to this fictional portfolio this week.',
    description:'That is separate from the '+rupees(movement)+' change in value after accounting for net cash flow. A deposit is not an investment gain.',
    evidence:['C012 fictional weekly valuations: '+rupees(prior)+' → '+rupees(now),
     'C012 recorded net weekly contribution: '+rupees(flow),'Valuation change excluding contributions: '+rupees(movement)],
    source:'Synthetic C012 valuations and external-net-flow fixture · '+DEMO_AS_OF},
   next:{label:'Understand contributions versus market movement',topic:'movement',
    reason:'Your recorded week includes both a contribution and a valuation change. A short explanation can separate the two.',
    cta:'See how the numbers fit together',product:false},
   content:{title:'When your portfolio value rises, what does it really mean?',
    body:'A portfolio value reflects both changes in investment value and any money you added or withdrew. Understanding that difference gives a clearer perspective than a single headline return.',
    action:'Explore the weekly breakdown'}
  }
 }
 if(person.role==='goal'){
  const goal=model.goal
  if(!goal)return null
  return {...base,headline:'Your goal deserves more than a target number.',
   intro:'Your fictional declared goal gives this story a direction. We can explore it without assuming every investment is set aside for that goal.',
   signal:{type:'goal',eyebrow:'YOUR GOAL, WITH THE RIGHT CONTEXT',
    headline:goal.label+' · '+rupees(goal.target)+' illustrative target',
    description:'This fictional account also records '+model.valuation+' in holdings. But the records do not show how much, if any, is assigned to your retirement goal.',
    evidence:['C014 declared fictional goal: '+goal.label+' · '+rupees(goal.target),
      'C014 recorded holdings: '+model.valuation,'No goal-to-holding earmarking is supplied'],
    source:'Synthetic C014 declared-goal and valuation fixtures · '+DEMO_AS_OF},
   next:{label:'Explore a retirement goal with your own assumptions',topic:'goal',
    reason:'You explicitly declared retirement planning in the fictional scenario. The calculator does not assume your recorded investments fund that goal.',
    cta:'Try an adjustable goal scenario',product:false},
   content:{title:'A goal becomes clearer when the assumptions are visible.',
    body:'Choosing a target and time horizon can help you understand savings arithmetic. Your actual need depends on many personal details not established here.',
    action:'Explore a savings scenario'}
  }
 }
 if(person.role==='service'){
  return {...base,headline:'We remember the question, not just the investments.',
   intro:'A good Wealth Story should also reflect your experience with Geojit. Here is a fictional example of a service conversation carried into the next chapter.',
   signal:{type:'service',eyebrow:'YOUR SERVICE STORY',
    headline:'Your statement request is recorded as in progress.',
    description:'The fictional support team acknowledged the request. The available record does not confirm a completion date or a next-update commitment.',
    evidence:['Case '+service.case_reference+' opened 18 November 2026',
      'Status in demo fixture: '+service.status+' as of '+service.last_update,
      'No confirmed next-update date or assigned RM contact'],
    source:'Separately invented POC 3.8 service case · not live CRM data'},
   next:{label:'Review your service request and tell us if you still need help',topic:'service',
    reason:'A service request is still marked in progress in the invented case. Service continuity takes priority over unrelated promotional content.',
    cta:'Review service context',product:false},
   content:{title:'A service update can matter more than another investment tip.',
    body:'When a customer has an unresolved request, the story can make the status easier to find, acknowledge uncertainty and offer an appropriate servicing route.',
    action:'Explore follow-up options'}
  }
 }
 return {...base,headline:'Your story begins with what matters to you.',
  intro:'No holdings or goals are confirmed in this fictional new-customer scenario. We can begin with your questions, not an assumed investment need.',
  signal:{type:'new',eyebrow:'YOUR STARTING POINT',
   headline:'No investments recorded here. No assumptions about your financial life.',
   description:'This is only a new-account scenario. Holdings, income, savings, family responsibilities and investments elsewhere are unknown.',
   evidence:['Illustrative fictional new-account status','No confirmed in-scope holdings or declared goals'],
   source:'New-client POC scenario; no financial data or inferred needs'},
  next:{label:'Choose a question to explore',topic:'learning',
   reason:'You have no confirmed financial goal or investment activity in this scenario. You choose the subject.',
   cta:'Start with a topic that matters to me',product:false},
  content:{title:'Start with a question. Discover at your pace.',
   body:'Explore financial flexibility, investment basics, goals or protection as education—without buying anything or assuming something is missing.',
   action:'Choose a learning topic'}
 }
}
export function storyInsightOrder(story){
 if(!story)return []
 if(story.service?.status==='In progress')return ['service','next','financial','contact','feedback']
 if(story.person.role==='new')return ['insight','next','learning','contact','feedback']
 return ['financial','insight','next','contact','feedback']
}
export const STORY_TOPICS=[
 {id:'investments',label:'Understand my investments'},
 {id:'goals',label:'Plan a goal I choose'},
 {id:'markets',label:'Understand market developments'},
 {id:'service',label:'Account and service updates'}
]
export function storyPreference(id){
 return STORY_TOPICS.some(x=>x.id===id)?id:'investments'
}
