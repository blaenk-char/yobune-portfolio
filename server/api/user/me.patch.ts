import z from 'zod'
import { ERROR_MESSAGE } from '#shared/constants'

const schema = z.object({
  username: z
    .string(ERROR_MESSAGE.username.string)
    .min(3, ERROR_MESSAGE.username.min)
    .max(50, ERROR_MESSAGE.username.max)
    .regex(/^[a-zA-Z0-9_-]+$/, ERROR_MESSAGE.username.regex)
    .optional()
})

export default defineEventHandler(async (event) => {
  const { profile } = await requireAuth(event)

  const body = await readBody(event)
  const parsed = schema.safeParse(body)

  // verify input
  if (!parsed.success) {
    throw createError({ statusCode: 422, statusMessage: parsed.error.issues[0]?.message })
  }

  const { username } = parsed.data

  // check if username is unique
  if (username && username !== profile.username) {
    const taken = await prisma.profiles.findUnique({ where: { username } })
    if (taken) {
      throw createError({ statusCode: 409, statusMessage: ERROR_MESSAGE.username.unique })
    }
  }

  // update profile
  const updated = await prisma.profiles.update({
    where: { id: profile.id },
    data: { ...(username && { username }) }
  })

  return {
    username: updated.username,
    role: updated.role,
    updatedAt: updated.updated_at
  }
})
