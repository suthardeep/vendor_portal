// src/routes/_app/route.tsx
import Header from "@/components/base/Header";
import Sidebar from "@/components/base/Sidebar";
import RegistrationBanner from "@/features/dashboard/components/BusinessRegistration";
import { StatusCard } from "@/components/base/StatusCard";
import { sidebarMenuItems } from "@/utils/sidebarMenuItems";
import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import logo from "@/assets/Logo.svg";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/utils/helpers";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [showOverlay, setShowOverlay] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  // Check onboarding status and verification status on mount and when user changes
  useEffect(() => {
    if (user) {
      // Check verification status first (higher priority)
      if (user.verificationStatus === "under_review") {
        // setShowVerificationModal(true); // BYPASSING AS OF NOW
        return;
      }

      // Check onboarding status if verification is not under review
      if (user.onboarding) {
        const { isCompleted } = user.onboarding;

        console.log("user", user);

        // Show overlay if onboarding is not completed
        if (!isCompleted) {
          setShowOverlay(true);
        }
      }
    }
  }, [user]);

  const handleBannerClose = () => {};

  const handleBannerNavigate = () => {
    if (user?.onboarding) {
      const { currentStep } = user.onboarding;

      console.log("current", currentStep);

      navigate({
        to: "/business-registration",
        search: { step: currentStep - 1 },
      });
    }
  };

  const handleExploreMore = () => {
    // Navigate to dashboard or any other page
    navigate({ to: "/" });
  };

  return (
    <div className="relative h-screen w-screen">
      {/* Main Layout - gets blurred when verification modal is active */}
      <div className={`flex p-4 gap-4 h-full ${showVerificationModal ? "blur-sm" : ""}`}>
        {/* Sidebar - with spacing all around */}
        {/* add - hidden xl:block for responsiveness and consider an alternative  */}
        <div className=" w-75">
          <Sidebar
            menuItems={sidebarMenuItems}
            logo={logo}
            userAvatar="profile.jpg"
            showOverlay={showOverlay}
          />
        </div>

        {/* Main Content Area - flex column */}
        <div className="flex-1 flex flex-col gap-2">
          {/* Header - white background - NOT blurred */}
          <div className={showOverlay ? "relative z-1001" : ""}>
            <Header
            // breadcrumbs={[{ label: "Dashboard" }, { label: "Analytics" }]}
            />
          </div>

          {/* Registration Banner - Shows above blurred content */}
          {showOverlay && (
            <div className="relative z-1001">
              <RegistrationBanner onClose={handleBannerClose} onNavigate={handleBannerNavigate} />
            </div>
          )}

          {/* Outlet/Main Content - white background, fills remaining space - BLURRED when overlay active */}
          <div
            className={cn(
              "flex-1 pb-4",
              showOverlay ? "blur-sm pointer-events-none" : "",
              // "shadow-[0px_2px_4px_-2px_rgba(0,0,0,0.06),0px_4px_6px_-1px_rgba(0,0,0,0.1)]"
            )}
          >
            <Outlet />
          </div>
        </div>
      </div>

      {/* Verification Status Modal Overlay - On top of everything */}
      {showVerificationModal && (
        <>
          {/* Semi-transparent backdrop */}
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-2000" />

          {/* StatusCard Modal - Centered */}
          <div className="fixed inset-0 z-2001 flex items-center justify-center p-4">
            <div className="w-auto h-md max-w-md bg-transparent">
              <StatusCard
                variant="info"
                icon="AlertCircle"
                title="Pending Approval."
                description="Your profile is under approval process. Aavak team might contact you if required."
                size="md"
                primaryAction={{
                  children: "Explore more",
                  onClick: handleExploreMore,
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AppLayout;
