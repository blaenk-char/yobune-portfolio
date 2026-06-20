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

      authStore.profile = await $fetch('/api/profile/me', {
        headers: { Authorization: `Bearer ${session.value.access_token}` }
      })

      authStore.ready = true
    })
  }

  /* Return */
  return {
    fetchProfile
  }
}
