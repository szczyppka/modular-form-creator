import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '@/api/apiError'
import { deleteResource, getResource, provisionResource } from '@/api/resources'
import ResourcePage from '@/pages/ResourcePage'
import { renderWithProviders } from '@/test/renderWithProviders'
import { createResourceFixture } from './resourceTestFixture'

vi.mock('@/api/resources', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/resources')>()
  return {
    ...actual,
    getResource: vi.fn(),
    deleteResource: vi.fn(),
    provisionResource: vi.fn(),
  }
})

const resource = createResourceFixture()

function renderPage() {
  return renderWithProviders(
    <Routes>
      <Route path="/resources" element={<p>Resources list</p>} />
      <Route path="/resources/:resourceId" element={<ResourcePage />} />
    </Routes>,
    { initialEntries: [`/resources/${resource.resourceId}`] },
  )
}

describe('ResourcePage', () => {
  beforeEach(() => {
    vi.mocked(getResource).mockReset()
    vi.mocked(deleteResource).mockReset()
    vi.mocked(provisionResource).mockReset()
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

  it('keeps completion disabled until both modules are complete', async () => {
    vi.mocked(getResource).mockResolvedValue(resource)

    renderPage()

    expect(
      await screen.findByRole('button', { name: 'Complete resource' }),
    ).toBeDisabled()
    expect(screen.getByText(/Completion unlocks/)).toBeInTheDocument()
  })

  it('keeps Project Details locked until Basic Info is complete', async () => {
    vi.mocked(getResource).mockResolvedValue(resource)

    renderPage()

    const projectDetailsHeading = await screen.findByRole('heading', {
      name: 'Project Details',
    })
    const projectDetailsModule = projectDetailsHeading.closest('li')

    expect(projectDetailsModule).not.toBeNull()
    expect(within(projectDetailsModule!).getByText('Locked')).toBeInTheDocument()
    expect(
      within(projectDetailsModule!).queryByRole('link', { name: 'Edit' }),
    ).not.toBeInTheDocument()
  })

  it('unlocks Project Details after Basic Info is complete', async () => {
    vi.mocked(getResource).mockResolvedValue(
      createResourceFixture({
        basicInfo: {
          resourceName: resource.name,
          owner: 'Jane Doe',
          email: 'jane@company.com',
          description: 'Handles onboarding.',
          priority: 'high',
        },
      }),
    )

    renderPage()

    const projectDetailsHeading = await screen.findByRole('heading', {
      name: 'Project Details',
    })
    const projectDetailsModule = projectDetailsHeading.closest('li')

    expect(projectDetailsModule).not.toBeNull()
    expect(
      within(projectDetailsModule!).getByRole('link', { name: 'Edit' }),
    ).toHaveAttribute('href', `/resources/${resource.resourceId}/project-details`)
    expect(within(projectDetailsModule!).queryByText('Locked')).not.toBeInTheDocument()
  })

  it('completes a resource and updates the cached status', async () => {
    const user = userEvent.setup()
    const completeDraft = createResourceFixture({
      basicInfo: {
        resourceName: resource.name,
        owner: 'Jane Doe',
        email: 'jane@company.com',
        description: 'Handles onboarding.',
        priority: 'high',
      },
      projectDetails: {
        projectName: 'Onboarding Portal',
        budget: '25000',
        category: 'internal',
        options: ['FE devs'],
      },
    })
    const completed = { ...completeDraft, status: 'completed' as const }
    vi.mocked(getResource).mockResolvedValue(completeDraft)
    vi.mocked(provisionResource).mockResolvedValue({
      alreadyCompleted: false,
      resource: completed,
    })

    renderPage()

    await user.click(await screen.findByRole('button', { name: 'Complete resource' }))

    expect(vi.mocked(provisionResource)).toHaveBeenCalledWith(resource.resourceId)
    expect(await screen.findByText('Completed')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Complete resource' }),
    ).not.toBeInTheDocument()
  })

  it('shows a provisioning business error returned with status 400', async () => {
    const user = userEvent.setup()
    const completeDraft = createResourceFixture({
      basicInfo: {
        resourceName: resource.name,
        owner: 'Jane Doe',
        email: 'jane@company.com',
        description: 'Handles onboarding.',
        priority: 'high',
      },
      projectDetails: {
        projectName: 'Onboarding Portal',
        budget: '25000',
        category: 'internal',
        options: ['FE devs'],
      },
    })
    vi.mocked(getResource).mockResolvedValue(completeDraft)
    vi.mocked(provisionResource).mockRejectedValue(
      new ApiError(400, 'Completed resource cannot be reprovisioned.'),
    )

    renderPage()

    await user.click(await screen.findByRole('button', { name: 'Complete resource' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Completed resource cannot be reprovisioned.',
    )
  })
})
