import { ERROR_MESSAGE } from '#shared/constants'
import type { CommissionServiceSchema } from '#shared/schemas'
import type { CommissionService } from '#shared/types'
import { createError } from 'h3'
import type { Prisma } from '~~/generated/prisma'

/**
 * Strongly-typed Prisma `include` block for fetching a commission service
 * with its ordered previews, 1-to-1 form, sections, fields, options,
 * and active orders count (for dynamic `slotsAvailable` calculation).
 */
export const commissionServiceInclude = {
  previews: {
    orderBy: { sort_order: 'asc' }
  },
  form: {
    include: {
      sections: {
        orderBy: { sort_order: 'asc' },
        include: {
          fields: {
            orderBy: { sort_order: 'asc' },
            include: {
              options: {
                orderBy: { sort_order: 'asc' }
              }
            }
          }
        }
      }
    }
  },
  _count: {
    select: {
      orders: {
        where: {
          status: {
            in: ['pending', 'in_queue', 'in_progress']
          }
        }
      }
    }
  }
} satisfies Prisma.commission_servicesInclude

export type CommissionServiceRow = Prisma.commission_servicesGetPayload<{
  include: typeof commissionServiceInclude
}>

/**
 * Ensures a commission service exists by ID or throws a 404 H3Error.
 */
export async function ensureCommissionServiceExists(id: string) {
  const existing = await prisma.commission_services.findUnique({
    where: { id },
    select: { id: true }
  })

  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: ERROR_MESSAGE.commission.notFound })
  }
}

/**
 * Builds nested Prisma create inputs for `commission_service_previews`.
 */
export function buildPreviewsCreateInput(previews: CommissionServiceSchema['previews']) {
  return previews.map((p, index) => ({
    url: p.url,
    sort_order: p.sortOrder ?? index
  }))
}

/**
 * Builds nested Prisma create inputs for `commission_form_sections` -> `fields` -> `options`.
 */
export function buildFormSectionsCreateInput(
  sections: NonNullable<CommissionServiceSchema['form']>['sections']
) {
  return sections.map((section, sIdx) => ({
    title: section.title,
    description: section.description ?? null,
    sort_order: section.sortOrder ?? sIdx,
    fields: {
      create: section.fields.map((field, fIdx) => ({
        ...(field.id ? { id: field.id } : {}),
        type: field.type,
        label: field.label,
        placeholder: field.placeholder ?? null,
        is_required: field.isRequired,
        sort_order: field.sortOrder ?? fIdx,
        options: {
          create: field.options.map((opt, oIdx) => ({
            ...(opt.id ? { id: opt.id } : {}),
            label: opt.label,
            modifier_type: opt.modifierType,
            modifier_value: opt.modifierValue,
            sort_order: opt.sortOrder ?? oIdx
          }))
        }
      }))
    }
  }))
}

/**
 * Formats a Prisma `CommissionServiceRow` into the shared `CommissionService` DTO,
 * converting Decimal/Date fields and calculating `slotsAvailable` dynamically.
 */
export function formatCommissionService(row: CommissionServiceRow): CommissionService {
  const activeOrders = row._count.orders
  const slotsAvailable = Math.max(0, row.slots_total - activeOrders)

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    basePrice: Number(row.base_price),
    slotsTotal: row.slots_total,
    slotsAvailable,
    isNsfw: row.is_nsfw,
    isActive: row.is_active,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
    previews: row.previews.map((p) => ({
      id: p.id,
      serviceId: p.service_id,
      url: p.url,
      sortOrder: p.sort_order
    })),
    form: row.form
      ? {
          id: row.form.id,
          serviceId: row.form.service_id,
          title: row.form.title,
          description: row.form.description,
          sections: row.form.sections.map((s) => ({
            id: s.id,
            formId: s.form_id,
            title: s.title,
            description: s.description,
            sortOrder: s.sort_order,
            fields: s.fields.map((f) => ({
              id: f.id,
              sectionId: f.section_id,
              type: f.type,
              label: f.label,
              placeholder: f.placeholder,
              isRequired: f.is_required,
              sortOrder: f.sort_order,
              options: f.options.map((o) => ({
                id: o.id,
                fieldId: o.field_id,
                label: o.label,
                modifierType: o.modifier_type,
                modifierValue: Number(o.modifier_value),
                sortOrder: o.sort_order
              }))
            }))
          }))
        }
      : null
  }
}
