import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getResource, updateBasicInfo } from '@/api/resources'
import BasicInfoPage from '@/pages/BasicInfo'
import ResourcePage from '@/pages/Resource'
import { renderWithProviders } from '@/test-utils/renderWithProviders'
import { createResourceFixture } from './resourceTestFixture'

vi.mock('@/api/resources', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/resources')>()
  return {
    ...actual,
    getResource: vi.fn(),
    updateBasicInfo: vi.fn(),
  }
})

const draftResource = createResourceFixture()

const completeDraft = createResourceFixture({
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

function renderFlow(initialEntry = `/resources/${draftResource.resourceId}`) {
  return renderWithProviders(
    <Routes>
      <Route path="/resources/:resourceId" element={<ResourcePage />} />
      <Route path="/resources/:resourceId/basic-info" element={<BasicInfoPage />} />
    </Routes>,
    { initialEntries: [initialEntry] },
  )
}

describe('draft module edit flow', () => {
  beforeEach(() => {
    vi.mocked(getResource).mockReset()
    vi.mocked(updateBasicInfo).mockReset()
    vi.mocked(getResource).mockResolvedValue(draftResource)
  })

  it('buffers unsubmitted draft edits and reflects them in module progress', async () => {
    const user = userEvent.setup()
    renderFlow(`/resources/${draftResource.resourceId}/basic-info`)

    await user.type(await screen.findByLabelText('Owner'), 'Jane Doe')
    await user.type(screen.getByLabelText('Email'), 'jane@company.com')
    await user.click(screen.getByRole('button', { name: 'Back to overview' }))

    const modules = await screen.findByRole('list', { name: 'Resource modules' })
    const basicInfoModule = within(modules)
      .getByRole('heading', { name: 'Basic Info' })
      .closest('li')

    expect(basicInfoModule).not.toBeNull()
    // Two of the four editable fields are filled — progress tracks the buffer.
    expect(
      within(basicInfoModule!).getByRole('progressbar', { name: 'Basic Info progress' }),
    ).toHaveAttribute('aria-valuenow', '50')

    // Re-entering the module restores the buffered values, nothing was sent.
    await user.click(within(basicInfoModule!).getByRole('link', { name: 'Edit' }))
    expect(await screen.findByLabelText('Owner')).toHaveValue('Jane Doe')
    expect(updateBasicInfo).not.toHaveBeenCalled()
  })

  it('keeps Project Details locked until Basic Info is actually submitted', async () => {
    const user = userEvent.setup()
    renderFlow(`/resources/${draftResource.resourceId}/basic-info`)

    await user.type(await screen.findByLabelText('Owner'), 'Jane Doe')
    await user.type(screen.getByLabelText('Email'), 'jane@company.com')
    await user.type(screen.getByLabelText('Description'), 'Handles onboarding.')
    await user.selectOptions(screen.getByLabelText('Priority'), 'high')
    await user.click(screen.getByRole('button', { name: 'Back to overview' }))

    const modules = await screen.findByRole('list', { name: 'Resource modules' })
    const projectDetailsModule = within(modules)
      .getByRole('heading', { name: 'Project Details' })
      .closest('li')

    expect(projectDetailsModule).not.toBeNull()
    // Completed locally, but not persisted — the next module stays gated.
    expect(
      within(projectDetailsModule!).getByText('Submit Basic Info to unlock'),
    ).toBeInTheDocument()
    expect(
      within(projectDetailsModule!).queryByRole('link', { name: 'Edit' }),
    ).not.toBeInTheDocument()
    expect(updateBasicInfo).not.toHaveBeenCalled()
  })

  it('blocks completion while a persisted module has unsaved breaking edits', async () => {
    const user = userEvent.setup()
    vi.mocked(getResource).mockResolvedValue(completeDraft)
    renderFlow(`/resources/${completeDraft.resourceId}`)

    // Both modules are persisted-complete, so completion is available.
    expect(await screen.findByRole('button', { name: 'Complete resource' })).toBeEnabled()

    // Locally remove a required Basic Info field and leave without saving.
    const modules = screen.getByRole('list', { name: 'Resource modules' })
    const basicInfoModule = within(modules)
      .getByRole('heading', { name: 'Basic Info' })
      .closest('li')
    await user.click(within(basicInfoModule!).getByRole('link', { name: 'Edit' }))
    await user.clear(await screen.findByLabelText('Owner'))
    await user.click(screen.getByRole('button', { name: 'Back to overview' }))

    // Provisioning would otherwise complete the stale persisted data.
    expect(
      await screen.findByRole('button', { name: 'Complete resource' }),
    ).toBeDisabled()
    expect(screen.getByText(/Save your pending module changes/)).toBeInTheDocument()
  })
})
