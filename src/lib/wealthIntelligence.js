// Wealth Story POC 2.7.2 — deterministic, synthetic financial intelligence.
// These are manually invented POC inputs, NEVER observed market prices, customer
// valuations, approved research, returns, or recommendations.
// Calculations remain separate from the OpenAI prose generator.
export const DEMO_AS_OF='2026-11-20';
export const METRIC_METHOD='Modified Dietz-style estimate (weekly external cash flow placed at midpoint)';
export const BENCHMARK_LABEL='Illustrative broad-equity benchmark proxy';
export const DEMO_MARKET={
 as_of:DEMO_AS_OF,verified_live:false,source:'POC fictional market fixture',
 commentary:'In this fictional week the broad-equity proxy rose modestly. That provides context, but it does not describe actual market movements or explain an individual portfolio.',
 caution:'Illustrative benchmark values are invented for demonstrating comparison methodology; these are not actual Nifty or market quotes.',
 date_labels:['09 Oct','16 Oct','23 Oct','30 Oct','06 Nov','13 Nov','20 Nov'],
 dates:['2026-10-09','2026-10-16','2026-10-23','2026-10-30','2026-11-06','2026-11-13','2026-11-20'],
 // Hypothetical index levels, deliberately NOT represented as NSE / Nifty data.
 proxy:[100.0,101.1,99.7,102.2,101.8,103.0,103.9]
};
const round2=x=>Math.round((x+Number.EPSILON)*100)/100;
const cash=x=>Math.round(x);
const pct=x=>round2(x*100);
const currency=x=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(cash(x));
const relPct=(a,b)=>Math.abs(b)<1e-12?null:round2(100*(a/b-1));
function seedHash(id){return [...id].reduce((n,c)=>(n*31+c.charCodeAt(0))>>>0,17)}
const defaultType=id=>['C008','C010','C011','C012','C016'].includes(id)?'multi':(['C002','C003','C005','C006','C014','C018'].includes(id)?'mf':'equity');
export function fictionalFinancialInput(clientId){
 const suffix=Number(String(clientId).slice(-3));
 if(!/^C\d{3}$/.test(clientId)||suffix<1||suffix>20)return null;
 const h=seedHash(clientId),type=defaultType(clientId);
 const latest=clientId==='C012'?542000:clientId==='C014'?968000:120000+(h%29)*22500;
 const equityShare=clientId==='C012'?(324000/542000):type==='mf'?0.12:type==='multi'?0.68:0.87;
 // Week-end asset-class composition and historical total values are distinct inputs.
 const eq=cash(latest*equityShare),mf=latest-eq;
 const w=[.948,.961,.955,.972,.982,.994,1];
 // Explicit weekly terminal valuations. Not inferred from a market index.
 const valuations=w.map((f,i)=>cash(latest*f+(i===0?(h%5)*200:0)));
 valuations[6]=latest;
 const flows=[0,2500+(h%4)*500,0,1500,0,0,clientId==='C012'?3000:clientId==='C014'?7000:2000];
 // Historical fictional contributions refer only to covered accounts.
 const contributions=clientId==='C012'?465000:clientId==='C014'?825000:cash(latest*0.77);
 const goal=clientId==='C014'?{label:'Retirement planning',target:1500000,explicitly_declared_in_demo:true}:null;
 return {client_id:clientId,kind:type,as_of:DEMO_AS_OF,
  end_equity_value:eq,end_mf_value:mf,valuations,external_net_flows:flows,
  contributions,declared_goal:goal,source:'Synthetic valuation + flow fixture (not Supabase holdings)',
  market:DEMO_MARKET,synthetic:true};
}
export function dietzReturn(start,end,externalFlow,weight=0.5){
 if(![start,end,externalFlow,weight].every(Number.isFinite)||start<=0||weight<0||weight>1)return null;
 const denominator=start+weight*externalFlow;
 if(denominator<=0)return null;
 return (end-start-externalFlow)/denominator;
}
export function computeWealthIntelligence(input){
 if(!input||input.synthetic!==true||input.as_of!==DEMO_AS_OF)return null;
 const {valuations:v,external_net_flows:f,market:m}=input;
 if(!Array.isArray(v)||!Array.isArray(f)||!m||v.length!==7||f.length!==7||
  v.some(x=>!Number.isFinite(x)||x<=0)||f.some(x=>!Number.isFinite(x))||
  !Array.isArray(m.proxy)||m.proxy.length!==7||m.proxy.some(x=>!Number.isFinite(x)||x<=0))return null;
 const n=6,weeklyFlow=f[n],weeklyChange=v[n]-v[n-1];
 const weeklyReturn=dietzReturn(v[n-1],v[n],weeklyFlow);
 const benchmarkReturn=m.proxy[n]/m.proxy[n-1]-1;
 if(weeklyReturn===null)return null;
 const relative=pct(weeklyReturn-benchmarkReturn);
 const sinceStartFlows=f.slice(1).reduce((a,b)=>a+b,0);
 const periodGain=v[n]-v[0]-sinceStartFlows;
 const portfolioMix=input.kind==='mf'?'Mutual-fund weighted':input.kind==='equity'?'Equity weighted':'Mixed equity and mutual funds';
 const gapText=relative>0.01?'The modelled portfolio moved ahead of the proxy during this period.':relative< -0.01?'The modelled portfolio moved behind the proxy during this period.':'The modelled portfolio moved broadly in line with the proxy during this period.';
 const comparisons=[
  {key:'weekly_portfolio',label:'Weekly portfolio return',value:pct(weeklyReturn),unit:'%',method:METRIC_METHOD},
  {key:'weekly_proxy',label:'Illustrative market proxy',value:pct(benchmarkReturn),unit:'%',method:'Hypothetical proxy level change for matching dates'},
  {key:'relative',label:'Difference',value:relative,unit:'pp',method:'Portfolio estimated return minus proxy return in percentage points'}
 ];
 const journey=m.dates.map((d,i)=>({date:d,label:m.date_labels[i],value:v[i],formatted:currency(v[i]),net_flow:f[i]}));
 const goal=input.declared_goal?.explicitly_declared_in_demo?{
  label:input.declared_goal.label,target:input.declared_goal.target,
  progress:pct(v[n]/input.declared_goal.target),
  note:'Illustrative goal progress based on current in-scope value and a fictional declared goal; not a forecast.'
 }:null;
 return {
  version:'wealth_intelligence_v2_7_2',synthetic:true,client_id:input.client_id,
  as_of:input.as_of,scope:'Fictional Geojit portfolio subset; external holdings excluded',
  valuation:currency(v[n]),value_numeric:v[n],equity_value:currency(input.end_equity_value),
  mutual_fund_value:currency(input.end_mf_value),
  weekly_net_flow:currency(weeklyFlow),weekly_value_change:currency(weeklyChange),
  weekly_investment_effect:currency(weeklyChange-weeklyFlow),
  weekly_return:pct(weeklyReturn),benchmark_return:pct(benchmarkReturn),relative_pp:relative,
  comparison:comparisons,gap_text:gapText,
  attribution:'A verified holdings-level attribution feed is not connected. The difference cannot be reliably assigned to specific stocks, funds or sectors.',
  comparison_caveat:'The benchmark is an invented broad-equity proxy, not a validated, portfolio-matched benchmark. This comparison is illustrative and should not be used to judge suitability or performance.',
  calculation_note:'The weekly portfolio estimate removes net external contributions and assumes they occurred halfway through the period. Actual cash-flow timestamps and daily valuations are required for production TWR or XIRR.',
  context:m.commentary,market_source:m.source,market_verified:false,
  market_caution:m.caution,
  journey,period_gain:currency(periodGain),period_net_flow:currency(sinceStartFlows),
  since_start_value:currency(v[0]),total_contributions:currency(input.contributions),
  journey_note:'The value series and contributions are fictional. Change in portfolio value is not equivalent to investment return, and contributions to date are not a cost-basis calculation.',
  allocation:[{name:'Equity',value:input.end_equity_value,percent:pct(input.end_equity_value/v[n])},
    {name:'Mutual funds',value:input.end_mf_value,percent:pct(input.end_mf_value/v[n])}],
  goal,portfolio_style:portfolioMix,
  source_records:{market:'DEMO_MARKET_PROXY_20261120',portfolio:'DEMO_VALUATION_SERIES_'+input.client_id,flows:'DEMO_EXTERNAL_FLOWS_'+input.client_id},
  tools:[
   {id:'portfolio',label:'Explore my investments',detail:'Review holdings and activity in the authenticated Geojit environment (not connected in POC)'},
   {id:'goals',label:'Explore a goal',detail:'Consider a goal-planning calculator with assumptions you can review (not connected in POC)'},
   {id:'rm',label:'Speak with Geojit',detail:'Ask a question through approved relationship channels (request not sent from POC)'}
  ]
 };
}
export function fixtureIntelligence(clientId){return computeWealthIntelligence(fictionalFinancialInput(clientId))}
