import { rateLimit } from '#server/utils/rateLimit'
import { ERROR_MESSAGE } from '#shared/constants'
import type { H3Event } from 'h3'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

function createMockEvent(path: string, ip = '127.0.0.1'): H3Event {
  return {
    path,
    context: {},
    node: {
      req: {
        headers: {
          'x-forwarded-for': ip
        },
        socket: {
          remoteAddress: ip
        }
      }
    }
  } as unknown as H3Event
}

describe('rateLimit utility', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('allows requests up to the configured limit and throws 429 on limit + 1', () => {
    const event = createMockEvent('/api/v1/auth/register', '10.0.0.1')

    expect(() => rateLimit(event, 3, 60_000)).not.toThrow()
    expect(() => rateLimit(event, 3, 60_000)).not.toThrow()
    expect(() => rateLimit(event, 3, 60_000)).not.toThrow()

    expect(() => rateLimit(event, 3, 60_000)).toThrowError(
      expect.objectContaining({
        statusCode: 429,
        statusMessage: ERROR_MESSAGE.rateLimit
      })
    )
  })

  it('isolates limits per IP address and per endpoint path', () => {
    const eventIp1 = createMockEvent('/api/v1/auth/confirm', '10.0.0.2')
    const eventIp2 = createMockEvent('/api/v1/auth/confirm', '10.0.0.3')
    const eventOtherPath = createMockEvent('/api/v1/auth/oauth', '10.0.0.2')

    rateLimit(eventIp1, 1, 60_000)
    expect(() => rateLimit(eventIp1, 1, 60_000)).toThrow()

    // Different IP or different path should still succeed
    expect(() => rateLimit(eventIp2, 1, 60_000)).not.toThrow()
    expect(() => rateLimit(eventOtherPath, 1, 60_000)).not.toThrow()
  })

  it('resets the counter once windowMs has elapsed', () => {
    const event = createMockEvent('/api/v1/auth/forgot-password', '10.0.0.4')

    rateLimit(event, 1, 10_000)
    expect(() => rateLimit(event, 1, 10_000)).toThrow()

    vi.advanceTimersByTime(10_001)
    expect(() => rateLimit(event, 1, 10_000)).not.toThrow()
  })
})
