import { describe, expect, it } from 'vitest'
import { basicInfoSchema } from '../basicInfoSchema'

const validValues = {
  owner: 'Jane Doe',
  email: 'jane.doe@company.com',
  description: 'Handles customer onboarding.',
  priority: 'high',
}

describe('basicInfoSchema', () => {
  it('accepts valid values and trims whitespace', () => {
    expect(basicInfoSchema.parse({ ...validValues, owner: '  Jane Doe  ' })).toEqual(
      validValues,
    )
  })

  it.each(['Jane123', 'Jane_Doe', 'Jane!'])(
    'rejects owner with characters outside letters and spaces: %j',
    (owner) => {
      expect(basicInfoSchema.safeParse({ ...validValues, owner }).success).toBe(false)
    },
  )

  it.each(['not-an-email', 'jane@doe', 'jane doe@x.com', ''])(
    'rejects invalid email %j',
    (email) => {
      expect(basicInfoSchema.safeParse({ ...validValues, email }).success).toBe(false)
    },
  )

  it('accepts a description at the 1000-character boundary and rejects 1001', () => {
    expect(
      basicInfoSchema.safeParse({ ...validValues, description: 'a'.repeat(1000) })
        .success,
    ).toBe(true)
    expect(
      basicInfoSchema.safeParse({ ...validValues, description: 'a'.repeat(1001) })
        .success,
    ).toBe(false)
  })

  it.each(['', 'urgent'])('rejects priority outside the allowed set: %j', (priority) => {
    expect(basicInfoSchema.safeParse({ ...validValues, priority }).success).toBe(false)
  })
})
