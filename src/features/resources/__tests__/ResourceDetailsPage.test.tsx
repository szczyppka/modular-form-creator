import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getResource, updateBasicInfo } from '@/api/resources'
import BasicInfoPage from '@/pages/BasicInfoPage'
import ResourceDetailsPage from '@/pages/ResourceDetailsPage'
import ResourcePage from '@/pages/ResourcePage'
import { renderWithProviders } from '@/test/renderWithProviders'
import { createResourceFixture } from './resourceTestFixture'

vi.mock('@/api/resources', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/resources')>()
  return {
    ...actual,
    getResource: vi.fn(),
    updateBasicInfo: vi.fn(),
  }
})

const completedResource = createResourceFixture({
  status: 'completed',
  basicInfo: {
    resourceName: 'Customer onboarding',
    owner: 'Jane Doe',
    email: 'jane@company.com',
    description: 'Handles onboarding.',
    priority: 'high',
  },
  projectDetails: {
    projectName: 'Onboarding Portal',
    budget: '25000',
    category: 'internal',
    options: ['FE devs', 'Designer'],
  },
})

function renderPage(initialEntry = `/resources/${completedResource.resourceId}/details`) {
  return renderWithProviders(
    <Routes>
      <Route path="/resources/:resourceId" element={<ResourcePage />} />
      <Route path="/resources/:resourceId/details" element={<ResourceDetailsPage />} />
      <Route path="/resources/:resourceId/basic-info" element={<BasicInfoPage />} />
    </Routes>,
    { initialEntries: [initialEntry] },
  )
}

describe('ResourceDetailsPage', () => {
  beforeEach(() => {
    vi.mocked(getResource).mockReset()
    vi.mocked(updateBasicInfo).mockReset()
  })

  it('renders both module summaries with status and completion state', async () => {
    vi.mocked(getResource).mockResolvedValue(completedResource)

    renderPage()

    expect(
      await screen.findByRole('heading', { name: 'Resource details' }),
    ).toBeInTheDocument()
    expect(screen.getAllByText(completedResource.name)).toHaveLength(2)
    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    expect(screen.getByText('Onboarding Portal')).toBeInTheDocument()
    expect(screen.getByText('FE devs, Designer')).toBeInTheDocument()
    expect(screen.getAllByText('Complete')).toHaveLength(2)
  })

  it('redirects an unfinished draft back to the overview', async () => {
    vi.mocked(getResource).mockResolvedValue(createResourceFixture())

    renderPage('/resources/7/details')

    // the summary route is guarded — direct URL entry lands on the overview
    expect(
      await screen.findByRole('link', { name: 'Back to resources' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: 'Resource details' }),
    ).not.toBeInTheDocument()
  })

  it('reflects buffered completed-resource edits in the summary', async () => {
    const user = userEvent.setup()
    vi.mocked(getResource).mockResolvedValue(completedResource)

    renderPage(`/resources/${completedResource.resourceId}/basic-info`)

    const ownerInput = await screen.findByLabelText('Owner')
    await user.clear(ownerInput)
    await user.type(ownerInput, 'John Smith')
    await user.click(screen.getByRole('button', { name: 'Save draft changes' }))
    expect(await screen.findByText('Unsaved local changes')).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'View summary' }))

    expect(await screen.findByText('Unsaved local changes')).toBeInTheDocument()
    expect(screen.getByText('John Smith')).toBeInTheDocument()
    expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument()
    expect(updateBasicInfo).not.toHaveBeenCalled()
  })
})
