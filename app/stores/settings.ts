import { CURSOR_CONFIG, NSFW_CONFIG } from '#shared/constants'

export const useSettingsStore = defineStore('settings', () => {
  /* Refs */
  const cursor = ref<boolean>(true)
  const nsfw = ref<boolean>(NSFW_CONFIG.default)

  /* Lifecycle Hooks */
  onNuxtReady(() => {
    cursor.value = !(
      (localStorage.getItem(CURSOR_CONFIG.storageKey) ?? String(CURSOR_CONFIG.default)) === 'true'
    )
    toggleCursor()
  })

  /* Functions */
  function toggleCursor() {
    cursor.value = !cursor.value
    localStorage.setItem(CURSOR_CONFIG.storageKey, String(cursor.value))

    if (cursor.value) {
      document.body.classList.add(CURSOR_CONFIG.className)
    } else {
      document.body.classList.remove(CURSOR_CONFIG.className)
    }
  }

  /* Return */
  return {
    cursor,
    nsfw,
    toggleCursor
  }
})
