import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '@/api/apiError'
import { getResource, provisionResource } from '@/api/resources'
import ResourcePage from '@/pages/Resource'
import { renderWithProviders } from '@/test-utils/renderWithProviders'
import { createResourceFixture } from './resourceTestFixture'

vi.mock('@/api/resources', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/resources')>()
  return {
    ...actual,
    getResource: vi.fn(),
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
    vi.mocked(provisionResource).mockReset()
  })

  it('keeps completion disabled until both modules are complete', async () => {
    vi.mocked(getResource).mockResolvedValue(resource)

    renderPage()

    expect(
      await screen.findByRole('button', { name: 'Complete resource' }),
    ).toBeDisabled()
    expect(screen.getByText(/Completion unlocks/)).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'View summary' })).not.toBeInTheDocument()
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
    vi.mocked(provisionResource).mockResolvedValue(completed)

    renderPage()

    expect(await screen.findByRole('link', { name: 'View summary' })).toHaveAttribute(
      'href',
      `/resources/${resource.resourceId}/details`,
    )
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
