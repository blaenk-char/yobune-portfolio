import type { UserRole } from '../types'

type PageLayout = 'public'
type PageMiddleware = 'auth' | 'guest' | 'token'

export type PageConfig = {
  url: string
  layout: PageLayout
  middleware?: PageMiddleware | PageMiddleware[]
  roles?: UserRole[]
}

export const PAGES = {
  // Home
  home: {
    url: '/',
    layout: 'public'
  },

  // Commissions
  commissions: {
    url: '/commissions',
    layout: 'public'
  },

  // Shop
  shop: {
    url: '/shop',
    layout: 'public'
  },

  // User Orders (My Commissions & Downloads)
  orders: {
    url: '/orders',
    layout: 'public',
    middleware: 'auth'
  },

  // Admin
  admin: {
    url: '/admin',
    layout: 'public',
    middleware: 'auth',
    roles: ['admin', 'super_admin']
  },

  // Profile
  profile: {
    url: '/profile',
    layout: 'public',
    middleware: 'auth'
  },

  // Auth
  auth: {
    url: '/auth',
    layout: 'public',
    middleware: 'guest'
  },

  // Confirm
  confirm: {
    url: '/auth/confirm',
    layout: 'public',
    middleware: ['guest', 'token']
  },

  // Forgot password
  forgotPassword: {
    url: '/auth/forgot-password',
    layout: 'public',
    middleware: 'guest'
  },

  // Reset password
  resetPassword: {
    url: '/auth/reset-password',
    layout: 'public',
    middleware: 'token'
  },

  // Change email
  changeEmail: {
    url: '/auth/change-email',
    layout: 'public',
    middleware: 'token'
  },

  // Privacy Policy
  privacy: {
    url: '/privacy',
    layout: 'public'
  }
} satisfies Record<string, PageConfig>
