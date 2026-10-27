import type { MessageResponse, Profile, UsernamePayload } from '#shared/types'

export const useProfile = () => {
  /* Constants */
  const authStore = useAuthStore()

  /* Refs */
  const loading = ref(false)

  /* Functions */
  async function fetchProfile() {
    return withLoading(loading, async () => {
      const session = useSupabaseSession()
      try {
        if (!session.value) return
        authStore.profile = await $fetch<Profile>('/api/profile/me', {
          headers: { Authorization: `Bearer ${session.value.access_token}` }
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
      const session = useSupabaseSession()

      const data = await $fetch<MessageResponse>('/api/profile/username', {
        headers: { Authorization: `Bearer ${session.value?.access_token}` },
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
