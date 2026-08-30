import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { InstallButton } from './InstallButton'

function setUserAgent(ua: string) {
  Object.defineProperty(window.navigator, 'userAgent', { value: ua, configurable: true })
}
const realUa = window.navigator.userAgent

afterEach(() => setUserAgent(realUa))

describe('InstallButton', () => {
  it('renders nothing on a non-iOS browser without an install prompt', () => {
    setUserAgent('Mozilla/5.0 (X11; Linux x86_64)')
    const { container } = render(<InstallButton />)
    expect(container).toBeEmptyDOMElement()
  })

  it('shows the iOS add-to-home-screen hint on iOS Safari', async () => {
    setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15')
    render(<InstallButton />)
    await userEvent.click(screen.getByRole('button', { name: /Nainstalovat/ }))
    expect(screen.getByText('Sdílet → Přidat na plochu')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Rozumím' }))
    expect(screen.queryByText('Sdílet → Přidat na plochu')).toBeNull()
  })
})
