import {
  CURSOR_CONFIG,
  DIALOG_CONFIG,
  DIALOGS,
  NSFW_CONFIG,
  PAGES,
  PRIVACY_POLICY,
  PROFILE_MENU,
  PROFILE_SECTIONS,
  SOCIALS
} from '#shared/constants'
import { describe, expect, it } from 'vitest'

describe('Shared Constants Integrity', () => {
  it('defines unique, root-relative page URLs in PAGES', () => {
    const urls = Object.values(PAGES).map((p) => p.url)
    expect(urls.every((url) => url.startsWith('/'))).toBe(true)
    expect(new Set(urls).size).toBe(urls.length)
  })

  it('defines unique dialog scenes and non-empty config keys', () => {
    expect(DIALOGS.length).toBeGreaterThan(0)
    const ids = DIALOGS.map((d) => d.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(DIALOG_CONFIG.storageKey).toBeTruthy()
    expect(CURSOR_CONFIG.storageKey).toBeTruthy()
    expect(NSFW_CONFIG.pages).toContain(PAGES.home.url)
  })

  it('maps every PROFILE_SECTIONS entry into PROFILE_MENU with hash links and active=false', () => {
    const sectionValues = Object.values(PROFILE_SECTIONS)
    expect(PROFILE_MENU.length).toBe(sectionValues.length)
    for (const item of PROFILE_MENU) {
      expect(sectionValues).toContain(item.id)
      expect(item.to).toBe(`${PAGES.profile.url}#${item.id}`)
      expect(item.active).toBe(false)
    }
  })

  it('contains valid external social links', () => {
    expect(SOCIALS.length).toBeGreaterThan(0)
    for (const social of SOCIALS) {
      expect(String(social.to)).toMatch(/^https:\/\//)
      expect(social.target).toBe('_blank')
    }
  })

  it('includes GDPR sections and cookie disclosures in PRIVACY_POLICY markdown', () => {
    expect(PRIVACY_POLICY).toContain('# Privacy Policy')
    expect(PRIVACY_POLICY).toContain(CURSOR_CONFIG.storageKey)
    expect(PRIVACY_POLICY).toContain(DIALOG_CONFIG.storageKey)
    expect(PRIVACY_POLICY).toContain('blaenk-color-mode')
    expect(PRIVACY_POLICY).toContain('GDPR')
  })
})
