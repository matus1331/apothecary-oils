import { PRODUCT_TYPES, PRODUCT_TYPE_LABELS_PLURAL, type Oil, type ProductType } from '@/shared/schema'

export interface OilGroup {
  type: ProductType
  label: string
  oils: Oil[]
}

export function groupByType(oils: Oil[]): OilGroup[] {
  return PRODUCT_TYPES.map((type) => ({
    type,
    label: PRODUCT_TYPE_LABELS_PLURAL[type],
    oils: oils.filter((o) => o.productType === type),
  })).filter((g) => g.oils.length > 0)
}
