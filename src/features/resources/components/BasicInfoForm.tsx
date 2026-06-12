import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { PRIORITY_VALUES, type BasicInfo, type Resource } from '@/api/types'
import { ErrorMessage, FormActions, FormStack } from '@/app/styles'
import { Button, Input, Select } from '@/design-system'
import { buildSelectOptions } from '@/shared/selectOptions'
import { basicInfoSchema, type BasicInfoFormValues } from '../basicInfoSchema'
import { applyResourceEditBuffer } from '../edit-buffer/applyResourceEditBuffer'
import { usePreserveFormChanges } from '../edit-buffer/usePreserveFormChanges'
import { useResourceEditBuffer } from '../edit-buffer/useResourceEditBuffer'
import { useUpdateBasicInfo } from '../queries'
import { useModuleFormFlow } from '../useModuleFormFlow'

const PRIORITY_OPTIONS = buildSelectOptions(PRIORITY_VALUES, 'Select priority')

interface BasicInfoFormProps {
  resource: Resource
}

export function BasicInfoForm({ resource }: BasicInfoFormProps) {
  const updateMutation = useUpdateBasicInfo(resource.resourceId)
  const { buffer, setBasicInfo } = useResourceEditBuffer(resource.resourceId)
  const resourceWithChanges = applyResourceEditBuffer(resource, buffer)
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<BasicInfoFormValues>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      owner: resourceWithChanges.basicInfo.owner,
      email: resourceWithChanges.basicInfo.email,
      description: resourceWithChanges.basicInfo.description,
      priority: resourceWithChanges.basicInfo.priority || undefined,
    },
  })
  const isCompleted = resource.status === 'completed'
  const { isSubmitting, errorMessage, goToOverview, saveModule } = useModuleFormFlow({
    resource,
    mutation: updateMutation,
    saveToBuffer: (payload) => setBasicInfo(resource.resourceId, payload),
    saveErrorMessage: 'Unable to save Basic Info. Please try again.',
  })

  const markChangesSaved = usePreserveFormChanges<BasicInfo>({
    enabled: isCompleted,
    isDirty,
    getValues: () => {
      const values = getValues()

      return {
        resourceName: resource.basicInfo.resourceName || resource.name,
        owner: values.owner ?? '',
        email: values.email ?? '',
        description: values.description ?? '',
        priority: values.priority ?? '',
      }
    },
    saveToBuffer: (values) => setBasicInfo(resource.resourceId, values),
  })

  const onSubmit = handleSubmit((values) => {
    const payload = {
      ...values,
      resourceName: resource.basicInfo.resourceName || resource.name,
    }

    markChangesSaved()
    saveModule(payload)
  })

  let submitButtonLabel = 'Save Basic Info'
  if (isCompleted) {
    submitButtonLabel = 'Save draft changes'
  }
  if (isSubmitting) {
    submitButtonLabel = 'Saving…'
  }
  const cancelButtonLabel = isCompleted ? 'Back to overview' : 'Cancel'

  return (
    <FormStack onSubmit={onSubmit} noValidate>
      <Input
        label="Owner"
        placeholder="e.g. Jane Doe"
        autoComplete="off"
        error={errors.owner?.message}
        disabled={isSubmitting}
        {...register('owner')}
      />
      <Input
        label="Email"
        type="email"
        placeholder="e.g. jane.doe@company.com"
        autoComplete="off"
        error={errors.email?.message}
        disabled={isSubmitting}
        {...register('email')}
      />
      <Input
        label="Description"
        multiline
        rows={4}
        error={errors.description?.message}
        disabled={isSubmitting}
        {...register('description')}
      />
      <Select
        label="Priority"
        options={PRIORITY_OPTIONS}
        error={errors.priority?.message}
        disabled={isSubmitting}
        {...register('priority')}
      />
      <FormActions>
        <Button
          type="button"
          variant="secondary"
          disabled={isSubmitting}
          onClick={goToOverview}
        >
          {cancelButtonLabel}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {submitButtonLabel}
        </Button>
      </FormActions>
      {errorMessage ? <ErrorMessage role="alert">{errorMessage}</ErrorMessage> : null}
    </FormStack>
  )
}
