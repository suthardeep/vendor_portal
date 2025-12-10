import { createFileRoute, redirect } from "@tanstack/react-router";
import { ROUTES } from "@/constants/routes";
import AuthLayout from "./layout";
import { TokenUtil } from "@/utils/tokenUtil";

export const Route = createFileRoute("/_auth")({
  component: AuthLayout,
  validateSearch: () => ({}),
  beforeLoad: async ({ context }) => {
    // Check current token status (more reliable than context)
    const hasToken = TokenUtil.hasToken();

    if (hasToken) {
      console.log("✅ [AUTH ROUTE] User has token, redirecting to dashboard");
      throw redirect({
        to: ROUTES.DASHBOARD,
      });
    }
    
    console.log("✅ [AUTH ROUTE] No token, allowing access to auth pages");
  },
});
