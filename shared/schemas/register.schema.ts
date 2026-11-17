import z from 'zod'
import { ERROR_MESSAGE } from '../constants'
import { primitives } from './primitives.schema'

export const registerSchema = z
  .object({
    email: primitives.email,
    password: primitives.password,
    confirmPassword: primitives.string.password
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: ERROR_MESSAGE.password.mismatch,
    path: ['confirmPassword']
  })

export type RegisterSchema = z.output<typeof registerSchema>

export const registerState: Partial<RegisterSchema> = {
  email: undefined,
  password: undefined,
  confirmPassword: undefined
}
