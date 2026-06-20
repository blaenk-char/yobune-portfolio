export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()

  // check if loggdin
  if (authStore.profile) {
    return navigateTo('/')
  }
})
