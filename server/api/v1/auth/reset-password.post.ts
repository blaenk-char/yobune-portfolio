import { useSupabaseAdmin } from '#server/utils/supabaseAdmin'
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from '#shared/constants'
import { resetPasswordSchema } from '#shared/schemas'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  rateLimit(event)
  const { password, token } = await parseBody(event, resetPasswordSchema)

  const supabase = await serverSupabaseClient(event)

  // get user by token
  const { data, error } = await supabase.auth.verifyOtp({
    token_hash: token,
    type: 'recovery'
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

  const admin = useSupabaseAdmin()

  // update user password
  const { error: updateError } = await admin.auth.admin.updateUserById(data.user.id, {
    password
  })

  console.log('UPDATE ERROR', updateError)

  if (updateError) {
    throw createError({
      statusCode: 500,
      statusMessage: updateError.message
    })
  }

  return { message: SUCCESS_MESSAGE.updatePassword }
})
