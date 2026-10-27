import z from 'zod'
import { primitives } from './primitives.schema'

export const confirmSchema = z.object({
  username: primitives.username,
  token: primitives.string.token
})

export type ConfirmSchema = z.output<typeof confirmSchema>
