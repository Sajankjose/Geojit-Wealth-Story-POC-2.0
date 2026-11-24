// POC 3.2: completely synthetic newly-onboarded client lifecycle.
// The scenario deliberately does not reuse any seeded holdings or POC 2.7.2 valuations.
export const LIFECYCLE_PHASES=[
 {id:'new',label:'Just joined',moment:'Day 1',summary:'No holdings, no transactions, no declared goal'},
 {id:'learning',label:'Exploring',moment:'Week 1',summary:'Customer voluntarily explores education'},
 {id:'goal',label:'Goal defined',moment:'Weeks 2–4',summary:'Customer explicitly chooses a hypothetical goal'},
 {id:'invested',label:'Investment started',moment:'Month 2+',summary:'A new fictional investment event is recorded'}
];
export const STARTING_CHOICES=[
 {id:'goal',label:'Plan for something important',description:'Start with a personal goal and explore useful assumptions'},
 {id:'investing',label:'Understand investing',description:'Learn about risk, return, saving and investing'},
 {id:'habits',label:'Build everyday money habits',description:'Explore financial flexibility and saving habits'},
 {id:'unsure',label:'Help me find a starting point',description:'Discover basic financial concepts at your pace'}
];
export const FIRST_ACTIONS={
 goal:{title:'Choose a goal you care about',why:'Defining a goal is a useful first step before exploring possible approaches.',learning:'A goal usually has a target and time horizon. You control both; the app cannot judge suitability.'},
 investing:{title:'Understand saving and investing',why:'Knowing how investment risk differs from predictable savings can help you ask better questions.',learning:'The value of investments can move up or down. Investing and saving are not interchangeable, and there is no one product suitable for everyone.'},
 habits:{title:'Explore financial flexibility',why:'Understanding accessible savings and regular expenses can help you think about financial resilience.',learning:'Liquidity and emergency reserves can be important considerations. No gap can be inferred from a new Geojit account.'},
 unsure:{title:'Begin with your financial questions',why:'There is no need to choose a product or goal before learning.',learning:'A financial journey can begin with understanding what you know, what remains unknown, and the choices available.'}
};
const INR=new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0});
export function newClientState(){
 return {version:'new_client_lifecycle_v3_2',stage:'new',selected:'unsure',completed:[],
  declaredGoal:null,illustrativeInvestment:false,edition:'none',lastAction:null};
}
export function sanitiseLifecycle(raw){
 const base=newClientState();
 if(!raw||raw.version!==base.version)return base;
 const validPhase=LIFECYCLE_PHASES.some(p=>p.id===raw.stage)?raw.stage:'new';
 const validChoice=STARTING_CHOICES.some(p=>p.id===raw.selected)?raw.selected:'unsure';
 const goal=raw.declaredGoal;
 const safeGoal=goal&&typeof goal.label==='string'&&goal.label.trim().length>0&&
   Number.isFinite(goal.target)&&goal.target>=10000&&goal.target<=50000000&&
   Number.isInteger(goal.years)&&goal.years>=1&&goal.years<=40
   ?{label:goal.label.slice(0,60),target:goal.target,years:goal.years}:null;
 return {...base,stage:validPhase,selected:validChoice,
  completed:[...new Set(Array.isArray(raw.completed)?raw.completed.filter(x=>['learn','goal_review','financial_picture'].includes(x)):[])],
  declaredGoal:safeGoal,illustrativeInvestment:raw.illustrativeInvestment===true&&validPhase==='invested',
  edition:['none','beginner','goal','activity'].includes(raw.edition)?raw.edition:'none'};
}
export function lifecycleSnapshot(raw){
 const s=sanitiseLifecycle(raw);
 const phase=LIFECYCLE_PHASES.find(p=>p.id===s.stage);
 const hasInvestment=s.illustrativeInvestment&&s.stage==='invested';
 // All values below are clearly labelled invented scenario fixtures, NOT an
 // account query, current NAV, brokerage event, performance or recommendation.
 const fictionalInvestment=hasInvestment?{type:'Fictional mutual fund contribution',
  amount:3000,display:INR.format(3000),as_of:'Simulated milestone',
  return_available:false,source:'MANAGEMENT_SCENARIO_ONLY'}:null;
 const learning=FIRST_ACTIONS[s.selected];
 const items=[
  {id:'learn',title:learning.title,why:learning.why,kind:'Learn',active:true},
  {id:'goal_review',title:s.declaredGoal?'Review the assumptions for your chosen goal':'Choose a goal if you wish',
   why:'You decide whether to set a goal. A missing goal is not a financial shortfall.',kind:'Explore',active:true},
  {id:'financial_picture',title:hasInvestment?'Understand your first recorded contribution':'Understand what is known and unknown',
   why:hasInvestment?'A contribution changes the account picture, but it does not prove investment growth or goal progress.':'An empty Geojit investment account is not an empty financial life.',kind:'Review',active:true}
 ];
 const title=s.stage==='new'?'Your journey begins with understanding.':
  s.stage==='learning'?'You have taken a step toward financial clarity.':
  s.stage==='goal'?'A goal gives your questions a clearer shape.':
  'Your first contribution adds a new chapter.';
 const story=s.stage==='new'?
  'There is no investment performance to report yet. Today, you can choose one subject to understand better. You set the pace.':
  s.stage==='learning'?'You have explored a financial concept you chose. The next useful step is deciding whether a financial goal matters to you—not selecting a product.':
  s.stage==='goal'?'You have chosen a fictional goal for this demonstration. Its target and horizon are assumptions you can revisit; no investment has been assessed as suitable.':
  'The fictional account now contains a contribution. It is worth understanding how contributions and changes in market value differ; a single contribution does not establish returns.';
 return {phase,hasInvestment,fictionalInvestment,title,story,items,
  next:items.find(i=>!s.completed.includes(i.id))||null,
  educationalProgress:s.completed.length,
  goal:s.declaredGoal,
  limitation:'All lifecycle events are manually simulated and never taken from an actual customer or market data feed.'};
}
export function advanceLifecycle(raw,next){
 const s=sanitiseLifecycle(raw);
 const idx=LIFECYCLE_PHASES.findIndex(x=>x.id===s.stage);
 const target=LIFECYCLE_PHASES.findIndex(x=>x.id===next);
 if(target<0)return s;
 // management may replay and compare all phases; moving backward removes
 // investment and goal data which should not appear in an earlier phase.
 return {...s,stage:next,illustrativeInvestment:target===3,
  declaredGoal:target>=2?s.declaredGoal:null,
  completed:target<idx?[]:s.completed,
  edition:target===3?'activity':target===2?'goal':target===1?'beginner':'none'};
}
