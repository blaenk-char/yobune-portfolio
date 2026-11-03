import changeEmailHandler from '#server/api/v1/auth/change-email.post'
import confirmHandler from '#server/api/v1/auth/confirm.post'
import forgotPasswordHandler from '#server/api/v1/auth/forgot-password.post'
import oauthHandler from '#server/api/v1/auth/oauth.post'
import registerHandler from '#server/api/v1/auth/register.post'
import resetPasswordHandler from '#server/api/v1/auth/reset-password.post'
import { ERROR_MESSAGE, PAGES, SUCCESS_MESSAGE } from '#shared/constants'
import type { H3Event } from 'h3'
import { createError } from 'h3'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const {
  mockRateLimit,
  mockParseBody,
  mockVerifySupabaseUser,
  mockGenerateUniqueUsername,
  mockPrismaFindUnique,
  mockPrismaCreate,
  mockSignUp,
  mockVerifyOtp,
  mockResetPasswordForEmail,
  mockUpdateUser,
  mockAdminUpdateUserById
} = vi.hoisted(() => {
  const mockRateLimit = vi.fn()
  const mockParseBody = vi.fn()
  const mockVerifySupabaseUser = vi.fn()
  const mockGenerateUniqueUsername = vi.fn()
  const mockPrismaFindUnique = vi.fn()
  const mockPrismaCreate = vi.fn()
  const mockSignUp = vi.fn()
  const mockVerifyOtp = vi.fn()
  const mockResetPasswordForEmail = vi.fn()
  const mockUpdateUser = vi.fn()
  const mockAdminUpdateUserById = vi.fn()

  const g = globalThis as Record<string, unknown>
  g.defineEventHandler = <T>(fn: T) => fn
  g.rateLimit = mockRateLimit
  g.parseBody = mockParseBody
  g.verifySupabaseUser = mockVerifySupabaseUser
  g.generateUniqueUsername = mockGenerateUniqueUsername
  g.useRuntimeConfig = () => ({
    public: {
      siteUrl: 'https://yobune.art'
    }
  })
  g.prisma = {
    profiles: {
      findUnique: mockPrismaFindUnique,
      create: mockPrismaCreate
    }
  }

  return {
    mockRateLimit,
    mockParseBody,
    mockVerifySupabaseUser,
    mockGenerateUniqueUsername,
    mockPrismaFindUnique,
    mockPrismaCreate,
    mockSignUp,
    mockVerifyOtp,
    mockResetPasswordForEmail,
    mockUpdateUser,
    mockAdminUpdateUserById
  }
})

;(globalThis as Record<string, unknown>).createError = createError

vi.mock('#supabase/server', () => ({
  serverSupabaseClient: vi.fn(async () => ({
    auth: {
      signUp: mockSignUp,
      verifyOtp: mockVerifyOtp,
      resetPasswordForEmail: mockResetPasswordForEmail,
      updateUser: mockUpdateUser
    }
  }))
}))

vi.mock('#server/utils/supabaseAdmin', () => ({
  useSupabaseAdmin: vi.fn(() => ({
    auth: {
      admin: {
        updateUserById: mockAdminUpdateUserById
      }
    }
  }))
}))

const mockEvent = { path: '/api/v1/auth/test' } as unknown as H3Event

describe('Server API v1 Auth Handlers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  describe('POST /api/v1/auth/register', () => {
    it('signs up user with confirm redirect URL and returns success message', async () => {
      mockParseBody.mockResolvedValueOnce({ email: 'new@yobune.art', password: 'Valid1!Password' })
      mockSignUp.mockResolvedValueOnce({ error: null })

      const res = await registerHandler(mockEvent)

      expect(mockRateLimit).toHaveBeenCalledWith(mockEvent)
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'new@yobune.art',
        password: 'Valid1!Password',
        options: {
          emailRedirectTo: `https://yobune.art${PAGES.confirm.url}`
        }
      })
      expect(res).toEqual({ message: SUCCESS_MESSAGE.register })
    })

    it('throws 500 when Supabase signUp fails', async () => {
      mockParseBody.mockResolvedValueOnce({ email: 'new@yobune.art', password: 'Valid1!Password' })
      mockSignUp.mockResolvedValueOnce({ error: { message: 'Sign up failed' } })

      await expect(registerHandler(mockEvent)).rejects.toMatchObject({
        statusCode: 500,
        statusMessage: 'Sign up failed'
      })
    })
  })

  describe('POST /api/v1/auth/confirm', () => {
    it('throws 409 when username already exists', async () => {
      mockParseBody.mockResolvedValueOnce({ username: 'taken_name', token: 'tok_1' })
      mockPrismaFindUnique.mockResolvedValueOnce({ id: 'other', username: 'taken_name' })

      await expect(confirmHandler(mockEvent)).rejects.toMatchObject({
        statusCode: 409,
        statusMessage: ERROR_MESSAGE.username.unique
      })
      expect(mockVerifyOtp).not.toHaveBeenCalled()
    })

    it('throws 500 when verifyOtp returns an error', async () => {
      mockParseBody.mockResolvedValueOnce({ username: 'fresh_name', token: 'bad_tok' })
      mockPrismaFindUnique.mockResolvedValueOnce(null)
      mockVerifyOtp.mockResolvedValueOnce({
        data: { user: null },
        error: { message: 'OTP expired' }
      })

      await expect(confirmHandler(mockEvent)).rejects.toMatchObject({
        statusCode: 500,
        statusMessage: 'OTP expired'
      })
    })

    it('throws 401 when verifyOtp succeeds without a user object', async () => {
      mockParseBody.mockResolvedValueOnce({ username: 'fresh_name', token: 'tok_1' })
      mockPrismaFindUnique.mockResolvedValueOnce(null)
      mockVerifyOtp.mockResolvedValueOnce({ data: { user: null }, error: null })

      await expect(confirmHandler(mockEvent)).rejects.toMatchObject({
        statusCode: 401,
        statusMessage: ERROR_MESSAGE.auth.user
      })
    })

    it('verifies signup OTP, creates profile row, and returns success message', async () => {
      mockParseBody.mockResolvedValueOnce({ username: 'fresh_name', token: 'tok_valid' })
      mockPrismaFindUnique.mockResolvedValueOnce(null)
      mockVerifyOtp.mockResolvedValueOnce({
        data: { user: { id: 'u-confirm' } },
        error: null
      })
      mockPrismaCreate.mockResolvedValueOnce({ id: 'u-confirm', username: 'fresh_name' })

      const res = await confirmHandler(mockEvent)

      expect(mockVerifyOtp).toHaveBeenCalledWith({
        token_hash: 'tok_valid',
        type: 'signup'
      })
      expect(mockPrismaCreate).toHaveBeenCalledWith({
        data: { id: 'u-confirm', username: 'fresh_name' }
      })
      expect(res).toEqual({ message: SUCCESS_MESSAGE.confirm })
    })
  })

  describe('POST /api/v1/auth/oauth', () => {
    it('returns existing profile without creating a duplicate for returning OAuth users', async () => {
      const existingProfile = { id: 'u-oauth', username: 'existing_artist', role: 'user' }
      mockVerifySupabaseUser.mockResolvedValueOnce({ id: 'u-oauth' })
      mockPrismaFindUnique.mockResolvedValueOnce(existingProfile)

      const res = await oauthHandler(mockEvent)

      expect(mockRateLimit).toHaveBeenCalledWith(mockEvent)
      expect(res).toEqual(existingProfile)
      expect(mockGenerateUniqueUsername).not.toHaveBeenCalled()
      expect(mockPrismaCreate).not.toHaveBeenCalled()
    })

    it('generates a unique username and creates profile for first-time OAuth users', async () => {
      const oauthUser = { id: 'u-new-oauth', email: 'google@yobune.art' }
      const createdProfile = { id: 'u-new-oauth', username: 'google_user', role: 'user' }
      mockVerifySupabaseUser.mockResolvedValueOnce(oauthUser)
      mockPrismaFindUnique.mockResolvedValueOnce(null)
      mockGenerateUniqueUsername.mockResolvedValueOnce('google_user')
      mockPrismaCreate.mockResolvedValueOnce(createdProfile)

      const res = await oauthHandler(mockEvent)

      expect(mockGenerateUniqueUsername).toHaveBeenCalledWith(oauthUser)
      expect(mockPrismaCreate).toHaveBeenCalledWith({
        data: { id: 'u-new-oauth', username: 'google_user' }
      })
      expect(res).toEqual(createdProfile)
    })
  })

  describe('POST /api/v1/auth/forgot-password', () => {
    it('sends reset password email with reset-password redirect URL', async () => {
      mockParseBody.mockResolvedValueOnce({ email: 'user@yobune.art' })
      mockResetPasswordForEmail.mockResolvedValueOnce({ error: null })

      const res = await forgotPasswordHandler(mockEvent)

      expect(mockResetPasswordForEmail).toHaveBeenCalledWith('user@yobune.art', {
        redirectTo: `https://yobune.art${PAGES.resetPassword.url}`
      })
      expect(res).toEqual({ message: SUCCESS_MESSAGE.resetPassword })
    })

    it('throws 400 when resetPasswordForEmail fails', async () => {
      mockParseBody.mockResolvedValueOnce({ email: 'user@yobune.art' })
      mockResetPasswordForEmail.mockResolvedValueOnce({ error: { message: 'Rate limited' } })

      await expect(forgotPasswordHandler(mockEvent)).rejects.toMatchObject({
        statusCode: 400,
        statusMessage: 'Rate limited'
      })
    })
  })

  describe('POST /api/v1/auth/reset-password', () => {
    it('throws 500 when recovery OTP verification fails', async () => {
      mockParseBody.mockResolvedValueOnce({ password: 'Valid1!Password', token: 'bad_tok' })
      mockVerifyOtp.mockResolvedValueOnce({
        data: { user: null },
        error: { message: 'Invalid recovery token' }
      })

      await expect(resetPasswordHandler(mockEvent)).rejects.toMatchObject({
        statusCode: 500,
        statusMessage: 'Invalid recovery token'
      })
    })

    it('throws 401 when recovery OTP verification returns no user', async () => {
      mockParseBody.mockResolvedValueOnce({ password: 'Valid1!Password', token: 'tok' })
      mockVerifyOtp.mockResolvedValueOnce({ data: { user: null }, error: null })

      await expect(resetPasswordHandler(mockEvent)).rejects.toMatchObject({
        statusCode: 401,
        statusMessage: ERROR_MESSAGE.auth.user
      })
    })

    it('throws 500 when admin password update fails', async () => {
      mockParseBody.mockResolvedValueOnce({ password: 'Valid1!Password', token: 'tok' })
      mockVerifyOtp.mockResolvedValueOnce({ data: { user: { id: 'u-1' } }, error: null })
      mockAdminUpdateUserById.mockResolvedValueOnce({ error: { message: 'Admin update failed' } })

      await expect(resetPasswordHandler(mockEvent)).rejects.toMatchObject({
        statusCode: 500,
        statusMessage: 'Admin update failed'
      })
    })

    it('verifies recovery token and updates password via Supabase Admin', async () => {
      mockParseBody.mockResolvedValueOnce({ password: 'Valid1!Password', token: 'tok_rec' })
      mockVerifyOtp.mockResolvedValueOnce({ data: { user: { id: 'u-1' } }, error: null })
      mockAdminUpdateUserById.mockResolvedValueOnce({ error: null })

      const res = await resetPasswordHandler(mockEvent)

      expect(mockVerifyOtp).toHaveBeenCalledWith({ token_hash: 'tok_rec', type: 'recovery' })
      expect(mockAdminUpdateUserById).toHaveBeenCalledWith('u-1', { password: 'Valid1!Password' })
      expect(res).toEqual({ message: SUCCESS_MESSAGE.updatePassword })
    })
  })

  describe('POST /api/v1/auth/change-email', () => {
    it('requests Supabase email update with change-email redirect URL', async () => {
      mockParseBody.mockResolvedValueOnce({ email: 'new@yobune.art' })
      mockUpdateUser.mockResolvedValueOnce({ error: null })

      const res = await changeEmailHandler(mockEvent)

      expect(mockUpdateUser).toHaveBeenCalledWith(
        { email: 'new@yobune.art' },
        { emailRedirectTo: `https://yobune.art${PAGES.changeEmail.url}` }
      )
      expect(res).toEqual({ message: SUCCESS_MESSAGE.changeEmail })
    })

    it('throws 400 when Supabase updateUser returns an error', async () => {
      mockParseBody.mockResolvedValueOnce({ email: 'new@yobune.art' })
      mockUpdateUser.mockResolvedValueOnce({ error: { message: 'Email already registered' } })

      await expect(changeEmailHandler(mockEvent)).rejects.toMatchObject({
        statusCode: 400,
        statusMessage: 'Email already registered'
      })
    })
  })
})
