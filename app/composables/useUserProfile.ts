import { ERROR_MESSAGE } from '#shared/constants'
import type { UpdateProfilePayload } from '#shared/types/user'

/**
 * Fetches and caches the current user's profile.
 * Refetches automatically when the Supabase session changes.
 */
export const useUserProfile = () => {
  /* Constants */
  const supabase = useSupabaseClient()
  const supabaseUser = useSupabaseUser()

  /* Refs */
  const profile = useState<AuthUser | null>('user-profile', () => null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  /* Watches */
  // sync profile with session changes
  watch(supabaseUser, () => fetchProfile(), { immediate: true })

  /* Computeds */
  const isEmailVerified = computed(() => !!profile.value?.emailConfirmedAt)
  const role = computed(() => profile.value?.role ?? null)
  const isAdmin = computed(() => role.value === 'admin' || role.value === 'super_admin')
  const isSuperAdmin = computed(() => role.value === 'super_admin')

  /* Functions */
  async function fetchProfile() {
    if (!supabaseUser.value) {
      profile.value = null
      return
    }

    loading.value = true
    error.value = null

    try {
      const session = await supabase.auth.getSession()
      const token = session.data.session?.access_token
      if (!token) return

      // get user profile
      profile.value = await $fetch<AuthUser>('/api/user/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch (e: unknown) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(payload: UpdateProfilePayload) {
    const session = await supabase.auth.getSession()
    const token = session.data.session?.access_token

    // throw if no token
    if (!token) throw new Error(ERROR_MESSAGE.user.session)

    // update profile
    const updated = await $fetch<AuthUser>('/api/user/me', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: payload
    })

    // merge into local state
    if (profile.value) {
      profile.value = { ...profile.value, ...updated }
    }

    return updated
  }

  /* Returns */
  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    isEmailVerified,
    role,
    isAdmin,
    isSuperAdmin
  }
}
