import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const PageLayout = styled.section`
  width: 100%;
  min-width: 300px;
  max-width: 900px;
  margin-inline: auto;
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 640px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`

export const NavigationLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primaryStrong};
  width: fit-content;
`

export const MutedText = styled.p`
  color: ${({ theme }) => theme.colors.inkMuted};
`

export const FormStack = styled.form`
  width: 100%;
  display: flex;
  margin: auto;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const InlineAction = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`

export const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.warning};
`
export const Breadcrumbs = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`

export const Separator = styled.span`
  color: ${({ theme }) => theme.colors.inkMuted};
`

export const CurrentCrumb = styled.span`
  color: ${({ theme }) => theme.colors.inkMuted};
`