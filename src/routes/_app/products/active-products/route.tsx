import ActiveProductsList from "@/features/products/active-products/pages/active-products-list/ActiveProductsList";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/products/active-products")({
  component: RouteComponent,
  staticData:{
    breadcrumb: {
      label: "Active Products",
    }
  }
});

function RouteComponent() {
  return (
      <ActiveProductsList />
  );
}
