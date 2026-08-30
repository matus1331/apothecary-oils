import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useTheme } from './useTheme'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({ matches: false, addEventListener() {}, removeEventListener() {} }),
  )
})

describe('useTheme', () => {
  it('first visit follows the OS preference and applies an explicit data-theme', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('first visit with a dark OS starts dark', () => {
    ;(window.matchMedia as ReturnType<typeof vi.fn>).mockReturnValue({
      matches: true,
      addEventListener() {},
      removeEventListener() {},
    })
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('toggle flips light ↔ dark and persists', () => {
    const { result } = renderHook(() => useTheme())
    act(() => result.current.toggle())
    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    expect(localStorage.getItem('oils.theme')).toBe('dark')
    act(() => result.current.toggle())
    expect(result.current.theme).toBe('light')
    expect(localStorage.getItem('oils.theme')).toBe('light')
  })

  it('a stored choice wins over the OS preference', () => {
    localStorage.setItem('oils.theme', 'dark')
    ;(window.matchMedia as ReturnType<typeof vi.fn>).mockReturnValue({
      matches: false,
      addEventListener() {},
      removeEventListener() {},
    })
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('dark')
  })
})
