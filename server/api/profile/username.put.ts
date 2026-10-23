import { ERROR_MESSAGE, SUCCESS_MESSAGE } from '#shared/constants'
import { usernameSchema } from '#shared/schemas'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = usernameSchema.safeParse(body)
  const { profile } = await requireAuth(event)

  // validate user input
  if (!parsed.success) {
    throw createError({
      statusCode: 422,
      statusMessage: parsed.error.issues[0]?.message
    })
  }

  const { username } = parsed.data

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
