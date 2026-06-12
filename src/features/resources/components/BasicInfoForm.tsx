import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { ApiError } from '@/api/apiError'
import { PRIORITY_VALUES, type Resource } from '@/api/types'
import { routeTo } from '@/app/routes'
import { Button, Input, Select } from '@/design-system'
import { basicInfoSchema, type BasicInfoFormValues } from '../basicInfoSchema'
import { useUpdateBasicInfo } from '../queries'

const PRIORITY_OPTIONS = [
  { value: '', label: 'Select priority' },
  ...PRIORITY_VALUES.map((value) => ({
    value,
    label: value.charAt(0).toUpperCase() + value.slice(1),
  })),
]

function getErrorMessage(error: unknown): string | undefined {
  if (!error) {
    return undefined
  }

  if (error instanceof ApiError) {
    return error.message
  }

  return 'Unable to save Basic Info. Please try again.'
}

interface BasicInfoFormProps {
  resource: Resource
}

export function BasicInfoForm({ resource }: BasicInfoFormProps) {
  const navigate = useNavigate()
  const updateMutation = useUpdateBasicInfo(resource.resourceId)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BasicInfoFormValues>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      owner: resource.basicInfo.owner,
      email: resource.basicInfo.email,
      description: resource.basicInfo.description,
      priority: resource.basicInfo.priority || undefined,
    },
  })
  const isSubmitting = updateMutation.isPending
  const errorMessage = getErrorMessage(updateMutation.error)

  const onSubmit = handleSubmit((values) => {
    updateMutation.mutate(
      // the name is locked after creation — re-send the current value untouched
      { ...values, resourceName: resource.basicInfo.resourceName || resource.name },
      { onSuccess: () => navigate(routeTo.resource(resource.resourceId)) },
    )
  })

  return (
    <Form onSubmit={onSubmit} noValidate>
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
          {isSubmitting ? 'Saving…' : 'Save Basic Info'}
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
