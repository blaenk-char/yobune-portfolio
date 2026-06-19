import z from 'zod'
import { primitives } from './primitives.schema'

export const forgotPasswordSchema = z.object({
  email: primitives.email
})

export type ForgotPasswordSchema = z.output<typeof forgotPasswordSchema>
