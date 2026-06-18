export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()

  // check if loggdin
  if (authStore.isLoggedIn) {
    return navigateTo('/')
  }
})
