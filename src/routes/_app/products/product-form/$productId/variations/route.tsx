import VariationsAndCombinations from "@/features/products/product-form/variations";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/products/product-form/$productId/variations")({
  component: RouteComponent,
});

function RouteComponent() {
  return <VariationsAndCombinations />;
}
