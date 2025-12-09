import { createRouter, RouterProvider } from "@tanstack/react-router";
import { useEffect } from "react";
import AppShimmer from "./components/empty-states/AppShimmer";
import GlobalNotFound from "./components/empty-states/GlobalNotFound";
import { routeTree } from "./routeTree.gen";
import { useAuthStore } from "./store/useAuthStore";
import { TokenUtil } from "./utils/tokenUtil";
import { queryClient } from "./lib/queryClient";
import { useGetProfile } from "@/api/profile/queryHooks";
import { ROUTES } from "@/constants/routes";

export const router = createRouter({
  routeTree,
  context: {
    isLoggedIn: false,
    queryClient,
  },
  scrollRestoration: true,
  defaultErrorComponent: (e: any) => <GlobalNotFound error={e?.error} />,
  defaultPendingComponent: () => <AppShimmer />,
  defaultNotFoundComponent: () => <GlobalNotFound />,
});

export type AppRouter = typeof router;

const AuthInitializer = () => {
  const { user, setUser, clearUser } = useAuthStore();
  const hasToken = TokenUtil.hasToken();
  
  // Only fetch profile if we have a token and no user in store
  const shouldFetchProfile = hasToken && !user;
  const { data: profileData, isLoading, isError } = useGetProfile(shouldFetchProfile);

  useEffect(() => {
    // If no token, do nothing (user needs to login)
    if (!hasToken) {
      return;
    }

    // If we have token but profile is loading, wait
    if (isLoading) {
      return;
    }

    // If profile fetch failed, clear token and user
    if (isError) {
      console.error("Failed to fetch profile, clearing token");
      clearUser();
      return;
    }

    // If we got profile data, store it
    if (profileData?.data) {
      const userData = profileData.data;
      setUser(userData);

      // Navigation logic based on onboarding status
      const currentPath = window.location.pathname;
      const isOnAuthPage = currentPath.includes('/login') || currentPath.includes('/registration') || currentPath.includes('/business-registration');
      
      // Only redirect if user is on auth pages
      if (!isOnAuthPage) {
        return;
      }

      // If email not verified, redirect to registration
      if (userData.emailVerified === false) {
        router.navigate({ to: ROUTES.REGISTRATION });
        return;
      }

      // Check if onboarding is completed
      if (userData.onboarding?.isCompleted) {
        router.navigate({ to: ROUTES.DASHBOARD });
        return;
      }

      // Find first incomplete step and redirect
      if (userData.onboarding?.steps) {
        const firstIncompleteStep = userData.onboarding.steps.find((step: any) => !step.completed);
        
        if (firstIncompleteStep) {
          const stepNumber = firstIncompleteStep.step;
          
          // Map step numbers to routes
          switch (stepNumber) {
            case 1:
              router.navigate({ to: ROUTES.REGISTRATION });
              break;
            case 2:
              router.navigate({ to: "/business-registration", search: { step: 1 } });
              break;
            case 3:
              router.navigate({ to: "/business-registration", search: { step: 2 } });
              break;
            case 4:
              router.navigate({ to: "/business-registration", search: { step: 3 } });
              break;
            case 5:
              router.navigate({ to: "/business-registration", search: { step: 4 } });
              break;
            default:
              router.navigate({ to: ROUTES.DASHBOARD });
          }
        } else {
          // No incomplete steps found, go to dashboard
          router.navigate({ to: ROUTES.DASHBOARD });
        }
      }
    }
  }, [hasToken, profileData, isLoading, isError, setUser, clearUser, user]);

  // Show loading state while initializing
  if (hasToken && isLoading) {
    return <AppShimmer />;
  }

  return <RouterProvider router={router} />;
};

export default AuthInitializer;
