import z from 'zod'
import { primitives } from './primitives.schema'

export const resetPasswordSchema = z.object({
  password: primitives.password
})

export const resetPasswordPayloadSchema = resetPasswordSchema.extend({
  token: primitives.string.token
})

export type ResetPasswordSchema = z.output<typeof resetPasswordSchema>
