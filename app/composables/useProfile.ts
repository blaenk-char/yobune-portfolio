import type { MessageResponse, Profile, UsernamePayload } from '#shared/types'

export const useProfile = () => {
  /* Constants */
  const authStore = useAuthStore()
  const supabase = useSupabaseClient()

  /* Refs */
  const loading = ref(false)

  /* Functions */
  async function fetchProfile() {
    authStore.ready = false
    return withLoading(loading, async () => {
      try {
        const {
          data: { session }
        } = await supabase.auth.getSession()
        if (!session) {
          authStore.profile = null
          return
        }
        authStore.profile = await $fetch<Profile>('/api/v1/profile/me', {
          headers: { Authorization: `Bearer ${session.access_token}` }
        })
      } catch {
        authStore.profile = null
      } finally {
        authStore.ready = true
      }
    })
  }

  async function updateUsername(payload: UsernamePayload) {
    return withLoading(loading, async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession()

      const data = await $fetch<MessageResponse>('/api/v1/profile/username', {
        headers: { Authorization: `Bearer ${session?.access_token}` },
        method: 'PUT',
        body: payload
      })

      await fetchProfile()

      return data
    })
  }

  /* Return */
  return {
    loading,
    fetchProfile,
    updateUsername
  }
}
