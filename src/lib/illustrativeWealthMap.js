// Wealth Story POC 3.9 — illustrative discovery map. Curiosity ≠ diagnosis.
// The five dimensions are general financial education, NOT missing products,
// personalised financial gaps, lead scores, wealth completion or advice.
export const MAP_CHAPTERS=[
 {id:'foundation',step:'01',icon:'◈',title:'Financial foundation',short:'How flexible is your financial life?',color:'teal',
  question:'What helps you stay financially flexible when plans change?',
  body:'Accessible reserves and everyday liquidity can matter before selecting investments. The demo has no evidence of the customer's cash holdings or emergency savings.',
  learn:'Explore a simple emergency-reserve checklist',
  products:[{id:'banking',name:'Cash and liquidity basics',description:'Understand how accessibility, risk and time horizon affect where money is held. No product or amount is prescribed.'}]},
 {id:'protection',step:'02',icon:'◇',title:'Protection',short:'What deserves protection?',color:'coral',
  question:'Which existing arrangements would you want to understand better?',
  body:'Insurance and other protection decisions depend on responsibilities and cover already in place. Neither has been assessed in this fictional story.',
  learn:'Understand the questions behind protection planning',
  products:[{id:'insurance',name:'Insurance education',description:'Explore types of cover, exclusions and terminology before any suitability conversation.'}]},
 {id:'growth',step:'03',icon:'↗',title:'Growing wealth',short:'Look beyond one investment type',color:'blue',
  question:'How do different investment approaches fit together?',
  body:'The story can show recorded equity or mutual fund holdings, but cannot infer that another product is needed. Explore the options if they interest you.',
  learn:'Learn how allocation and investment types differ',
  products:[{id:'mf',name:'Mutual funds',description:'Understand pooled investments, diversification, costs and risks.'},{id:'smartfolios',name:'Smartfolios',description:'Learn what curated stock baskets are and how concentration and equity risks work. Eligibility and suitability are not assessed.'},{id:'bonds',name:'Bonds and fixed income',description:'Understand issuer, duration, interest-rate and liquidity risks.'}]},
 {id:'goals',step:'04',icon:'◎',title:'Life goals',short:'Give tomorrow a clearer shape',color:'gold',
  question:'What future milestone would you choose to explore?',
  body:'A customer-declared goal can be mapped using assumptions the customer controls. A portfolio is not automatically earmarked for that goal.',
  learn:'Try a goal scenario with adjustable assumptions',
  products:[{id:'sip',name:'Systematic investing education',description:'See how regular contributions work, including risks and limits of return assumptions.'}]},
 {id:'review',step:'05',icon:'◉',title:'Review and adapt',short:'Keep your journey evolving',color:'lavender',
  question:'What would be useful to understand at your next review?',
  body:'Financial circumstances and choices change. A periodic review is an option, not a mandatory financial action or an invitation to trade.',
  learn:'Explore a self-directed review checklist',
  products:[{id:'review',name:'Understanding portfolio reviews',description:'Learn what an authorised financial review may consider and when professional advice may be appropriate.'}]}
]
export function illustrativeMapForStory(story){
 if(!story||story.synthetic!==true)return null
 const role=story.person?.role
 const active=role==='goal'?'goals':role==='investor'?'growth':role==='service'?'review':'foundation'
 return {
  version:'illustrative_wealth_map_3_9',synthetic:true,active,
  hasVerifiedGoal:!!story.model?.goal&&role==='goal',
  hasPortfolio:!!story.model&&role!=='new',
  serviceFirst:!!story.service&&story.service.status==='In progress',
  chapters:MAP_CHAPTERS.map(x=>({...x,
   evidence:x.id==='goals'&&role==='goal'?'Goal explicitly declared in this fictional account':x.id==='growth'&&story.model&&role!=='new'?'Investments recorded in fictional Geojit account':'Open to explore · Not assessed',
   known:x.id==='goals'&&role==='goal'||x.id==='growth'&&story.model&&role!=='new'}))
 }
}
export function mayShowOptionalProductDiscovery(map,userOpened=false){
 return !!map&&!map.serviceFirst&&userOpened===true
}
