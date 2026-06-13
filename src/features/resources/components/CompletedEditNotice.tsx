import type { ResourceStatus } from '@/api/types'
import { MutedText } from '@/app/styles'

interface CompletedEditNoticeProps {
  status: ResourceStatus
}

export function CompletedEditNotice({ status }: CompletedEditNoticeProps) {
  if (status !== 'completed') {
    return null
  }

  return (
    <MutedText>
      Changes are kept locally until you submit them from the overview.
    </MutedText>
  )
}
