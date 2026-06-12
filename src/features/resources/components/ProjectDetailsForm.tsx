import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { ApiError } from '@/api/apiError'
import { PROJECT_CATEGORY_VALUES, TEAM_MEMBER_VALUES, type Resource } from '@/api/types'
import { routeTo } from '@/app/routes'
import { Button, CheckboxGroup, Input, Select } from '@/design-system'
import {
  projectDetailsSchema,
  type ProjectDetailsFormValues,
} from '../projectDetailsSchema'
import { useUpdateProjectDetails } from '../queries'
import { useCompletedResourceDraft } from '../useCompletedResourceDraft'

const CATEGORY_OPTIONS = [
  { value: '', label: 'Select category' },
  ...PROJECT_CATEGORY_VALUES.map((value) => ({
    value,
    label: value.charAt(0).toUpperCase() + value.slice(1),
  })),
]

const TEAM_MEMBER_OPTIONS = [...TEAM_MEMBER_VALUES]

function getErrorMessage(error: unknown): string | undefined {
  if (!error) {
    return undefined
  }

  if (error instanceof ApiError) {
    return error.message
  }

  return 'Unable to save Project Details. Please try again.'
}

interface ProjectDetailsFormProps {
  resource: Resource
}

export function ProjectDetailsForm({ resource }: ProjectDetailsFormProps) {
  const navigate = useNavigate()
  const updateMutation = useUpdateProjectDetails(resource.resourceId)
  const { draft, setProjectDetails } = useCompletedResourceDraft(resource.resourceId)
  const bufferedProjectDetails = draft?.projectDetails
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectDetailsFormValues>({
    resolver: zodResolver(projectDetailsSchema),
    defaultValues: {
      projectName:
        bufferedProjectDetails?.projectName ?? resource.projectDetails.projectName,
      budget: bufferedProjectDetails?.budget ?? resource.projectDetails.budget,
      category:
        bufferedProjectDetails?.category ||
        resource.projectDetails.category ||
        undefined,
      options: bufferedProjectDetails?.options ?? resource.projectDetails.options,
    },
  })
  const isCompleted = resource.status === 'completed'
  const isSubmitting = !isCompleted && updateMutation.isPending
  const errorMessage = isCompleted ? undefined : getErrorMessage(updateMutation.error)

  const onSubmit = handleSubmit((values) => {
    if (isCompleted) {
      setProjectDetails(resource.resourceId, values)
      navigate(routeTo.resource(resource.resourceId))
      return
    }

    updateMutation.mutate(values, {
      onSuccess: () => navigate(routeTo.resource(resource.resourceId)),
    })
  })

  return (
    <Form onSubmit={onSubmit} noValidate>
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
      <Actions>
        <Button
          type="button"
          variant="secondary"
          disabled={isSubmitting}
          onClick={() => navigate(routeTo.resource(resource.resourceId))}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? 'Saving…'
            : isCompleted
              ? 'Save draft changes'
              : 'Save Project Details'}
        </Button>
      </Actions>
      {errorMessage ? <ErrorMessage role="alert">{errorMessage}</ErrorMessage> : null}
    </Form>
  )
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  max-width: 560px;
`

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
`

const ErrorMessage = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.warning};
`
