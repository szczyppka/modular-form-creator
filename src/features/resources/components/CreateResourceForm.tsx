import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { ApiError } from '@/api/apiError'
import { routeTo } from '@/app/routes'
import { Button, Input } from '@/design-system'
import {
  createResourceSchema,
  type CreateResourceFormValues,
} from '../createResourceSchema'
import { useCreateResource } from '../queries'

function getErrorMessage(error: unknown): string | undefined {
  if (!error) {
    return undefined
  }

  if (error instanceof ApiError) {
    return error.message
  }

  return 'Unable to create the resource. Please try again.'
}

export function CreateResourceForm() {
  const navigate = useNavigate()
  const createMutation = useCreateResource()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateResourceFormValues>({
    resolver: zodResolver(createResourceSchema),
    defaultValues: { resourceName: '' },
  })
  const isSubmitting = createMutation.isPending
  const errorMessage = getErrorMessage(createMutation.error)

  const onSubmit = handleSubmit(({ resourceName }) => {
    createMutation.mutate(resourceName, {
      onSuccess: (resource) => {
        navigate(routeTo.resource(resource.resourceId))
      },
    })
  })

  return (
    <Form onSubmit={onSubmit} noValidate>
      <Description>
        Start a draft resource. Its name cannot be changed after creation.
      </Description>
      <Input
        label="Resource name"
        placeholder="e.g. Customer onboarding"
        autoComplete="off"
        error={errors.resourceName?.message}
        disabled={isSubmitting}
        {...register('resourceName')}
      />
      <Button type="submit" disabled={isSubmitting} fullWidth>
        {isSubmitting ? 'Creating…' : 'Create resource'}
      </Button>
      {errorMessage ? <ErrorMessage role="alert">{errorMessage}</ErrorMessage> : null}
    </Form>
  )
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

const Description = styled.p`
  color: ${({ theme }) => theme.colors.inkMuted};
`

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.warning};
`
