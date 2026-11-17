import { parseBody } from '#server/utils/validate'
import { ERROR_MESSAGE } from '#shared/constants'
import { usernameSchema } from '#shared/schemas'
import type { H3Event } from 'h3'
import * as h3 from 'h3'
import { describe, expect, it, vi } from 'vitest'

vi.mock('h3', async (importOriginal) => {
  const actual = await importOriginal<typeof import('h3')>()
  return {
    ...actual,
    readBody: vi.fn()
  }
})

describe('parseBody utility', () => {
  const mockEvent = {} as H3Event

  it('returns parsed data when request body matches schema', async () => {
    vi.mocked(h3.readBody).mockResolvedValueOnce({ username: 'valid_user' })

    const result = await parseBody(mockEvent, usernameSchema)
    expect(result).toEqual({ username: 'valid_user' })
  })

  it('throws 422 H3Error with first validation issue message on invalid body', async () => {
    vi.mocked(h3.readBody).mockResolvedValueOnce({ username: 'x' })

    await expect(parseBody(mockEvent, usernameSchema)).rejects.toMatchObject({
      statusCode: 422,
      statusMessage: ERROR_MESSAGE.username.min
    })
  })
})
