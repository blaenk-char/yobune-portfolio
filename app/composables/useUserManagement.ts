import { ERROR_MESSAGE } from '#shared/constants'
import type { PaginatedProfiles } from '#shared/types/user'

/**
 * Admin only composable for listing and managing users.
 */
export const useUserManagement = () => {
  /* Constants */
  const supabase = useSupabaseClient()

  /* Refs */
  const users = ref<PaginatedProfiles | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  /* Functions */
  async function getToken() {
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token

    // throw if no token
    if (!token) throw new Error(ERROR_MESSAGE.user.session)
    return token
  }

  async function fetchUsers(page = 1, limit = 20) {
    loading.value = true
    error.value = null

    try {
      const token = await getToken()

      // get user list
      users.value = await $fetch<PaginatedProfiles>('/api/user/list', {
        query: { page, limit },
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch (e: unknown) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  async function updateRole(userId: string, role: UserRole) {
    const token = await getToken()

    // update user role
    return $fetch(`/api/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
      // @ts-expect-error - Nuxt complains that it can't find patch even though it can
      method: 'PATCH',
      body: { role }
    })
  }

  async function fetchUser(userId: string) {
    const token = await getToken()

    // get user
    return $fetch(`/api/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
  }

  /* Returns */
  return {
    users,
    loading,
    error,
    fetchUsers,
    updateRole,
    fetchUser
  }
}
