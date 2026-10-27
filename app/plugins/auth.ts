export default defineNuxtPlugin(async () => {
  const supabase = useSupabaseClient()
  const authStore = useAuthStore()
  const { fetchProfile } = useProfile()

  // listen to auth state changes on client and update the profile accordingly
  if (import.meta.client) {
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') fetchProfile()
      if (event === 'SIGNED_OUT') authStore.clear()
    })
  }

  // fetch on SSR (or if not yet initialized) before route middleware runs
  if (!authStore.ready) {
    await fetchProfile()
  }
})
