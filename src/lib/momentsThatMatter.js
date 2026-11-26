// POC 4.2 – standalone fictional relationship milestones.
// Dates/ages are EXPLICIT synthetic demo-only records, not read from a real CRM,
// Data Lake, or the financial value fixtures. No DOB-derived need is inferred.
import {fictionalFinancialInput} from './wealthIntelligence.js'
export const MOMENT_REVIEW_DATE='2026-11-26'
export const DEMO_RELATIONSHIP_RECORDS=Object.freeze({
 C012:{birthDate:'1985-04-19',joinedDate:'2014-11-26',source:'Separately invented customer dates, POC 4.2'},
 C014:{birthDate:'1982-11-26',joinedDate:'2017-03-08',source:'Separately invented customer dates, POC 4.2'},
 C008:{birthDate:'1990-08-21',joinedDate:'2020-09-12',source:'Separately invented customer dates, POC 4.2'},
 C001:{birthDate:null,joinedDate:'2026-11-18',source:'Separately invented new-customer join date, POC 4.2'}
})
const dateParts=s=>{const match=/^(\d{4})-(\d{2})-(\d{2})$/.exec(s||'');if(!match)return null;const [year,month,day]=match.slice(1).map(Number);const d=new Date(Date.UTC(year,month-1,day));return d.getUTCFullYear()===year&&d.getUTCMonth()===month-1&&d.getUTCDate()===day?{year,month,day}:null}
export function yearsBetween(start,end=MOMENT_REVIEW_DATE){
 const a=dateParts(start),b=dateParts(end)
 if(!a||!b)return null
 const years=b.year-a.year-(b.month<a.month||(b.month===a.month&&b.day<a.day)?1:0)
 return years>=0?years:null
}
export function isCalendarAnniversary(start,end=MOMENT_REVIEW_DATE){
 const a=dateParts(start),b=dateParts(end)
 return !!a&&!!b&&a.month===b.month&&a.day===b.day
}
export function meaningfulMoments(story,asOf=MOMENT_REVIEW_DATE){
 if(!story?.synthetic)return null
 const registry=DEMO_RELATIONSHIP_RECORDS[story.client_id]
 if(!registry)return null
 const age=registry.birthDate?yearsBetween(registry.birthDate,asOf):null
 const tenure=yearsBetween(registry.joinedDate,asOf)
 const isBirthday=registry.birthDate?isCalendarAnniversary(registry.birthDate,asOf):false
 const isRelationshipAnniversary=isCalendarAnniversary(registry.joinedDate,asOf)&&tenure>0
 const events=[]
 if(isRelationshipAnniversary)events.push({id:'anniversary',kind:'delight',label:'Together on this journey',value:tenure,unit:'years',title:tenure+' years of your Geojit journey',message:'You joined this fictional Geojit relationship on '+registry.joinedDate+'. Thank you for sharing the journey.',source:registry.source})
 if(isBirthday)events.push({id:'birthday',kind:'delight',label:'A personal moment',value:age,unit:'years',title:'Happy birthday!',message:'Wishing you a wonderful year ahead. If you choose, your next Wealth Story can include a self-directed financial reflection.',source:registry.source})
 if(story.model){
  const raw=fictionalFinancialInput(story.client_id)
  if(raw?.synthetic)events.push({id:'investment',kind:'figure',label:'Your recorded investment story',value:story.model.value_numeric,unit:'INR',title:'Your recorded Geojit value: '+story.model.valuation,message:'The latest synthetic account value is distinct from contributions or investment returns.',source:'Synthetic valuation fixture dated '+story.model.as_of})
 }
 return {synthetic:true,clientId:story.client_id,reviewDate:asOf,age,tenure,isBirthday,isRelationshipAnniversary,events,hasDob:!!registry.birthDate,hasJoinedDate:!!registry.joinedDate,source:registry.source}
}
// Term cover calculation is an arithmetic illustration of USER-ENTERED assumptions.
// It is not an insurance-needs assessment, sale, recommendation or guarantee.
export function illustrativeTermCover({annualFamilyExpense=600000,supportYears=10,liabilities=0,earmarkedAssets=0,existingTermCover=0}={}){
 const values=[annualFamilyExpense,supportYears,liabilities,earmarkedAssets,existingTermCover]
 if(!values.every(Number.isFinite)||values.some(n=>n<0)||supportYears<1||supportYears>40||annualFamilyExpense>100000000||liabilities>1000000000||earmarkedAssets>1000000000||existingTermCover>1000000000)return null
 const hypotheticalNeed=Math.max(0,annualFamilyExpense*supportYears+liabilities-earmarkedAssets)
 const unaddressed=Math.max(0,hypotheticalNeed-existingTermCover)
 return {hypotheticalNeed,unaddressed,existingTermCover,assumption:'Simple, customer-controlled illustration: annual family expenses × years + liabilities − earmarked assets − declared term cover. It does not model inflation, taxes, investment growth, affordability, medical underwriting, existing policy terms, employment benefits or individual suitability. A positive difference is NOT evidence of underinsurance or a recommended policy amount.'}
}
export function protectionEngagement(state){
 const allowed=['has_cover','no_cover','unsure','later']
 return allowed.includes(state)?state:'unsure'
}
