import z from 'zod'
import { ERROR_MESSAGE } from '#shared/constants'

const schema = z.object({
  role: z.enum(['super_admin', 'admin', 'user'])
})

export default defineEventHandler(async (event) => {
  // only super_admin can change roles
  await requireAuth(event, ['super_admin'])

  const body = await readBody(event)
  const parsed = schema.safeParse(body)

  // verify input
  if (!parsed.success) {
    throw createError({ statusCode: 422, statusMessage: parsed.error.issues[0]?.message })
  }

  // get id
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: ERROR_MESSAGE.user.id })

  // find profile
  const profile = await prisma.profiles.findUnique({ where: { id } })
  if (!profile) throw createError({ statusCode: 404, statusMessage: ERROR_MESSAGE.user.notFound })

  // update profile
  const updated = await prisma.profiles.update({
    where: { id },
    data: { role: parsed.data.role }
  })

  return updated
})
