import {test} from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {dirname,resolve} from 'node:path'
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..')
const page=readFileSync(resolve(root,'src/WealthStoryExperience.jsx'),'utf8')
const hub=readFileSync(resolve(root,'src/WealthStoryHub.jsx'),'utf8')
test('personal moments precede journey status and are visible in normal story flow',()=>{
 assert.ok(page.indexOf('<MomentsThatMatter')>0)
 assert.ok(page.indexOf('<WealthJourneySnapshot')>0)
 assert.ok(page.indexOf('<MomentsThatMatter')<page.indexOf('<WealthJourneySnapshot'))
 assert.ok(page.includes('onExploreProtection={()=>goToSection(\'protection-explorer\')}'))
})
test('journey status gives a plain-language why and one real on-page next action',()=>{
 assert.match(hub,/WHAT WE KNOW IN THIS DEMO/)
 assert.match(hub,/ONE USEFUL NEXT STEP/)
 assert.match(hub,/Review my protection picture/)
 assert.match(hub,/onClick=\{nextAction\}/)
 assert.match(hub,/onClick=\{\(\)=>onExplore\(ch.id\)\}/)
 assert.match(hub,/Not yet reviewed/)
 assert.doesNotMatch(hub,/Chapters with known context/)
 assert.doesNotMatch(hub,/Open to understand/)
})
test('new client has no implied account holdings or financial deficiency',()=>{
 assert.match(hub,/No investments or goals confirmed/)
 assert.match(hub,/not a checklist of products to buy/)
 assert.match(hub,/not a score/)
})
