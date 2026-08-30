import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useSortState } from './useSortState'

beforeEach(() => {
  window.history.replaceState(null, '', '/')
})

describe('useSortState', () => {
  it('defaults to name asc with active=null', () => {
    const { result } = renderHook(() => useSortState())
    expect(result.current.sort).toEqual({ key: 'name', dir: 'asc' })
    expect(result.current.active).toBeNull()
  })
  it('toggle cycles asc → desc → off and writes the URL', () => {
    const { result } = renderHook(() => useSortState())
    act(() => result.current.toggle('expiryDate'))
    expect(result.current.sort).toEqual({ key: 'expiryDate', dir: 'asc' })
    expect(window.location.search).toBe('?sort=expiryDate&dir=asc')
    act(() => result.current.toggle('expiryDate'))
    expect(result.current.sort.dir).toBe('desc')
    act(() => result.current.toggle('expiryDate'))
    expect(result.current.active).toBeNull()
    expect(window.location.search).toBe('')
  })
  it('hydrates from an existing query string', () => {
    window.history.replaceState(null, '', '/?sort=manufacturerName&dir=desc')
    const { result } = renderHook(() => useSortState())
    expect(result.current.sort).toEqual({ key: 'manufacturerName', dir: 'desc' })
  })
  it('ignores an invalid sort key', () => {
    window.history.replaceState(null, '', '/?sort=bogus&dir=asc')
    const { result } = renderHook(() => useSortState())
    expect(result.current.active).toBeNull()
  })
})
