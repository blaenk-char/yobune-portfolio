export default defineEventHandler(async (event) => {
  await requireAuth(event, ['admin', 'super_admin'])

  const services = await prisma.commission_services.findMany({
    orderBy: { created_at: 'desc' },
    include: commissionServiceInclude
  })

  return services.map(formatCommissionService)
})
