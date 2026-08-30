import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useTheme } from './useTheme'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
})

describe('useTheme', () => {
  it('defaults to system and sets no attribute', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('system')
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false)
  })
  it('setTheme("dark") writes attribute and storage', () => {
    const { result } = renderHook(() => useTheme())
    act(() => result.current.setTheme('dark'))
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    expect(localStorage.getItem('oils.theme')).toBe('dark')
  })
  it('setTheme("system") removes the attribute', () => {
    const { result } = renderHook(() => useTheme())
    act(() => result.current.setTheme('light'))
    act(() => result.current.setTheme('system'))
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false)
  })
})
