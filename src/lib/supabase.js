import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

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
