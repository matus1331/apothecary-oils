import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { OilsView } from './OilsView'
import type { Oil } from '@/shared/schema'

const oil: Oil = {
  id: 1, productType: 'essential', name: 'Levandule', latinName: null,
  manufacturerId: null, manufacturerName: null, expiryDate: null,
  lowStock: false, note: null, createdAt: 0, updatedAt: 0,
}

function mockMatchMedia(matches: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }))
}

const props = {
  oils: [oil],
  sort: { key: 'name', dir: 'asc' } as const,
  active: null,
  onToggle: vi.fn(),
  onSortChange: vi.fn(),
  onOpen: vi.fn(),
  today: new Date(2026, 7, 30),
}

describe('OilsView', () => {
  it('renders a table on desktop', () => {
    mockMatchMedia(true)
    render(<OilsView {...props} />)
    expect(screen.getByRole('table')).toBeInTheDocument()
  })
  it('renders cards + sort select on mobile', () => {
    mockMatchMedia(false)
    render(<OilsView {...props} />)
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(screen.getByText('Seřadit podle')).toBeInTheDocument()
  })
})
