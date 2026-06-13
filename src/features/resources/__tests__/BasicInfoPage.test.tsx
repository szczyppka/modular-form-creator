import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getResource, updateBasicInfo } from '@/api/resources'
import BasicInfoPage from '@/pages/BasicInfo'
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

const resource = createResourceFixture()
const mockedGetResource = vi.mocked(getResource)
const mockedUpdateBasicInfo = vi.mocked(updateBasicInfo)

function renderPage() {
  return renderWithProviders(
    <Routes>
      <Route path="/resources/:resourceId" element={<p>Resource overview</p>} />
      <Route path="/resources/:resourceId/basic-info" element={<BasicInfoPage />} />
    </Routes>,
    { initialEntries: [`/resources/${resource.resourceId}/basic-info`] },
  )
}

describe('BasicInfoPage', () => {
  beforeEach(() => {
    mockedGetResource.mockReset()
    mockedUpdateBasicInfo.mockReset()
  })

  it('submits the full payload with the locked name re-sent unchanged', async () => {
    const user = userEvent.setup()
    mockedGetResource.mockResolvedValue(resource)
    mockedUpdateBasicInfo.mockResolvedValue(resource)

    renderPage()

    expect(await screen.findByText(resource.name)).toBeInTheDocument()
    expect(screen.queryByLabelText('Resource name')).not.toBeInTheDocument()

    await user.type(screen.getByLabelText('Owner'), 'Jane Doe')
    await user.type(screen.getByLabelText('Email'), 'jane.doe@company.com')
    await user.type(screen.getByLabelText('Description'), 'Handles onboarding.')
    await user.selectOptions(screen.getByLabelText('Priority'), 'high')
    await user.click(screen.getByRole('button', { name: 'Save Basic Info' }))

    await waitFor(() => {
      expect(mockedUpdateBasicInfo).toHaveBeenCalledOnce()
    })
    expect(mockedUpdateBasicInfo.mock.calls[0]?.[1]).toEqual({
      resourceName: resource.name,
      owner: 'Jane Doe',
      email: 'jane.doe@company.com',
      description: 'Handles onboarding.',
      priority: 'high',
    })
    expect(await screen.findByText('Resource overview')).toBeInTheDocument()
  })
})
