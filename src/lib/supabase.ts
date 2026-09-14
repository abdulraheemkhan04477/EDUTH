import { createClient } from '@supabase/supabase-js'

const getEnvVar = (key: string, metaVal?: string): string => {
  if (metaVal) return metaVal
  if (typeof (globalThis as any).process !== 'undefined' && (globalThis as any).process?.env) {
    return (globalThis as any).process.env[key] || ''
  }
  return ''
}

const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined
const supabaseUrl = getEnvVar('VITE_SUPABASE_URL', metaEnv?.VITE_SUPABASE_URL)
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY', metaEnv?.VITE_SUPABASE_ANON_KEY)

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials not found. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file. Running in offline mode.'
  )
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
)

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)
