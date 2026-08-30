import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ManufacturerCombobox } from './ManufacturerCombobox'

const options = [
  { id: 1, name: 'Nobilis Tilia' },
  { id: 2, name: 'doTERRA' },
]

function setup(value = '') {
  const onChange = vi.fn()
  render(<ManufacturerCombobox value={value} onChange={onChange} options={options} />)
  return { onChange }
}

describe('ManufacturerCombobox', () => {
  it('filters options as you type and selects one', async () => {
    const { onChange } = setup()
    const input = screen.getByRole('combobox')
    await userEvent.type(input, 'nob')
    const option = await screen.findByRole('option', { name: /Nobilis Tilia/ })
    await userEvent.click(option)
    expect(onChange).toHaveBeenCalledWith('Nobilis Tilia')
  })

  it('offers to create a new manufacturer when nothing matches exactly', async () => {
    const { onChange } = setup()
    await userEvent.type(screen.getByRole('combobox'), 'Saloos')
    const create = await screen.findByRole('option', { name: /Vytvořit «Saloos»/ })
    await userEvent.click(create)
    expect(onChange).toHaveBeenCalledWith('Saloos')
  })

  it('does not offer create when the text matches an option case-insensitively', async () => {
    setup()
    await userEvent.type(screen.getByRole('combobox'), 'DOTERRA')
    expect(screen.queryByRole('option', { name: /Vytvořit/ })).not.toBeInTheDocument()
  })
})
