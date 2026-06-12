import { Link } from 'react-router-dom'
import { routeTo } from '../app/routes'

export default function NotFoundPage() {
  return (
    <section>
      <h1>Page not found</h1>
      <p>
        The page you are looking for does not exist.{' '}
        <Link to={routeTo.resources()}>Go to resources</Link>
      </p>
    </section>
  )
}
