// Synthetic brokerage transparency and governed pricing review — not a live tariff, quote, discount or transaction feed.
// All figures are invented for C012 solely to demonstrate a dated cost summary.
export const COST_DEMO_AS_OF='2026-11-26'
export const COST_RECORDS=Object.freeze({
 C012:Object.freeze({clientId:'C012',synthetic:true,asOf:COST_DEMO_AS_OF,planLabel:'Illustrative standard brokerage',
  currency:'INR',todayBrokerage:185,monthBrokerage:2450,monthTrades:18,tradeSegment:'Illustrative cash equity trades',
  chargeScope:'Brokerage only. GST, STT, exchange and regulatory charges, stamp duty and other applicable charges are excluded.',
  source:'Invented brokerage fixtures for UX demonstration; not reconciled with contract notes or billing systems.'})
})
export const BROKERAGE_INQUIRY_TYPES=[
 {id:'understand',label:'Understand my brokerage and charges'},
 {id:'review',label:'Request a review of my brokerage plan'},
 {id:'discount',label:'Request consideration for a brokerage discount'},
 {id:'other',label:'Other brokerage enquiry'}
]
export const REVIEW_OUTCOMES=Object.freeze({
 standard:'Existing structure may be retained',
 alternative:'An approved alternative plan may be explored',
 manual:'Requires an authorised relationship review',
 unavailable:'No change currently available'
})
export function brokerageSnapshot(clientId){return Object.hasOwn(COST_RECORDS,clientId)?COST_RECORDS[clientId]:null}
export function shouldShowBrokerageCard(clientId){return !!brokerageSnapshot(clientId)}
export function brokerageIsToday(snapshot,todayISO){return !!snapshot && snapshot.asOf===todayISO}
export function evaluateBrokerageScenario({monthlyBrokerage=2450,proposedDiscountPct=0,serviceCost=400,otherVariableCost=300,minimumContribution=900}={}){
 const values=[monthlyBrokerage,proposedDiscountPct,serviceCost,otherVariableCost,minimumContribution]
 if(!values.every(Number.isFinite)||monthlyBrokerage<0||proposedDiscountPct<0||proposedDiscountPct>60||serviceCost<0||otherVariableCost<0||minimumContribution<0)return null
 const discountAmount=monthlyBrokerage*proposedDiscountPct/100
 const retainedRevenue=monthlyBrokerage-discountAmount
 const contribution=retainedRevenue-serviceCost-otherVariableCost
 const clearsFloor=contribution>=minimumContribution
 return {discountAmount,retainedRevenue,contribution,clearsFloor,
  outcome:clearsFloor?REVIEW_OUTCOMES.manual:REVIEW_OUTCOMES.unavailable,
  note:'Illustrative margin arithmetic only. The assumed costs, revenue, approval floor and discount percentage are not Geojit policy or an eligible customer offer.'}
}
