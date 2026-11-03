import { PAGES } from '#shared/constants'

export default defineNuxtPlugin(async () => {
  const supabase = useSupabaseClient()
  const authStore = useAuthStore()
  const { fetchProfile } = useProfile()
  const { confirmOAuth } = useAuth()
  const route = useRoute()

  async function syncClientAuth() {
    if (route.query.code) {
      await confirmOAuth()
    } else {
      await fetchProfile()
    }

    if (authStore.profile && (route.path === PAGES.auth.url || route.query.code)) {
      const redirect = route.query.redirect as string | undefined
      await navigateTo(
        redirect?.startsWith('/') && !redirect.startsWith('//') ? redirect : PAGES.home.url,
        { replace: true }
      )
    }
  }

  // listen to auth state changes on client and update the profile accordingly
  if (import.meta.client) {
    onNuxtReady(async () => {
      if (!authStore.profile) {
        await syncClientAuth()
      }
    })

    supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') syncClientAuth()
      if (event === 'SIGNED_OUT') authStore.clear()
    })
  }

  // fetch on SSR (or if not yet initialized) before route middleware runs
  if (!authStore.ready) {
    await fetchProfile()
  }
})
