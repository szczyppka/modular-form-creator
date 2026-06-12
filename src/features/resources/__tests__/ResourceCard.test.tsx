import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/test/renderWithProviders'
import { ResourceCard } from '../components/ResourceCard'
import { createResourceFixture } from './resourceTestFixture'

const resource = createResourceFixture()

describe('ResourceCard', () => {
  it('shows draft status and an edit action for a draft resource', () => {
    renderWithProviders(<ResourceCard resource={resource} onDeleteRequest={vi.fn()} />)

    expect(screen.getByRole('link', { name: /Customer onboarding/ })).toHaveAttribute(
      'href',
      '/resources/7',
    )
    expect(screen.getByText('Draft')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Edit' })).toHaveAttribute(
      'href',
      '/resources/7',
    )
    expect(
      screen.getByRole('button', { name: 'Delete Customer onboarding' }),
    ).toBeInTheDocument()
  })

  it('shows completed status and links directly to the summary', () => {
    renderWithProviders(
      <ResourceCard
        resource={{ ...resource, status: 'completed' }}
        onDeleteRequest={vi.fn()}
      />,
    )

    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'View summary' })).toHaveAttribute(
      'href',
      '/resources/7/details',
    )
    expect(screen.queryByRole('link', { name: 'Edit' })).not.toBeInTheDocument()
  })
})
