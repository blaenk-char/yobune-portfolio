import { ERROR_MESSAGE } from '#shared/constants'
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
  const user = useSupabaseUser()

  /* Refs */
  const loading = ref<boolean>(false)

  /* Functions */
  async function login(payload: LoginPayload) {
    const { data, error } = await supabase.auth.signInWithPassword(payload)
    if (error) throw error
    return data
  }

  async function logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    await navigateTo('/auth')
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
    return $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: payload
    })
  }

  async function resetPassword(payload: ResetPasswordPayload) {
    const session = await supabase.auth.getSession()
    const token = session.data.session?.access_token
    if (!token) throw new Error(ERROR_MESSAGE.user.session)

    return $fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: payload
    })
  }

  /* Return */
  return {
    loading,
    user,
    login,
    logout,
    register,
    confirm,
    forgotPassword,
    resetPassword
  }
}
