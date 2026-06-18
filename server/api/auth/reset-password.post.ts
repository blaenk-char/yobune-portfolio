import z from 'zod'
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from '#shared/constants'

const schema = z.object({
  password: z
    .string(ERROR_MESSAGE.password.string)
    .min(8, ERROR_MESSAGE.password.min)
    .max(128, ERROR_MESSAGE.password.max)
    .regex(/[A-Z]/, ERROR_MESSAGE.password.regex.uppercase)
    .regex(/[a-z]/, ERROR_MESSAGE.password.regex.lowercase)
    .regex(/[0-9]/, ERROR_MESSAGE.password.regex.number)
    .regex(/[!@#$%^&*(),.?":{}|<>]/, ERROR_MESSAGE.password.regex.special)
    .refine((val) => !/\s/.test(val), ERROR_MESSAGE.password.regex.spaces)
})

export default defineEventHandler(async (event) => {
  // user must be authenticated (recovery session counts)
  const { user } = await requireAuth(event)

  const body = await readBody(event)
  const parsed = schema.safeParse(body)

  // validate user input
  if (!parsed.success) {
    throw createError({ statusCode: 422, statusMessage: parsed.error.issues[0]?.message })
  }

  // update user password
  const admin = useSupabaseAdmin()
  const { error } = await admin.auth.admin.updateUserById(user.id, {
    password: parsed.data.password
  })

  if (error) {
    throw createError({ statusCode: 400, statusMessage: error.message })
  }

  return { message: SUCCESS_MESSAGE.updatePassword }
})
