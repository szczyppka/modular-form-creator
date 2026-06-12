import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getResource,
  replaceResource,
  updateBasicInfo,
  updateProjectDetails,
} from '@/api/resources'
import BasicInfoPage from '@/pages/BasicInfoPage'
import ProjectDetailsPage from '@/pages/ProjectDetailsPage'
import ResourceOverviewPage from '@/pages/ResourceOverviewPage'
import { renderWithProviders } from '@/test/renderWithProviders'
import { createResourceFixture } from './resourceTestFixture'

vi.mock('@/api/resources', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/resources')>()
  return {
    ...actual,
    getResource: vi.fn(),
    replaceResource: vi.fn(),
    updateBasicInfo: vi.fn(),
    updateProjectDetails: vi.fn(),
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
    options: ['FE devs'],
  },
})

function renderFlow(initialEntry = `/resources/${completedResource.resourceId}`) {
  return renderWithProviders(
    <Routes>
      <Route path="/resources/:resourceId" element={<ResourceOverviewPage />} />
      <Route path="/resources/:resourceId/basic-info" element={<BasicInfoPage />} />
      <Route
        path="/resources/:resourceId/project-details"
        element={<ProjectDetailsPage />}
      />
    </Routes>,
    { initialEntries: [initialEntry] },
  )
}

describe('completed resource edit flow', () => {
  beforeEach(() => {
    vi.mocked(getResource).mockReset()
    vi.mocked(replaceResource).mockReset()
    vi.mocked(updateBasicInfo).mockReset()
    vi.mocked(updateProjectDetails).mockReset()
    vi.mocked(getResource).mockResolvedValue(completedResource)
  })

  it('buffers module edits and persists the full resource only after explicit submit', async () => {
    const user = userEvent.setup()
    vi.mocked(replaceResource).mockResolvedValue({
      ...completedResource,
      basicInfo: {
        ...completedResource.basicInfo,
        owner: 'John Smith',
      },
    })
    renderFlow(`/resources/${completedResource.resourceId}/basic-info`)

    const ownerInput = await screen.findByLabelText('Owner')
    await user.clear(ownerInput)
    await user.type(ownerInput, 'John Smith')
    await user.click(screen.getByRole('button', { name: 'Save draft changes' }))

    expect(updateBasicInfo).not.toHaveBeenCalled()
    expect(replaceResource).not.toHaveBeenCalled()
    expect(await screen.findByText('Unsaved local changes')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Save pending changes' }))

    expect(vi.mocked(replaceResource)).toHaveBeenCalledWith(
      completedResource.resourceId,
      {
        name: completedResource.name,
        basicInfo: {
          ...completedResource.basicInfo,
          owner: 'John Smith',
        },
        projectDetails: completedResource.projectDetails,
      },
    )
    expect(
      await screen.findByRole('heading', { name: completedResource.name }),
    ).toBeInTheDocument()
    expect(screen.queryByText('Unsaved local changes')).not.toBeInTheDocument()
  })

  it('keeps buffered values while navigating between module pages', async () => {
    const user = userEvent.setup()
    renderFlow(`/resources/${completedResource.resourceId}/project-details`)

    const projectNameInput = await screen.findByLabelText('Project name')
    await user.clear(projectNameInput)
    await user.type(projectNameInput, 'Updated Portal')
    await user.click(screen.getByRole('button', { name: 'Save draft changes' }))

    const modules = await screen.findByRole('list', { name: 'Resource modules' })
    await user.click(within(modules).getAllByRole('link', { name: 'Edit' })[1])

    expect(await screen.findByLabelText('Project name')).toHaveValue('Updated Portal')
    expect(updateProjectDetails).not.toHaveBeenCalled()
    expect(replaceResource).not.toHaveBeenCalled()
  })

  it('loses buffered edits after the provider is remounted', async () => {
    const user = userEvent.setup()
    const firstRender = renderFlow(
      `/resources/${completedResource.resourceId}/basic-info`,
    )

    const ownerInput = await screen.findByLabelText('Owner')
    await user.clear(ownerInput)
    await user.type(ownerInput, 'Temporary Owner')
    await user.click(screen.getByRole('button', { name: 'Save draft changes' }))
    expect(await screen.findByText('Unsaved local changes')).toBeInTheDocument()

    firstRender.unmount()
    renderFlow()

    expect(
      await screen.findByRole('heading', { name: completedResource.name }),
    ).toBeInTheDocument()
    expect(screen.queryByText('Unsaved local changes')).not.toBeInTheDocument()
  })
})
