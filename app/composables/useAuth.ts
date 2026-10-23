import { PAGES } from '#shared/constants'
import type {
  ChangeEmailPayload,
  ChangePasswordPayload,
  ConfirmEmailPayload,
  ConfirmPayload,
  ForgotPasswordPayload,
  MessageResponse,
  RegisterPayload,
  ResetPasswordPayload
} from '#shared/types'

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
      $fetch<MessageResponse>('/api/auth/register', {
        method: 'POST',
        body: payload
      })
    )
  }

  async function confirm(payload: ConfirmPayload) {
    return withLoading(loading, () =>
      $fetch<MessageResponse>('/api/auth/confirm', {
        method: 'POST',
        body: payload
      })
    )
  }

  async function forgotPassword(payload: ForgotPasswordPayload) {
    return withLoading(loading, () =>
      $fetch<MessageResponse>('/api/auth/forgot-password', {
        method: 'POST',
        body: payload
      })
    )
  }

  async function resetPassword(payload: ResetPasswordPayload) {
    return withLoading(loading, () =>
      $fetch<MessageResponse>('/api/auth/reset-password', {
        method: 'POST',
        body: payload
      })
    )
  }

  async function changeEmail(payload: ChangeEmailPayload) {
    return withLoading(loading, () =>
      $fetch<MessageResponse>('/api/auth/change-email', {
        method: 'POST',
        body: payload
      })
    )
  }

  async function confirmEmail(payload: ConfirmEmailPayload) {
    return withLoading(loading, async () => {
      const { data, error } = await supabase.auth.verifyOtp({
        type: 'email_change',
        token_hash: payload.token
      })

      if (error) throw error

      await supabase.auth.refreshSession()
      return data
    })
  }

  async function changePassword(payload: ChangePasswordPayload) {
    return withLoading(loading, async () => {
      const email = useSupabaseUser().value?.email as string

      const { error } = await supabase.auth.signInWithPassword({
        ...payload,
        email
      })

      if (error) throw { statusMessage: error.message }

      return await forgotPassword({ email })
    })
  }

  /* Return */
  return {
    loading,
    login,
    logout,
    register,
    confirm,
    forgotPassword,
    resetPassword,
    changeEmail,
    confirmEmail,
    changePassword
  }
}
