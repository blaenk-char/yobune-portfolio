import { DIALOG_CONFIG, DIALOGS, type DialogRecord } from '#shared/constants'

export const useDialogStore = defineStore('dialog', () => {
  /* Refs */
  const dialogIndex = ref(-1)
  const isTyping = ref(false)

  /* Computeds */
  const currentDialog = computed<DialogRecord | null>(() => DIALOGS[dialogIndex.value] ?? null)

  /* Functions */
  async function next() {
    if (isTyping.value) return

    // check if last
    if (dialogIndex.value >= DIALOGS.length - 1) {
      stop()
      return
    }

    // set next scene
    dialogIndex.value++
    const scene = currentDialog.value
    if (!scene) return

    // scroll to card
    await nextTick()
    document.getElementById(scene.id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  }

  function stop() {
    dialogIndex.value = -1
    localStorage.setItem(DIALOG_CONFIG.storageKey, 'false')
    return
  }

  function reset() {
    stop()
    localStorage.removeItem(DIALOG_CONFIG.storageKey)
    next()
  }

  /** Called by the component when its typewriter finishes */
  function onTypingDone() {
    isTyping.value = false
  }

  /** Called by the component when its typewriter starts */
  function onTypingStart() {
    isTyping.value = true
  }

  /* Return */
  return {
    dialogIndex,
    isTyping,
    currentDialog,
    next,
    stop,
    reset,
    onTypingDone,
    onTypingStart
  }
})
