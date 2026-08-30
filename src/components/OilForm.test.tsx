import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { OilForm } from './OilForm'
import type { Oil } from '@/shared/schema'

const manufacturers = [{ id: 1, name: 'Nobilis Tilia' }]

const existing: Oil = {
  id: 7,
  productType: 'carrier',
  name: 'Mandlový olej',
  latinName: 'Prunus dulcis',
  manufacturerId: 1,
  manufacturerName: 'Nobilis Tilia',
  expiryDate: '2027-03-01',
  lowStock: true,
  note: 'chladno',
  createdAt: 0,
  updatedAt: 0,
}

describe('OilForm', () => {
  it('blocks submit and shows errors when required fields are missing', async () => {
    const onSubmit = vi.fn()
    render(
      <OilForm manufacturers={manufacturers} onSubmit={onSubmit} onCancel={() => {}} />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Uložit' }))
    expect(onSubmit).not.toHaveBeenCalled()
    expect(await screen.findByText('Zadejte název')).toBeInTheDocument()
    expect(screen.getByText('Vyberte typ produktu')).toBeInTheDocument()
  })

  it('submits a normalized OilInput for a new oil', async () => {
    const onSubmit = vi.fn()
    render(<OilForm manufacturers={manufacturers} onSubmit={onSubmit} onCancel={() => {}} />)
    await userEvent.click(screen.getByRole('radio', { name: 'Éterický olej' }))
    await userEvent.type(screen.getByLabelText('Název'), '  Levandule ')
    await userEvent.type(screen.getByRole('combobox'), 'Nobilis Tilia')
    await userEvent.click(await screen.findByRole('option', { name: /Nobilis Tilia/ }))
    await userEvent.click(screen.getByRole('button', { name: 'Uložit' }))
    expect(onSubmit).toHaveBeenCalledWith({
      productType: 'essential',
      name: 'Levandule',
      latinName: null,
      manufacturerName: 'Nobilis Tilia',
      expiryDate: null,
      lowStock: false,
      note: null,
    })
  })

  it('prefills from an existing oil and can trigger delete', async () => {
    const onDelete = vi.fn()
    render(
      <OilForm
        defaultOil={existing}
        manufacturers={manufacturers}
        onSubmit={() => {}}
        onDelete={onDelete}
        onCancel={() => {}}
      />,
    )
    expect(screen.getByLabelText('Název')).toHaveValue('Mandlový olej')
    expect(screen.getByRole('radio', { name: 'Rostlinný olej' })).toBeChecked()
    expect(screen.getByRole('switch', { name: 'Dochází' })).toHaveAttribute('aria-checked', 'true')
    await userEvent.click(screen.getByRole('button', { name: 'Smazat' }))
    expect(onDelete).toHaveBeenCalled()
  })

  it('keeps "Uložit" disabled in edit mode until something changes', async () => {
    render(
      <OilForm
        defaultOil={existing}
        manufacturers={manufacturers}
        onSubmit={() => {}}
        onDelete={() => {}}
        onCancel={() => {}}
      />,
    )
    const save = screen.getByRole('button', { name: 'Uložit' })
    expect(save).toBeDisabled()
    await userEvent.type(screen.getByLabelText('Název'), 'x')
    expect(save).toBeEnabled()
  })

  it('leaves "Uložit" enabled for a new oil (add mode)', () => {
    render(<OilForm manufacturers={manufacturers} onSubmit={() => {}} onCancel={() => {}} />)
    expect(screen.getByRole('button', { name: 'Uložit' })).toBeEnabled()
  })

  it('the "+1 rok" chip fills the expiry date', async () => {
    const onSubmit = vi.fn()
    vi.setSystemTime(new Date(2026, 0, 15))
    render(<OilForm manufacturers={manufacturers} onSubmit={onSubmit} onCancel={() => {}} />)
    await userEvent.click(screen.getByRole('button', { name: '+1 rok' }))
    expect(screen.getByLabelText('Datum expirace')).toHaveValue('2027-01-15')
    vi.useRealTimers()
  })
})
