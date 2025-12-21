import ComingSoon from '@/components/empty-states/ComingSoon'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/orders/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ComingSoon 
      title="Orders Management"
      description="Order management features are coming soon. You'll be able to view and manage all your orders here."
    />
  )
}
