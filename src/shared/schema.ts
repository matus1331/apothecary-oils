import { z } from 'zod'

export const PRODUCT_TYPES = ['essential', 'carrier', 'hydrosol'] as const
export type ProductType = (typeof PRODUCT_TYPES)[number]

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  essential: 'Éterický olej',
  carrier: 'Rostlinný olej',
  hydrosol: 'Hydrolát',
}

export const PRODUCT_TYPE_LABELS_PLURAL: Record<ProductType, string> = {
  essential: 'Éterické oleje',
  carrier: 'Rostlinné oleje',
  hydrosol: 'Hydroláty',
}

/** '' | whitespace | null | undefined → null; otherwise the trimmed string. */
const emptyToNull = (max: number, tooLong: string) =>
  z
    .union([z.string(), z.null(), z.undefined()])
    .transform((v) => {
      const t = (v ?? '').trim()
      return t.length ? t : null
    })
    .refine((v) => v === null || v.length <= max, { message: tooLong })

const isoDateOrNull = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((v) => {
    const t = (v ?? '').trim()
    return t.length ? t : null
  })
  .refine((v) => v === null || (/^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v))), {
    message: 'Neplatné datum',
  })

export const oilInputSchema = z.object({
  productType: z.enum(PRODUCT_TYPES, { message: 'Vyberte typ produktu' }),
  name: z.string().trim().min(1, 'Zadejte název').max(120, 'Maximálně 120 znaků'),
  latinName: emptyToNull(120, 'Maximálně 120 znaků'),
  manufacturerName: emptyToNull(120, 'Maximálně 120 znaků'),
  expiryDate: isoDateOrNull,
  lowStock: z.boolean().default(false),
  note: emptyToNull(2000, 'Maximálně 2000 znaků'),
})
export type OilInput = z.infer<typeof oilInputSchema>

export const oilSchema = z.object({
  id: z.number(),
  productType: z.enum(PRODUCT_TYPES),
  name: z.string(),
  latinName: z.string().nullable(),
  manufacturerId: z.number().nullable(),
  manufacturerName: z.string().nullable(),
  expiryDate: z.string().nullable(),
  lowStock: z.boolean(),
  note: z.string().nullable(),
  createdAt: z.number(),
  updatedAt: z.number(),
})
export type Oil = z.infer<typeof oilSchema>

export const oilsResponseSchema = z.array(oilSchema)

export const manufacturerSchema = z.object({ id: z.number(), name: z.string() })
export type Manufacturer = z.infer<typeof manufacturerSchema>
export const manufacturersResponseSchema = z.array(manufacturerSchema)
