import { describe, expect, it } from 'vitest'
import {
  buildListSearchParams,
  parseListSearchParams,
  toListRequestParams,
  type ResourcesListUrlState,
} from '../listSearchParams'

describe('resource list URL state', () => {
  it('uses safe defaults for invalid query values', () => {
    expect(
      parseListSearchParams(
        new URLSearchParams({
          page: '-2',
          status: 'archived',
          sort: 'newest',
        }),
      ),
    ).toEqual({
      page: 1,
      status: undefined,
      name: '',
      sortOrder: 'desc',
    })
  })

  it('round-trips non-default list state through the URL', () => {
    const state: ResourcesListUrlState = {
      page: 5,
      status: 'draft',
      name: 'my resource',
      sortOrder: 'asc',
    }

    expect(parseListSearchParams(buildListSearchParams(state))).toEqual(state)
  })

  it('maps URL state to the backend request and removes a blank name', () => {
    expect(
      toListRequestParams({
        page: 2,
        status: 'completed',
        name: '   ',
        sortOrder: 'asc',
      }),
    ).toEqual({
      page: 2,
      pageSize: 10,
      status: 'completed',
      name: undefined,
      sortOrder: 'asc',
    })
  })
})
