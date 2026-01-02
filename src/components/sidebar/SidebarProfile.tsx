import React, { useEffect, useState } from "react";
import Icon, { IconName } from "@/components/base/Icon";
import { cn } from "../../utils/helpers";
import { TokenUtil } from "@/utils/tokenUtil";
import { useNavigate } from "@tanstack/react-router";
import LogoutDialog from "../shared/LogoutDialog";
import { useAuthStore } from "@/store/useAuthStore";

interface SidebarProfileProps {
  userName?: string;
  userRole?: string;
  userAvatar?: string;
  userExpanded: boolean;
  onUserExpand: (expanded: boolean) => void;
}

interface ProfileMenuItems {
  label: string;
  icon: IconName;
  onClick?: () => void;
}

const SidebarProfile: React.FC<SidebarProfileProps> = ({ userExpanded, onUserExpand }) => {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Debug: Log user data
  console.log("🔍 [SIDEBAR PROFILE] User data:", user);

  // Get user data from store or fallback to defaults
  const userName = user?.fullName || user?.businessName || "Vendor User";
  const userRole = "Vendor";
  const userAvatar = undefined; // No avatar field in vendor user type

  console.log("🔍 [SIDEBAR PROFILE] Computed userName:", userName);

  const profileMenuItems: ProfileMenuItems[] = [
    { label: "My Profile", icon: "User", onClick: () => navigate({ to: "/profile" }) },
    { label: "Logout", icon: "LogOut", onClick: () => setIsLogoutDialogOpen(true) },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userExpanded && containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onUserExpand(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userExpanded, onUserExpand]);

  return (
    <div ref={containerRef} className="sidebar-footer p-4 pt-2 relative">
      {/* Dropdown Menu - Positioned Above */}
      {userExpanded && (
        <div
          className="absolute bottom-full p-1.5 left-4 right-4 bg-base-2 rounded-lg shadow-lg py-2 z-50"
        >
          {profileMenuItems.map((item, index) => (
            <div
              key={item.label}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 relative",
                "hover:bg-base-3/80",
              )}
              onClick={(e) => {
                e.stopPropagation();
                item.onClick && item.onClick();
                onUserExpand(false);
              }}
            >
              <Icon name={item.icon as any} size={18} className="text-base-content opacity-60 shrink-0" />
              <span className="text-sm font-normal text-base-content">{item.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Profile Button */}
      <div
        className={cn(
          "user-profile flex items-center gap-3 p-3 rounded-lg bg-base-2",
          "cursor-pointer transition-all duration-200",
          "hover:bg-base-200",
          userExpanded && "bg-base-200"
        )}
        onClick={() => onUserExpand(!userExpanded)}
      >
        <div className="user-info flex items-center gap-3 flex-1 min-w-0">
          {userAvatar ? (
            <img src={userAvatar} alt={userName} className="w-10 h-10 rounded-xl object-cover shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
              <span className="text-primary-600 font-semibold text-sm">{userName.charAt(0)}</span>
            </div>
          )}
          <div className="user-details flex flex-col min-w-0 flex-1">
            <span className="text-sm font-medium text-base-content leading-5 truncate">{userName}</span>
            <span className="text-xs font-normal text-base-content leading-4 truncate opacity-60">
              {userRole}
            </span>
          </div>
        </div>
        <Icon
          name="ChevronDown"
          size={16}
          className={cn(
            "text-base-content opacity-40 shrink-0 transition-transform duration-200",
            userExpanded && "rotate-180"
          )}
        />
      </div>

      <LogoutDialog isOpen={isLogoutDialogOpen} close={() => setIsLogoutDialogOpen(false)} />
    </div>
  );
};

export default SidebarProfile;
