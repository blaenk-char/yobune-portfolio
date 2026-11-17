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

export interface CommissionFormFieldOptionPayload {
  id?: string
  label: string
  modifierType: 'none' | 'flat' | 'multiplier'
  modifierValue: number
  sortOrder: number
}

export interface CommissionFormFieldPayload {
  id?: string
  type: 'text' | 'file' | 'checkbox' | 'radio'
  label: string
  placeholder?: string | null
  isRequired: boolean
  sortOrder: number
  options?: CommissionFormFieldOptionPayload[]
}

export interface CommissionFormSectionPayload {
  id?: string
  title: string
  description?: string | null
  sortOrder: number
  fields: CommissionFormFieldPayload[]
}

export interface CommissionFormPayload {
  title: string
  description?: string | null
  sections: CommissionFormSectionPayload[]
}

export interface CommissionServicePreviewPayload {
  id?: string
  url: string
  sortOrder: number
}

export interface CommissionServicePayload {
  title: string
  description: string
  basePrice: number
  slotsTotal: number
  isNsfw: boolean
  isActive: boolean
  previews: CommissionServicePreviewPayload[]
  form?: CommissionFormPayload | null
}

export interface CommissionOrderAnswerPayload {
  fieldId: string
  optionId?: string | null
  optionIds?: string[]
  textValue?: string | null
  filePath?: string | null
  filePaths?: string[]
}

export interface CreateCommissionOrderPayload {
  answers: CommissionOrderAnswerPayload[]
}

export interface UpdateCommissionOrderStatusPayload {
  status: 'pending' | 'in_queue' | 'in_progress' | 'completed' | 'declined' | 'cancelled'
  deliverablePaths?: string[]
}

export interface ShopProductPreviewPayload {
  id?: string
  url: string
  sortOrder: number
}

export interface ShopProductPayload {
  title: string
  description: string
  price: number
  isNsfw: boolean
  isPublished: boolean
  filePath: string
  previews: ShopProductPreviewPayload[]
}
