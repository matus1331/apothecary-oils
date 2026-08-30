import { describe, it, expect } from 'vitest'
import { plural } from './plural'

const forms: [string, string, string] = ['olej', 'oleje', 'olejů']

describe('plural (cs)', () => {
  it('1 → one', () => expect(plural(1, forms)).toBe('olej'))
  it('2..4 → few', () => {
    expect(plural(2, forms)).toBe('oleje')
    expect(plural(4, forms)).toBe('oleje')
  })
  it('0 and 5+ → other', () => {
    expect(plural(0, forms)).toBe('olejů')
    expect(plural(5, forms)).toBe('olejů')
    expect(plural(12, forms)).toBe('olejů')
  })
})
