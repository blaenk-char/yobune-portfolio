import z from 'zod'
import { ERROR_MESSAGE } from '../constants'
import { primitives } from './primitives.schema'

export const commissionFormFieldOptionSchema = z.object({
  id: primitives.uuid.optional(),
  label: primitives.label,
  modifierType: primitives.commissionModifierType.default('none'),
  modifierValue: primitives.modifierValue,
  sortOrder: primitives.sortOrder
})

export const commissionFormFieldSchema = z
  .object({
    id: primitives.uuid.optional(),
    type: primitives.commissionFieldType,
    label: primitives.label,
    placeholder: primitives.placeholder.nullable().optional(),
    isRequired: primitives.booleanDefaultFalse,
    sortOrder: primitives.sortOrder,
    options: z.array(commissionFormFieldOptionSchema).default([])
  })
  .refine(
    (field) =>
      field.type === 'checkbox' || field.type === 'radio' ? field.options.length > 0 : true,
    {
      message: ERROR_MESSAGE.commission.optionsRequired,
      path: ['options']
    }
  )

export const commissionFormSectionSchema = z.object({
  id: primitives.uuid.optional(),
  title: primitives.title,
  description: z.string().nullable().optional(),
  sortOrder: primitives.sortOrder,
  fields: z.array(commissionFormFieldSchema).default([])
})

export const commissionFormSchema = z.object({
  title: primitives.title,
  description: z.string().nullable().optional(),
  sections: z.array(commissionFormSectionSchema).default([])
})

export const commissionServicePreviewSchema = z.object({
  id: primitives.uuid.optional(),
  url: primitives.string.url,
  sortOrder: primitives.sortOrder
})

export const commissionServiceSchema = z.object({
  title: primitives.title,
  description: primitives.description,
  basePrice: primitives.price,
  slotsTotal: primitives.slotsTotal,
  isNsfw: primitives.booleanDefaultFalse,
  isActive: primitives.booleanDefaultTrue,
  previews: z.array(commissionServicePreviewSchema).default([]),
  form: commissionFormSchema.nullable().optional()
})

export type CommissionServiceSchema = z.output<typeof commissionServiceSchema>
