// Stable paths for the synthetic reviewer demos on both Netlify (/)
// and GitHub Pages (/Geojit-Wealth-Story-POC-2.0/). No customer identifiers in paths.
export const APP_BASE_PATH=(()=>{
 const raw=typeof import.meta.env?.BASE_URL==='string'?import.meta.env.BASE_URL:'/'
 return '/'+String(raw).split('/').filter(Boolean).join('/')+(raw==='/'?'':'/')
})()
const child=part=>APP_BASE_PATH+part
export const DEMO_PATHS=Object.freeze({
 story:child('wealth-story'),companion:child('wealth-companion'),lab:APP_BASE_PATH
})
export function resolveDemoRouteAtBase(pathname='/',basePath='/'){
 const path=String(pathname||'/').replace(/\/+$/,'')||'/'
 const prefix=('/'+String(basePath||'/').split('/').filter(Boolean).join('/')).replace(/\/$/,'')
 const internal=prefix&&path.startsWith(prefix+'/')?path.slice(prefix.length):path===prefix?'/':path
 if(internal==='/wealth-story')return 'story'
 if(internal==='/wealth-companion')return 'companion'
 return 'lab'
}
export function resolveDemoRoute(pathname='/'){
 return resolveDemoRouteAtBase(pathname,APP_BASE_PATH)
}
export function isSyntheticClientId(value){
 return /^C0(?:0[1-9]|1[0-9]|20)$/.test(String(value||''))
}
export function syntheticClientIdFromQuery(search=''){
 const match=String(search).match(/(?:^|[?&])client=(C0(?:0[1-9]|1[0-9]|20))(?:&|$)/)
 return match?.[1]||'C012'
}
