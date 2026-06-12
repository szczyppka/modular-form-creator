import { Badge } from '@/design-system'

interface ModuleCompletionBadgeProps {
  isComplete: boolean
}

export function ModuleCompletionBadge({ isComplete }: ModuleCompletionBadgeProps) {
  if (isComplete) {
    return <Badge variant="success">Complete</Badge>
  }

  return <Badge variant="neutral">Incomplete</Badge>
}
