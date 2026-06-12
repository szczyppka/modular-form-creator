import { useParams } from 'react-router-dom'

export default function BasicInfoPage() {
  const { resourceId } = useParams()
  return <h1>Basic Info — {resourceId}</h1>
}
