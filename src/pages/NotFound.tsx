import { routeTo } from '@/app/routes'
import { NavigationLink, PageLayout } from '@/app/styles'

export default function NotFound() {
  return (
    <PageLayout>
      <h1>Page not found</h1>
      <p>
        The page you are looking for does not exist.{' '}
        <NavigationLink to={routeTo.resources()}>Go to resources</NavigationLink>
      </p>
    </PageLayout>
  )
}
