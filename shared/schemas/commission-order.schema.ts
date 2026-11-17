import z from 'zod'
import { primitives } from './primitives.schema'

export const commissionOrderAnswerSchema = z.object({
  fieldId: primitives.uuid,
  optionId: primitives.uuid.nullable().optional(),
  optionIds: z.array(primitives.uuid).optional(),
  textValue: z.string().nullable().optional(),
  filePath: z.string().nullable().optional(),
  filePaths: z.array(primitives.string.filePath).optional()
})

export const createCommissionOrderSchema = z.object({
  answers: z.array(commissionOrderAnswerSchema).default([])
})

export const updateCommissionOrderStatusSchema = z.object({
  status: primitives.commissionOrderStatus,
  deliverablePaths: z.array(primitives.string.filePath).optional()
})

export type CreateCommissionOrderSchema = z.output<typeof createCommissionOrderSchema>
export type UpdateCommissionOrderStatusSchema = z.output<typeof updateCommissionOrderStatusSchema>
