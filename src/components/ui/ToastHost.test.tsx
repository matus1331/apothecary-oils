import { act, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ToastHost } from './ToastHost'
import { toast, type Toast } from './toast'

function currentToasts(): Toast[] {
  let list: Toast[] = []
  const unsub = toast.subscribe((l) => (list = l))
  unsub()
  return list
}

describe('ToastHost auto-dismiss', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    // module singleton has no reset — clear anything a test left behind
    act(() => {
      for (const t of currentToasts()) toast.dismiss(t.id)
    })
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('dismisses a single toast after exactly 4000ms', () => {
    const dismiss = vi.spyOn(toast, 'dismiss')
    render(<ToastHost />)

    let id = 0
    act(() => {
      id = toast.success('Uloženo')
    })
    expect(dismiss).not.toHaveBeenCalled()
    expect(currentToasts().some((t) => t.id === id)).toBe(true)

    act(() => {
      vi.advanceTimersByTime(3999)
    })
    expect(dismiss).not.toHaveBeenCalledWith(id)

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(dismiss).toHaveBeenCalledWith(id)
    expect(currentToasts().some((t) => t.id === id)).toBe(false)
  })

  it('gives each toast its own independent 4s clock', () => {
    const dismiss = vi.spyOn(toast, 'dismiss')
    render(<ToastHost />)

    let first = 0
    act(() => {
      first = toast.success('First')
    })

    // 2s later a sibling arrives — must NOT push the first toast's deadline out
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    let second = 0
    act(() => {
      second = toast.error('Second')
    })

    // reach the first toast's own 4000ms (2000ms more)
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(dismiss).toHaveBeenCalledWith(first)
    expect(dismiss).not.toHaveBeenCalledWith(second)
    const afterFirst = currentToasts()
    expect(afterFirst.some((t) => t.id === first)).toBe(false)
    expect(afterFirst.some((t) => t.id === second)).toBe(true)

    // the survivor's clock was NOT restarted by the sibling leaving — it dies at its own 4000ms
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(dismiss).toHaveBeenCalledWith(second)
    expect(currentToasts().some((t) => t.id === second)).toBe(false)
  })
})
