import { generateUniqueUsername } from '#server/utils/username'
import type { User } from '@supabase/supabase-js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { mockFindUnique } = vi.hoisted(() => {
  const mockFindUnique = vi.fn()
  ;(globalThis as Record<string, unknown>).prisma = {
    profiles: {
      findUnique: mockFindUnique
    }
  }
  return { mockFindUnique }
})

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 'user-123',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: '2026-01-01T00:00:00Z',
    ...overrides
  }
}

describe('generateUniqueUsername utility', () => {
  beforeEach(() => {
    mockFindUnique.mockReset()
    mockFindUnique.mockResolvedValue(null)
  })

  it('prioritizes user_metadata.full_name and sanitizes special characters', async () => {
    const user = makeUser({
      email: 'fallback@example.com',
      user_metadata: {
        full_name: '  Yobune   Art!!  ',
        name: 'IgnoredName'
      }
    })

    const username = await generateUniqueUsername(user)
    expect(username).toBe('Yobune_Art')
    expect(mockFindUnique).toHaveBeenCalledWith({ where: { username: 'Yobune_Art' } })
  })

  it('falls back to user_metadata.name when full_name is missing', async () => {
    const user = makeUser({
      email: 'fallback@example.com',
      user_metadata: { name: 'Studio-Name_01' }
    })

    const username = await generateUniqueUsername(user)
    expect(username).toBe('Studio-Name_01')
  })

  it('falls back to email local-part when metadata names are absent', async () => {
    const user = makeUser({
      email: 'artist.yobune@gmail.com',
      user_metadata: {}
    })

    const username = await generateUniqueUsername(user)
    expect(username).toBe('artist_yobune')
  })

  it('falls back to "user" when sanitized base is shorter than 3 characters or empty', async () => {
    const shortUser = makeUser({
      email: 'ab@example.com',
      user_metadata: {}
    })
    expect(await generateUniqueUsername(shortUser)).toBe('user')

    const symbolsOnlyUser = makeUser({
      user_metadata: { full_name: '!!!@@@' }
    })
    expect(await generateUniqueUsername(symbolsOnlyUser)).toBe('user')
  })

  it('truncates long names to at most 40 characters', async () => {
    const longUser = makeUser({
      user_metadata: { full_name: 'a'.repeat(65) }
    })

    const username = await generateUniqueUsername(longUser)
    expect(username.length).toBe(40)
    expect(username).toBe('a'.repeat(40))
  })

  it('appends a 4-char suffix and retries when username collisions occur', async () => {
    mockFindUnique
      .mockResolvedValueOnce({ id: 'taken-1', username: 'yobune' })
      .mockResolvedValueOnce({ id: 'taken-2', username: 'yobune_abcd' })
      .mockResolvedValueOnce(null)

    const user = makeUser({
      user_metadata: { full_name: 'yobune' }
    })

    const username = await generateUniqueUsername(user)
    expect(username).toMatch(/^yobune_[a-z0-9]{4}$/)
    expect(mockFindUnique).toHaveBeenCalledTimes(3)
  })
})
