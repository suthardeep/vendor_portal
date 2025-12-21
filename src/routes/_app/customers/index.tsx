import ComingSoon from '@/components/empty-states/ComingSoon'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/customers/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ComingSoon 
      title="Customer Management"
      description="Customer management features are coming soon. You'll be able to view and manage your customers here."
    />
  )
}