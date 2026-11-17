import z from 'zod'
import { ERROR_MESSAGE } from '../constants'
import { primitives } from './primitives.schema'

export const resetPasswordSchema = z
  .object({
    password: primitives.password,
    confirmPassword: primitives.string.password,
    token: primitives.string.token
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: ERROR_MESSAGE.password.mismatch,
    path: ['confirmPassword']
  })

export type ResetPasswordSchema = z.output<typeof resetPasswordSchema>

export const resetPasswordState: Partial<ResetPasswordSchema> = {
  password: undefined,
  confirmPassword: undefined,
  token: undefined
}
