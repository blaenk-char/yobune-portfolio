import z from 'zod'
import { primitives } from './primitives.schema'

export const changeEmailSchema = z.object({
  email: primitives.email
})

export type ChangeEmailSchema = z.output<typeof changeEmailSchema>
