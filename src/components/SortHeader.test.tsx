import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SortHeader } from './SortHeader'

function wrap(ui: React.ReactNode) {
  return render(
    <table>
      <thead>
        <tr>{ui}</tr>
      </thead>
    </table>,
  )
}

describe('SortHeader', () => {
  it('shows no direction and aria-sort none when inactive', () => {
    wrap(<SortHeader label="Název" column="name" active={null} onToggle={() => {}} />)
    expect(screen.getByRole('columnheader')).toHaveAttribute('aria-sort', 'none')
  })
  it('reflects active ascending and toggles on click', async () => {
    const onToggle = vi.fn()
    wrap(
      <SortHeader label="Datum expirace" column="expiryDate" active={{ key: 'expiryDate', dir: 'asc' }} onToggle={onToggle} />,
    )
    expect(screen.getByRole('columnheader')).toHaveAttribute('aria-sort', 'ascending')
    await userEvent.click(screen.getByRole('button', { name: /Datum expirace/ }))
    expect(onToggle).toHaveBeenCalledWith('expiryDate')
  })
})
