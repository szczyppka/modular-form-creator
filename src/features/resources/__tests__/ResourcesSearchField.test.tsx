import { act, fireEvent, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SearchField } from '../components/SearchField'
import { renderWithProviders } from '@/test-utils/renderWithProviders'

describe('SearchField', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('debounces searches and resets when the URL value changes', () => {
    vi.useFakeTimers()
    const onSearch = vi.fn()
    const view = renderWithProviders(
      <SearchField key="customer" initialValue="customer" onSearch={onSearch} />,
    )

    fireEvent.change(screen.getByLabelText('Search'), {
      target: { value: 'customer portal' },
    })

    act(() => vi.advanceTimersByTime(299))
    expect(onSearch).not.toHaveBeenCalled()

    act(() => vi.advanceTimersByTime(1))
    expect(onSearch).toHaveBeenCalledWith('customer portal')

    view.rerender(
      <SearchField
        key="previous search"
        initialValue="previous search"
        onSearch={onSearch}
      />,
    )

    expect(screen.getByLabelText('Search')).toHaveValue('previous search')
  })
})
