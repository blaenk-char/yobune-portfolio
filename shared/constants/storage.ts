export const STORAGE_BUCKETS = {
  publicPreviews: 'public-previews',
  commissionReferences: 'commission-references',
  digitalDeliverables: 'digital-deliverables'
} as const

export type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS]
