import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import {
  PROJECT_CATEGORY_VALUES,
  TEAM_MEMBER_VALUES,
  type ProjectDetails,
  type Resource,
} from '@/api/types'
import { ErrorMessage, FormActions, FormStack } from '@/app/styles'
import { Button, CheckboxGroup, Input, Select } from '@/design-system'
import { buildSelectOptions } from '@/shared/selectOptions'
import {
  projectDetailsSchema,
  type ProjectDetailsFormValues,
} from '../projectDetailsSchema'
import { applyResourceEditBuffer } from '../edit-buffer/applyResourceEditBuffer'
import { usePreserveFormChanges } from '../edit-buffer/usePreserveFormChanges'
import { useResourceEditBuffer } from '../edit-buffer/useResourceEditBuffer'
import { useUpdateProjectDetails } from '../queries'
import { useModuleFormFlow } from '../useModuleFormFlow'

const CATEGORY_OPTIONS = buildSelectOptions(PROJECT_CATEGORY_VALUES, 'Select category')
const TEAM_MEMBER_OPTIONS = Array.from(TEAM_MEMBER_VALUES)

interface ProjectDetailsFormProps {
  resource: Resource
}

export function ProjectDetailsForm({ resource }: ProjectDetailsFormProps) {
  const updateMutation = useUpdateProjectDetails(resource.resourceId)
  const { buffer, setProjectDetails } = useResourceEditBuffer(resource.resourceId)
  const resourceWithChanges = applyResourceEditBuffer(resource, buffer)
  const {
    register,
    control,
    getValues,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProjectDetailsFormValues>({
    resolver: zodResolver(projectDetailsSchema),
    defaultValues: {
      projectName: resourceWithChanges.projectDetails.projectName,
      budget: resourceWithChanges.projectDetails.budget,
      category: resourceWithChanges.projectDetails.category || undefined,
      options: resourceWithChanges.projectDetails.options,
    },
  })
  const isCompleted = resource.status === 'completed'
  const { isSubmitting, errorMessage, goToOverview, saveModule } = useModuleFormFlow({
    resource,
    mutation: updateMutation,
    saveToBuffer: (payload) => setProjectDetails(resource.resourceId, payload),
    saveErrorMessage: 'Unable to save Project Details. Please try again.',
  })

  const markChangesSaved = usePreserveFormChanges<ProjectDetails>({
    enabled: isCompleted,
    isDirty,
    getValues: () => {
      const values = getValues()

      return {
        projectName: values.projectName ?? '',
        budget: values.budget ?? '',
        category: values.category ?? '',
        options: values.options ?? [],
      }
    },
    saveToBuffer: (values) => setProjectDetails(resource.resourceId, values),
  })

  const onSubmit = handleSubmit((values) => {
    markChangesSaved()
    saveModule(values)
  })

  let submitButtonLabel = 'Save Project Details'
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
        label="Project name"
        placeholder="e.g. Onboarding Portal"
        autoComplete="off"
        error={errors.projectName?.message}
        disabled={isSubmitting}
        {...register('projectName')}
      />
      <Input
        label="Budget"
        inputMode="numeric"
        placeholder="e.g. 25000"
        autoComplete="off"
        error={errors.budget?.message}
        disabled={isSubmitting}
        {...register('budget')}
      />
      <Select
        label="Category"
        options={CATEGORY_OPTIONS}
        error={errors.category?.message}
        disabled={isSubmitting}
        {...register('category')}
      />
      <Controller
        control={control}
        name="options"
        render={({ field, fieldState }) => (
          <CheckboxGroup
            label="Team members"
            options={TEAM_MEMBER_OPTIONS}
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
            disabled={isSubmitting}
          />
        )}
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
