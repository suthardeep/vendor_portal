import { createFileRoute, redirect } from "@tanstack/react-router";
import { ROUTES } from "@/constants/routes";
import AuthLayout from "./layout";

export const Route = createFileRoute("/_auth")({
  component: AuthLayout,
  validateSearch: () => ({}),
  beforeLoad: async ({ context }) => {
    const { isLoggedIn } = context;
    // const { redirectTo } = search;

   
  },
});
