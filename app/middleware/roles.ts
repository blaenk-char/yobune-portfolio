export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  const requiredRoles = to.meta.roles as UserRole[] | undefined

  // no restriction
  if (!requiredRoles || requiredRoles.length === 0) return

  // check if logged in
  if (!authStore.isLoggedIn) {
    return navigateTo('auth')
  }

  // check if role matches
  const userRole = authStore.role
  if (!userRole || !requiredRoles.includes(userRole)) {
    return navigateTo('/403')
  }
})
