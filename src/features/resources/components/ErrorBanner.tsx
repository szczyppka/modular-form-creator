import { ErrorMessage } from '@/app/styles'

interface ErrorBannerProps {
  message: string | undefined
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  if (!message) {
    return null
  }

  return <ErrorMessage role="alert">{message}</ErrorMessage>
}
