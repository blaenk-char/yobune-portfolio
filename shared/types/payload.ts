export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  password: string
  confirmPassword: string
}

export interface ConfirmPayload {
  username: string
  token: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  password: string
  confirmPassword: string
  token: string
}

export interface UsernamePayload {
  username: string
}

export interface ChangeEmailPayload {
  email: string
}

export interface ConfirmEmailPayload {
  token: string
}

export interface ChangePasswordPayload {
  password: string
}
