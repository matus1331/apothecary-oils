import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { ThemeToggle } from './ThemeToggle'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
})

describe('ThemeToggle', () => {
  it('cycles system → light → dark → system', async () => {
    render(<ThemeToggle />)
    const btn = screen.getByRole('button')
    expect(btn).toHaveAttribute('aria-label', 'Motiv: systém')
    await userEvent.click(btn)
    expect(btn).toHaveAttribute('aria-label', 'Motiv: světlý')
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    await userEvent.click(btn)
    expect(btn).toHaveAttribute('aria-label', 'Motiv: tmavý')
    await userEvent.click(btn)
    expect(btn).toHaveAttribute('aria-label', 'Motiv: systém')
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false)
  })
})
