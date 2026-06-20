import { PAGES, UI_TEXT } from '#shared/constants'

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return

  const authStore = useAuthStore()
  const requiredRoles = to.meta.roles as UserRole[] | undefined

  // wait for auth store to be ready
  if (!authStore.ready) {
    await until(() => authStore.ready).toBe(true)
  }

  // check if logged in
  if (!authStore.profile) {
    return navigateTo(PAGES.auth.url)
  }

  // check if user has required role
  if (requiredRoles && requiredRoles.length > 0) {
    if (!authStore.profile.role || !requiredRoles.includes(authStore.profile.role)) {
      throw createError({ statusCode: 403, statusMessage: UI_TEXT.forbidden, fatal: true })
    }
  }
})
