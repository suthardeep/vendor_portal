// src/routes/_app/route.tsx
import Header from "@/components/base/Header";
import Sidebar from "@/components/base/Sidebar";
import RegistrationBanner from "@/features/dashboard/components/BusinessRegistration";
import { sidebarMenuItems } from "@/utils/sidebarMenuItems";
import { Outlet, createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { TokenUtil } from "@/utils/tokenUtil";
import { ROUTES } from "@/constants/routes";
import { getProfile } from "@/api/profile/queryFns";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
  beforeLoad: async ({ context, location }) => {
    console.log(`🔒 [ROUTE PROTECTION] Checking access to: ${location.pathname}`);
    
    // Check if user has a token
    const hasToken = TokenUtil.hasToken();
    
    if (!hasToken) {
      console.log("🚫 [ROUTE PROTECTION] No token found, redirecting to login");
      throw redirect({
        to: ROUTES.LOGIN,
      });
    }

    // Validate token by calling profile API
    try {
      console.log("🔍 [ROUTE PROTECTION] Validating token with profile API...");
      const profileResponse = await getProfile();
      
      if (!profileResponse?.data) {
        console.log("🚫 [ROUTE PROTECTION] Invalid token response, redirecting to login");
        TokenUtil.clearToken();
        throw redirect({
          to: ROUTES.LOGIN,
        });
      }
      
      console.log("✅ [ROUTE PROTECTION] Token valid, allowing access to protected route");
      console.log("👤 [ROUTE PROTECTION] User data:", profileResponse.data.fullName, profileResponse.data.email);
      
      return {
        user: profileResponse.data
      };
      
    } catch (error) {
      console.error("🚫 [ROUTE PROTECTION] Profile API failed, token invalid:", error);
      TokenUtil.clearToken();
      throw redirect({
        to: ROUTES.LOGIN,
      });
    }
  },
});

function AppLayout() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [showOverlay, setShowOverlay] = useState(false);

  // Check onboarding status on mount and when user changes
  useEffect(() => {
    if (user?.onboarding) {
      const { isCompleted, currentStep } = user.onboarding;


      console.log("user" , user)
      
      // Show overlay if onboarding is not completed (currentStep < 5)

      if(!isCompleted){
        setShowOverlay(true)
      }
    
    }
  }, [user]);

  const handleBannerClose = () => {
  };

  const handleBannerNavigate = () => {
    if (user?.onboarding) {
      const { currentStep } = user.onboarding;


      console.log("current" , currentStep)
      
     
      navigate({ 
        to: "/business-registration",
        search: { step: currentStep-1 }
      });
    }
  };

  return (
    <div className="relative h-screen w-screen flex p-4 gap-4">
      {/* Sidebar - with spacing all around */}
      <div className="w-[18.75rem]">
        <Sidebar 
          menuItems={sidebarMenuItems} 
          logo="aavak-logo.svg" 
          userAvatar="profile.jpg"
          showOverlay={showOverlay}
        />
      </div>

      {/* Main Content Area - flex column */}
      <div className="flex-1 flex flex-col gap-2">
        {/* Header - white background - NOT blurred */}
        <div className={showOverlay ? "relative z-[1001]" : ""}>
          <Header 
            breadcrumbs={[{ label: "Dashboard" }, { label: "Analytics" }]}
          />
        </div>

        {/* Registration Banner - Shows above blurred content */}
        {showOverlay && (
          <div className="relative z-[1001]">
            <RegistrationBanner
              onClose={handleBannerClose}
              onNavigate={handleBannerNavigate}
            />
          </div>
        )}

        {/* Outlet/Main Content - white background, fills remaining space - BLURRED when overlay active */}
        <div className={`flex-1 rounded-md overflow-auto bg-white ${showOverlay ? "blur-sm pointer-events-none" : ""}`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AppLayout;