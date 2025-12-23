import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/products")({
  component: RouteComponent,
  beforeLoad: ({ location }) => {
    if (location.pathname.replaceAll("/", "") === "products") {
      throw redirect({
        to: "/products/active-products",
      });
    }
  },
  staticData: {
    breadcrumb: {
      label: "Products",
      to: "/products/active-products",
    },
  },
});

function RouteComponent() {
  return <Outlet />;
}
