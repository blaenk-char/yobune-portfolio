import { CURSOR_CONFIG, DIALOG_CONFIG, DIALOGS, NSFW_CONFIG, PAGES } from '#shared/constants'
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('Pinia Stores (Auth, Settings, Dialog)', () => {
  beforeEach(async () => {
    await navigateTo(PAGES.home.url)
  })

  describe('useAuthStore', () => {
    it('manages profile and ready state and clears cleanly', () => {
      const authStore = useAuthStore()
      authStore.profile = {
        id: 'u-1',
        username: 'yobune',
        role: 'user'
      }
      authStore.ready = false

      authStore.clear()

      expect(authStore.profile).toBeNull()
      expect(authStore.ready).toBe(true)
    })
  })

  describe('useSettingsStore', () => {
    it('persists cursor preference in cookie and syncs body class with route allowance', async () => {
      const settingsStore = useSettingsStore()

      settingsStore.cursor = true
      settingsStore.nsfw = NSFW_CONFIG.default
      await nextTick()

      expect(settingsStore.showCursor).toBe(true)
      expect(settingsStore.showNsfw).toBe(true)
      expect(settingsStore.showDialog).toBe(true)

      // Toggle off -> cookie becomes false and class is removed
      settingsStore.toggleCursor()
      await nextTick()
      expect(settingsStore.cursor).toBe(false)
      expect(useCookie<boolean>(CURSOR_CONFIG.storageKey).value).toBe(false)
      expect(document.body.classList.contains(CURSOR_CONFIG.className)).toBe(false)

      // Toggle back on -> cookie becomes true and class is added on '/'
      settingsStore.toggleCursor()
      await nextTick()
      expect(settingsStore.cursor).toBe(true)
      expect(useCookie<boolean>(CURSOR_CONFIG.storageKey).value).toBe(true)
      expect(document.body.classList.contains(CURSOR_CONFIG.className)).toBe(true)

      // Navigating away from '/' disables page-scoped features and removes body cursor class
      await navigateTo(PAGES.privacy.url)
      await nextTick()
      expect(settingsStore.showCursor).toBe(false)
      expect(settingsStore.showNsfw).toBe(false)
      expect(settingsStore.showDialog).toBe(false)
      expect(document.body.classList.contains(CURSOR_CONFIG.className)).toBe(false)
    })
  })

  describe('useDialogStore', () => {
    it('steps through DIALOGS, respects typing lock, and writes cookie on stop and reset', async () => {
      const dialogStore = useDialogStore()

      dialogStore.stop()
      dialogStore.onTypingDone()
      await nextTick()
      expect(dialogStore.dialogIndex).toBe(-1)
      expect(dialogStore.currentDialog).toBeNull()

      // Advance to first dialog
      const scrollSpy = vi.fn()
      const el = document.createElement('div')
      el.id = DIALOGS[0]!.id
      el.scrollIntoView = scrollSpy
      document.body.appendChild(el)

      await dialogStore.next()
      expect(dialogStore.dialogIndex).toBe(0)
      expect(dialogStore.currentDialog?.id).toBe(DIALOGS[0]!.id)
      expect(scrollSpy).toHaveBeenCalledOnce()
      el.remove()

      // Typing lock blocks advancing
      dialogStore.onTypingStart()
      await dialogStore.next()
      expect(dialogStore.dialogIndex).toBe(0)

      // Unlock and advance to end -> stops and sets cookie to false
      dialogStore.onTypingDone()
      dialogStore.dialogIndex = DIALOGS.length - 1
      await dialogStore.next()
      await nextTick()

      expect(dialogStore.dialogIndex).toBe(-1)
      expect(useCookie<boolean | null>(DIALOG_CONFIG.storageKey).value).toBe(false)

      // Reset clears cookie so it is no longer false and starts back at index 0
      dialogStore.reset()
      await nextTick()
      expect(useCookie<boolean | null>(DIALOG_CONFIG.storageKey).value).not.toBe(false)
      expect(dialogStore.dialogIndex).toBe(0)
    })
  })
})
