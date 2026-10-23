import type { Profile } from '~~/shared/types'

export const useAuthStore = defineStore('auth', () => {
  /* Refs */
  const profile = ref<Profile | null>(null)
  const ready = ref<boolean>(false)

  /* Functions */
  function clear() {
    profile.value = null
    ready.value = true
  }

  /* Return */
  return {
    profile,
    ready,
    clear
  }
})
