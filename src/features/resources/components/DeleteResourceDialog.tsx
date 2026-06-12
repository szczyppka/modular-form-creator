import styled from 'styled-components'
import { getApiErrorMessage } from '@/api/apiError'
import type { ResourceId } from '@/api/types'
import { ErrorMessage, FormActions } from '@/app/styles'
import { Button, Drawer } from '@/design-system'
import { useResourceEditBuffer } from '../edit-buffer/useResourceEditBuffer'
import { useDeleteResource } from '../queries'

/** Minimal data the confirmation needs — callers don't pass whole resources around. */
export interface DeleteTarget {
  resourceId: ResourceId
  name: string
}

interface DeleteResourceDialogProps {
  /** `null` keeps the dialog closed; one shared instance serves any number of triggers. */
  target: DeleteTarget | null
  onClose: () => void
  onDeleted?: () => void
}

/**
 * Single shared confirmation dialog. List views render one instance for all
 * rows instead of mounting a drawer per card.
 */
export function DeleteResourceDialog({
  target,
  onClose,
  onDeleted,
}: DeleteResourceDialogProps) {
  const { clear } = useResourceEditBuffer(target?.resourceId ?? '')
  const {
    mutate: deleteResource,
    reset: resetMutation,
    error,
    isPending: isDeleting,
  } = useDeleteResource()
  const errorMessage = getApiErrorMessage(
    error,
    'Unable to delete the resource. Please try again.',
  )

  const close = () => {
    if (isDeleting) return
    resetMutation()
    onClose()
  }

  const confirmDelete = () => {
    if (!target) return
    deleteResource(target.resourceId, {
      onSuccess: () => {
        clear(target.resourceId)
        resetMutation()
        onClose()
        onDeleted?.()
      },
    })
  }

  return (
    <Drawer title="Delete resource" isOpen={target !== null} onClose={close}>
      {target ? (
        <>
          <ConfirmationCopy>
            Permanently delete <strong>{target.name}</strong>? This action cannot be
            undone.
          </ConfirmationCopy>
          {errorMessage ? <ErrorMessage role="alert">{errorMessage}</ErrorMessage> : null}
          <FormActions>
            <Button
              type="button"
              variant="secondary"
              onClick={close}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button type="button" onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting…' : 'Delete resource'}
            </Button>
          </FormActions>
        </>
      ) : null}
    </Drawer>
  )
}

const ConfirmationCopy = styled.p`
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.ink};
`
