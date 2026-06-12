import { useParams } from 'react-router-dom'

export default function ResourceDetailsPage() {
  const { resourceId } = useParams()
  return <h1>Resource details — {resourceId}</h1>
}
