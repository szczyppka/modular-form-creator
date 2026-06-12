import { describe, expect, it } from 'vitest'
import { createResourceSchema } from '../createResourceSchema'

describe('createResourceSchema', () => {
  it('trims and accepts a valid resource name', () => {
    expect(
      createResourceSchema.parse({ resourceName: '  Customer onboarding  ' }),
    ).toEqual({ resourceName: 'Customer onboarding' })
  })

  it.each(['', '   ', 'Customer_onboarding', 'Customer!'])(
    'rejects invalid resource name %j',
    (resourceName) => {
      expect(createResourceSchema.safeParse({ resourceName }).success).toBe(false)
    },
  )

  it('rejects names longer than 255 characters', () => {
    expect(
      createResourceSchema.safeParse({ resourceName: 'a'.repeat(256) }).success,
    ).toBe(false)
  })
})
