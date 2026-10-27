import { PAGES } from '#shared/constants'

export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()

  // check if logged in
  if (authStore.rawProfile) {
    return navigateTo(PAGES.home.url)
  }
})
