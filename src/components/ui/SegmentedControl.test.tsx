import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SegmentedControl } from './SegmentedControl'

const options = [
  { value: 'essential', label: 'Éterický olej' },
  { value: 'carrier', label: 'Rostlinný olej' },
  { value: 'hydrosol', label: 'Hydrolát' },
]

describe('SegmentedControl', () => {
  it('renders options and marks the selected one', () => {
    render(<SegmentedControl name="typ" options={options} value="carrier" onChange={() => {}} />)
    expect(screen.getByRole('radio', { name: 'Rostlinný olej' })).toBeChecked()
  })
  it('calls onChange when an option is clicked', async () => {
    const onChange = vi.fn()
    render(<SegmentedControl name="typ" options={options} value={null} onChange={onChange} />)
    await userEvent.click(screen.getByRole('radio', { name: 'Hydrolát' }))
    expect(onChange).toHaveBeenCalledWith('hydrosol')
  })
})
