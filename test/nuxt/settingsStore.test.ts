import { useCookie, useSettingsStore } from '#imports'
import { CURSOR_CONFIG, NSFW_CONFIG } from '#shared/constants'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

describe('useSettingsStore', () => {
  let store: ReturnType<typeof useSettingsStore>

  beforeEach(() => {
    useCookie(CURSOR_CONFIG.storageKey).value = null
    setActivePinia(createPinia())
    store = useSettingsStore()
    document.body.classList.remove(CURSOR_CONFIG.className)
  })

  // NSFW
  it('nsfw has default value', () => {
    expect(store.nsfw).toBe(NSFW_CONFIG.default)
  })

  it('nsfw can be set to true', () => {
    store.nsfw = true
    expect(store.nsfw).toBe(true)
  })

  it('nsfw can be toggled back to false', () => {
    store.nsfw = true
    store.nsfw = false
    expect(store.nsfw).toBe(false)
  })

  // Cursor
  it('toggleCursor() toggles the cursor boolean', () => {
    const before = store.cursor
    store.toggleCursor()
    expect(store.cursor).toBe(!before)
  })

  it('toggleCursor() saves to cookie', () => {
    store.toggleCursor()
    expect(useCookie(CURSOR_CONFIG.storageKey).value).toBe(store.cursor)
  })

  it('two toggleCursor() calls return to the original value', () => {
    const initial = store.cursor
    store.toggleCursor()
    store.toggleCursor()
    expect(store.cursor).toBe(initial)
  })

  it('adds the CSS class to body when cursor becomes true', () => {
    // force cursor off, then toggle on
    if (store.cursor) store.toggleCursor()
    store.toggleCursor()
    expect(store.cursor).toBe(true)
    expect(document.body.classList.contains(CURSOR_CONFIG.className)).toBe(true)
  })

  it('removes the CSS class from body when cursor becomes false', () => {
    // force cursor on, then toggle off
    if (!store.cursor) store.toggleCursor()
    store.toggleCursor()
    expect(store.cursor).toBe(false)
    expect(document.body.classList.contains(CURSOR_CONFIG.className)).toBe(false)
  })

  it('cookie value stays in sync after multiple toggles', () => {
    store.toggleCursor()
    store.toggleCursor()
    store.toggleCursor()
    expect(useCookie(CURSOR_CONFIG.storageKey).value).toBe(store.cursor)
  })
})
