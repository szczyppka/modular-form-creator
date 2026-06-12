import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '@/api/apiError'
import { deleteResource } from '@/api/resources'
import { renderWithProviders } from '@/test/renderWithProviders'
import {
  DeleteResourceDialog,
  type DeleteTarget,
} from '../components/DeleteResourceDialog'
import { resourceKeys } from '../queries'
import { createResourceFixture } from './resourceTestFixture'

vi.mock('@/api/resources', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/resources')>()
  return {
    ...actual,
    deleteResource: vi.fn(),
  }
})

const resource = createResourceFixture()
const mockedDeleteResource = vi.mocked(deleteResource)

/** Minimal consumer mirroring how list/overview drive the shared dialog. */
function DialogHarness({ onDeleted }: { onDeleted?: () => void }) {
  const [target, setTarget] = useState<DeleteTarget | null>(null)

  return (
    <>
      <button
        type="button"
        onClick={() =>
          setTarget({ resourceId: resource.resourceId, name: resource.name })
        }
      >
        Request delete
      </button>
      <DeleteResourceDialog
        target={target}
        onClose={() => setTarget(null)}
        onDeleted={onDeleted}
      />
    </>
  )
}

describe('DeleteResourceDialog', () => {
  beforeEach(() => {
    mockedDeleteResource.mockReset()
  })

  it('stays closed until requested and cancels without deleting', async () => {
    const user = userEvent.setup()
    renderWithProviders(<DialogHarness />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Request delete' }))

    const dialog = screen.getByRole('dialog', { name: 'Delete resource' })
    expect(dialog).toHaveTextContent(resource.name)

    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(mockedDeleteResource).not.toHaveBeenCalled()
  })

  it('deletes the resource, cleans the cache and notifies the consumer', async () => {
    const user = userEvent.setup()
    const onDeleted = vi.fn()
    mockedDeleteResource.mockResolvedValue(resource)

    const { queryClient } = renderWithProviders(<DialogHarness onDeleted={onDeleted} />)
    const detailKey = resourceKeys.detail(resource.resourceId)
    const listKey = resourceKeys.list({ page: 1, pageSize: 10 })
    queryClient.setQueryData(detailKey, resource)
    queryClient.setQueryData(listKey, {
      items: [resource],
      pagination: { page: 1, pageSize: 10, totalItems: 1, totalPages: 1 },
    })

    await user.click(screen.getByRole('button', { name: 'Request delete' }))
    await user.click(
      within(screen.getByRole('dialog')).getByRole('button', {
        name: 'Delete resource',
      }),
    )

    await waitFor(() => {
      expect(mockedDeleteResource).toHaveBeenCalledOnce()
      expect(mockedDeleteResource.mock.calls[0]?.[0]).toBe(resource.resourceId)
      expect(onDeleted).toHaveBeenCalledOnce()
      expect(queryClient.getQueryData(detailKey)).toBeUndefined()
      expect(queryClient.getQueryState(listKey)?.isInvalidated).toBe(true)
    })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('keeps the dialog open and shows the API error after failure', async () => {
    const user = userEvent.setup()
    mockedDeleteResource.mockRejectedValue(new ApiError(404, 'Resource not found'))

    renderWithProviders(<DialogHarness />)

    await user.click(screen.getByRole('button', { name: 'Request delete' }))
    await user.click(
      within(screen.getByRole('dialog')).getByRole('button', {
        name: 'Delete resource',
      }),
    )

    expect(await screen.findByRole('alert')).toHaveTextContent('Resource not found')
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
