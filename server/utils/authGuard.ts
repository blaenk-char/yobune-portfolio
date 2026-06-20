import { ERROR_MESSAGE } from '#shared/constants'
import { createClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'
import { createError, getHeader } from 'h3'

/**
 * Extracts and verifies the Bearer JWT from the Authorization header.
 * Returns the Supabase user with their profile.
 */
export async function requireAuth(event: H3Event, allowedRoles?: UserRole[]) {
  const config = useRuntimeConfig()
  const token = getHeader(event, 'authorization')?.replace('Bearer ', '')

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: ERROR_MESSAGE.auth.token })
  }

  // verify token with supabase
  const supabase = createClient(config.public.supabaseUrl, config.public.supabaseKey)
  const {
    data: { user },
    error
  } = await supabase.auth.getUser(token)

  if (error || !user) {
    throw createError({ statusCode: 401, statusMessage: ERROR_MESSAGE.auth.invalid })
  }

  // fetch profile
  const profile = await prisma.profiles.findUnique({ where: { id: user.id } })
  if (!profile) {
    throw createError({ statusCode: 401, statusMessage: ERROR_MESSAGE.user.notFound })
  }

  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    throw createError({ statusCode: 403, statusMessage: ERROR_MESSAGE.user.permission })
  }

  return { user, profile }
}
