import { useParams } from 'react-router-dom'

export default function ProjectDetailsPage() {
  const { resourceId } = useParams()
  return <h1>Project Details — {resourceId}</h1>
}
