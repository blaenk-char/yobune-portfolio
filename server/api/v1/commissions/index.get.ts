export default defineEventHandler(async () => {
  const services = await prisma.commission_services.findMany({
    where: { is_active: true },
    orderBy: { created_at: 'desc' },
    include: commissionServiceInclude
  })

  return services.map(formatCommissionService)
})
