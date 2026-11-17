import type { User } from '@supabase/supabase-js'

/**
 * Generates a valid, unique username from a Supabase OAuth user's metadata or email.
 */
export async function generateUniqueUsername(user: User): Promise<string> {
  const rawName =
    user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'user'

  let base = String(rawName)
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 40)

  if (base.length < 3) {
    base = 'user'
  }

  let username = base
  while (await prisma.profiles.findUnique({ where: { username } })) {
    const suffix = Math.random().toString(36).slice(2, 6)
    username = `${base}_${suffix}`
  }

  return username
}
