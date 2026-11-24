import React from 'react'
import {PLAN_EXPERIENCES} from './lib/wealthCompanion.js'

const matrix=[
 ['Portfolio and market information','Financial utility','Show factual holdings, trends, methodology and limitations; no personalised buy/sell recommendation.'],
 ['Customer-selected goals','Self-directed calculator','Customer changes target, timeline and assumptions; no recommended securities or product allocation.'],
 ['Learning roadmap','Educational guidance','Steps arise from declared interests, not diagnosed financial gaps or sales targets.'],
 ['Proactive check-ins','Permission-gated utility','No unsolicited messages without verified trigger, proper channel preference and service-priority checks.'],
 ['Product information','Separate distribution journey','Explicit customer request, general information and any relevant eligibility/disclosures; no suitability inferred here.'],
 ['Personalised investment advice','Out of POC scope','Requires a separate authorised advice/segregation assessment and appropriate advisory operating model.'],
 ['Paid digital subscription','Not launched','A price, customer contract, fee treatment and regulatory classification need approval before charging.']
]
export default function CompanionGovernance({onPreviewCustomer}){
 return <div className="cgGovernance">
  <div className="eyebrow">POC 3.0 · DIGITAL SERVICE BUSINESS CONCEPT</div><h2>Value first. Revenue earned through trust.</h2>
  <p className="cgLead">Wealth Companion is being prototyped as a self-directed financial understanding service—not a paid investment-advisory subscription. The Wealth Story is its ongoing, reviewed communication layer.</p>
  <div className="cgCards">{PLAN_EXPERIENCES.map(x=><article key={x.id}><span>{x.tag}</span><h3>{x.name}</h3><strong>{x.price}</strong><p>{x.description}</p><ul>{x.features.map(f=><li key={f}>{f}</li>)}</ul></article>)}</div>
  <div className="cgActions"><button type="button" onClick={()=>onPreviewCustomer?.('C012')}>Preview Thomas's companion →</button><span>Every plan selection is a browser-session simulation; no payment or entitlement is created.</span></div>
  <section className="cgMatrix"><div className="eyebrow">COMPLIANCE SCOPING MATRIX · REVIEW REQUIRED</div><h3>Decide which capabilities can go to market.</h3><div className="cgMatrixList">{matrix.map(([capability,category,rule])=><div key={capability}><strong>{capability}</strong><span>{category}</span><p>{rule}</p></div>)}</div></section>
  <section className="cgNext"><h3>Before a paid pilot</h3><ol><li>Obtain a feature-level written Compliance and Legal determination of utility, education, financial planning and investment advice boundaries.</li><li>Confirm conflicts, legal entity, distribution/advice segregation and any fee restrictions.</li><li>Replace fictional portfolio and market inputs with governed data sources; validate methods, disclosure and entitlement handling.</li><li>Test customer comprehension and willingness to pay without charging anyone.</li><li>Use an authorised billing platform and real account-level permissions only after approval.</li></ol></section>
 </div>
}
