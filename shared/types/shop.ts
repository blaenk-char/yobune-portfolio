export interface ShopProductPreview {
  id: string
  productId: string
  url: string
  sortOrder: number
}

export interface ShopProduct {
  id: string
  title: string
  description: string
  price: number
  isNsfw: boolean
  isPublished: boolean
  filePath?: string
  isClaimed?: boolean
  createdAt: string
  updatedAt: string
  previews: ShopProductPreview[]
}

export interface ShopOrder {
  id: string
  userId: string
  productId: string
  claimedAt: string
  product?: ShopProduct
}
