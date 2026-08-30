import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ExpiryBanner } from './ExpiryBanner'
import type { Oil } from '@/shared/schema'

const today = new Date(2026, 7, 30)
const mk = (expiryDate: string | null): Oil => ({
  id: Math.random(), productType: 'essential', name: 'X', latinName: null,
  manufacturerId: null, manufacturerName: null, expiryDate, lowStock: false,
  note: null, createdAt: 0, updatedAt: 0,
})

describe('ExpiryBanner', () => {
  it('renders nothing when nothing expires', () => {
    const { container } = render(<ExpiryBanner oils={[mk(null), mk('2029-01-01')]} today={today} onShow={vi.fn()} />)
    expect(container).toBeEmptyDOMElement()
  })
  it('shows counts with correct Czech plurals and both lines', () => {
    render(
      <ExpiryBanner
        oils={[mk('2026-09-10'), mk('2026-09-20'), mk('2026-01-01')]}
        today={today}
        onShow={vi.fn()}
      />,
    )
    expect(screen.getByText(/2 oleje expiruje do 90 dní/)).toBeInTheDocument()
    expect(screen.getByText(/1 olej je po expiraci/)).toBeInTheDocument()
  })
  it('calls onShow', async () => {
    const onShow = vi.fn()
    render(<ExpiryBanner oils={[mk('2026-09-10')]} today={today} onShow={onShow} />)
    await userEvent.click(screen.getByRole('button', { name: 'Zobrazit' }))
    expect(onShow).toHaveBeenCalled()
  })
})
