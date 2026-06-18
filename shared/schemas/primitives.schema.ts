import z from 'zod'
import { ERROR_MESSAGE } from '../constants'

export const primitives = {
  email: z.email(ERROR_MESSAGE.email),
  password: z
    .string(ERROR_MESSAGE.password.string)
    .min(8, ERROR_MESSAGE.password.min)
    .max(128, ERROR_MESSAGE.password.max)
    .regex(/[A-Z]/, ERROR_MESSAGE.password.regex.uppercase)
    .regex(/[a-z]/, ERROR_MESSAGE.password.regex.lowercase)
    .regex(/[0-9]/, ERROR_MESSAGE.password.regex.number)
    .regex(/[!@#$%^&*(),.?":{}|<>]/, ERROR_MESSAGE.password.regex.special)
    .refine((val) => !/\s/.test(val), ERROR_MESSAGE.password.regex.spaces),
  username: z
    .string(ERROR_MESSAGE.username.string)
    .min(3, ERROR_MESSAGE.username.min)
    .max(50, ERROR_MESSAGE.username.max)
    .regex(/^[a-zA-Z0-9_-]+$/, ERROR_MESSAGE.username.regex),
  string: {
    email: zString(ERROR_MESSAGE.required.email),
    password: zString(ERROR_MESSAGE.required.password)
  }
}

function zString(message: string) {
  return z.string(message).min(1, message)
}
