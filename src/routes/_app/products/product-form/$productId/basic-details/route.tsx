import { BasicProductDetails } from "@/features/products/product-form/basic-details/BasicProductDetails";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/products/product-form/$productId/basic-details")({
  component: RouteComponent,
});

function RouteComponent() {
  const { productId } = Route.useParams();
  return <BasicProductDetails productId={productId} />;
}
