import { ERROR_MESSAGE, PAGES, UI_TEXT } from '#shared/constants'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { mockToastAdd } = vi.hoisted(() => ({
  mockToastAdd: vi.fn()
}))

mockNuxtImport('useToast', () => () => ({
  add: mockToastAdd
}))

describe('Client Utilities', () => {
  beforeEach(async () => {
    mockToastAdd.mockClear()
    await navigateTo(PAGES.home.url)
  })

  describe('withLoading', () => {
    it('sets loading to true while executing and false once resolved', async () => {
      const loading = ref(false)
      let observedDuringRun = false

      const result = await withLoading(loading, async () => {
        observedDuringRun = loading.value
        return 'ok'
      })

      expect(observedDuringRun).toBe(true)
      expect(loading.value).toBe(false)
      expect(result).toBe('ok')
    })

    it('resets loading to false even when the async callback rejects', async () => {
      const loading = ref(false)

      await expect(
        withLoading(loading, async () => {
          expect(loading.value).toBe(true)
          throw new Error('boom')
        })
      ).rejects.toThrow('boom')

      expect(loading.value).toBe(false)
    })
  })

  describe('isPageAllowed', () => {
    it('returns true when current route path is in allowed pages list and false otherwise', async () => {
      await navigateTo(PAGES.home.url)
      expect(isPageAllowed([PAGES.home.url])).toBe(true)
      expect(isPageAllowed([PAGES.profile.url])).toBe(false)

      await navigateTo(PAGES.privacy.url)
      expect(isPageAllowed([PAGES.privacy.url])).toBe(true)
      expect(isPageAllowed([PAGES.home.url])).toBe(false)
    })
  })

  describe('addToast', () => {
    it('dispatches a success toast with UI_TEXT.success title', () => {
      addToast('Profile saved', 'success')

      expect(mockToastAdd).toHaveBeenCalledWith({
        title: UI_TEXT.success,
        description: 'Profile saved',
        color: 'success'
      })
    })

    it('dispatches an error toast and falls back to ERROR_MESSAGE.server when message is empty', () => {
      addToast(undefined, 'error')

      expect(mockToastAdd).toHaveBeenCalledWith({
        title: UI_TEXT.error,
        description: ERROR_MESSAGE.server,
        color: 'error'
      })
    })
  })
})
