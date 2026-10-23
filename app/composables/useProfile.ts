import type { MessageResponse, Profile, UsernamePayload } from '~~/shared/types'

export const useProfile = () => {
  /* Constants */
  const authStore = useAuthStore()

  /* Refs */
  const loading = ref(false)

  /* Functions */
  async function fetchProfile() {
    withLoading(loading, async () => {
      const session = useSupabaseSession()

      if (!session.value) {
        authStore.ready = true
        return
      }

      authStore.profile = await $fetch<Profile>('/api/profile/me', {
        headers: { Authorization: `Bearer ${session.value.access_token}` }
      })

      authStore.ready = true
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
