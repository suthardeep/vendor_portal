import AddProduct from '@/features/products/add-product'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/products/add-product/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AddProduct/>
}
