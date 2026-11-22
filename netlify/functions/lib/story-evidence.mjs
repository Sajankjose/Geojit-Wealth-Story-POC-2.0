// POC 2.5: source-aware, conservative synthetic customer evidence selection.
// Pure module shared by read-only preview and server-side AI generation.
// An event is evidence that a *record exists*, not proof of suitability or intent.

export const SOURCE_DOMAINS = [
 'service_cases','consent_preferences','goals_preferences','product_subscriptions',
 'transactions','human_touchpoints','engagement_tool_events',
 'digital_platform_events','communication_events','story_contexts','customer_states'
];
const PRIORITY = {
 service_cases:100,consent_preferences:95,goals_preferences:80,
 product_subscriptions:70,transactions:65,human_touchpoints:60,
 engagement_tool_events:48,digital_platform_events:42,
 communication_events:38,story_contexts:22,customer_states:25
};
const LABELS = {
 service_cases:'Service record',consent_preferences:'Communication preference',
 goals_preferences:'Goal or preference',product_subscriptions:'Product relationship',
 transactions:'Transaction record',human_touchpoints:'Human interaction',
 engagement_tool_events:'Engagement-tool activity',digital_platform_events:'Digital activity',
 communication_events:'Communication activity',story_contexts:'Prior editorial story',
 customer_states:'Derived customer state'
};
const FIELDS={
 service_cases:['status','case_type','service_type','suppress_optional_promotions'],
 consent_preferences:['marketing_permission','email_opt_in','subscription_status','preferred_channel'],
 goals_preferences:['goal_type','goal','goal_name','goal_label','preference_type','preference_name'],
 product_subscriptions:['product','product_name','product_label','product_type','product_category','asset_class','subscription_type','subscription_status','status'],
 transactions:['transaction_type','transaction_category','activity_type','product','product_name','product_type','product_category','asset_class','status'],
 human_touchpoints:['touchpoint_type','touchpoint','interaction_type','interaction_name','channel','topic','meeting_type'],
 engagement_tool_events:['tool_name','tool_type','event_type','event_name','action','activity_type'],
 digital_platform_events:['platform','platform_name','event_type','event_name','action','activity_type','channel'],
 communication_events:['channel','event_type','event_name','status','communication_type'],
 story_contexts:['headline'],
 customer_states:['primary_priority','story_type','goal_type','marketing_permission']
};
const dateOnly=v=>{if(!v)return null;const d=new Date(v);return Number.isFinite(d.valueOf())?d.toISOString().slice(0,10):null};
const clean=v=>{
 if(typeof v==='boolean')return String(v);
 if(typeof v!=='string')return '';
 return v.replace(/[\u0000-\u001f<>]/g,' ').trim().replace(/\s+/g,' ').slice(0,90)
};
const label=v=>String(v||'').replace(/_/g,' ').replace(/\s+/g,' ').trim();
const blockedDomains=new Set(['communications','story_decisions']);
export function selectEvidence(rows,client,edition,now=new Date()){
 const raw=(rows||[]).filter(row=>row&&SOURCE_DOMAINS.includes(row.domain)&&!blockedDomains.has(row.domain));
 const asOf=Number.isFinite(now.valueOf())?now:new Date();
 const candidates=[];
 for(const r of raw){
  const p=r.payload;
  if(!p||typeof p!=='object'||Array.isArray(p))continue;
  const parts=(FIELDS[r.domain]||[]).filter(key=>Object.prototype.hasOwnProperty.call(p,key))
   .map(key=>{const value=clean(p[key]);return value?label(key)+': '+label(value):''}).filter(Boolean);
  if(!parts.length)continue;
  const recorded=dateOnly(r.event_at||p.event_at||p.occurred_at||p.timestamp||p.as_of);
  const age=recorded?Math.floor((asOf.getTime()-new Date(recorded).getTime())/86400000):null;
  const freshness=age===null?'undated':age<0?'future-dated':age>90?'older':'recent';
  const isPriorStory=r.domain==='story_contexts';
  const statement=LABELS[r.domain]+': '+parts.slice(0,isPriorStory?1:3).join(' · ');
  const id=String(r.record_id||'').slice(0,140);
  if(!id)continue;
  candidates.push({
   id,domain:r.domain,source_id:clean(r.source_id)||'Source not recorded',
   observed_at:recorded,freshness,
   evidence_kind:isPriorStory?'prior_editorial_context':'source_record',
   label:LABELS[r.domain],observation:statement.slice(0,330),
   priority:PRIORITY[r.domain]-(freshness==='older'?15:freshness==='future-dated'?40:0),
   caution:isPriorStory?'Prior drafted content; not an independently verified financial fact':
     freshness==='undated'?'Source date unavailable; avoid claims about when this occurred':
     freshness==='future-dated'?'Future timestamp; must not be used as past activity':
     freshness==='older'?'Historical record; do not describe as current':
     'Synthetic record; confirm source accuracy before approval'
  });
 }
 candidates.sort((a,b)=>b.priority-a.priority||(b.observed_at||'').localeCompare(a.observed_at||''));
 const chosen=[];const domainCounter={};
 for(const x of candidates){
  if(chosen.length>=9)break;
  if((domainCounter[x.domain]||0)>=2)continue;
  if(x.freshness==='future-dated')continue;
  if(edition==='daily_trading'&&['story_contexts','transactions','communication_events'].includes(x.domain))continue;
  domainCounter[x.domain]=(domainCounter[x.domain]||0)+1;
  chosen.push(x)
 }
 const allDomainCounts={};
 for(const r of raw)allDomainCounts[r.domain]=(allDomainCounts[r.domain]||0)+1;
 const state=raw.find(r=>r.domain==='customer_states')?.payload||{};
 const services=raw.filter(r=>r.domain==='service_cases').map(r=>r.payload||{});
 const service_first=services.some(x=>x.suppress_optional_promotions===true&&!['resolved','closed'].includes(String(x.status||'').toLowerCase()));
 const optional_outbound_withheld=service_first||state.marketing_permission===false||client.client_id==='C020';
 const caveats=[
  'All observations are from fabricated POC records and may be incomplete.',
  'Recorded product activity is not evidence of goals, suitability, risk appetite or external assets.',
  'Do not extrapolate returns, prices, transaction totals or performance from these records.',
  ...(edition==='daily_trading'?['There is no live market data or approved current research feed. This cannot be a real trading brief.']:[]),
  ...(optional_outbound_withheld?['Optional outbound communication is withheld by the synthetic relationship/service state.']:[])
 ];
 return {
  version:'evidence_v2_5',client_id:client.client_id,edition_type:edition,
  selected:chosen,source_counts:allDomainCounts,source_record_count:raw.length,
  service_first,optional_outbound_withheld,caveats,
  missing:chosen.length===0?'No allowlisted, attributable facts were available.':'Sources outside this allowlist were intentionally excluded.'
 };
}
