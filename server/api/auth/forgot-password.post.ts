import { PAGES, SUCCESS_MESSAGE } from '#shared/constants'
import { forgotPasswordSchema } from '#shared/schemas/forgot-password.schema'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = forgotPasswordSchema.safeParse(body)

  // validate user input
  if (!parsed.success) {
    throw createError({
      statusCode: 422,
      statusMessage: parsed.error.issues[0]?.message
    })
  }

  const { email } = parsed.data

  const supabase = await serverSupabaseClient(event)
  const config = useRuntimeConfig()

  // send link by email to reset password
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${config.public.siteUrl + PAGES.resetPassword.url}`
  })

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message
    })
  }

  return {
    message: SUCCESS_MESSAGE.resetPassword
  }
})
