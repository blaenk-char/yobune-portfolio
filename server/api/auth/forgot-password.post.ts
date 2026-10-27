import { PAGES, SUCCESS_MESSAGE } from '#shared/constants'
import { forgotPasswordSchema } from '#shared/schemas'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const { email } = await parseBody(event, forgotPasswordSchema)

  const supabase = await serverSupabaseClient(event)
  const config = useRuntimeConfig()

  // send link by email to reset password
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${config.public.siteUrl + PAGES.resetPassword.url}`
  })
  console.log('ERROR', error)

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
