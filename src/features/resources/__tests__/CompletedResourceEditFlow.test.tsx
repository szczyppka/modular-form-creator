import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getResource,
  replaceResource,
  updateBasicInfo,
  updateProjectDetails,
} from '@/api/resources'
import BasicInfoPage from '@/pages/BasicInfo'
import ProjectDetailsPage from '@/pages/ProjectDetails'
import ResourcePage from '@/pages/Resource'
import { renderWithProviders } from '@/test-utils/renderWithProviders'
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
      <Route path="/resources/:resourceId" element={<ResourcePage />} />
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

  it('preserves dirty values when leaving a module without submitting it', async () => {
    const user = userEvent.setup()
    renderFlow(`/resources/${completedResource.resourceId}/project-details`)

    const projectNameInput = await screen.findByLabelText('Project name')
    await user.clear(projectNameInput)
    await user.type(projectNameInput, 'Updated Portal')
    await user.click(screen.getByRole('button', { name: 'Back to overview' }))

    const modules = await screen.findByRole('list', { name: 'Resource modules' })
    const projectDetailsModule = within(modules)
      .getByRole('heading', { name: 'Project Details' })
      .closest('li')

    expect(projectDetailsModule).not.toBeNull()
    await user.click(within(projectDetailsModule!).getByRole('link', { name: 'Edit' }))

    expect(await screen.findByLabelText('Project name')).toHaveValue('Updated Portal')
    expect(updateProjectDetails).not.toHaveBeenCalled()
    expect(replaceResource).not.toHaveBeenCalled()
  })

  it('keeps invalid changes in memory but blocks the full update', async () => {
    const user = userEvent.setup()
    renderFlow(`/resources/${completedResource.resourceId}/basic-info`)

    const ownerInput = await screen.findByLabelText('Owner')
    await user.clear(ownerInput)
    await user.type(ownerInput, 'Jane 123')
    await user.click(screen.getByRole('button', { name: 'Back to overview' }))

    expect(
      await screen.findByText(
        'Review invalid or incomplete module values before saving.',
      ),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Save pending changes' }),
    ).not.toBeInTheDocument()
    expect(replaceResource).not.toHaveBeenCalled()

    const modules = screen.getByRole('list', { name: 'Resource modules' })
    const basicInfoModule = within(modules)
      .getByRole('heading', { name: 'Basic Info' })
      .closest('li')

    expect(basicInfoModule).not.toBeNull()
    await user.click(within(basicInfoModule!).getByRole('link', { name: 'Edit' }))
    expect(await screen.findByLabelText('Owner')).toHaveValue('Jane 123')
  })

  it('clears the buffer when the full update succeeds after leaving the overview', async () => {
    const user = userEvent.setup()
    let resolveReplace: (resource: typeof completedResource) => void = () => undefined

    vi.mocked(replaceResource).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveReplace = resolve
        }),
    )
    renderFlow(`/resources/${completedResource.resourceId}/basic-info`)

    const ownerInput = await screen.findByLabelText('Owner')
    await user.clear(ownerInput)
    await user.type(ownerInput, 'John Smith')
    await user.click(screen.getByRole('button', { name: 'Save draft changes' }))
    await user.click(await screen.findByRole('button', { name: 'Save pending changes' }))

    const modules = screen.getByRole('list', { name: 'Resource modules' })
    const basicInfoModule = within(modules)
      .getByRole('heading', { name: 'Basic Info' })
      .closest('li')

    expect(basicInfoModule).not.toBeNull()
    await user.click(within(basicInfoModule!).getByRole('link', { name: 'Edit' }))

    await act(async () => {
      resolveReplace({
        ...completedResource,
        basicInfo: {
          ...completedResource.basicInfo,
          owner: 'John Smith',
        },
      })
    })

    await waitFor(() => {
      expect(screen.getByLabelText('Owner')).toHaveValue('John Smith')
    })
    await user.click(screen.getByRole('button', { name: 'Back to overview' }))

    expect(
      await screen.findByRole('heading', { name: completedResource.name }),
    ).toBeInTheDocument()
    expect(screen.queryByText('Unsaved local changes')).not.toBeInTheDocument()
  })

  it('loses automatically preserved edits after the provider is remounted', async () => {
    const user = userEvent.setup()
    const firstRender = renderFlow(
      `/resources/${completedResource.resourceId}/basic-info`,
    )

    const ownerInput = await screen.findByLabelText('Owner')
    await user.clear(ownerInput)
    await user.type(ownerInput, 'Temporary Owner')
    await user.click(screen.getByRole('button', { name: 'Back to overview' }))
    expect(await screen.findByText('Unsaved local changes')).toBeInTheDocument()

    firstRender.unmount()
    renderFlow()

    expect(
      await screen.findByRole('heading', { name: completedResource.name }),
    ).toBeInTheDocument()
    expect(screen.queryByText('Unsaved local changes')).not.toBeInTheDocument()
  })
})
