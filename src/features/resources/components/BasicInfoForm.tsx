import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { PRIORITY_VALUES, type BasicInfo, type Resource } from '@/api/types'
import { FormActions, FormStack } from '@/app/styles'
import { Button, Input, Select } from '@/design-system'
import { buildSelectOptions } from '@/shared/selectOptions'
import { basicInfoSchema, type BasicInfoFormValues } from '../schemas/basicInfo'
import { useBufferedResource } from '../edit-buffer/useBufferedResource'
import { usePreserveFormChanges } from '../edit-buffer/usePreserveFormChanges'
import { useUpdateBasicInfo } from '../queries'
import { useModuleFormFlow } from '../hooks/useModuleFormFlow'
import { ErrorBanner } from './ErrorBanner'

const PRIORITY_OPTIONS = buildSelectOptions(PRIORITY_VALUES, {
  placeholder: 'Select priority',
})

interface BasicInfoFormProps {
  resource: Resource
}

export function BasicInfoForm({ resource }: BasicInfoFormProps) {
  const updateMutation = useUpdateBasicInfo(resource.resourceId)
  const {
    resource: resourceWithChanges,
    setBasicInfo,
    clearModule,
  } = useBufferedResource(resource)
  const resourceName = resource.basicInfo.resourceName || resource.name
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
  const {
    isSubmitting,
    errorMessage,
    goToOverview,
    saveModule,
    submitLabel,
    cancelLabel,
  } = useModuleFormFlow({
    resource,
    mutation: updateMutation,
    saveToBuffer: (payload) => setBasicInfo(resource.resourceId, payload),
    clearBuffer: () => clearModule(resource.resourceId, 'basicInfo'),
    saveLabel: 'Save Basic Info',
    saveErrorMessage: 'Unable to save Basic Info. Please try again.',
  })

  const markChangesSaved = usePreserveFormChanges<BasicInfo>({
    isDirty,
    getValues: () => {
      const values = getValues()

      return {
        resourceName,
        owner: values.owner ?? '',
        email: values.email ?? '',
        description: values.description ?? '',
        priority: values.priority ?? '',
      }
    },
    saveToBuffer: (values) => setBasicInfo(resource.resourceId, values),
  })

  const onSubmit = handleSubmit((values) => {
    markChangesSaved()
    saveModule({ ...values, resourceName })
  })

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
          {cancelLabel}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </FormActions>
      <ErrorBanner message={errorMessage} />
    </FormStack>
  )
}
