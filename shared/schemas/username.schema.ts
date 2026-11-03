import z from 'zod'
import { primitives } from './primitives.schema'

export const usernameSchema = z.object({
  username: primitives.username
})

export type UsernameSchema = z.output<typeof usernameSchema>

export const usernameState: Partial<UsernameSchema> = {
  username: undefined
}
