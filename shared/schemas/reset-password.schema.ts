import z from 'zod'
import { primitives } from './primitives.schema'

export const resetPasswordSchema = z.object({
  password: primitives.password
})

export type ResetPasswordSchema = z.output<typeof resetPasswordSchema>
