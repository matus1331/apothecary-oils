import { QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createQueryClient } from '@/lib/query'
import * as api from '@/lib/api-client'
import { ToastHost } from '@/components/ui/ToastHost'
import { AppShell } from './AppShell'

const oil = {
  id: 1, productType: 'essential' as const, name: 'Levandule', latinName: 'Lavandula',
  manufacturerId: 1, manufacturerName: 'Nobilis', expiryDate: '2026-09-15',
  lowStock: false, note: null, createdAt: 0, updatedAt: 0,
}

function renderShell() {
  return render(
    <QueryClientProvider client={createQueryClient()}>
      <AppShell />
      <ToastHost />
    </QueryClientProvider>,
  )
}

beforeEach(() => {
  vi.stubGlobal('matchMedia', (q: string) => ({
    matches: true, media: q, addEventListener: () => {}, removeEventListener: () => {},
  }))
  vi.spyOn(api, 'getManufacturers').mockResolvedValue([{ id: 1, name: 'Nobilis' }])
})
afterEach(() => vi.restoreAllMocks())

describe('AppShell', () => {
  it('shows the loading screen then the table', async () => {
    vi.spyOn(api, 'getOils').mockResolvedValue([oil])
    renderShell()
    expect(screen.getByText('Připravuji tvou sbírku…')).toBeInTheDocument()
    expect(await screen.findByText('Levandule')).toBeInTheDocument()
    expect(screen.getByText(/expiruje do 90 dní/)).toBeInTheDocument()
  })

  it('shows the empty state when there are no oils', async () => {
    vi.spyOn(api, 'getOils').mockResolvedValue([])
    renderShell()
    expect(await screen.findByText('Zatím žádné oleje')).toBeInTheDocument()
  })

  it('opens the add drawer, submits, and shows a success toast', async () => {
    vi.spyOn(api, 'getOils').mockResolvedValue([])
    const created = { ...oil, name: 'Máta' }
    const createSpy = vi.spyOn(api, 'createOil').mockResolvedValue(created)
    renderShell()
    await userEvent.click(await screen.findByRole('button', { name: 'Přidat první olej' }))
    const dialog = screen.getByRole('dialog')
    await userEvent.click(within(dialog).getByRole('radio', { name: 'Éterický olej' }))
    await userEvent.type(within(dialog).getByLabelText('Název'), 'Máta')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Uložit' }))
    await waitFor(() => expect(createSpy).toHaveBeenCalled())
    expect(await screen.findByText('Uloženo')).toBeInTheDocument()
  })

  it('surfaces an error toast when a mutation fails', async () => {
    vi.spyOn(api, 'getOils').mockResolvedValue([oil])
    vi.spyOn(api, 'updateOil').mockRejectedValue(new api.ApiError(0, 'Bez připojení — změna se neuložila'))
    renderShell()
    await userEvent.click(await screen.findByText('Levandule'))
    const dialog = screen.getByRole('dialog')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Uložit' }))
    expect(await screen.findByText('Bez připojení — změna se neuložila')).toBeInTheDocument()
  })
})
