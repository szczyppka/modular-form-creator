import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '@/api/apiError'
import { deleteResource, getResource } from '@/api/resources'
import ResourceOverviewPage from '@/pages/ResourceOverviewPage'
import { renderWithProviders } from '@/test/renderWithProviders'
import { createResourceFixture } from './resourceTestFixture'

vi.mock('@/api/resources', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/resources')>()
  return {
    ...actual,
    getResource: vi.fn(),
    deleteResource: vi.fn(),
  }
})

const resource = createResourceFixture()

function renderPage() {
  return renderWithProviders(
    <Routes>
      <Route path="/resources" element={<p>Resources list</p>} />
      <Route path="/resources/:resourceId" element={<ResourceOverviewPage />} />
    </Routes>,
    { initialEntries: [`/resources/${resource.resourceId}`] },
  )
}

describe('ResourceOverviewPage', () => {
  beforeEach(() => {
    vi.mocked(getResource).mockReset()
    vi.mocked(deleteResource).mockReset()
  })

  it('renders the loaded resource with its delete action', async () => {
    vi.mocked(getResource).mockResolvedValue(resource)

    renderPage()

    expect(
      await screen.findByRole('heading', { name: resource.name }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: `Delete ${resource.name}` }),
    ).toBeInTheDocument()
  })

  it('shows the API error with a retry action when loading fails', async () => {
    vi.mocked(getResource).mockRejectedValue(new ApiError(404, 'Resource not found'))

    renderPage()

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('Resource not found')
    expect(within(alert).getByRole('button', { name: 'Try again' })).toBeInTheDocument()
  })

  it('navigates back to the list after a confirmed delete', async () => {
    const user = userEvent.setup()
    vi.mocked(getResource).mockResolvedValue(resource)
    vi.mocked(deleteResource).mockResolvedValue(resource)

    renderPage()

    await user.click(
      await screen.findByRole('button', { name: `Delete ${resource.name}` }),
    )
    await user.click(
      within(screen.getByRole('dialog')).getByRole('button', {
        name: 'Delete resource',
      }),
    )

    expect(await screen.findByText('Resources list')).toBeInTheDocument()
    expect(vi.mocked(deleteResource)).toHaveBeenCalledOnce()
  })
})
