import ImageZoomDialog from "@/components/compound/ImageZoomDialog";
import { ROUTES } from "@/constants/routes";
import type { AuthStore } from "@/store/useAuthStore";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet, redirect } from "@tanstack/react-router";
import { Toaster } from "sonner";
import "../styles/index.css";
import MediaDialog from "@/components/compound/MediaDialog";

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Root,
  beforeLoad: ({ location }) => {
    if (location.pathname === "" || location.pathname === "/") {
      throw redirect({
        to: ROUTES.DASHBOARD,
      });
    }
  },
  pendingMs: 0,
});

function Root() {
  return (
    <div className="h-screen w-screen relative bg-white">
      <div className="absolute top-0 left-0 w-full h-[45dvh] bg-black" />
        <Toaster visibleToasts={6} />
        <Outlet />
        <ImageZoomDialog />
        <MediaDialog />
        {/* <TanStackRouterDevtools />
        <ReactQueryDevtools initialIsOpen={false} /> */}
    </div>
  );
}

export interface RouterContext {
  isLoggedIn: AuthStore["isLoggedIn"];
  queryClient: QueryClient;
}
