import { ERROR_MESSAGE, SUCCESS_MESSAGE } from '#shared/constants'

export default defineEventHandler(async (event) => {
  rateLimit(event)
  await requireAuth(event, ['admin', 'super_admin'])

  const id = parseUuidParam(event, ERROR_MESSAGE.commission.notFound)
  await ensureCommissionServiceExists(id)

  await prisma.commission_services.delete({
    where: { id }
  })

  return {
    message: SUCCESS_MESSAGE.commissionServiceDeleted
  }
})
