// Offline regression tests for the synthetic Wealth Story AI function.
// No real secrets, customer data or network calls.
import { test, after } from 'node:test'
import assert from 'node:assert/strict'
import handler from '../netlify/functions/generate-wealth-story.mjs'

const originalFetch=globalThis.fetch
const originalEnv={
 SUPABASE_URL:process.env.SUPABASE_URL,
 SUPABASE_PUBLISHABLE_KEY:process.env.SUPABASE_PUBLISHABLE_KEY,
 OPENAI_API_KEY:process.env.OPENAI_API_KEY
}
after(()=>{
 globalThis.fetch=originalFetch
 for(const [name,value] of Object.entries(originalEnv)){
  if(value===undefined)delete process.env[name];else process.env[name]=value
 }
})
const json=(body,status=200)=>new Response(JSON.stringify(body),{
 status,headers:{'content-type':'application/json'}
})
const request=(method='POST',payload={client_id:'C012',edition_type:'weekly_investing'},token='test-reviewer-token')=>
 new Request('https://example.netlify.app/.netlify/functions/generate-wealth-story',{
  method,
  headers:{'authorization':'Bearer '+token,...(method==='POST'?{'content-type':'application/json'}:{})},
  ...(method==='POST'?{body:JSON.stringify(payload)}:{})
 })

test('reviewer check succeeds when Supabase returns an authenticated synthetic reviewer',async()=>{
 process.env.SUPABASE_URL='https://project.supabase.co'
 process.env.SUPABASE_PUBLISHABLE_KEY='test-publishable'
 process.env.OPENAI_API_KEY='test-openai-secret'
 globalThis.fetch=async input=>{
  if(String(input).includes('/auth/v1/user'))return json({id:'reviewer-1',email:'reviewer@example.com'})
  throw Error('unexpected request')
 }
 const res=await handler(request('GET'))
 assert.equal(res.status,200)
 const data=await res.json()
 assert.equal(data.reviewer_authenticated,true)
 assert.equal(data.openai_key_configured,true)
})

test('AI generation parses OpenAI success, checks evidence IDs and returns draft with trace',async()=>{
 process.env.SUPABASE_URL='https://project.supabase.co'
 process.env.SUPABASE_PUBLISHABLE_KEY='test-publishable'
 process.env.OPENAI_API_KEY='test-openai-secret'
 let openaiCalls=0
 globalThis.fetch=async (input,init={})=>{
  const url=String(input)
  if(url.includes('/auth/v1/user'))return json({id:'reviewer-1',email:'reviewer@example.com'})
  if(url.includes('/rest/v1/poc_clients'))return json([{client_id:'C012',alias:'Thomas',persona_scenario:'Multi-product',synthetic:true}])
  if(url.includes('/rest/v1/poc_records'))return json([{
   record_id:'transactions:00083',client_id:'C012',domain:'transactions',
   source_id:'SRC02',event_at:'2026-11-20T00:00:00Z',
   payload:{transaction_type:'Equity buy',product:'Equity',status:'completed'}
  }])
  if(url.includes('api.openai.com/v1/responses')){
   openaiCalls++
   const req=JSON.parse(init.body)
   assert.equal(req.store,false)
   assert.equal(req.text.format.name,'wealth_story')
   return json({output:[{type:'message',content:[{type:'output_text',text:JSON.stringify({
    headline:'Your recent equity activity',
    narrative:'The available fictional records show a completed equity purchase. This snapshot reflects activity recorded on the platform, but it does not establish investment goals or performance. Your broader financial intentions would need to be confirmed before suggesting any further steps.',
    context_hint:'You can review the recorded activity in your authenticated account.',
    next_step:'Check the transaction record if you would like more context.',
    why_this_story:'Selected the relevant, attributable synthetic transaction record.',
    evidence_ids:['transactions:00083']
   })}]}]})
  }
  throw Error('Unexpected mock request: '+url)
 }
 const res=await handler(request())
 const result=await res.json()
 assert.equal(res.status,200,JSON.stringify(result))
 assert.equal(result.ok,true)
 assert.equal(result.candidate.generation_method,'openai_draft')
 assert.equal(result.candidate.evidence_count,1)
 assert.deepEqual(result.candidate.evidence_trace.used_ids,['transactions:00083'])
 assert.equal(openaiCalls,1)
})

test('OpenAI content with an invented source reference is rejected',async()=>{
 process.env.SUPABASE_URL='https://project.supabase.co'
 process.env.SUPABASE_PUBLISHABLE_KEY='test-publishable'
 process.env.OPENAI_API_KEY='test-openai-secret'
 globalThis.fetch=async(input)=>{
  const url=String(input)
  if(url.includes('/auth/v1/user'))return json({id:'reviewer-1'})
  if(url.includes('/rest/v1/poc_clients'))return json([{client_id:'C012',alias:'Thomas',synthetic:true}])
  if(url.includes('/rest/v1/poc_records'))return json([{record_id:'transactions:00083',domain:'transactions',source_id:'SRC02',payload:{transaction_type:'Equity buy'}}])
  if(url.includes('api.openai.com'))return json({output:[{type:'message',content:[{type:'output_text',text:JSON.stringify({
   headline:'Account context',narrative:'An equity activity was recorded.',
   context_hint:'Review activity',next_step:'Review activity',
   why_this_story:'Fictional transaction context',evidence_ids:['invented-record']
  })}]}]})
  throw Error('Unexpected mock request '+url)
 }
 const res=await handler(request())
 assert.equal(res.status,422)
 assert.equal((await res.json()).code,'EVIDENCE_REF_MISMATCH')
})
