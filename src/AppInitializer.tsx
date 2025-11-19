// import { useQuery } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
// import { useEffect, useState } from "react";
// import AppLoader from "./components/empty-states/AppLoader";
import AppShimmer from "./components/empty-states/AppShimmer";
import GlobalNotFound from "./components/empty-states/GlobalNotFound";
import { routeTree } from "./routeTree.gen";
// import { useAuthStore } from "./store/useAuthStore";
// import { TokenUtil } from "./utils/tokenUtil";
import { queryClient } from "./lib/queryClient";

import { MobileNumberInput } from "demaze-ui-lib/components";

export const router = createRouter({
  routeTree,
  context: {
    isLoggedIn: false,
    queryClient,
  },
  scrollRestoration: true,
  defaultErrorComponent: (e : any) => <GlobalNotFound error={e?.error} />,
  defaultPendingComponent: () => <AppShimmer />,
  defaultNotFoundComponent: () => <GlobalNotFound />,
});

export type AppRouter = typeof router;

const AuthInitializer = () => {
  // const token = TokenUtil.getToken();
  // const { isLoggedIn, loginFail, setUser } = useAuthStore();
  // const [isLoading, setIsLoading] = useState(true);

  // const { data: permissions, isLoading: isLoadingPermissions } = useQuery({
  //   ...authQueries.getPermissions(),
  //   enabled: !!token,
  // });

  // const checkIsAuthenticated = async () => {
  //   try {
  //     const user = await authService.getProfile();
  //     if (user?.uniqueId) {
  //       setUser(user);
  //     } else {
  //       loginFail();
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     loginFail();
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };


  // useEffect(() => {
  //   if (!token) {
  //     loginFail();
  //     setIsLoading(false);
  //     return;
  //   }
  //   checkIsAuthenticated();
  // }, []);

  return (
    <>
      {/* <AppLoader isLoading={isLoading} /> */}
      {!false && ( // change to isLoggedIn when auth is enabled 
        <RouterProvider
          router={router}
          context={{
            isLoggedIn: false, // change to isLoggedIn when auth is enabled 
            queryClient,
          }}
        />
      )}
    </>
  );
};

export default AuthInitializer;

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
