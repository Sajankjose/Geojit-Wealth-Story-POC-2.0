// Stable, public-facing URL paths for reviewer-only demonstrations.
// Paths never contain real customer identifiers; synthetic client selection uses allowlisted C001-C020.
export const DEMO_PATHS=Object.freeze({
 story:'/wealth-story',companion:'/wealth-companion',lab:'/'
})
export function resolveDemoRoute(pathname='/'){
 const path=String(pathname||'/').replace(/\/+$/,'')||'/'
 if(path===DEMO_PATHS.story)return 'story'
 if(path===DEMO_PATHS.companion)return 'companion'
 return 'lab'
}
export function isSyntheticClientId(value){
 return /^C0(?:0[1-9]|1[0-9]|20)$/.test(String(value||''))
}
export function syntheticClientIdFromQuery(search=''){
 const match=String(search).match(/(?:^|[?&])client=(C0(?:0[1-9]|1[0-9]|20))(?:&|$)/)
 return match?.[1]||'C012'
}
