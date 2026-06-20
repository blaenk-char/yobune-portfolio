import type { Profile } from '#shared/types/user'

export const useAuthStore = defineStore('auth', () => {
  /* Refs */
  const profile = ref<Profile | null>(null)
  const ready = ref(false)

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
