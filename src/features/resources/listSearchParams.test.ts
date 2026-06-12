import { describe, expect, it } from 'vitest'
import {
  buildListSearchParams,
  parseListSearchParams,
  toListRequestParams,
  type ResourcesListUrlState,
} from './listSearchParams'

const params = (init: Record<string, string> = {}) => new URLSearchParams(init)

describe('parseListSearchParams', () => {
  it('returns safe defaults for empty params', () => {
    expect(parseListSearchParams(params())).toEqual({
      page: 1,
      status: undefined,
      name: '',
      sortOrder: 'desc',
    })
  })

  it('parses valid values', () => {
    const result = parseListSearchParams(
      params({ page: '3', status: 'draft', name: 'api', sort: 'asc' }),
    )

    expect(result).toEqual({
      page: 3,
      status: 'draft',
      name: 'api',
      sortOrder: 'asc',
    })
  })

  it.each(['0', '-2', '1.5', 'abc', ''])(
    'falls back to page 1 for invalid page %j',
    (page) => {
      expect(parseListSearchParams(params({ page })).page).toBe(1)
    },
  )

  it('ignores an unknown status value', () => {
    expect(parseListSearchParams(params({ status: 'archived' })).status).toBeUndefined()
  })

  it('falls back to desc for an unknown sort value', () => {
    expect(parseListSearchParams(params({ sort: 'newest' })).sortOrder).toBe('desc')
  })
})

describe('buildListSearchParams', () => {
  it('omits default values entirely', () => {
    const state: ResourcesListUrlState = {
      page: 1,
      status: undefined,
      name: '',
      sortOrder: 'desc',
    }

    expect(buildListSearchParams(state).toString()).toBe('')
  })

  it('serializes non-default values', () => {
    const state: ResourcesListUrlState = {
      page: 2,
      status: 'completed',
      name: 'api',
      sortOrder: 'asc',
    }

    expect(buildListSearchParams(state).toString()).toBe(
      'page=2&status=completed&name=api&sort=asc',
    )
  })

  it('round-trips through parse without losing state', () => {
    const state: ResourcesListUrlState = {
      page: 5,
      status: 'draft',
      name: 'my resource',
      sortOrder: 'asc',
    }

    expect(parseListSearchParams(buildListSearchParams(state))).toEqual(state)
  })
})

describe('toListRequestParams', () => {
  it('maps state to request params with a fixed page size', () => {
    const state: ResourcesListUrlState = {
      page: 2,
      status: 'draft',
      name: 'api',
      sortOrder: 'asc',
    }

    expect(toListRequestParams(state)).toEqual({
      page: 2,
      pageSize: 10,
      status: 'draft',
      name: 'api',
      sortOrder: 'asc',
    })
  })

  it('omits a blank name so the API receives no empty filter', () => {
    const state: ResourcesListUrlState = {
      page: 1,
      status: undefined,
      name: '   ',
      sortOrder: 'desc',
    }

    expect(toListRequestParams(state).name).toBeUndefined()
  })
})
