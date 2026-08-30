import { describe, it, expect } from 'vitest'
import { oilInputSchema, PRODUCT_TYPE_LABELS } from './schema'

const valid = {
  productType: 'essential',
  name: '  Levandule  ',
  latinName: '',
  manufacturerName: '  Nobilis ',
  expiryDate: '2026-11-01',
  lowStock: false,
  note: '',
}

describe('oilInputSchema', () => {
  it('trims name and maps empty strings to null', () => {
    const p = oilInputSchema.parse(valid)
    expect(p.name).toBe('Levandule')
    expect(p.latinName).toBeNull()
    expect(p.note).toBeNull()
    expect(p.manufacturerName).toBe('Nobilis')
  })
  it('rejects empty name', () => {
    expect(oilInputSchema.safeParse({ ...valid, name: '   ' }).success).toBe(false)
  })
  it('rejects unknown product type', () => {
    expect(oilInputSchema.safeParse({ ...valid, productType: 'wax' }).success).toBe(false)
  })
  it('rejects malformed date but allows null', () => {
    expect(oilInputSchema.safeParse({ ...valid, expiryDate: '01/2026' }).success).toBe(false)
    expect(oilInputSchema.parse({ ...valid, expiryDate: null }).expiryDate).toBeNull()
  })
  it('enforces max lengths', () => {
    expect(oilInputSchema.safeParse({ ...valid, name: 'x'.repeat(121) }).success).toBe(false)
  })
  it('has a Czech label for every product type', () => {
    expect(PRODUCT_TYPE_LABELS.essential).toBe('Éterický olej')
    expect(PRODUCT_TYPE_LABELS.carrier).toBe('Rostlinný olej')
    expect(PRODUCT_TYPE_LABELS.hydrosol).toBe('Hydrolát')
  })
})
