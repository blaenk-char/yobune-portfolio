import z from 'zod'
import { primitives } from './primitives.schema'

export const loginSchema = z.object({
  email: primitives.string.email,
  password: primitives.string.password
})

export type LoginSchema = z.output<typeof loginSchema>
