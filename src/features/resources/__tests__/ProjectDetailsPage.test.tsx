import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getResource, updateProjectDetails } from '@/api/resources'
import ProjectDetailsPage from '@/pages/ProjectDetails'
import { renderWithProviders } from '@/test-utils/renderWithProviders'
import { createResourceFixture } from './resourceTestFixture'

vi.mock('@/api/resources', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/resources')>()
  return {
    ...actual,
    getResource: vi.fn(),
    updateProjectDetails: vi.fn(),
  }
})

const draftWithCompleteBasicInfo = createResourceFixture({
  basicInfo: {
    resourceName: 'Customer onboarding',
    owner: 'Jane Doe',
    email: 'jane@company.com',
    description: 'Handles onboarding.',
    priority: 'high',
  },
})

const mockedGetResource = vi.mocked(getResource)
const mockedUpdateProjectDetails = vi.mocked(updateProjectDetails)

function renderPage() {
  return renderWithProviders(
    <Routes>
      <Route path="/resources/:resourceId" element={<p>Resource overview</p>} />
      <Route
        path="/resources/:resourceId/project-details"
        element={<ProjectDetailsPage />}
      />
    </Routes>,
    { initialEntries: ['/resources/7/project-details'] },
  )
}

describe('ProjectDetailsPage', () => {
  beforeEach(() => {
    mockedGetResource.mockReset()
    mockedUpdateProjectDetails.mockReset()
  })

  it('locks the module until Basic Info is complete', async () => {
    mockedGetResource.mockResolvedValue(createResourceFixture())

    renderPage()

    expect(
      await screen.findByText(/unlocks after Basic Info is completed/),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Complete Basic Info first' }),
    ).toHaveAttribute('href', '/resources/7/basic-info')
    expect(screen.queryByLabelText('Project name')).not.toBeInTheDocument()
  })

  it('submits the payload and navigates back to the overview', async () => {
    const user = userEvent.setup()
    mockedGetResource.mockResolvedValue(draftWithCompleteBasicInfo)
    mockedUpdateProjectDetails.mockResolvedValue(draftWithCompleteBasicInfo)

    renderPage()

    await user.type(await screen.findByLabelText('Project name'), 'Onboarding Portal')
    await user.type(screen.getByLabelText('Budget'), '25000')
    await user.selectOptions(screen.getByLabelText('Category'), 'internal')
    await user.click(screen.getByRole('checkbox', { name: 'FE devs' }))
    await user.click(screen.getByRole('button', { name: 'Save Project Details' }))

    await waitFor(() => {
      expect(mockedUpdateProjectDetails).toHaveBeenCalledOnce()
    })
    expect(mockedUpdateProjectDetails.mock.calls[0]?.[1]).toEqual({
      projectName: 'Onboarding Portal',
      budget: '25000',
      category: 'internal',
      options: ['FE devs'],
    })
    expect(await screen.findByText('Resource overview')).toBeInTheDocument()
  })
})
