// Wealth Story POC 2.6 — simulated optional email eligibility.
// Pure decision function. For the fictional dataset only; NOT a production consent engine.
// Mandatory and essential account/service communications remain out of scope.
export const WEEKLY_COOLDOWN_DAYS=7;
export const MONTHLY_COOLDOWN_DAYS=28;
export const MAX_DRAFT_AGE_DAYS=30;

const validTime=value=>{const d=new Date(value);return Number.isFinite(d.getTime())?d:null};
export function evaluateDelivery({clientId,editionType,subscription,edition,events=[],serviceBlocked=false,permissionBlocked=false,now=new Date()}={}){
 const blockers=[],checks=[];
 const check=(name,pass,detail)=>{checks.push({name,pass,detail});if(!pass)blockers.push(detail)};
 check('Subscription',subscription?.status==='subscribed','Optional email subscription is not active for this edition.');
 check('Approved in-app edition',Boolean(edition?.id&&edition.stage==='published_in_app'&&edition.client_id===clientId&&edition.edition_type===editionType),'No matching published edition is available.');
 check('Customer preferences',!permissionBlocked&&clientId!=='C020','Fictional customer preference blocks optional email.');
 check('Service priority',!serviceBlocked,'Open service-first context blocks optional email.');
 const created=validTime(edition?.created_at);
 const age=created?Math.floor((now.getTime()-created.getTime())/86400000):null;
 check('Edition freshness',age!==null&&age>=0&&age<=MAX_DRAFT_AGE_DAYS,'Edition is undated, future-dated or older than the demo validity window.');
 // Event-sourced demo cooldown, not a real schedule. The same edition cannot be "sent" twice.
 const prior=(events||[]).filter(e=>e?.client_id===clientId&&e?.edition_type===editionType&&e?.event_type==='email_delivery_simulated');
 const duplicate=prior.some(e=>e.edition_id===edition?.id);
 check('Duplicate prevention',!duplicate,'This edition already has a simulated email delivery event.');
 const mostRecent=prior.map(e=>validTime(e.created_at)).filter(Boolean).sort((a,b)=>b-a)[0];
 const days=mostRecent?Math.floor((now.getTime()-mostRecent.getTime())/86400000):null;
 const cooldown=editionType==='weekly_investing'?WEEKLY_COOLDOWN_DAYS:editionType==='monthly_wealth'?MONTHLY_COOLDOWN_DAYS:0;
 const cadenceOK=days===null||days>=cooldown;
 check('Frequency limit',cadenceOK,cooldown?('Edition frequency limit: minimum '+cooldown+' days between simulated emails.'):'No duplicate delivery permitted.');
 const window=subscription?.delivery_window||'standard';
 const isTradingDay=[1,2,3,4,5].includes(now.getDay());
 check('Trading-day schedule',editionType!=='daily_trading'||isTradingDay,'Daily Trading Brief is only eligible on market days (weekday approximation; holidays not configured).');
 return {eligible:blockers.length===0,checks,blockers,edition_id:edition?.id||null,edition_type:editionType,
  channel:'email',simulation_only:true,delivery_window:window,frequency_window_days:cooldown,
  policy_version:'poc_2_6_delivery_v1'};
}
