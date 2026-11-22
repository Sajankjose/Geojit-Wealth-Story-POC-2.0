// POC 2.7.1 editorial policy: helpful guidance, not behavioural surveillance.
// Synthetic POC only. All amounts shown by this module must be explicit,
// provenance-bearing, as-of-dated and verified by the source. Never ask an LLM
// to invent financial figures, aggregate holdings or interpret suitability.

const METRIC_TYPES={
 total_invested:{label:'Amount invested',unit:'currency'},
 current_value:{label:'Current value',unit:'currency'},
 equity_value:{label:'Equity value',unit:'currency'},
 mutual_fund_value:{label:'Mutual fund value',unit:'currency'},
 sip_contributions:{label:'SIP contributions',unit:'currency'},
 goal_target:{label:'Declared goal target',unit:'currency'}
};
const safeDate=value=>{if(!value)return null;let d=new Date(value);return Number.isFinite(d.getTime())?d:null};
const INR=new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0});
export function selectVerifiedFigures(rows,now=new Date()){
 const valid=[];
 for(const row of rows||[]){
  const p=row?.payload;
  if(!p||Array.isArray(p)||typeof p!=='object')continue;
  const key=p.metric_type||p.metric_key;
  const type=METRIC_TYPES[key];
  const asOf=safeDate(p.as_of||p.valuation_at);
  const amount=p.value;
  const verified=p.verified===true && p.source_verified===true;
  const geojitScope=p.scope==='geojit' || p.scope==='geojit_accounts';
  const currency=p.currency==='INR';
  if(!type||!verified||!geojitScope||!currency||
     typeof amount!=='number'||!Number.isFinite(amount)||amount<0||
     !asOf||asOf.getTime()>now.getTime()||
     now.getTime()-asOf.getTime()>30*86400000||
     !row?.record_id||!row?.source_id)continue;
  valid.push({key,label:type.label,value:amount,display:INR.format(amount),
    as_of:asOf.toISOString().slice(0,10),source_id:row.source_id,
    record_id:row.record_id,scope:'Geojit accounts only',verified:true});
 }
 // Prefer latest verified figure per metric; do not sum across records.
 const result=[];
 for(const key of Object.keys(METRIC_TYPES)){
  const record=valid.filter(x=>x.key===key).sort((a,b)=>b.as_of.localeCompare(a.as_of))[0];
  if(record)result.push(record);
 }
 return result.slice(0,3);
}
export function planStory(evidence,rows,editionType,now=new Date()){
 const figures=selectVerifiedFigures(rows,now);
 const selected=evidence?.selected||[];
 const has=d=>selected.some(x=>x.domain===d&&x.evidence_kind==='source_record');
 let angle='relationship_perspective';
 if(evidence?.service_first)angle='service_first';
 else if(editionType==='daily_trading')angle='trading_context';
 else if(has('goals_preferences')&&has('transactions'))angle='connecting_activity_and_goals';
 else if(has('transactions')&&has('product_subscriptions'))angle='investments_in_perspective';
 else if(has('goals_preferences'))angle='declared_goals';
 else if(has('transactions'))angle='investment_activity';
 else if(has('product_subscriptions'))angle='product_relationship';
 else angle='helpful_foundation';
 const guidance={
  service_first:'Prioritise clarity on the unresolved service matter; no sales or promotional next step.',
  trading_context:'No current market/research feed is connected. Provide only timeless, non-trading educational context.',
  connecting_activity_and_goals:'Help the reader consider how recorded investment activity relates to explicitly declared priorities, without claiming it already aligns.',
  investments_in_perspective:'Help the reader understand different roles of known investment types without assuming strategy or suitability.',
  declared_goals:'Reflect only an explicitly declared goal. Avoid predictions or unsupported progress claims.',
  investment_activity:'Explain one verified activity in plain language, without pretending to know why it occurred.',
  product_relationship:'Provide a helpful educational perspective about a known relationship, never imply a financial gap.',
  helpful_foundation:'Be transparent that the available data does not support a meaningful new personal insight.'
 };
 return {version:'story_framework_v2_7_1',angle,guidance:guidance[angle],
   figures,figures_available:figures.length>0,
   figure_policy:'Display only source-verified dated metrics scoped to Geojit. No LLM-generated amounts or inferred returns.',
   customer_voice:'Address the customer as you/your; avoid mentioning monitoring, tools, clicks, meetings or data collection.',
   reader_value:'One perspective that helps the customer understand their investments, and at most one useful low-pressure next step.',
   layers:['chapter','financial_picture','perspective','next_step'],
   service_first:!!evidence?.service_first};
}
const surveillance=[
 /\bwe (noticed|observed|tracked|monitored|detected)\b/i,
 /\b(you (clicked|searched|browsed|visited|engaged with|used the calculator)|your (clicks|browsing|digital activity|engagement with|tool usage))\b/i,
 /\b(our tracking|your behaviour|behavioural signals|recent meetings? with (your|the) (rm|relationship manager))\b/i,
 /\b(he|she|thomas) (has|is|recently|explores)\b/i
];
export function validateEditorialDraft(draft){
 const customerFacing=[draft?.headline,draft?.narrative,draft?.context_hint,draft?.next_step].join(' ');
 if(surveillance.some(rx=>rx.test(customerFacing)))return {
  ok:false,code:'INTRUSIVE_LANGUAGE',message:'The draft exposes behavioural monitoring or describes the customer in third person.'};
 if(/\b(guaranteed|risk.free|assured returns?|buy now|sell now|perfect for you)\b/i.test(customerFacing))
  return {ok:false,code:'UNSAFE_GUIDANCE',message:'The draft contains promotional or unsuitable financial language.'};
 if(/\b(we recommend (you|that you)|you should (buy|sell|invest))\b/i.test(customerFacing))
  return {ok:false,code:'UNSAFE_GUIDANCE',message:'The draft makes a personalised investment recommendation.'};
 if(/\b(you (want|intend|prefer|need) to (retire|trade|invest)|your risk appetite is)\b/i.test(customerFacing))
  return {ok:false,code:'INFERRED_INTENT',message:'The draft asserts an unverified goal, motivation or risk appetite.'};
 if(/\d|₹|%|https?:\/\//i.test(customerFacing))
  return {ok:false,code:'UNVERIFIED_NUMERIC_CLAIM',message:'Customer-facing AI text contains a number or URL. Financial figures must come from verified metrics.'};
 if(!draft?.narrative?.trim()||!draft?.context_hint?.trim()||!draft?.next_step?.trim())
  return {ok:false,code:'STORY_INCOMPLETE',message:'One of the editorial story layers is missing.'};
 return {ok:true};
}
