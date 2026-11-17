import z from 'zod'
import { primitives } from './primitives.schema'

export const shopProductPreviewSchema = z.object({
  id: primitives.uuid.optional(),
  url: primitives.string.url,
  sortOrder: primitives.sortOrder
})

export const shopProductSchema = z.object({
  title: primitives.title,
  description: primitives.description,
  price: primitives.price,
  isNsfw: primitives.booleanDefaultFalse,
  isPublished: primitives.booleanDefaultFalse,
  filePath: primitives.string.filePath,
  previews: z.array(shopProductPreviewSchema).default([])
})

export type ShopProductSchema = z.output<typeof shopProductSchema>
