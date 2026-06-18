import { ERROR_MESSAGE } from '#shared/constants'

export default defineEventHandler(async (event) => {
  // only super_admin can change roles
  await requireAuth(event, ['super_admin'])

  // get id
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: ERROR_MESSAGE.user.id })

  // find profile
  const profile = await prisma.profiles.findUnique({ where: { id } })
  if (!profile) throw createError({ statusCode: 404, statusMessage: ERROR_MESSAGE.user.notFound })

  return profile
})
