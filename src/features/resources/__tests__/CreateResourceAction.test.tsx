import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '@/api/apiError'
import { createResource } from '@/api/resources'
import { renderWithProviders } from '@/test-utils/renderWithProviders'
import { CreateResourceAction } from '../components/CreateResourceAction'
import { createResourceFixture } from './resourceTestFixture'

vi.mock('@/api/resources', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/resources')>()
  return {
    ...actual,
    createResource: vi.fn(),
  }
})

const mockedCreateResource = vi.mocked(createResource)

describe('create resource drawer', () => {
  beforeEach(() => {
    mockedCreateResource.mockReset()
  })
  it('creates the resource and navigates to its overview', async () => {
    const user = userEvent.setup()
    const resource = createResourceFixture()
    mockedCreateResource.mockResolvedValue(resource)

    renderWithProviders(
      <Routes>
        <Route path="/" element={<CreateResourceAction />} />
        <Route path="/resources/:resourceId" element={<p>Resource overview</p>} />
      </Routes>,
    )

    await user.click(screen.getByRole('button', { name: 'Create resource' }))
    const dialog = screen.getByRole('dialog', { name: 'Create resource' })

    await user.type(within(dialog).getByLabelText('Resource name'), resource.name)
    await user.click(within(dialog).getByRole('button', { name: 'Create resource' }))

    expect(await screen.findByText('Resource overview')).toBeInTheDocument()
    expect(mockedCreateResource).toHaveBeenCalledOnce()
    expect(mockedCreateResource.mock.calls[0]?.[0]).toBe(resource.name)
  })

  it('surfaces a backend validation error next to the name field', async () => {
    const user = userEvent.setup()
    mockedCreateResource.mockRejectedValue(
      new ApiError(400, 'resourceName must be unique'),
    )

    renderWithProviders(<CreateResourceAction />)

    await user.click(screen.getByRole('button', { name: 'Create resource' }))
    const dialog = screen.getByRole('dialog', { name: 'Create resource' })

    await user.type(within(dialog).getByLabelText('Resource name'), 'Duplicate name')
    await user.click(within(dialog).getByRole('button', { name: 'Create resource' }))

    expect(
      await within(dialog).findByText('This resource name already exists.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('dialog', { name: 'Create resource' })).toBeInTheDocument()
  })
})
