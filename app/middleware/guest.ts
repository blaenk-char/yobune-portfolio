export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()

  // check if loggdin
  if (authStore.rawProfile) {
    return navigateTo('/')
  }
})
