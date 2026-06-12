import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'styled-components'
import App from './App'
import { queryClient } from './app/queryClient'
import { GlobalStyles } from './design-system/theme/GlobalStyles'
import { theme } from './design-system/theme/theme'
import { CompletedResourceDraftProvider } from './features/resources/components/CompletedResourceDraftProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <CompletedResourceDraftProvider>
          <App />
        </CompletedResourceDraftProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
