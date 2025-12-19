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

const IS_DEV = import.meta.env.VITE_NODE_ENV === "development";


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

  const currentPath = window.location.pathname;

  // Always fetch profile if we have a token (for centralized navigation)
  const shouldFetchProfile = hasToken;
  const { data: profileData, isLoading, isError } = useGetProfile(shouldFetchProfile);

  // Helper function to check if user is on a valid route for their current state
  const isUserOnValidRoute = (userData: any, path: string) => {
    const hasBasicProfile =
      userData.fullName &&
      userData.email &&
      userData.fullName !== null &&
      userData.email !== null &&
      userData.emailVerified === true;

    console.log("🔍 [APP INIT] Checking route validity:", {
      path,
      hasBasicProfile,
      onboardingCompleted: userData.onboarding?.isCompleted,
      currentStep: userData.onboarding?.currentStep,
    });

    // If profile incomplete, only registration and login are valid
    if (!hasBasicProfile) {
      const isValid = path.includes("/registration") || path.includes("/login");
      console.log(`📧 [APP INIT] Profile incomplete, route ${path} valid: ${isValid}`);
      return isValid;
    }

    // If onboarding complete OR under review, dashboard and other app routes are valid
    if (userData.onboarding?.isCompleted || userData.verificationStatus === "under_review") {
      const isValid =
        path.includes("/dashboard") ||
        path.includes("/orders") ||
        path.includes("/products") ||
        path.includes("/profile") ||
        path.includes("/settings");
      console.log(`✅ [APP INIT] Onboarding complete/under review, route ${path} valid: ${isValid}`);
      return isValid;
    }

    // If onboarding incomplete but profile complete, only business registration is valid
    if (path.includes("/business-registration")) {
      const urlParams = new URLSearchParams(window.location.search);
      const urlStep = parseInt(urlParams.get("step") || "1");
      const currentStep = userData.onboarding?.currentStep || 1;

      // Allow if they're on their current step or any previous step
      const isValid = urlStep <= Math.max(currentStep, 1);
      console.log(
        `🔄 [APP INIT] Business registration step ${urlStep}, current step ${currentStep}, valid: ${isValid}`
      );
      return isValid;
    }

    // Allow registration page always (user might want to update profile)
    if (path.includes("/registration")) {
      console.log(`📝 [APP INIT] Registration page always valid`);
      return true;
    }

    // Dashboard is NOT valid if onboarding is incomplete
    if (path.includes("/dashboard")) {
      console.log(`🚫 [APP INIT] Dashboard not valid - onboarding incomplete`);
      return false;
    }

    console.log(`❌ [APP INIT] Route ${path} is invalid for current state`);
    return false; // Invalid route for current state
  };

  // Helper function to get correct route for user's current state
  const getCorrectRouteForUser = (userData: any) => {
    const hasBasicProfile =
      userData.fullName &&
      userData.email &&
      userData.fullName !== null &&
      userData.email !== null &&
      userData.emailVerified === true;

    // If profile incomplete, go to registration
    if (!hasBasicProfile) {
      return ROUTES.REGISTRATION;
    }

    // If onboarding complete OR under review, go to dashboard
    if (userData.onboarding?.isCompleted || userData.verificationStatus === "under_review") {
      return ROUTES.DASHBOARD;
    }

    // If onboarding incomplete, go to appropriate business registration step
    if (userData.onboarding?.steps) {
      const incompleteStep = userData.onboarding.steps.find((step: any) => !step.completed);

      if (incompleteStep) {
        switch (incompleteStep.step) {
          case 2:
            return "/business-registration?step=1";
          case 3:
            return "/business-registration?step=2";
          case 4:
            return "/business-registration?step=3";
          case 5:
            return "/business-registration?step=4";
          default:
            return "/business-registration?step=1";
        }
      }
    }

    // Default fallback
    return ROUTES.DASHBOARD;
  };

  // Smart navigation logic - only redirect when necessary
  const determineNavigationAction = (userData: any, currentPath: string) => {
    // Skip navigation for recent user actions ONLY if they're on a valid route
    const justLoggedIn = sessionStorage.getItem("justLoggedIn");
    const justRegistered = sessionStorage.getItem("justRegistered");

    if (justLoggedIn || justRegistered) {
      console.log("🔄 [APP INIT] Recent user action detected");
      sessionStorage.removeItem("justLoggedIn");
      sessionStorage.removeItem("justRegistered");

      // But still check if they're on a valid route
      const isOnValidRoute = isUserOnValidRoute(userData, currentPath);

      if (isOnValidRoute) {
        console.log("✅ [APP INIT] Recent action + valid route, skipping navigation");
        return null;
      } else {
        console.log("🚫 [APP INIT] Recent action but INVALID route, will redirect");
        // Continue to check and redirect if needed
      }
    }

    // Check if user is on a valid route for their state
    const isOnValidRoute = isUserOnValidRoute(userData, currentPath);

    if (isOnValidRoute) {
      console.log(`✅ [APP INIT] User is on valid route: ${currentPath}`);
      return null; // Don't redirect
    }

    // User is on invalid route, determine correct route
    const correctRoute = getCorrectRouteForUser(userData);
    console.log(`🔄 [APP INIT] User on invalid route ${currentPath}, should be on ${correctRoute}`);

    return correctRoute;
  };

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

    if (IS_DEV) {
    console.log("🧪 [DEV MODE] Auth & route guards disabled");
    return;
  }
  
    // No token - redirect to login if not already there
    if (!hasToken) {
      if (!currentPath.includes("/login")) {
        console.log("🚫 [APP INIT] No token, redirecting to login");
        router.navigate({ to: ROUTES.LOGIN });
      }
      return;
    }

    // Token exists but profile is loading - wait
    if (isLoading) {
      return;
    }

    // Profile fetch failed - token is invalid
    if (isError) {
      console.error("🚫 [APP INIT] Profile API failed, token invalid - clearing auth data");
      TokenUtil.clearToken();
      clearUser();
      router.update({
        context: {
          isLoggedIn: false,
          queryClient,
        },
      });
      router.navigate({ to: ROUTES.LOGIN });
      return;
    }

    // Profile data received - store it and determine navigation
    if (profileData?.data) {
      const userData = profileData.data;
      setUser(userData);

      // Determine if navigation is needed using smart logic
      const targetRoute = determineNavigationAction(userData, currentPath);

      if (targetRoute && targetRoute !== currentPath) {
        // Use setTimeout to prevent navigation conflicts
        setTimeout(() => {
          if (targetRoute.includes("?")) {
            const [path, search] = targetRoute.split("?");
            const searchParams = new URLSearchParams(search);
            const step = searchParams.get("step");
            router.navigate({
              to: path,
              search: step ? { step: parseInt(step) } : undefined,
            });
          } else {
            router.navigate({ to: targetRoute });
          }
        }, 100);
      } else {
      }
    }
  }, [hasToken, profileData, isLoading, isError, setUser, clearUser, currentPath]);

  if (hasToken && isLoading && shouldFetchProfile) {
    return <AppShimmer />;
  }

  return <RouterProvider router={router} />;
};

export default AuthInitializer;
