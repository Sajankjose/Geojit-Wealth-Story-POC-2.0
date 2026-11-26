import {test} from 'node:test'
import assert from 'node:assert/strict'
import {composeWealthStory} from '../src/lib/wealthStoryOrchestrator.js'
import {GUIDE_PROMPTS,guideResponse} from '../src/lib/wealthStoryGuide.js'
import {illustrativeMapForStory} from '../src/lib/illustrativeWealthMap.js'
test('all four fictional stories have meaningful non-live guide answers',()=>{
 for(const id of ['C012','C014','C008','C001']){
  const story=composeWealthStory(id)
  for(const prompt of GUIDE_PROMPTS){
   const response=guideResponse(story,prompt.id)
   assert.equal(response.live,false)
   assert.equal(response.advice,false)
   assert.equal(response.contactCreated,false)
   assert.ok(response.text.length>45)
  }
 }
})
test('Thomas guide uses only story financial inputs, not made-up financial needs',()=>{
 const story=composeWealthStory('C012')
 const answer=guideResponse(story,'summary')
 assert.match(answer.text,/₹5,42,000/)
 assert.match(answer.text,/₹3,000/)
 assert.doesNotMatch(answer.text,/must buy|incomplete/i)
})
test('George guide distinguishes declared goal and unassigned investments',()=>{
 const answer=guideResponse(composeWealthStory('C014'),'summary')
 assert.match(answer.text,/₹15,00,000/)
 assert.match(answer.text,/₹9,68,000/)
 assert.match(answer.text,/cannot be assumed/i)
})
test('service issues suppress promotional product responses',()=>{
 const answer=guideResponse(composeWealthStory('C008'),'products')
 assert.match(answer.text,/withheld/i)
 assert.equal(illustrativeMapForStory(composeWealthStory('C008')).serviceFirst,true)
})
test('new customers have no invented non-subscriptions and no RM identity',()=>{
 const story=composeWealthStory('C001')
 const products=guideResponse(story,'products')
 const rm=guideResponse(story,'rm')
 assert.match(products.text,/No non-subscriptions are explicitly verified/)
 assert.match(rm.text,/No individual relationship manager/)
 assert.equal(story.contact.name,null)
 assert.equal(guideResponse({synthetic:false},'summary'),null)
})
