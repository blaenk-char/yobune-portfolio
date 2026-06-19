export type UserRole = 'super_admin' | 'admin' | 'user'

export interface AuthUser {
  id: string
  email: string | undefined
  emailConfirmedAt: string | null
  username: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

export interface PaginatedProfiles {
  data: AuthUser[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
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
