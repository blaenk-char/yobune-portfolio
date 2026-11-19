import { ERROR_MESSAGE } from '#shared/constants'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const id = parseUuidParam(event, ERROR_MESSAGE.commission.notFound)

  const service = await prisma.commission_services.findFirst({
    where: {
      id,
      is_active: true
    },
    include: commissionServiceInclude
  })

  if (!service) {
    throw createError({ statusCode: 404, statusMessage: ERROR_MESSAGE.commission.notFound })
  }

  return formatCommissionService(service)
})
