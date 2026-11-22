import { createClient } from '@supabase/supabase-js'

// The Supabase JS client requires a PROJECT ORIGIN, not the Data API /rest/v1 endpoint.
// Accept common copied Supabase URLs defensively, then validate the result.
const rawUrl = String(import.meta.env.VITE_SUPABASE_URL || '').trim()
function projectOrigin(value) {
  if (!value) return ''
  try {
    const parsed = new URL(value)
    if (parsed.protocol !== 'https:') return ''
    // No endpoint path is passed to createClient; it adds /auth/v1 and /rest/v1 itself.
    if (!parsed.hostname.endsWith('.supabase.co') && !parsed.hostname.endsWith('.supabase.in')) {
      return parsed.origin
    }
    return parsed.origin
  } catch {
    return ''
  }
}
const url = projectOrigin(rawUrl)
const key = String(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '').trim()

export const configured = Boolean(url && key && !url.includes('your-project-ref') && !key.includes('your-project-'))
export const supabase = configured ? createClient(url, key, {
  auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true }
}) : null

export async function loadClients() {
  const { data, error } = await supabase.from('poc_clients')
    .select('client_id,alias,persona_scenario,starting_mode,profile')
    .order('client_id')
  if (error) throw error
  return data ?? []
}

export async function loadClientRecords(clientId) {
  if (!/^C\d{3}$/.test(clientId)) throw new Error('Invalid synthetic client identifier')
  const { data, error } = await supabase.from('poc_records')
    .select('record_id,client_id,domain,source_id,event_at,payload')
    .eq('client_id', clientId)
    .order('record_id')
    .limit(1000)
  if (error) throw error
  return data ?? []
}
