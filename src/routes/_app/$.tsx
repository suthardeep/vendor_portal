import ComingSoon from '@/components/empty-states/ComingSoon'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/$')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ComingSoon 
      title="Page Not Found"
      description="This page is either under development or doesn't exist yet. We're constantly adding new features!"
    />
  )
}