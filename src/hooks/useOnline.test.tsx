import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useOnline } from './useOnline'

describe('useOnline', () => {
  it('tracks offline / online events', () => {
    const { result } = renderHook(() => useOnline())
    expect(result.current).toBe(true)
    act(() => {
      window.dispatchEvent(new Event('offline'))
    })
    expect(result.current).toBe(false)
    act(() => {
      window.dispatchEvent(new Event('online'))
    })
    expect(result.current).toBe(true)
  })
})
