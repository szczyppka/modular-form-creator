import { QueryClientProvider, type QueryClient } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { theme } from '@/design-system'
import { ResourceEditBufferProvider } from '@/features/resources/edit-buffer/ResourceEditBufferProvider'
import { createTestQueryClient } from './createTestQueryClient'

interface TestProvidersProps {
  children: ReactNode
  initialEntries?: string[]
  queryClient?: QueryClient
}

export function TestProviders({
  children,
  initialEntries = ['/'],
  queryClient,
}: TestProvidersProps) {
  const [defaultQueryClient] = useState(createTestQueryClient)
  const resolvedQueryClient = queryClient ?? defaultQueryClient

  return (
    <MemoryRouter initialEntries={initialEntries}>
      <QueryClientProvider client={resolvedQueryClient}>
        <ThemeProvider theme={theme}>
          <ResourceEditBufferProvider>{children}</ResourceEditBufferProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </MemoryRouter>
  )
}
