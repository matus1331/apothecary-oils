import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AppHeader } from './AppHeader'

describe('AppHeader', () => {
  it('renders the title and fires onAdd', async () => {
    const onAdd = vi.fn()
    render(<AppHeader onAdd={onAdd} />)
    expect(screen.getByRole('heading', { name: 'Olejovník' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /Přidat olej/ }))
    expect(onAdd).toHaveBeenCalled()
  })
})
