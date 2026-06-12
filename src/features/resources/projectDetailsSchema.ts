import { z } from 'zod'
import { PROJECT_CATEGORY_VALUES, TEAM_MEMBER_VALUES } from '@/api/types'

/** Mirrors backend validation (resource.service.ts) so errors surface before the request. */
const NAME_PATTERN = /^[A-Za-z0-9 -]+$/
const INTEGER_PATTERN = /^\d+$/

export const projectDetailsSchema = z.object({
  projectName: z
    .string()
    .trim()
    .min(1, 'Project name is required.')
    .max(255, 'Project name must be at most 255 characters.')
    .regex(NAME_PATTERN, 'Use only letters, numbers, spaces, and hyphens.'),
  budget: z
    .string()
    .trim()
    .min(1, 'Budget is required.')
    .regex(INTEGER_PATTERN, 'Budget must contain only digits.'),
  category: z.enum(PROJECT_CATEGORY_VALUES, { message: 'Select a category.' }),
  options: z.array(z.enum(TEAM_MEMBER_VALUES)).min(1, 'Select at least one team member.'),
})

export type ProjectDetailsFormValues = z.infer<typeof projectDetailsSchema>
