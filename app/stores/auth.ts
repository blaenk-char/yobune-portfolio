import type { Profile } from '~~/shared/types'

export const useAuthStore = defineStore('auth', () => {
  /* Refs */
  const rawProfile = ref<Profile | null>(null)
  const ready = ref<boolean>(false)
  const hydrated = ref<boolean>(false)

  /* Lifecycle Hooks */
  onNuxtReady(() => {
    hydrated.value = true
  })

  /* Computeds */
  const profile = computed<Profile | null>({
    get: () => (hydrated.value ? rawProfile.value : null),
    set: (value) => {
      rawProfile.value = value
    }
  })

  /* Functions */
  function clear() {
    rawProfile.value = null
    ready.value = true
  }

  /* Return */
  return {
    profile,
    rawProfile,
    ready,
    clear
  }
})
