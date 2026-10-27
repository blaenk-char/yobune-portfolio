import { ERROR_MESSAGE, SUCCESS_MESSAGE } from '#shared/constants'
import { confirmSchema } from '#shared/schemas'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const { username, token } = await parseBody(event, confirmSchema)

  // check if username is unique
  const existing = await prisma.profiles.findUnique({ where: { username } })
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: ERROR_MESSAGE.username.unique })
  }

  const supabase = await serverSupabaseClient(event)

  // confirm email
  const { data, error } = await supabase.auth.verifyOtp({
    token_hash: token,
    type: 'signup'
  })
  console.log('ERROR', error)

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }

  // check if user found
  if (!data.user) {
    throw createError({ statusCode: 401, statusMessage: ERROR_MESSAGE.auth.user })
  }

  // create user profile
  await prisma.profiles.create({
    data: {
      id: data.user.id,
      username
    }
  })

  return {
    message: SUCCESS_MESSAGE.confirm
  }
})
