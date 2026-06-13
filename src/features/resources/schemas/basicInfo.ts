import { z } from 'zod'
import { PRIORITY_VALUES } from '@/api/types'
import { resourceNameSchema } from './createResource'

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

export const basicInfoPayloadSchema = basicInfoSchema.extend({
  resourceName: resourceNameSchema,
})

export type BasicInfoFormValues = z.infer<typeof basicInfoSchema>
