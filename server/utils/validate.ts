import { primitives } from '#shared/schemas'
import type { H3Event } from 'h3'
import { createError, getRouterParam, readBody } from 'h3'
import type { z } from 'zod'

/**
 * Reads and validates the request body against a Zod schema.
 * Throws a 422 H3Error with the first validation issue message on failure.
 */
export async function parseBody<T extends z.ZodType>(
  event: H3Event,
  schema: T
): Promise<z.output<T>> {
  const body = await readBody(event)
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 422,
      statusMessage: parsed.error.issues[0]?.message
    })
  }

  return parsed.data
}

/**
 * Extracts and validates a UUID route parameter (defaults to `id`).
 * Throws a 400 H3Error on invalid UUID format.
 */
export function parseUuidParam(event: H3Event, notFoundMessage: string, param = 'id'): string {
  const value = getRouterParam(event, param)
  const parsed = primitives.uuid.safeParse(value)

  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: notFoundMessage })
  }

  return parsed.data
}
