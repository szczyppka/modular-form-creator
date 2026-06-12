import { z } from 'zod'
import { PRIORITY_VALUES } from '@/api/types'

/** Mirrors backend validation (resource.service.ts) so errors surface before the request. */
const OWNER_PATTERN = /^[A-Za-z ]+$/
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const basicInfoSchema = z.object({
  owner: z
    .string()
    .trim()
    .min(1, 'Owner is required.')
    .max(255, 'Owner must be at most 255 characters.')
    .regex(OWNER_PATTERN, 'Use only letters and spaces.'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required.')
    .regex(EMAIL_PATTERN, 'Enter a valid email address.'),
  description: z
    .string()
    .trim()
    .min(1, 'Description is required.')
    .max(1000, 'Description must be at most 1000 characters.'),
  priority: z.enum(PRIORITY_VALUES, { message: 'Select a priority.' }),
})

/**
 * `resourceName` is intentionally absent: the name is locked after creation,
 * so the form never edits it — the payload re-sends the current value.
 */
export type BasicInfoFormValues = z.infer<typeof basicInfoSchema>
