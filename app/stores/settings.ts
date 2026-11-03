import { CURSOR_CONFIG, DIALOG_CONFIG, NSFW_CONFIG } from '#shared/constants'

export const useSettingsStore = defineStore('settings', () => {
  /* Refs */
  const cursor = useCookie<boolean>(CURSOR_CONFIG.storageKey, {
    default: () => CURSOR_CONFIG.default
  })
  const nsfw = ref<boolean>(NSFW_CONFIG.default)

  /* Computeds */
  const showCursor = computed<boolean>(() => isPageAllowed(CURSOR_CONFIG.pages))
  const showNsfw = computed<boolean>(() => isPageAllowed(NSFW_CONFIG.pages))
  const showDialog = computed<boolean>(() => isPageAllowed(DIALOG_CONFIG.pages))

  /* Lifecycle Hooks */
  onNuxtReady(updateCursorClass)

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
