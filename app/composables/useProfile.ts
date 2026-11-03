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
        authStore.profile = await authFetch<Profile>('/api/v1/profile/me')
      } catch {
        authStore.profile = null
      } finally {
        authStore.ready = true
      }
    })
  }

  async function updateUsername(payload: UsernamePayload) {
    return withLoading(loading, async () => {
      const data = await authFetch<MessageResponse>('/api/v1/profile/username', {
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
