import { PAGES } from '#shared/constants'
import type {
  ConfirmPayload,
  ForgotPasswordPayload,
  RegisterPayload,
  ResetPasswordPayload
} from '#shared/types/user'

/**
 * Composable handling auth calls.
 */
export const useAuth = () => {
  /* Constants */
  const supabase = useSupabaseClient()

  /* Refs */
  const loading = ref<boolean>(false)

  /* Functions */
  async function login(payload: LoginPayload) {
    return withLoading(loading, async () => {
      const { error } = await supabase.auth.signInWithPassword(payload)
      if (error) throw error
    })
  }

  async function logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    await navigateTo(PAGES.auth.url)
  }

  async function register(payload: RegisterPayload) {
    return withLoading(loading, () =>
      $fetch('/api/auth/register', {
        method: 'POST',
        body: payload
      })
    )
  }

  async function confirm(payload: ConfirmPayload) {
    return withLoading(loading, () =>
      $fetch('/api/auth/confirm', {
        method: 'POST',
        body: payload
      })
    )
  }

  async function forgotPassword(payload: ForgotPasswordPayload) {
    return withLoading(loading, () =>
      $fetch('/api/auth/forgot-password', {
        method: 'POST',
        body: payload
      })
    )
  }

  async function resetPassword(payload: ResetPasswordPayload) {
    return withLoading(loading, () =>
      $fetch('/api/auth/reset-password', {
        method: 'POST',
        body: payload
      })
    )
  }

  /* Return */
  return {
    loading,
    login,
    logout,
    register,
    confirm,
    forgotPassword,
    resetPassword
  }
}
