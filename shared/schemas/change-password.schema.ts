import z from 'zod'
import { primitives } from './primitives.schema'

export const changePasswordSchema = z.object({
  password: primitives.password
})

export type ChangePasswordSchema = z.output<typeof changePasswordSchema>
