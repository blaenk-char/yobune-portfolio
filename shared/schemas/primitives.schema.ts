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
  uuid: z.uuid(),
  title: zString(ERROR_MESSAGE.commission.titleRequired).max(
    128,
    ERROR_MESSAGE.commission.titleMax
  ),
  description: zString(ERROR_MESSAGE.commission.descriptionRequired),
  label: zString(ERROR_MESSAGE.commission.labelRequired).max(
    255,
    ERROR_MESSAGE.commission.labelMax
  ),
  placeholder: z.string().max(255, ERROR_MESSAGE.commission.placeholderMax),
  price: z.number().min(0, ERROR_MESSAGE.commission.priceMin),
  modifierValue: z.number().default(0),
  slotsTotal: z.number().int().min(0, ERROR_MESSAGE.commission.slotsMin).default(0),
  sortOrder: z.number().int().min(0).default(0),
  booleanDefaultFalse: z.boolean().default(false),
  booleanDefaultTrue: z.boolean().default(true),
  commissionFieldType: z.enum(['text', 'file', 'checkbox', 'radio']),
  commissionModifierType: z.enum(['none', 'flat', 'multiplier']),
  commissionOrderStatus: z.enum([
    'pending',
    'in_queue',
    'in_progress',
    'completed',
    'declined',
    'cancelled'
  ]),
  string: {
    email: zString(ERROR_MESSAGE.required.email),
    password: zString(ERROR_MESSAGE.required.password),
    token: zString(ERROR_MESSAGE.auth.token),
    url: zString(ERROR_MESSAGE.storage.uploadFailed),
    filePath: zString(ERROR_MESSAGE.shop.fileRequired)
  }
}

function zString(message: string) {
  return z.string(message).min(1, message)
}
