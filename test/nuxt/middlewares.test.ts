import { ERROR_MESSAGE, PAGES, UI_TEXT } from '#shared/constants'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import type { RouteLocationNormalized } from 'vue-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import authMiddleware from '~/middleware/auth'
import guestMiddleware from '~/middleware/guest'
import tokenMiddleware from '~/middleware/token'

const { mockNavigateTo } = vi.hoisted(() => ({
  mockNavigateTo: vi.fn((target: unknown) => target)
}))

mockNuxtImport('navigateTo', () => mockNavigateTo)

function makeRoute(overrides: Partial<RouteLocationNormalized> = {}): RouteLocationNormalized {
  return {
    path: '/',
    fullPath: '/',
    query: {},
    params: {},
    hash: '',
    matched: [],
    meta: {},
    name: undefined,
    redirectedFrom: undefined,
    ...overrides
  } as RouteLocationNormalized
}

const dummyFrom = makeRoute()

describe('Nuxt Route Middlewares', () => {
  beforeEach(() => {
    mockNavigateTo.mockClear()
    const authStore = useAuthStore()
    authStore.clear()
  })

  describe('token middleware', () => {
    it('throws fatal 400 error when ?token query parameter is missing', () => {
      const to = makeRoute({ path: PAGES.confirm.url, query: {} })

      expect(() => tokenMiddleware(to, dummyFrom)).toThrowError(
        expect.objectContaining({
          statusCode: 400,
          statusMessage: ERROR_MESSAGE.auth.token
        })
      )
    })

    it('allows navigation when ?token query parameter is present', () => {
      const to = makeRoute({ path: PAGES.confirm.url, query: { token: 'abc123' } })
      expect(tokenMiddleware(to, dummyFrom)).toBeUndefined()
    })
  })

  describe('guest middleware', () => {
    it('waits until authStore.ready becomes true before evaluating', async () => {
      const authStore = useAuthStore()
      authStore.ready = false
      authStore.profile = {
        id: 'u-1',
        username: 'yobune',
        role: 'user'
      }

      setTimeout(() => {
        authStore.ready = true
      }, 15)

      await guestMiddleware(makeRoute({ path: PAGES.auth.url }), dummyFrom)
      expect(mockNavigateTo).toHaveBeenCalledWith(PAGES.home.url)
    })

    it('allows unauthenticated visitors to access guest pages', async () => {
      const authStore = useAuthStore()
      authStore.clear()

      const result = await guestMiddleware(makeRoute({ path: PAGES.auth.url }), dummyFrom)
      expect(result).toBeUndefined()
      expect(mockNavigateTo).not.toHaveBeenCalled()
    })
  })

  describe('auth middleware', () => {
    it('redirects unauthenticated users to /auth with redirect query parameter', async () => {
      const authStore = useAuthStore()
      authStore.clear()

      const to = makeRoute({ path: PAGES.profile.url, fullPath: '/profile#email' })
      await authMiddleware(to, dummyFrom)

      expect(mockNavigateTo).toHaveBeenCalledWith({
        path: PAGES.auth.url,
        query: { redirect: '/profile#email' }
      })
    })

    it('throws 403 error when authenticated user lacks required route role', async () => {
      const authStore = useAuthStore()
      authStore.profile = {
        id: 'u-1',
        username: 'yobune',
        role: 'user'
      }
      authStore.ready = true

      const adminRoute = makeRoute({
        path: '/admin',
        fullPath: '/admin',
        meta: { roles: ['admin'] }
      })

      await expect(authMiddleware(adminRoute, dummyFrom)).rejects.toMatchObject({
        statusCode: 403,
        statusMessage: UI_TEXT.forbidden
      })
    })

    it('allows authenticated user with matching role', async () => {
      const authStore = useAuthStore()
      authStore.profile = {
        id: 'u-admin',
        username: 'admin_artist',
        role: 'admin'
      }
      authStore.ready = true

      const adminRoute = makeRoute({
        path: '/admin',
        fullPath: '/admin',
        meta: { roles: ['admin'] }
      })

      const result = await authMiddleware(adminRoute, dummyFrom)
      expect(result).toBeUndefined()
      expect(mockNavigateTo).not.toHaveBeenCalled()
    })
  })
})
