import ComingSoon from '@/components/empty-states/ComingSoon'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/products/categories/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ComingSoon 
      title="Product Categories"
      description="Category management features are coming soon. You'll be able to organize your products by categories here."
    />
  )
}