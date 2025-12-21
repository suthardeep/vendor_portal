import ActiveProductsList from '@/features/active-products/pages/active-products-list/ActiveProductsList'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/active-products/')({
  component: RouteComponent,
  beforeLoad: () => ({
    breadcrumb: {
      label: "Active Products"
    }
  }),
})

function RouteComponent() {
  return (
    <div className='h-full'>
      <ActiveProductsList />
    </div>
  )
}