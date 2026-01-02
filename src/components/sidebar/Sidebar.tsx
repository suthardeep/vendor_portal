import React, { useState, forwardRef, useEffect } from "react";
import SidebarHeader from "./SidebarHeader";
import SidebarMenu from "./SidebarMenu";
import { cn } from "@/utils/helpers";
import SidebarProfile from "./SidebarProfile";

export interface SubMenuItem {
  label: string;
  path: string;
  icon?: string;
}

export interface MenuItem {
  label: string;
  path?: string;
  icon: string;
  subItems?: SubMenuItem[];
  badge?: string | number;
}

export interface SidebarProps {
  logo: string;
  logoAlt?: string;
  userRole?: string;
  userName?: string;
  userAvatar?: string;
  menuItems: MenuItem[];
  activePath?: string;
  onNavigate?: (path: string) => void;
  className?: string;
  containerClassName?: string;
  showOverlay?: boolean; // Add this prop
}

const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      logo,
      logoAlt = "Aavak Logo",
      userRole = "Vendor",
      userName = "Aavak vendor",
      userAvatar,
      menuItems,
      activePath,
      onNavigate,
      className,
      containerClassName,
      showOverlay = true, // Default to false
      ...props
    },
    ref
  ) => {
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [userExpanded, setUserExpanded] = useState(false);
    const [internalActivePath, setInternalActivePath] = useState(activePath || "");

    // Auto-expand parent items when their children are active
    useEffect(() => {
      const itemsToExpand: string[] = [];
      menuItems.forEach((item) => {
        if (item.subItems?.some((sub) => sub.path === internalActivePath)) {
          itemsToExpand.push(item.label);
        }
      });
      if (itemsToExpand.length > 0) {
        setExpandedItems((prev) => {
          const newExpanded = [...prev];
          itemsToExpand.forEach((label) => {
            if (!newExpanded.includes(label)) {
              newExpanded.push(label);
            }
          });
          return newExpanded;
        });
      }
    }, [internalActivePath, menuItems]);

    useEffect(() => {
      if (activePath !== undefined) {
        setInternalActivePath(activePath);
      }
    }, [activePath]);

    const toggleExpand = (label: string) => {
      setExpandedItems((prev) =>
        prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
      );
    };

    const handleNavigation = (path: string) => {
      setInternalActivePath(path);
      onNavigate?.(path);
    };

    return (
      <div
        className={cn(
          "sidebar w-75 flex flex-col h-[96%] rounded-lg overflow-hidden bg-base-1 fixed",
          "shadow-card",
          containerClassName
        )}
      >
        {/* Header - NOT blurred */}
        <div className={cn(showOverlay && "relative z-1001")}>
          <SidebarHeader logo={logo} logoAlt={logoAlt} userRole={userRole} className={className} />
        </div>

        {/* Menu - BLURRED */}
        <div className={cn("flex-1", showOverlay && "blur-sm pointer-events-none")}>
          <SidebarMenu
            menuItems={menuItems}
            expandedItems={expandedItems}
            internalActivePath={internalActivePath}
            onToggleExpand={toggleExpand}
            onNavigate={handleNavigation}
          />
        </div>

        {/* Profile - NOT blurred */}
        <div className={cn(showOverlay && "relative z-1001")}>
          <SidebarProfile
            userName={userName}
            userRole={userRole}
            userAvatar={userAvatar}
            userExpanded={userExpanded}
            onUserExpand={setUserExpanded}
          />
        </div>
      </div>
    );
  }
);

Sidebar.displayName = "Sidebar";
export default Sidebar;
