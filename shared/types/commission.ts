export type CommissionFieldType = 'text' | 'file' | 'checkbox' | 'radio'

export type CommissionModifierType = 'none' | 'flat' | 'multiplier'

export type CommissionOrderStatus =
  'pending' | 'in_queue' | 'in_progress' | 'completed' | 'declined' | 'cancelled'

export interface CommissionServicePreview {
  id: string
  serviceId: string
  url: string
  sortOrder: number
}

export interface CommissionFormFieldOption {
  id: string
  fieldId: string
  label: string
  modifierType: CommissionModifierType
  modifierValue: number
  sortOrder: number
}

export interface CommissionFormField {
  id: string
  sectionId: string
  type: CommissionFieldType
  label: string
  placeholder: string | null
  isRequired: boolean
  sortOrder: number
  options: CommissionFormFieldOption[]
}

export interface CommissionFormSection {
  id: string
  formId: string
  title: string
  description: string | null
  sortOrder: number
  fields: CommissionFormField[]
}

export interface CommissionForm {
  id: string
  serviceId: string
  title: string
  description: string | null
  sections: CommissionFormSection[]
}

export interface CommissionService {
  id: string
  title: string
  description: string
  basePrice: number
  slotsTotal: number
  slotsAvailable: number
  isNsfw: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
  previews: CommissionServicePreview[]
  form: CommissionForm | null
}

export interface CommissionOrderAnswer {
  id: string
  orderId: string
  fieldId: string
  optionId: string | null
  textValue: string | null
  filePath: string | null
  field?: Pick<CommissionFormField, 'id' | 'label' | 'type'>
  option?: Pick<CommissionFormFieldOption, 'id' | 'label' | 'modifierType' | 'modifierValue'> | null
}

export interface CommissionOrderDeliverable {
  id: string
  orderId: string
  filePath: string
  createdAt: string
}

export interface CommissionOrder {
  id: string
  userId: string
  serviceId: string
  status: CommissionOrderStatus
  totalPrice: number
  createdAt: string
  updatedAt: string
  username?: string
  serviceTitle?: string
  answers?: CommissionOrderAnswer[]
  deliverables?: CommissionOrderDeliverable[]
}

export interface CommissionQueueItem {
  id: string
  username: string
  serviceTitle: string
  status: Extract<CommissionOrderStatus, 'in_queue' | 'in_progress' | 'completed'>
  createdAt: string
  updatedAt: string
}
