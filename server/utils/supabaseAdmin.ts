import { createClient } from '@supabase/supabase-js'

let _admin: ReturnType<typeof createClient> | null = null

/**
 * Supabase client using the NUXT_SUPABASE_SECRET_KEY.
 * Never expose this on the client.
 */
export function useSupabaseAdmin() {
  if (_admin) return _admin

  const config = useRuntimeConfig()
  _admin = createClient(config.public.supabaseUrl, config.supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  return _admin
}
