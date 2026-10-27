import { PAGES, SUCCESS_MESSAGE } from '#shared/constants'
import { registerSchema } from '#shared/schemas'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  rateLimit(event)
  const { email, password } = await parseBody(event, registerSchema)

  const supabase = await serverSupabaseClient(event)
  const config = useRuntimeConfig()

  // create auth user and let supabase send confirmation mail
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${config.public.siteUrl + PAGES.confirm.url}`
    }
  })
  console.log('ERROR', error)

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }

  return {
    message: SUCCESS_MESSAGE.register
  }
})
