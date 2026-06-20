export default defineNuxtPlugin(async () => {
  const supabase = useSupabaseClient()
  const authStore = useAuthStore()
  const { fetchProfile } = useProfile()

  // try to fetch on app launch
  await fetchProfile()

  // listen to auth state changes and update the profile accordingly
  supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_IN') fetchProfile()
    if (event === 'SIGNED_OUT') authStore.clear()
  })
})
