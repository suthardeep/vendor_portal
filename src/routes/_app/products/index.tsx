import ComingSoon from '@/components/empty-states/ComingSoon'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/products/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ComingSoon 
      title="All Products"
      description="Complete product management features are coming soon. You'll be able to view and manage all your products here."
    />
  )
}