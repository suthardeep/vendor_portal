// src/routes/_app/route.tsx
import Header from "@/components/base/Header";
import Sidebar from "@/components/base/Sidebar";
import { sidebarMenuItems } from "@/utils/sidebarMenuItems";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <div className=" relative h-screen w-screen flex p-4 gap-4">
      {/* Sidebar - with spacing all around */}
      <div className="w-[18.75rem]">
        <Sidebar menuItems={sidebarMenuItems} logo="aavak-logo.svg" userAvatar="profile.jpg" />
      </div>

      {/* Main Content Area - flex column */}
      <div className="flex-1 flex flex-col gap-2">
        {/* Header - white background */}
        <Header 
          breadcrumbs={[{ label: "Dashboard" } , {"label": "Analytics"}]}
        />

        {/* Outlet/Main Content - white background, fills remaining space */}
        <div className="flex-1  rounded-md overflow-auto bg-white">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AppLayout;