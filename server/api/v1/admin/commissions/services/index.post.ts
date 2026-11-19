import { commissionServiceSchema } from '#shared/schemas'

export default defineEventHandler(async (event) => {
  rateLimit(event)
  await requireAuth(event, ['admin', 'super_admin'])

  const body = await parseBody(event, commissionServiceSchema)

  const created = await prisma.commission_services.create({
    data: {
      title: body.title,
      description: body.description,
      base_price: body.basePrice,
      slots_total: body.slotsTotal,
      is_nsfw: body.isNsfw,
      is_active: body.isActive,
      previews: {
        create: buildPreviewsCreateInput(body.previews)
      },
      ...(body.form
        ? {
            form: {
              create: {
                title: body.form.title,
                description: body.form.description ?? null,
                sections: {
                  create: buildFormSectionsCreateInput(body.form.sections)
                }
              }
            }
          }
        : {})
    },
    include: commissionServiceInclude
  })

  return formatCommissionService(created)
})
