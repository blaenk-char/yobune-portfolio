type PageConfig = { url: string }

export const PAGES = {
  // Home
  home: {
    url: '/'
  },

  // Profile
  profile: {
    url: '/profile'
  },

  // Auth
  auth: {
    url: '/auth'
  },

  // Confirm
  confirm: {
    url: '/auth/confirm'
  },

  // Forgot password
  forgotPassword: {
    url: '/auth/forgot-password'
  },

  // Reset password
  resetPassword: {
    url: '/auth/reset-password'
  },

  // Change email
  changeEmail: {
    url: '/auth/change-email'
  },

  // Privacy Policy
  privacy: {
    url: '/privacy'
  }
} satisfies Record<string, PageConfig>
