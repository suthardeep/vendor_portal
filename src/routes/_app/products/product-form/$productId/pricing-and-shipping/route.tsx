import { createFileRoute } from "@tanstack/react-router";
import PricingAndShipping from "@/features/products/product-form/pricing-and-shipping/PricingAndShipping";

export const Route = createFileRoute("/_app/products/product-form/$productId/pricing-and-shipping")({
  staticData: {
    title: "Pricing & Shipping",
  },
  component: () => {
    const { productId } = Route.useParams();
    return <PricingAndShipping productId={productId} />;
  },
});