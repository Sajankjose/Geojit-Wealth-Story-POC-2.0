import {test} from 'node:test'
import assert from 'node:assert/strict'
import {DEMO_PATHS,resolveDemoRoute,isSyntheticClientId,syntheticClientIdFromQuery} from '../src/lib/demoRoutes.js'
test('phase 1 and phase 2 have stable independent URL paths',()=>{
 assert.equal(DEMO_PATHS.story,'/wealth-story')
 assert.equal(DEMO_PATHS.companion,'/wealth-companion')
 assert.notEqual(DEMO_PATHS.story,DEMO_PATHS.companion)
 assert.equal(resolveDemoRoute('/wealth-story'),'story')
 assert.equal(resolveDemoRoute('/wealth-companion'),'companion')
 assert.equal(resolveDemoRoute('/wealth-story/'),'story')
 assert.equal(resolveDemoRoute('/wealth-companion/'),'companion')
})
test('root reviewer workspace and unrelated paths remain in the existing lab',()=>{
 assert.equal(resolveDemoRoute('/'),'lab')
 assert.equal(resolveDemoRoute('/other'),'lab')
 assert.equal(resolveDemoRoute(''),'lab')
})
test('only C001-C020 synthetic client IDs are accepted',()=>{
 assert.equal(isSyntheticClientId('C001'),true)
 assert.equal(isSyntheticClientId('C012'),true)
 assert.equal(isSyntheticClientId('C020'),true)
 assert.equal(isSyntheticClientId('C000'),false)
 assert.equal(isSyntheticClientId('C021'),false)
 assert.equal(isSyntheticClientId('C999'),false)
 assert.equal(isSyntheticClientId('any-real-account'),false)
 assert.equal(syntheticClientIdFromQuery('?client=C012'),'C012')
 assert.equal(syntheticClientIdFromQuery('?client=real'),'C012')
})
