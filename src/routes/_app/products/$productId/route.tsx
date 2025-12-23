import ProductDetails from '@/features/products/product-details/ProductDetails';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/products/$productId')({
  component: RouteComponent,
  staticData:{
    breadcrumb: {
      label: "Product Details",
    }
  }
})

function RouteComponent() {
    const {productId} = Route.useParams();
  return <ProductDetails productId={productId}/>
}
