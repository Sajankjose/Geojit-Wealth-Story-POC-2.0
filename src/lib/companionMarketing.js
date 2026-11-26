// POC 3.5: customer-first opening insight and honest service promises.
// A "wow" moment cannot come from fabricated holdings, inferred needs, or behavioural surveillance.
import {fictionalFinancialInput} from './wealthIntelligence.js'
export const DEMO_PERSONAS=[
 {id:'new',label:'Arun · New to Geojit',description:'No investments or goals recorded in this fictional One App scenario'},
 {id:'thomas',label:'Thomas · Existing investor',description:'Fictional recorded equity and mutual fund snapshot; dated and limited'}
]
const INR=new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0});
export function openingInsight(persona='new'){
 if(persona==='thomas'){
  const data=fictionalFinancialInput('C012')
  // The numeric hook only appears if the validated synthetic fixture is present.
  if(data&&data.synthetic&&data.as_of&&Number.isFinite(data.end_equity_value)&&Number.isFinite(data.end_mf_value)){
   const total=data.end_equity_value+data.end_mf_value
   return {persona:'thomas',name:'Thomas',eyebrow:'ONE FINANCIAL PICTURE · MORE QUESTIONS WORTH EXPLORING',
    headline:'You can see what your investments are worth. But do they tell your whole story?',
    highlight:INR.format(total),highlightLabel:'in fictional Geojit holdings',
    body:'Your recorded investments include equity and mutual funds. That is a useful starting picture—not a complete view of your finances, and not an investment recommendation.',
    question:'Where do these investments fit into the future you want to build?',
    sources:'Illustrative fictional equity and MF valuation as of '+data.as_of+'. Assets outside Geojit are unknown.',
    proof:'Verified within synthetic POC fixture only',kind:'dated_fictional_facts'}
  }
 }
 return {persona:'new',name:'Arun',eyebrow:'YOUR ACCOUNT IS NEW. YOUR QUESTIONS DON’T HAVE TO WAIT.',
  headline:'Your investment journey hasn’t started here yet. Your financial future already has questions worth asking.',
  highlight:'No investments recorded',highlightLabel:'in this fictional Geojit account',
  body:'An empty account does not mean an empty financial life. We can start with what matters to you—without guessing about your income, savings, family or goals.',
  question:'What would you like your money to make possible?',
  sources:'Fictional newly opened Geojit account. No confirmed holdings, transactions or financial goal.',
  proof:'Based on the absence of in-scope fictional account records, not inferred personal needs',kind:'verified_unknowns'}
}
export const COMPANION_SERVICES=[
 {id:'roadmap',icon:'◎',name:'Your Wealth Creation Roadmap',
  promise:'A guided map of subjects and goals you choose—clear next steps you can explore at your pace.',
  availability:'Interactive educational roadmap in the POC',kind:'demo'},
 {id:'expert',icon:'◉',name:'A dedicated expert when you need one',
  promise:'A human conversation to clarify questions, explain services and help you find the right authorised channel.',
  availability:'Proposed service model · scheduling, hours, eligibility and advisory boundaries not yet approved',kind:'proposed'},
 {id:'story',icon:'◈',name:'Your continuing Wealth Story',
  promise:'Regular, insightful perspectives connecting verified financial facts, your chosen interests and useful learning.',
  availability:'Editorial POC · real cadence and publication approval pending',kind:'demo'},
 {id:'coach',icon:'◇',name:'A guiding coach, whenever you explore',
  promise:'An on-demand educational companion for questions, explanations, goal scenarios and next learning steps.',
  availability:'Scripted educational coach demonstration · not a staffed 24/7 advisory service',kind:'demo'}
]
export function servicePromise(id){
 return COMPANION_SERVICES.find(s=>s.id===id)||null
}
export function educationalCoachAnswer(topic,persona='new'){
 const answers={
  roadmap:'Your Wealth Creation Map begins with questions you choose. We can explore goals and financial concepts, but we cannot determine the right investment strategy for you here.',
  expert:'Expert support is a proposed service. This demo cannot connect you to a live expert, schedule a call or promise real-time availability. The eventual operating model needs approval.',
  story:'Your Wealth Story is designed to explain relevant, verified facts and what they might mean for understanding your journey. It is not an investment recommendation.',
  goal:'You can choose a target and timeline and explore hypothetical saving scenarios. These calculations do not prescribe how much you should invest or which securities to select.',
  investment:'We can explain how equity and mutual funds differ and the risks involved. We cannot tell you which fund or security to buy, sell or hold.',
  other:'Choose a topic and I can help you understand the concept, not prescribe an investment.'
 }
 return {answer:answers[topic]||answers.other,
  provenance:persona==='thomas'?'Education only; fictional holdings shown separately':'Education only; no investment profile established',
  live:false,advice:false,contactCreated:false}
}
