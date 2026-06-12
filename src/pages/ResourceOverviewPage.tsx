import { useParams } from 'react-router-dom'

export default function ResourceOverviewPage() {
  const { resourceId } = useParams()
  return <h1>Resource overview — {resourceId}</h1>
}
