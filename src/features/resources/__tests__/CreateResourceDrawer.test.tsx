import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/renderWithProviders'
import { CreateResourceDrawer } from '../components/CreateResourceDrawer'

describe('CreateResourceDrawer', () => {
  it('mounts the form only while open and resets it after closing', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CreateResourceDrawer />)

    expect(screen.queryByLabelText('Resource name')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Create resource' }))

    const dialog = screen.getByRole('dialog', { name: 'Create resource' })
    const resourceName = within(dialog).getByLabelText('Resource name')

    await user.type(resourceName, 'Temporary draft')
    expect(resourceName).toHaveValue('Temporary draft')

    await user.click(within(dialog).getByRole('button', { name: '✕' }))

    expect(screen.queryByLabelText('Resource name')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Create resource' }))

    expect(screen.getByLabelText('Resource name')).toHaveValue('')
  })

  it('shows validation feedback without submitting an empty form', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CreateResourceDrawer />)

    await user.click(screen.getByRole('button', { name: 'Create resource' }))

    const dialog = screen.getByRole('dialog', { name: 'Create resource' })
    await user.click(within(dialog).getByRole('button', { name: 'Create resource' }))

    expect(within(dialog).getByText('Resource name is required.')).toBeInTheDocument()
  })
})
