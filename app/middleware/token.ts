import { ERROR_MESSAGE } from '#shared/constants'

export default defineNuxtRouteMiddleware((to) => {
  if (!to.query.token) {
    throw createError({
      statusCode: 400,
      statusMessage: ERROR_MESSAGE.auth.token,
      fatal: true
    })
  }
})
