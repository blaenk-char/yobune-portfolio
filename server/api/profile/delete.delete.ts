import { useSupabaseAdmin } from '#server/utils/supabaseAdmin'
import { SUCCESS_MESSAGE } from '#shared/constants'

export default defineEventHandler(async (event) => {
  const { user } = await requireAuth(event)
  const admin = useSupabaseAdmin()

  const { error } = await admin.auth.admin.deleteUser(user.id)
  console.log('ERROR', error)

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }

  return {
    message: SUCCESS_MESSAGE.accountDeleted
  }
})
