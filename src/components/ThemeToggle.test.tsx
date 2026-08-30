import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ThemeToggle } from './ThemeToggle'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({ matches: false, addEventListener() {}, removeEventListener() {} }),
  )
})

describe('ThemeToggle', () => {
  it('toggles between light and dark with a clear label', async () => {
    render(<ThemeToggle />)
    const btn = screen.getByRole('button')
    expect(btn).toHaveAttribute('aria-label', 'Přepnout na tmavý motiv')
    await userEvent.click(btn)
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    expect(btn).toHaveAttribute('aria-label', 'Přepnout na světlý motiv')
    await userEvent.click(btn)
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    expect(btn).toHaveAttribute('aria-label', 'Přepnout na tmavý motiv')
  })
})
