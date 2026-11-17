export default defineEventHandler(async (event) => {
  rateLimit(event)
  const user = await verifySupabaseUser(event)

  // return existing profile if already created
  const existing = await prisma.profiles.findUnique({ where: { id: user.id } })
  if (existing) {
    return existing
  }

  // create profile with a unique generated username for first-time OAuth user
  const username = await generateUniqueUsername(user)
  return prisma.profiles.create({
    data: {
      id: user.id,
      username
    }
  })
})
