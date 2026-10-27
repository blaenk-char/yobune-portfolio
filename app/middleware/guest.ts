import { PAGES } from '#shared/constants'

export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore()

  // wait for auth store to be ready
  if (!authStore.ready) {
    await until(() => authStore.ready).toBe(true)
  }

  // check if logged in
  if (authStore.profile) {
    return navigateTo(PAGES.home.url)
  }
})

