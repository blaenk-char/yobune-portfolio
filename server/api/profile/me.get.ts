export default defineEventHandler(async (event) => {
  const { profile } = await requireAuth(event)

  return profile
})
