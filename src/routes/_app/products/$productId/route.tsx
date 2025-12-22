import ProductDetails from '@/features/products/product-details/ProductDetails';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/products/$productId')({
  component: RouteComponent,
})

function RouteComponent() {
    const {productId} = Route.useParams();
  return <ProductDetails productId={productId}/>
}
