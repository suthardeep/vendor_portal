import { useProductDetailsQuery } from "@/features/products/product-form/product-header/api/queryHooks";
import VariationsAndCombinations from "@/features/products/product-form/variations";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/products/product-form/$productId/variations")({
  component: RouteComponent,
});

function RouteComponent() {
  const { productId } = Route.useParams();
  return <VariationsAndCombinations productId={productId} />;
}
