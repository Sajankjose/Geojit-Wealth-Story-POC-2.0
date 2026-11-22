// POC 2.7.3 — Genuine Guidance Gate and client-controlled goal scenarios.
// All client data are fictional. No outcome is personal advice or a product recommendation.
export const MAP_AREAS=[
 {id:'foundation',title:'Financial foundation',summary:'Emergency reserves, liquidity and everyday financial flexibility',question:'Do I have enough flexibility for unexpected needs?',icon:'◇'},
 {id:'protection',title:'Financial protection',summary:'Understand protection and existing arrangements',question:'Have I considered what should be protected?',icon:'♧'},
 {id:'growth',title:'Growing wealth',summary:'Investing habits, allocation and financial perspective',question:'How do my investments fit together?',icon:'↗'},
 {id:'goals',title:'Life goals',summary:'Make personal milestones clearer through adjustable planning',question:'What might it take to reach a goal I choose?',icon:'◎'},
 {id:'review',title:'Review and adapt',summary:'Keep decisions aligned with evolving circumstances',question:'When is it useful to review my overall picture?',icon:'◌'}
];
export const GUIDANCE={
 foundation:{headline:'Begin with financial flexibility',body:'An emergency reserve can support flexibility when plans change. Consider what may be accessible without depending on market movements.',next:'Explore how to review an emergency reserve.',options:[]},
 protection:{headline:'Understand protection before choosing anything',body:'Protection depends on your responsibilities and existing arrangements, which are not established by Geojit product subscriptions.',next:'Explore what to consider when reviewing existing cover.',options:[{id:'insurance',title:'Insurance information',purpose:'Understand types of cover, exclusions and existing protection; no need has been established.'}]},
 growth:{headline:'See how your investments work together',body:'Investment types can serve different purposes. Understanding allocation, risk and time horizons may help you evaluate your overall picture.',next:'Explore your investment mix and available education.',options:[{id:'mf',title:'Mutual fund education',purpose:'Understand systematic investing and diversification, including risks.'},{id:'smartfolios',title:'Smartfolios information',purpose:'Learn how curated baskets work and which risks and eligibility conditions apply.'}]},
 goals:{headline:'Put a number around a goal you choose',body:'Use your own target, time horizon and assumptions to explore a possible monthly contribution—not an investment prescription.',next:'Adjust a planning scenario with clear assumptions.',options:[{id:'mf',title:'SIP and mutual fund education',purpose:'Understand regular contributions, market risks and alternative saving approaches.'}]},
 review:{headline:'A wider picture can be useful',body:'A periodic review helps make account coverage, goals and assumptions explicit without assuming a gap or a need to buy.',next:'Explore a portfolio review or a conversation if you wish.',options:[{id:'pms',title:'Portfolio Management Services information',purpose:'General information only; eligibility, risk and suitability are not established.'}]}
};
const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
export function calculateGoalScenario({target=1500000,current=0,years=15,annualRate=0.04}={}){
 if(![target,current,years,annualRate].every(Number.isFinite)||target<=0||current<0||years<1||years>40||annualRate<0||annualRate>0.12)return null;
 const months=Math.round(years*12),r=Math.pow(1+annualRate,1/12)-1;
 const currentAtEnd=current*Math.pow(1+r,months);
 const needed=Math.max(0,target-currentAtEnd);
 const factor=Math.abs(r)<1e-12?months:(Math.pow(1+r,months)-1)/r;
 const monthly=needed/factor;
 return {target,current,years,annualRate,months,monthly:Math.ceil(monthly),currentProjected:Math.round(currentAtEnd),
  totalContributed:Math.ceil(monthly)*months,unfunded:needed>0,
  caveat:'Illustrative end-of-month contributions, constant nominal scenario rate, no taxes/fees/inflation adjustment. Returns are not guaranteed and this is not a product recommendation.'};
}
export function dimensionState(area,clientId,explicitGoal){
 if(area==='growth')return {state:'Known in Geojit',detail:'A limited fictional investment snapshot exists; investments elsewhere may be unknown.'};
 if(area==='goals'&&explicitGoal)return {state:'Declared in demo',detail:'A fictional explicitly declared goal is available; assumptions remain adjustable.'};
 if(area==='review')return {state:'Available to explore',detail:'A periodic review is an option, not a required financial action.'};
 return {state:'Not assessed',detail:'No conclusion can be drawn about your overall preparedness from a missing Geojit record.'};
}
export function evaluateGenuineGuidance({area,customerAsked=false,requestedProductInfo=false,serviceFirst=false,customerDeclined=false,knownNeed=false}={}){
 const evidence=MAP_AREAS.some(x=>x.id===area);
 const checks=[
  {id:'customer_value',pass:evidence,detail:'A clear educational question and benefit must exist.'},
  {id:'customer_control',pass:customerAsked&&!customerDeclined,detail:'The customer must choose to explore this topic.'},
  {id:'service_first',pass:!serviceFirst,detail:'Open service matters take priority over optional product discovery.'},
  {id:'commercial_neutrality',pass:evidence,detail:'Equivalent guidance remains available without buying anything.'},
  {id:'need_not_assumed',pass:!requestedProductInfo||knownNeed||customerAsked,detail:'Product information is available on request, never treated as a diagnosed gap.'}
 ];
 const allowEducation=checks.slice(0,2).every(x=>x.pass); // Service issue does not suppress neutral self-help education.
 const allowProductInformation=allowEducation&&!serviceFirst&&requestedProductInfo&&checks.every(x=>x.pass);
 return {area,allowEducation,allowProductInformation,allowFollowupDemo:allowProductInformation,
  checks,reason:!allowEducation?'No customer-initiated learning request.':serviceFirst?'Self-help guidance remains available, but optional product prompts are withheld.':allowProductInformation?'Customer-requested information only; no suitability or recommendation has been established.':'Offer learning first. No product need has been inferred.',
  noSalesRequired:true,eligibilityVerified:false,source:'POC synthetic guidance rules v2.7.3'};
}
