import { ERROR_MESSAGE } from '#shared/constants'
import type { H3Event } from 'h3'
import { createError, getRequestIP } from 'h3'

type RateLimitEntry = {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

/**
 * Simple in-memory IP rate limiter for API routes.
 * Throws a 429 H3Error when the limit is exceeded within the window.
 */
export function rateLimit(event: H3Event, limit = 5, windowMs = 60_000) {
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  const key = `${ip}:${event.path}`
  const now = Date.now()

  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return
  }

  entry.count++

  if (entry.count > limit) {
    throw createError({
      statusCode: 429,
      statusMessage: ERROR_MESSAGE.rateLimit
    })
  }
}
