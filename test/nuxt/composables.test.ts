import { DIALOG_CONFIG, PAGES, SUCCESS_MESSAGE } from '#shared/constants'
import { mockNuxtImport, mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const {
  mockGetSession,
  mockSignInWithPassword,
  mockSignInWithOAuth,
  mockSignOut,
  mockVerifyOtp,
  mockRefreshSession,
  mockOnAuthStateChange,
  mockSupabaseUser,
  mockNavigateTo
} = vi.hoisted(() => ({
  mockGetSession: vi.fn().mockResolvedValue({ data: { session: null } }),
  mockSignInWithPassword: vi.fn(),
  mockSignInWithOAuth: vi.fn(),
  mockSignOut: vi.fn(),
  mockVerifyOtp: vi.fn(),
  mockRefreshSession: vi.fn(),
  mockOnAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
  mockSupabaseUser: {
    value: { id: 'u-1', email: 'artist@yobune.art' } as Record<string, string> | null
  },
  mockNavigateTo: vi.fn()
}))

mockNuxtImport('useSupabaseClient', () => () => ({
  auth: {
    getSession: mockGetSession,
    signInWithPassword: mockSignInWithPassword,
    signInWithOAuth: mockSignInWithOAuth,
    signOut: mockSignOut,
    verifyOtp: mockVerifyOtp,
    refreshSession: mockRefreshSession,
    onAuthStateChange: mockOnAuthStateChange
  }
}))

mockNuxtImport('useSupabaseUser', () => () => mockSupabaseUser)
mockNuxtImport('navigateTo', () => mockNavigateTo)

const mockMeEndpoint = vi.fn()
const mockUpdateUsernameEndpoint = vi.fn()
const mockDeleteEndpoint = vi.fn()
const mockOAuthEndpoint = vi.fn()
const mockRegisterEndpoint = vi.fn()
const mockConfirmEndpoint = vi.fn()
const mockForgotPasswordEndpoint = vi.fn()
const mockResetPasswordEndpoint = vi.fn()
const mockChangeEmailEndpoint = vi.fn()

registerEndpoint('/api/v1/profile/me', (event) =>
  mockMeEndpoint(event.headers.get('authorization'))
)
registerEndpoint('/api/v1/profile/username', {
  method: 'PUT',
  handler: async (event) =>
    mockUpdateUsernameEndpoint(event.headers.get('authorization'), await event.web!.request!.json())
})
registerEndpoint('/api/v1/profile/delete', {
  method: 'DELETE',
  handler: (event) => mockDeleteEndpoint(event.headers.get('authorization'))
})
registerEndpoint('/api/v1/auth/oauth', {
  method: 'POST',
  handler: (event) => mockOAuthEndpoint(event.headers.get('authorization'))
})
registerEndpoint('/api/v1/auth/register', {
  method: 'POST',
  handler: async (event) => mockRegisterEndpoint(await event.web!.request!.json())
})
registerEndpoint('/api/v1/auth/confirm', {
  method: 'POST',
  handler: async (event) => mockConfirmEndpoint(await event.web!.request!.json())
})
registerEndpoint('/api/v1/auth/forgot-password', {
  method: 'POST',
  handler: async (event) => mockForgotPasswordEndpoint(await event.web!.request!.json())
})
registerEndpoint('/api/v1/auth/reset-password', {
  method: 'POST',
  handler: async (event) => mockResetPasswordEndpoint(await event.web!.request!.json())
})
registerEndpoint('/api/v1/auth/change-email', {
  method: 'POST',
  handler: async (event) =>
    mockChangeEmailEndpoint(event.headers.get('authorization'), await event.web!.request!.json())
})

describe('Nuxt Composables', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetSession.mockResolvedValue({ data: { session: null } })
    mockSupabaseUser.value = { id: 'u-1', email: 'artist@yobune.art' }
    useAuthStore().clear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('useLightbox', () => {
    it('opens with image URL, shares state across instances, and closes cleanly', () => {
      const a = useLightbox()
      const b = useLightbox()

      a.close()
      expect(a.isOpen.value).toBe(false)
      expect(a.image.value).toBe('')

      a.open('/banners/1.webp')
      expect(b.isOpen.value).toBe(true)
      expect(b.image.value).toBe('/banners/1.webp')

      b.close()
      expect(a.isOpen.value).toBe(false)
      expect(a.image.value).toBe('')
    })
  })

  describe('useTypewriter', () => {
    it('types characters at DIALOG_CONFIG.speed, triggers onDone, and supports stop/restart', async () => {
      vi.useFakeTimers()
      const text = ref('Hi!')
      let writer!: ReturnType<typeof useTypewriter>

      const Host = defineComponent({
        setup() {
          writer = useTypewriter(text)
          return () => h('div', writer.output.value)
        }
      })

      const wrapper = await mountSuspended(Host)
      const onDone = vi.fn()

      writer.start(onDone)
      expect(writer.output.value).toBe('')

      vi.advanceTimersByTime(DIALOG_CONFIG.speed)
      expect(writer.output.value).toBe('H')

      vi.advanceTimersByTime(DIALOG_CONFIG.speed)
      expect(writer.output.value).toBe('Hi')
      expect(onDone).not.toHaveBeenCalled()

      vi.advanceTimersByTime(DIALOG_CONFIG.speed)
      expect(writer.output.value).toBe('Hi!')
      expect(onDone).toHaveBeenCalledOnce()

      // Restarting resets output and stop() halts midway
      text.value = 'ABCD'
      writer.start()
      vi.advanceTimersByTime(DIALOG_CONFIG.speed)
      expect(writer.output.value).toBe('A')

      writer.stop()
      vi.advanceTimersByTime(DIALOG_CONFIG.speed * 5)
      expect(writer.output.value).toBe('A')

      wrapper.unmount()
    })
  })

  describe('useDevice', () => {
    it('exposes reactive boolean device flags', async () => {
      let device!: ReturnType<typeof useDevice>
      const Host = defineComponent({
        setup() {
          device = useDevice()
          return () => h('div')
        }
      })

      await mountSuspended(Host)
      expect(typeof device.isMobile.value).toBe('boolean')
      expect(typeof device.isTablet.value).toBe('boolean')
      expect(typeof device.isDesktop.value).toBe('boolean')
    })
  })

  describe('useProfile', () => {
    it('sets profile to null and ready to true when there is no Supabase session', async () => {
      const authStore = useAuthStore()
      const { fetchProfile } = useProfile()

      mockGetSession.mockResolvedValueOnce({ data: { session: null } })
      await fetchProfile()

      expect(authStore.profile).toBeNull()
      expect(authStore.ready).toBe(true)
      expect(mockMeEndpoint).not.toHaveBeenCalled()
    })

    it('fetches /api/v1/profile/me with Bearer token and updates authStore', async () => {
      const authStore = useAuthStore()
      const { fetchProfile } = useProfile()
      const fakeProfile = { id: 'u-1', username: 'yobune', role: 'user' }

      mockGetSession.mockResolvedValue({
        data: { session: { access_token: 'jwt-123' } }
      })
      mockMeEndpoint.mockReturnValueOnce(fakeProfile)

      await fetchProfile()

      expect(mockMeEndpoint).toHaveBeenCalledWith('Bearer jwt-123')
      expect(authStore.profile).toMatchObject(fakeProfile)
      expect(authStore.ready).toBe(true)
    })

    it('clears profile and marks ready=true if /api/v1/profile/me throws', async () => {
      const authStore = useAuthStore()
      const { fetchProfile } = useProfile()

      mockGetSession.mockResolvedValue({
        data: { session: { access_token: 'expired-jwt' } }
      })
      mockMeEndpoint.mockImplementationOnce(() => {
        throw createError({ statusCode: 401 })
      })

      await fetchProfile()

      expect(authStore.profile).toBeNull()
      expect(authStore.ready).toBe(true)
    })

    it('updates username via PUT /api/v1/profile/username and refreshes profile', async () => {
      const authStore = useAuthStore()
      const { updateUsername } = useProfile()

      mockGetSession.mockResolvedValue({ data: { session: { access_token: 'jwt-123' } } })

      mockUpdateUsernameEndpoint.mockReturnValueOnce({ message: SUCCESS_MESSAGE.usernameUpdated })
      mockMeEndpoint.mockReturnValueOnce({ id: 'u-1', username: 'renamed', role: 'user' })

      const res = await updateUsername({ username: 'renamed' })

      expect(mockUpdateUsernameEndpoint).toHaveBeenCalledWith('Bearer jwt-123', {
        username: 'renamed'
      })
      expect(res).toEqual({ message: SUCCESS_MESSAGE.usernameUpdated })
      expect(authStore.profile?.username).toBe('renamed')
    })
  })

  describe('useAuth', () => {
    it('logs in with email/password and fetches profile', async () => {
      const authStore = useAuthStore()
      const { login } = useAuth()

      mockSignInWithPassword.mockResolvedValueOnce({ error: null })
      mockGetSession.mockResolvedValue({ data: { session: { access_token: 'jwt-login' } } })
      mockMeEndpoint.mockReturnValueOnce({ id: 'u-1', username: 'yobune', role: 'user' })

      await login({ email: 'artist@yobune.art', password: 'Valid1!Password' })

      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: 'artist@yobune.art',
        password: 'Valid1!Password'
      })
      expect(authStore.profile?.username).toBe('yobune')
    })

    it('initiates Google OAuth login with window.location.origin and preserves ?redirect query', async () => {
      const route = useRoute()
      const { loginWithGoogle } = useAuth()
      mockSignInWithOAuth.mockResolvedValue({ error: null })

      await loginWithGoogle()

      expect(mockSignInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      })

      route.query.redirect = '/profile'
      await loginWithGoogle()

      expect(mockSignInWithOAuth).toHaveBeenLastCalledWith({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}?redirect=%2Fprofile`
        }
      })

      // Protocol-relative URLs must be ignored
      route.query.redirect = '//evil.com'
      await loginWithGoogle()

      expect(mockSignInWithOAuth).toHaveBeenLastCalledWith({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      })
      delete route.query.redirect
    })

    it('confirms OAuth session via POST /api/v1/auth/oauth and populates authStore', async () => {
      const authStore = useAuthStore()
      const { confirmOAuth } = useAuth()

      mockGetSession.mockResolvedValue({ data: { session: { access_token: 'jwt-oauth' } } })
      mockOAuthEndpoint.mockReturnValueOnce({
        id: 'u-google',
        username: 'google_artist',
        role: 'user'
      })

      await confirmOAuth()

      expect(mockOAuthEndpoint).toHaveBeenCalledWith('Bearer jwt-oauth')
      expect(authStore.profile?.username).toBe('google_artist')
      expect(authStore.ready).toBe(true)
    })

    it('logs out, clears authStore, and navigates to /auth', async () => {
      const authStore = useAuthStore()
      const { logout } = useAuth()
      authStore.profile = {
        id: 'u-1',
        username: 'yobune',
        role: 'user'
      }
      mockSignOut.mockResolvedValueOnce({ error: null })

      await logout()

      expect(mockSignOut).toHaveBeenCalledOnce()
      expect(authStore.profile).toBeNull()
      expect(mockNavigateTo).toHaveBeenCalledWith(PAGES.auth.url)
    })

    it('posts to register, confirm (and fetches profile), forgotPassword, resetPassword, and changeEmail v1 endpoints', async () => {
      const authStore = useAuthStore()
      const { register, confirm, forgotPassword, resetPassword, changeEmail } = useAuth()

      mockRegisterEndpoint.mockReturnValueOnce({ message: SUCCESS_MESSAGE.register })
      mockConfirmEndpoint.mockReturnValueOnce({ message: SUCCESS_MESSAGE.confirm })
      mockGetSession.mockResolvedValue({ data: { session: { access_token: 'jwt-confirm' } } })
      mockMeEndpoint.mockReturnValueOnce({ id: 'u-confirm', username: 'yobune', role: 'user' })
      mockForgotPasswordEndpoint.mockReturnValueOnce({ message: SUCCESS_MESSAGE.resetPassword })
      mockResetPasswordEndpoint.mockReturnValueOnce({ message: SUCCESS_MESSAGE.updatePassword })
      mockChangeEmailEndpoint.mockReturnValueOnce({ message: SUCCESS_MESSAGE.changeEmail })

      expect(
        await register({
          email: 'a@b.com',
          password: 'Valid1!Password',
          confirmPassword: 'Valid1!Password'
        })
      ).toEqual({ message: SUCCESS_MESSAGE.register })

      expect(await confirm({ username: 'yobune', token: 'tok_1' })).toEqual({
        message: SUCCESS_MESSAGE.confirm
      })
      expect(authStore.profile?.username).toBe('yobune')

      expect(await forgotPassword({ email: 'a@b.com' })).toEqual({
        message: SUCCESS_MESSAGE.resetPassword
      })

      expect(
        await resetPassword({
          password: 'Valid1!Password',
          confirmPassword: 'Valid1!Password',
          token: 'tok_r'
        })
      ).toEqual({ message: SUCCESS_MESSAGE.updatePassword })

      mockGetSession.mockResolvedValue({ data: { session: { access_token: 'jwt-email' } } })
      expect(await changeEmail({ email: 'new@b.com' })).toEqual({
        message: SUCCESS_MESSAGE.changeEmail
      })
      expect(mockChangeEmailEndpoint).toHaveBeenCalledWith('Bearer jwt-email', {
        email: 'new@b.com'
      })
    })

    it('confirms email change OTP and refreshes Supabase session', async () => {
      const { confirmEmail } = useAuth()
      mockVerifyOtp.mockResolvedValueOnce({ data: { user: { id: 'u-1' } }, error: null })
      mockRefreshSession.mockResolvedValueOnce({ error: null })

      await confirmEmail({ token: 'tok_email_change' })

      expect(mockVerifyOtp).toHaveBeenCalledWith({
        type: 'email_change',
        token_hash: 'tok_email_change'
      })
      expect(mockRefreshSession).toHaveBeenCalledOnce()
    })

    it('verifies current password before sending password reset link in changePassword', async () => {
      const { changePassword } = useAuth()
      mockSignInWithPassword.mockResolvedValueOnce({ error: null })
      mockForgotPasswordEndpoint.mockReturnValueOnce({ message: SUCCESS_MESSAGE.resetPassword })

      const res = await changePassword({ password: 'Valid1!Password' })

      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: 'artist@yobune.art',
        password: 'Valid1!Password'
      })
      expect(mockForgotPasswordEndpoint).toHaveBeenCalledWith({ email: 'artist@yobune.art' })
      expect(res).toEqual({ message: SUCCESS_MESSAGE.resetPassword })
    })

    it('deletes account via DELETE /api/v1/profile/delete and logs out', async () => {
      const { deleteAccount } = useAuth()
      mockGetSession.mockResolvedValueOnce({ data: { session: { access_token: 'jwt-del' } } })
      mockDeleteEndpoint.mockReturnValueOnce({ message: SUCCESS_MESSAGE.accountDeleted })
      mockSignOut.mockResolvedValueOnce({ error: null })

      const res = await deleteAccount()

      expect(mockDeleteEndpoint).toHaveBeenCalledWith('Bearer jwt-del')
      expect(mockSignOut).toHaveBeenCalledOnce()
      expect(res).toEqual({ message: SUCCESS_MESSAGE.accountDeleted })
    })
  })
})
