import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/test/renderWithProviders'
import { ResourceCard } from '../components/ResourceCard'
import { createResourceFixture } from './resourceTestFixture'

const resource = createResourceFixture()

describe('ResourceCard', () => {
  it('provides independent navigation and delete actions', () => {
    renderWithProviders(<ResourceCard resource={resource} onDeleteRequest={vi.fn()} />)

    expect(screen.getByRole('link', { name: /Customer onboarding/ })).toHaveAttribute(
      'href',
      '/resources/7',
    )
    expect(
      screen.getByRole('button', { name: 'Delete Customer onboarding' }),
    ).toBeInTheDocument()
  })
})
