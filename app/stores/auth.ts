import type { Profile } from '#shared/types'

export const useAuthStore = defineStore('auth', () => {
  /* Constants */
  const user = useSupabaseUser()

  /* Refs */
  const profile = ref<Profile | null>(null)
  const ready = ref<boolean>(false)

  /* Computeds */
  const isOAuth = computed<boolean>(() => {
    const providers = user.value?.app_metadata?.providers as string[] | undefined
    if (providers?.length) return !providers.includes('email')
    const provider = user.value?.app_metadata?.provider as string | undefined
    return Boolean(provider && provider !== 'email')
  })

  /* Functions */
  function clear() {
    profile.value = null
    ready.value = true
  }

  /* Return */
  return {
    profile,
    ready,
    isOAuth,
    clear
  }
})
