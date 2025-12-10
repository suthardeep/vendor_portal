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
    isLoggedIn: TokenUtil.hasToken(),
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
  
  // Only fetch profile if we have a token and are on auth pages (login/registration)
  const currentPath = window.location.pathname;
  const isOnAuthPage = currentPath.includes('/login') || currentPath.includes('/registration');
  const isOnBusinessRegistration = currentPath.includes('/business-registration');
  
  // Only run profile fetch for navigation logic on auth pages or business registration
  const shouldFetchProfile = hasToken && (isOnAuthPage || isOnBusinessRegistration);
  const { data: profileData, isLoading, isError } = useGetProfile(shouldFetchProfile);

  // Update router context when token status changes
  useEffect(() => {
    router.update({
      context: {
        isLoggedIn: hasToken,
        queryClient,
      },
    });
  }, [hasToken]);

  useEffect(() => {
    // If no token and not on auth pages, let route protection handle redirect
    if (!hasToken) {
      // Only handle redirect if we're on auth pages
      if (isOnAuthPage && !currentPath.includes('/login')) {
        router.navigate({ to: ROUTES.LOGIN });
      }
      return;
    }

    // If we're not fetching profile (on protected routes), let route protection handle it
    if (!shouldFetchProfile) {
      return;
    }

    // If we have token but profile is loading, wait
    if (isLoading) {
      return;
    }

    // If profile fetch failed, token is invalid - clear everything and redirect to login
    if (isError) {
      console.error("🚫 [APP INIT] Failed to fetch profile, token invalid - clearing auth data");
      TokenUtil.clearToken();
      clearUser();
      // Update router context
      router.update({
        context: {
          isLoggedIn: false,
          queryClient,
        },
      });
      router.navigate({ to: ROUTES.LOGIN });
      return;
    }

    // If we got profile data, store it and handle navigation
    if (profileData?.data) {
      const userData = profileData.data;
      setUser(userData);

      // Only handle navigation if we're on auth pages or business registration
      if (!isOnAuthPage && !isOnBusinessRegistration) {
        return;
      }
      
      // If user just registered, let them proceed to business registration without interference
      const justRegistered = sessionStorage.getItem('justRegistered');
      if (justRegistered) {
        sessionStorage.removeItem('justRegistered'); // Clear the flag
        return;
      }
      
      // If user is on business registration, let them stay there (don't auto-redirect)
      if (isOnBusinessRegistration) {
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

      // Check business registration steps (steps 2, 3, 4) for incomplete ones
      if (userData.onboarding?.steps) {
        const businessSteps = userData.onboarding.steps.filter((step: any) => 
          step.step >= 2 && step.step <= 4
        );
        
        // Find first incomplete business step
        const firstIncompleteBusinessStep = businessSteps.find((step: any) => !step.completed);
        
        if (firstIncompleteBusinessStep) {
          const stepNumber = firstIncompleteBusinessStep.step;
          
          // Map API step numbers to business registration form steps
          switch (stepNumber) {
            case 2: // Business Details
              router.navigate({ to: "/business-registration", search: { step: 1 } });
              break;
            case 3: // Brand Details
              router.navigate({ to: "/business-registration", search: { step: 2 } });
              break;
            case 4: // Bank Details
              router.navigate({ to: "/business-registration", search: { step: 3 } });
              break;
            default:
              router.navigate({ to: ROUTES.DASHBOARD });
          }
          return;
        }
        
        // If all business steps are complete but step 5 (verification) is not
        const verificationStep = userData.onboarding.steps.find((step: any) => step.step === 5);
        if (verificationStep && !verificationStep.completed) {
          router.navigate({ to: "/business-registration", search: { step: 4 } }); // Declaration step
          return;
        }
      }

      // Default fallback - go to dashboard
      router.navigate({ to: ROUTES.DASHBOARD });
    }
  }, [hasToken, profileData, isLoading, isError, setUser, clearUser, user, shouldFetchProfile, isOnAuthPage, isOnBusinessRegistration, currentPath]);

  // Show loading state while initializing (only for auth pages)
  if (hasToken && isLoading && shouldFetchProfile) {
    return <AppShimmer />;
  }

  return <RouterProvider router={router} />;
};

export default AuthInitializer;
