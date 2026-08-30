import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { OilsTable } from './OilsTable'
import type { Oil } from '@/shared/schema'

const today = new Date(2026, 7, 30)

const mk = (over: Partial<Oil>): Oil => ({
  id: Math.random(),
  productType: 'essential',
  name: 'X',
  latinName: null,
  manufacturerId: null,
  manufacturerName: null,
  expiryDate: null,
  lowStock: false,
  note: null,
  createdAt: 0,
  updatedAt: 0,
  ...over,
})

const oils = [
  mk({ name: 'Levandule', productType: 'essential', expiryDate: '2026-09-10' }), // expiring
  mk({ name: 'Máta', productType: 'essential', expiryDate: '2027-06-01' }),
  mk({ name: 'Mandlový', productType: 'carrier' }),
]

function renderTable(props: Partial<Parameters<typeof OilsTable>[0]> = {}) {
  return render(
    <OilsTable
      oils={oils}
      sort={{ key: 'name', dir: 'asc' }}
      active={null}
      onToggle={vi.fn()}
      onOpen={vi.fn()}
      today={today}
      {...props}
    />,
  )
}

describe('OilsTable', () => {
  it('renders one section per non-empty type in fixed order', () => {
    renderTable()
    const headings = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    expect(headings).toEqual(['Éterické oleje (2)', 'Rostlinné oleje (1)'])
  })

  it('tints the expiring row', () => {
    renderTable()
    expect(screen.getByText('Levandule').closest('tr')).toHaveClass('bg-warn-bg')
  })

  it('opens an oil on row click', async () => {
    const onOpen = vi.fn()
    renderTable({ onOpen })
    await userEvent.click(screen.getByText('Máta'))
    expect(onOpen).toHaveBeenCalledWith(expect.objectContaining({ name: 'Máta' }))
  })

  it('sorts within a section by the given sort state', () => {
    renderTable({ sort: { key: 'name', dir: 'desc' } })
    const essentialTable = screen.getByText('Éterické oleje (2)').parentElement!.querySelector('table')!
    const names = within(essentialTable)
      .getAllByRole('row')
      .slice(1)
      .map((r) => r.firstChild?.textContent)
    expect(names).toEqual(['Máta', 'Levandule'])
  })
})
