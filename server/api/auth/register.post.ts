import { SUCCESS_MESSAGE } from '#shared/constants'
import { registerSchema } from '#shared/schemas'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = registerSchema.safeParse(body)

  // validate user input
  if (!parsed.success) {
    throw createError({
      statusCode: 422,
      statusMessage: parsed.error.issues[0]?.message
    })
  }

  const { email, password } = parsed.data

  const supabase = await serverSupabaseClient(event)
  const config = useRuntimeConfig()

  // create auth user and let supabase send confirmation mail
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${config.public.siteUrl}/auth/confirm`
    }
  })

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
