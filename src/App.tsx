import styled from 'styled-components'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/router'

function App() {
  return (
    <AppShell>
      <RouterProvider router={router} />
    </AppShell>
  )
}

const AppShell = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
`

export default App
