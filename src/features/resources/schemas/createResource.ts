import { z } from 'zod'

const RESOURCE_NAME_PATTERN = /^[A-Za-z0-9 -]+$/

export const resourceNameSchema = z
  .string()
  .trim()
  .min(1, 'Resource name is required.')
  .max(255, 'Resource name must be at most 255 characters.')
  .regex(RESOURCE_NAME_PATTERN, 'Use only letters, numbers, spaces, and hyphens.')

export const createResourceSchema = z.object({
  resourceName: resourceNameSchema,
})

export type CreateResourceFormValues = z.infer<typeof createResourceSchema>
