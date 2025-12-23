import { ProductHeader } from "@/features/products/product-form/product-header/ProductHeader";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/products/product-form/$productId")({
  component: RouteComponent,
  staticData:{
    breadcrumb: {
      label: "Complete Product Details",
    }
  }
});

function RouteComponent() {
  const { productId } = Route.useParams();
  return (
    <div>
      <ProductHeader title="Complete Product Details" showSteps={true} enableStepClick={false} productId={productId} />
      <Outlet />
    </div>
  );
}
