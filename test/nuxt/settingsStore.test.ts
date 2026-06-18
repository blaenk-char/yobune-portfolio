import { useSettingsStore } from '#imports'
import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { CURSOR_CONFIG, NSFW_CONFIG } from '#shared/constants'

describe('useSettingsStore', () => {
  let store: ReturnType<typeof useSettingsStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useSettingsStore()
    localStorage.clear()
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

  it('toggleCursor() saves to localStorage', () => {
    store.toggleCursor()
    expect(localStorage.getItem(CURSOR_CONFIG.storageKey)).toBe(String(store.cursor))
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

  it('localStorage value stays in sync after multiple toggles', () => {
    store.toggleCursor()
    store.toggleCursor()
    store.toggleCursor()
    expect(localStorage.getItem(CURSOR_CONFIG.storageKey)).toBe(String(store.cursor))
  })
})
