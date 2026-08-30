import { describe, it, expect } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('merges conditional classes', () => {
    // eslint-disable-next-line no-constant-binary-expression -- exercising falsy-conditional class input
    expect(cn('p-2', false && 'hidden', 'text-ink')).toBe('p-2 text-ink')
  })
  it('dedupes conflicting tailwind classes, last wins', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })
})
