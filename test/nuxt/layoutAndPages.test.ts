import { CURSOR_CONFIG, FOOTER_CONFIG, PAGES, TITLES, UI_TEXT } from '#shared/constants'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it } from 'vitest'
import AuthGoogleButton from '~/components/auth/GoogleButton.vue'
import AuthLogoutButton from '~/components/auth/LogoutButton.vue'
import AuthPasswordInput from '~/components/auth/PasswordInput.vue'
import LayoutFooter from '~/components/layout/Footer.vue'
import LayoutHeader from '~/components/layout/Header.vue'
import ProfileEmail from '~/components/profile/Email.vue'
import ProfilePassword from '~/components/profile/Password.vue'
import ProfileUsername from '~/components/profile/Username.vue'
import PrivacyPage from '~/pages/privacy.vue'

describe('Layout, Auth, Profile & Privacy Components', () => {
  beforeEach(async () => {
    await navigateTo(PAGES.home.url)
    useAuthStore().clear()
  })

  describe('LayoutHeader', () => {
    it('renders site title and "?" avatar when logged out', async () => {
      const wrapper = await mountSuspended(LayoutHeader)

      expect(wrapper.text()).toContain(TITLES.main)
      expect(wrapper.text()).toContain('?')
    })

    it('renders uppercase user initial in avatar when logged in and toggles cursor mode', async () => {
      const authStore = useAuthStore()
      const settingsStore = useSettingsStore()
      authStore.profile = {
        id: 'u-1',
        username: 'yobune',
        role: 'user'
      }
      settingsStore.cursor = true

      const wrapper = await mountSuspended(LayoutHeader)

      expect(wrapper.text()).toContain('Y')

      const cursorBtn = wrapper
        .findAll('button')
        .find((b) => b.text().includes(CURSOR_CONFIG.trueLabel))
      expect(cursorBtn).toBeDefined()

      await cursorBtn!.trigger('click')
      expect(settingsStore.cursor).toBe(false)
      expect(wrapper.text()).toContain(CURSOR_CONFIG.falseLabel)
    })
  })

  describe('LayoutFooter', () => {
    it('renders ownership, contact, legal notice, credit link, and inactive Privacy Policy link', async () => {
      await navigateTo(PAGES.privacy.url)
      const wrapper = await mountSuspended(LayoutFooter)

      expect(wrapper.text()).toContain(FOOTER_CONFIG.ownership[0])
      expect(wrapper.text()).toContain(FOOTER_CONFIG.contact)
      expect(wrapper.text()).toContain(String(new Date().getFullYear()))
      expect(wrapper.text()).toContain(FOOTER_CONFIG.legal)

      const privacyLink = wrapper.findAll('a').find((a) => a.text().includes(UI_TEXT.privacyPolicy))
      expect(privacyLink).toBeDefined()
      expect(privacyLink!.attributes('href')).toBe(PAGES.privacy.url)
      expect(privacyLink!.attributes('aria-current')).toBeUndefined()
    })
  })

  describe('Auth Components (PasswordInput, GoogleButton, LogoutButton)', () => {
    it('toggles password visibility between type="password" and type="text"', async () => {
      const wrapper = await mountSuspended(AuthPasswordInput)

      const input = wrapper.find('input')
      expect(input.attributes('type')).toBe('password')

      await wrapper.find('button').trigger('click')
      expect(input.attributes('type')).toBe('text')

      await wrapper.find('button').trigger('click')
      expect(input.attributes('type')).toBe('password')
    })

    it('renders Google OAuth and Logout buttons with expected labels', async () => {
      const googleBtn = await mountSuspended(AuthGoogleButton)
      expect(googleBtn.text()).toContain(UI_TEXT.continueWithGoogle)

      const logoutBtn = await mountSuspended(AuthLogoutButton)
      expect(logoutBtn.text()).toContain(UI_TEXT.logout)
    })
  })

  describe('Profile Components & Autofill Prevention', () => {
    it('disables browser autofill on ProfileEmail (autocomplete="off") and ProfilePassword (autocomplete="new-password")', async () => {
      const emailWrapper = await mountSuspended(ProfileEmail)
      expect(emailWrapper.find('input').attributes('autocomplete')).toBe('off')

      const passwordWrapper = await mountSuspended(ProfilePassword)
      expect(passwordWrapper.find('input').attributes('autocomplete')).toBe('new-password')
    })

    it('pre-populates current username in ProfileUsername input', async () => {
      const authStore = useAuthStore()
      authStore.profile = {
        id: 'u-1',
        username: 'current_artist',
        role: 'user'
      }

      const wrapper = await mountSuspended(ProfileUsername)
      expect((wrapper.find('input').element as HTMLInputElement).value).toBe('current_artist')
    })
  })

  describe('Privacy Policy Page (/privacy)', () => {
    it('renders read-only Markdown UEditor populated with PRIVACY_POLICY', async () => {
      const wrapper = await mountSuspended(PrivacyPage)

      expect(wrapper.text()).toContain('Privacy Policy')
      expect(wrapper.text()).toContain(CURSOR_CONFIG.storageKey)
      expect(wrapper.find('[contenteditable="true"]').exists()).toBe(false)
    })
  })
})
