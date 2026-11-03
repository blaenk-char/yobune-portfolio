import deleteAccountHandler from '#server/api/v1/profile/delete.delete'
import meHandler from '#server/api/v1/profile/me.get'
import updateUsernameHandler from '#server/api/v1/profile/username.put'
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from '#shared/constants'
import type { H3Event } from 'h3'
import { createError } from 'h3'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const {
  mockRateLimit,
  mockRequireAuth,
  mockParseBody,
  mockPrismaFindFirst,
  mockPrismaUpdate,
  mockAdminDeleteUser
} = vi.hoisted(() => {
  const mockRateLimit = vi.fn()
  const mockRequireAuth = vi.fn()
  const mockParseBody = vi.fn()
  const mockPrismaFindFirst = vi.fn()
  const mockPrismaUpdate = vi.fn()
  const mockAdminDeleteUser = vi.fn()

  const g = globalThis as Record<string, unknown>
  g.defineEventHandler = <T>(fn: T) => fn
  g.rateLimit = mockRateLimit
  g.requireAuth = mockRequireAuth
  g.parseBody = mockParseBody
  g.prisma = {
    profiles: {
      findFirst: mockPrismaFindFirst,
      update: mockPrismaUpdate
    }
  }

  return {
    mockRateLimit,
    mockRequireAuth,
    mockParseBody,
    mockPrismaFindFirst,
    mockPrismaUpdate,
    mockAdminDeleteUser
  }
})

;(globalThis as Record<string, unknown>).createError = createError

vi.mock('#server/utils/supabaseAdmin', () => ({
  useSupabaseAdmin: vi.fn(() => ({
    auth: {
      admin: {
        deleteUser: mockAdminDeleteUser
      }
    }
  }))
}))

const mockEvent = { path: '/api/v1/profile/test' } as unknown as H3Event

describe('Server API v1 Profile Handlers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  describe('GET /api/v1/profile/me', () => {
    it('requires authentication and returns the authenticated profile', async () => {
      const profile = { id: 'u-1', username: 'yobune', role: 'user' }
      mockRequireAuth.mockResolvedValueOnce({ user: { id: 'u-1' }, profile })

      const res = await meHandler(mockEvent)

      expect(mockRequireAuth).toHaveBeenCalledWith(mockEvent)
      expect(res).toEqual(profile)
    })
  })

  describe('PUT /api/v1/profile/username', () => {
    it('throws 409 when another user already owns the requested username', async () => {
      mockRequireAuth.mockResolvedValueOnce({
        user: { id: 'u-1' },
        profile: { id: 'u-1', username: 'old_name', role: 'user' }
      })
      mockParseBody.mockResolvedValueOnce({ username: 'taken_name' })
      mockPrismaFindFirst.mockResolvedValueOnce({ id: 'u-2', username: 'taken_name' })

      await expect(updateUsernameHandler(mockEvent)).rejects.toMatchObject({
        statusCode: 409,
        statusMessage: ERROR_MESSAGE.username.unique
      })
      expect(mockPrismaUpdate).not.toHaveBeenCalled()
    })

    it('updates username when unique (or owned by current user) and returns success message', async () => {
      mockRequireAuth.mockResolvedValueOnce({
        user: { id: 'u-1' },
        profile: { id: 'u-1', username: 'old_name', role: 'user' }
      })
      mockParseBody.mockResolvedValueOnce({ username: 'new_name' })
      mockPrismaFindFirst.mockResolvedValueOnce(null)
      mockPrismaUpdate.mockResolvedValueOnce({ id: 'u-1', username: 'new_name' })

      const res = await updateUsernameHandler(mockEvent)

      expect(mockRateLimit).toHaveBeenCalledWith(mockEvent)
      expect(mockPrismaFindFirst).toHaveBeenCalledWith({
        where: {
          username: 'new_name',
          NOT: { id: 'u-1' }
        }
      })
      expect(mockPrismaUpdate).toHaveBeenCalledWith({
        where: { id: 'u-1' },
        data: { username: 'new_name' }
      })
      expect(res).toEqual({ message: SUCCESS_MESSAGE.usernameUpdated })
    })
  })

  describe('DELETE /api/v1/profile/delete', () => {
    it('deletes user via Supabase Admin and returns success message', async () => {
      mockRequireAuth.mockResolvedValueOnce({
        user: { id: 'u-delete' },
        profile: { id: 'u-delete', username: 'bye', role: 'user' }
      })
      mockAdminDeleteUser.mockResolvedValueOnce({ error: null })

      const res = await deleteAccountHandler(mockEvent)

      expect(mockRateLimit).toHaveBeenCalledWith(mockEvent)
      expect(mockAdminDeleteUser).toHaveBeenCalledWith('u-delete')
      expect(res).toEqual({ message: SUCCESS_MESSAGE.accountDeleted })
    })

    it('throws 500 when Supabase Admin deleteUser fails', async () => {
      mockRequireAuth.mockResolvedValueOnce({
        user: { id: 'u-delete' },
        profile: { id: 'u-delete', username: 'bye', role: 'user' }
      })
      mockAdminDeleteUser.mockResolvedValueOnce({ error: { message: 'Delete failed' } })

      await expect(deleteAccountHandler(mockEvent)).rejects.toMatchObject({
        statusCode: 500,
        statusMessage: 'Delete failed'
      })
    })
  })
})
