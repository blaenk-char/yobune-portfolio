export type UserRole = 'super_admin' | 'admin' | 'user'

export interface Profile {
  id: string
  username: string
  role: UserRole
}

export interface MessageResponse {
  message: string
}
