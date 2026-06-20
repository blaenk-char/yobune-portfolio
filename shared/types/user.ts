export type UserRole = 'super_admin' | 'admin' | 'user'

export interface Profile {
  id: string
  username: string
  role: UserRole
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  password: string
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
  token: string
}

export interface UpdateProfilePayload {
  username?: string
}
