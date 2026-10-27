import { ERROR_MESSAGE, SUCCESS_MESSAGE } from '#shared/constants'
import { usernameSchema } from '#shared/schemas'

export default defineEventHandler(async (event) => {
  const { profile } = await requireAuth(event)
  const { username } = await parseBody(event, usernameSchema)

  // check if username is unique
  const existing = await prisma.profiles.findFirst({
    where: {
      username,
      NOT: { id: profile.id }
    }
  })
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: ERROR_MESSAGE.username.unique })
  }

  // update user profile
  await prisma.profiles.update({
    where: { id: profile.id },
    data: { username }
  })

  return {
    message: SUCCESS_MESSAGE.usernameUpdated
  }
})
