import { useEffect, useRef } from 'react'

interface PreserveFormChangesOptions<TValues> {
  isDirty: boolean
  getValues: () => TValues
  saveToBuffer: (values: TValues) => void
}

/**
 * On unmount, buffers the form's current values if they are dirty and weren't
 * already saved — so leaving a module mid-edit (draft or completed) keeps the
 * in-progress values locally. Call the returned function right before an
 * explicit submit to opt that unmount out of buffering.
 */
export function usePreserveFormChanges<TValues>({
  isDirty,
  getValues,
  saveToBuffer,
}: PreserveFormChangesOptions<TValues>) {
  const formState = useRef({ isDirty, getValues, saveToBuffer })
  const changesWereSaved = useRef(false)

  useEffect(() => {
    formState.current = { isDirty, getValues, saveToBuffer }
  }, [getValues, isDirty, saveToBuffer])

  useEffect(() => {
    return () => {
      const currentFormState = formState.current

      if (changesWereSaved.current || !currentFormState.isDirty) {
        return
      }

      currentFormState.saveToBuffer(currentFormState.getValues())
    }
  }, [])

  return () => {
    changesWereSaved.current = true
  }
}
