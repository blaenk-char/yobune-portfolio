import { ERROR_MESSAGE } from '#shared/constants'
import { commissionServiceSchema } from '#shared/schemas'

export default defineEventHandler(async (event) => {
  rateLimit(event)
  await requireAuth(event, ['admin', 'super_admin'])

  const id = parseUuidParam(event, ERROR_MESSAGE.commission.notFound)
  const body = await parseBody(event, commissionServiceSchema)

  await ensureCommissionServiceExists(id)

  const updated = await prisma.$transaction(async (tx) => {
    await tx.commission_service_previews.deleteMany({
      where: { service_id: id }
    })

    if (body.form) {
      await tx.commission_form_sections.deleteMany({
        where: { form: { service_id: id } }
      })

      const sectionsCreate = {
        create: buildFormSectionsCreateInput(body.form.sections)
      }

      await tx.commission_forms.upsert({
        where: { service_id: id },
        create: {
          service_id: id,
          title: body.form.title,
          description: body.form.description ?? null,
          sections: sectionsCreate
        },
        update: {
          title: body.form.title,
          description: body.form.description ?? null,
          sections: sectionsCreate
        }
      })
    } else {
      await tx.commission_forms.deleteMany({
        where: { service_id: id }
      })
    }

    return tx.commission_services.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        base_price: body.basePrice,
        slots_total: body.slotsTotal,
        is_nsfw: body.isNsfw,
        is_active: body.isActive,
        previews: {
          create: buildPreviewsCreateInput(body.previews)
        }
      },
      include: commissionServiceInclude
    })
  })

  return formatCommissionService(updated)
})
