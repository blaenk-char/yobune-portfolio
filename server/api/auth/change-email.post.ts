import { PAGES, SUCCESS_MESSAGE } from '#shared/constants'
import { changeEmailSchema } from '#shared/schemas'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  rateLimit(event)
  const { email } = await parseBody(event, changeEmailSchema)

  const supabase = await serverSupabaseClient(event)
  const config = useRuntimeConfig()

  // send link by email to confirm email
  const { error } = await supabase.auth.updateUser(
    { email },
    {
      emailRedirectTo: `${config.public.siteUrl + PAGES.changeEmail.url}`
    }
  )
  console.log('ERROR', error)

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message
    })
  }

  return {
    message: SUCCESS_MESSAGE.changeEmail
  }
})
