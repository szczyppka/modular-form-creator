import type { Resource } from '@/api/types'

export function createResourceFixture(overrides: Partial<Resource> = {}): Resource {
  return {
    _id: 'resource-id',
    resourceId: 7,
    name: 'Customer onboarding',
    status: 'draft',
    basicInfo: {
      resourceName: 'Customer onboarding',
      owner: '',
      email: '',
      description: '',
      priority: '',
    },
    projectDetails: {
      projectName: '',
      budget: '',
      category: '',
      options: [],
    },
    createdAt: '2026-06-12T10:00:00.000Z',
    updatedAt: '2026-06-12T10:00:00.000Z',
    ...overrides,
  }
}
