import type { ResourceStatus } from '@/api/types'
import { Badge, type BadgeVariant } from '@/design-system'

const STATUS_BADGE: Record<ResourceStatus, { variant: BadgeVariant; label: string }> = {
  draft: { variant: 'info', label: 'Draft' },
  completed: { variant: 'success', label: 'Completed' },
}

interface ResourceStatusBadgeProps {
  status: ResourceStatus
}

export function ResourceStatusBadge({ status }: ResourceStatusBadgeProps) {
  const { variant, label } = STATUS_BADGE[status]
  return <Badge variant={variant}>{label}</Badge>
}
