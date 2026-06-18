import z from 'zod'
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from '#shared/constants'

const schema = z.object({
  email: z.email(ERROR_MESSAGE.email)
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = schema.safeParse(body)

  // validate user input
  if (!parsed.success) {
    throw createError({ statusCode: 422, statusMessage: parsed.error.issues[0]?.message })
  }

  const admin = useSupabaseAdmin()
  const config = useRuntimeConfig()

  // send link by email to reset password
  const { error } = await admin.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${config.public.siteUrl}/auth/reset-password`
  })

  if (error) {
    throw createError({ statusCode: 400, statusMessage: error.message })
  }

  return { message: SUCCESS_MESSAGE.resetPassword }
})
