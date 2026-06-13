import { routeTo } from '@/app/routes'
import { InlineAction, MutedText, NavigationLink, PageLayout } from '@/app/styles'
import { Button } from '@/design-system'

export default function RouteError() {
  return (
    <PageLayout role="alert">
      <h1>Unable to display this page</h1>
      <MutedText>
        Try loading it again. If the problem continues, return to the resources list.
      </MutedText>
      <InlineAction>
        <Button type="button" onClick={() => window.location.reload()}>
          Reload page
        </Button>
        <NavigationLink to={routeTo.resources()}>Go to resources</NavigationLink>
      </InlineAction>
    </PageLayout>
  )
}
