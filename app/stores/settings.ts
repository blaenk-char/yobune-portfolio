import { CURSOR_CONFIG, DIALOG_CONFIG, NSFW_CONFIG } from '#shared/constants'

export const useSettingsStore = defineStore('settings', () => {
  /* Refs */
  const cursor = ref<boolean>(true)
  const nsfw = ref<boolean>(NSFW_CONFIG.default)

  /* Computeds */
  const showCursor = computed<boolean>(() => isPageAllowed(CURSOR_CONFIG.pages))
  const showNsfw = computed<boolean>(() => isPageAllowed(NSFW_CONFIG.pages))
  const showDialog = computed<boolean>(() => isPageAllowed(DIALOG_CONFIG.pages))

  /* Lifecycle Hooks */
  onNuxtReady(() => {
    cursor.value = !(
      (localStorage.getItem(CURSOR_CONFIG.storageKey) ?? String(CURSOR_CONFIG.default)) === 'true'
    )
    toggleCursor()
  })

  /* Functions */
  function updateCursorClass() {
    if (cursor.value && showCursor.value) {
      document.body.classList.add(CURSOR_CONFIG.className)
    } else {
      document.body.classList.remove(CURSOR_CONFIG.className)
    }
  }

  function toggleCursor() {
    cursor.value = !cursor.value
    localStorage.setItem(CURSOR_CONFIG.storageKey, String(cursor.value))
    updateCursorClass()
  }

  /* Watches */
  watch(showCursor, updateCursorClass)

  /* Return */
  return {
    cursor,
    nsfw,
    showCursor,
    showNsfw,
    showDialog,
    toggleCursor
  }
})
