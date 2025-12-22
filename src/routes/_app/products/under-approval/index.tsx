import ProductsUnderApprovalList from '@/features/products/under-approval/pages/products-under-approval-list/ProductsUnderApprovalList'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/products/under-approval/')({
  component: RouteComponent,
  beforeLoad: () => ({
    breadcrumb: {
      label: "Products Under Approval"
    }
  }),
})

function RouteComponent() {
  return (
    <div className='h-full'>
      <ProductsUnderApprovalList />
    </div>
  )
}