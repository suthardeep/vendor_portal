import ComingSoon from '@/components/empty-states/ComingSoon'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/analytics/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ComingSoon 
      title="Analytics Dashboard"
      description="Advanced analytics and reporting features are coming soon. You'll get detailed insights about your business performance."
    />
  )
}