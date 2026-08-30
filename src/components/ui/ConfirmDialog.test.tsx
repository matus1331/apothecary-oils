import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ConfirmDialog } from './ConfirmDialog'

describe('ConfirmDialog', () => {
  it('fires onConfirm / onCancel', async () => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    render(
      <ConfirmDialog
        open
        title="Opravdu smazat «Levandule»?"
        confirmLabel="Smazat"
        danger
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    )
    expect(screen.getByText('Opravdu smazat «Levandule»?')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Smazat' }))
    expect(onConfirm).toHaveBeenCalled()
    await userEvent.click(screen.getByRole('button', { name: 'Zrušit' }))
    expect(onCancel).toHaveBeenCalled()
  })
})
