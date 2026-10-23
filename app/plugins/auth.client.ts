export default defineNuxtPlugin(async () => {
  const supabase = useSupabaseClient()
  const authStore = useAuthStore()
  const { fetchProfile } = useProfile()

  // on app launch
  useNuxtApp().hook('app:mounted', () => {
    // try to fetch
    fetchProfile()

    // listen to auth state changes and update the profile accordingly
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') fetchProfile()
      if (event === 'SIGNED_OUT') authStore.clear()
    })
  })
})
