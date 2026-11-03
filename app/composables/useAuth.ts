import { PAGES } from '#shared/constants'
import type {
  ChangeEmailPayload,
  ChangePasswordPayload,
  ConfirmEmailPayload,
  ConfirmPayload,
  ForgotPasswordPayload,
  MessageResponse,
  Profile,
  RegisterPayload,
  ResetPasswordPayload
} from '#shared/types'

/**
 * Composable handling auth calls.
 */
export const useAuth = () => {
  /* Constants */
  const supabase = useSupabaseClient()
  const authStore = useAuthStore()
  const { fetchProfile } = useProfile()

  /* Refs */
  const loading = ref<boolean>(false)

  /* Functions */
  async function login(payload: LoginPayload) {
    return withLoading(loading, async () => {
      const { error } = await supabase.auth.signInWithPassword(payload)
      if (error) throw error
      await fetchProfile()
    })
  }

  async function loginWithGoogle() {
    return withLoading(loading, async () => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      })
      if (error) throw error
    })
  }

  async function confirmOAuth() {
    return withLoading(loading, async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession()
      if (!session) return

      authStore.profile = await $fetch<Profile>('/api/v1/auth/oauth', {
        headers: { Authorization: `Bearer ${session.access_token}` },
        method: 'POST'
      })
      authStore.ready = true
    })
  }

  async function logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    authStore.clear()
    await navigateTo(PAGES.auth.url)
  }

  async function register(payload: RegisterPayload) {
    return withLoading(loading, () =>
      $fetch<MessageResponse>('/api/v1/auth/register', {
        method: 'POST',
        body: payload
      })
    )
  }

  async function confirm(payload: ConfirmPayload) {
    return withLoading(loading, () =>
      $fetch<MessageResponse>('/api/v1/auth/confirm', {
        method: 'POST',
        body: payload
      })
    )
  }

  async function forgotPassword(payload: ForgotPasswordPayload) {
    return withLoading(loading, () =>
      $fetch<MessageResponse>('/api/v1/auth/forgot-password', {
        method: 'POST',
        body: payload
      })
    )
  }

  async function resetPassword(payload: ResetPasswordPayload) {
    return withLoading(loading, () =>
      $fetch<MessageResponse>('/api/v1/auth/reset-password', {
        method: 'POST',
        body: payload
      })
    )
  }

  async function changeEmail(payload: ChangeEmailPayload) {
    return withLoading(loading, () =>
      $fetch<MessageResponse>('/api/v1/auth/change-email', {
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

  async function deleteAccount() {
    return withLoading(loading, async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession()

      const data = await $fetch<MessageResponse>('/api/v1/profile/delete', {
        headers: { Authorization: `Bearer ${session?.access_token}` },
        method: 'DELETE'
      })

      await logout()

      return data
    })
  }

  /* Return */
  return {
    loading,
    login,
    loginWithGoogle,
    confirmOAuth,
    logout,
    register,
    confirm,
    forgotPassword,
    resetPassword,
    changeEmail,
    confirmEmail,
    changePassword,
    deleteAccount
  }
}
