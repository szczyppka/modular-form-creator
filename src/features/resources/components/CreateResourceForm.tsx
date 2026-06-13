import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { ApiError, getApiErrorMessage } from '@/api/apiError'
import { FormStack, MutedText } from '@/app/styles'
import { routeTo } from '@/app/routes'
import { Button, Input } from '@/design-system'
import {
  createResourceSchema,
  type CreateResourceFormValues,
} from '../schemas/createResource'
import { useCreateResource } from '../queries'
import { ErrorBanner } from './ErrorBanner'

export function CreateResourceForm() {
  const navigate = useNavigate()
  const createMutation = useCreateResource()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateResourceFormValues>({
    resolver: zodResolver(createResourceSchema),
    defaultValues: { resourceName: '' },
  })
  const createError = createMutation.error
  const isSubmitting = createMutation.isPending
  const isFieldError = createError instanceof ApiError && createError.isClientError
  const errorMessage = isFieldError
    ? undefined
    : getApiErrorMessage(createError, 'Unable to create the resource. Please try again.')

  const onSubmit = handleSubmit(({ resourceName }) => {
    createMutation.mutate(resourceName, {
      onSuccess: (resource) => {
        navigate(routeTo.resource(resource.resourceId))
      },
      onError: (error) => {
        if (error instanceof ApiError && error.isClientError) {
          setError('resourceName', { type: 'server', message: error.message })
        }
      },
    })
  })

  return (
    <FormStack onSubmit={onSubmit} noValidate>
      <MutedText>
        Start a draft resource. Its name cannot be changed after creation.
      </MutedText>
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
      <ErrorBanner message={errorMessage} />
    </FormStack>
  )
}
