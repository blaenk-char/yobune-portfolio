import { requireAuth, verifySupabaseUser } from '#server/utils/authGuard'
import { useSupabaseAdmin } from '#server/utils/supabaseAdmin'
import { ERROR_MESSAGE } from '#shared/constants'
import { createClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { mockGetUser, mockFindUnique } = vi.hoisted(() => {
  const mockGetUser = vi.fn()
  const mockFindUnique = vi.fn()
  const mockRuntimeConfig = vi.fn(() => ({
    supabaseServiceKey: 'service-secret-key',
    public: {
      supabaseUrl: 'https://example.supabase.co',
      supabaseKey: 'public-anon-key'
    }
  }))

  ;(globalThis as Record<string, unknown>).useRuntimeConfig = mockRuntimeConfig
  ;(globalThis as Record<string, unknown>).prisma = {
    profiles: {
      findUnique: mockFindUnique
    }
  }

  return { mockGetUser, mockFindUnique }
})

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: mockGetUser
    }
  }))
}))

function createAuthEvent(authHeader?: string): H3Event {
  return {
    node: {
      req: {
        headers: authHeader ? { authorization: authHeader } : {}
      }
    }
  } as unknown as H3Event
}

describe('authGuard & supabaseAdmin utilities', () => {
  beforeEach(() => {
    mockGetUser.mockReset()
    mockFindUnique.mockReset()
    vi.mocked(createClient).mockClear()
  })

  describe('verifySupabaseUser', () => {
    it('throws 401 when Authorization header is missing', async () => {
      await expect(verifySupabaseUser(createAuthEvent())).rejects.toMatchObject({
        statusCode: 401,
        statusMessage: ERROR_MESSAGE.auth.token
      })
    })

    it('throws 401 when Bearer token is empty', async () => {
      await expect(verifySupabaseUser(createAuthEvent('Bearer '))).rejects.toMatchObject({
        statusCode: 401,
        statusMessage: ERROR_MESSAGE.auth.token
      })
    })

    it('throws 401 when Supabase returns an auth error or null user', async () => {
      mockGetUser.mockResolvedValueOnce({
        data: { user: null },
        error: new Error('Invalid JWT')
      })

      await expect(verifySupabaseUser(createAuthEvent('Bearer bad-jwt'))).rejects.toMatchObject({
        statusCode: 401,
        statusMessage: ERROR_MESSAGE.auth.invalid
      })
      expect(mockGetUser).toHaveBeenCalledWith('bad-jwt')
    })

    it('returns the Supabase user when Bearer token is valid', async () => {
      const fakeUser = { id: 'u-1', email: 'test@yobune.art' }
      mockGetUser.mockResolvedValueOnce({
        data: { user: fakeUser },
        error: null
      })

      const result = await verifySupabaseUser(createAuthEvent('Bearer valid-jwt'))
      expect(result).toEqual(fakeUser)
      expect(mockGetUser).toHaveBeenCalledWith('valid-jwt')
    })
  })

  describe('requireAuth', () => {
    const fakeUser = { id: 'u-1', email: 'test@yobune.art' }

    it('throws 401 when authenticated user has no profile row in database', async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: fakeUser }, error: null })
      mockFindUnique.mockResolvedValueOnce(null)

      await expect(requireAuth(createAuthEvent('Bearer valid-jwt'))).rejects.toMatchObject({
        statusCode: 401,
        statusMessage: ERROR_MESSAGE.user.notFound
      })
    })

    it('throws 403 when user role is not in allowedRoles', async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: fakeUser }, error: null })
      mockFindUnique.mockResolvedValueOnce({ id: 'u-1', username: 'yobune', role: 'user' })

      await expect(
        requireAuth(createAuthEvent('Bearer valid-jwt'), ['admin'])
      ).rejects.toMatchObject({
        statusCode: 403,
        statusMessage: ERROR_MESSAGE.user.permission
      })
    })

    it('returns user and profile when authenticated and role is permitted', async () => {
      const fakeProfile = { id: 'u-1', username: 'yobune', role: 'admin' }
      mockGetUser.mockResolvedValueOnce({ data: { user: fakeUser }, error: null })
      mockFindUnique.mockResolvedValueOnce(fakeProfile)

      const result = await requireAuth(createAuthEvent('Bearer valid-jwt'), ['admin'])
      expect(result).toEqual({ user: fakeUser, profile: fakeProfile })
    })
  })

  describe('useSupabaseAdmin', () => {
    it('creates an admin client with service key and caches the singleton instance', () => {
      const first = useSupabaseAdmin()
      const second = useSupabaseAdmin()

      expect(first).toBe(second)
      expect(createClient).toHaveBeenCalledTimes(1)
      expect(createClient).toHaveBeenCalledWith(
        'https://example.supabase.co',
        'service-secret-key',
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      )
    })
  })
})
