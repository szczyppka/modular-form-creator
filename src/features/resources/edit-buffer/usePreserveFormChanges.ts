import { useEffect, useRef } from 'react'

interface PreserveFormChangesOptions<TValues> {
  enabled: boolean
  isDirty: boolean
  getValues: () => TValues
  saveToBuffer: (values: TValues) => void
}

export function usePreserveFormChanges<TValues>({
  enabled,
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

      if (!enabled || changesWereSaved.current || !currentFormState.isDirty) {
        return
      }

      currentFormState.saveToBuffer(currentFormState.getValues())
    }
  }, [enabled])

  return () => {
    changesWereSaved.current = true
  }
}
