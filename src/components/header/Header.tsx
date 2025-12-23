import React, { FC, JSX, useState } from "react";
import Icon from "../base/Icon";
import { cn } from "../../utils/helpers";
import { useMatches, useNavigate } from "@tanstack/react-router";
import { getBreadcrumbs } from "@/utils/getBreadCrumbs";
import { useAuthStore } from "@/store/useAuthStore";
import { BreadcrumbMeta } from "@/types/breadcrumb";

interface HeaderProps {
  greeting?: string;
  subtitle?: string;
  // breadcrumbs?: Breadcrumb[];
  showBack?: boolean;
  onBackClick?: () => void;
  userAvatar?: string;
  showNotification?: boolean;
}

const Header: FC<HeaderProps> = ({
  greeting,
  subtitle,
  // breadcrumbs = [],
  showBack = false,
  onBackClick,
  showNotification = true,
}): JSX.Element => {
  const setOpacity = (e: React.MouseEvent<HTMLElement>, value: string) => {
    (e.currentTarget as HTMLElement).style.opacity = value;
  };

  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [showNotifPanel, setShowNotifPanel] = useState(false);

  const matches = useMatches();

  const breadcrumbs: BreadcrumbMeta[] = matches.map((m) => (m.staticData as any).breadcrumb).filter(Boolean);

  // Get user data from store
  const userName = user?.fullName || user?.businessName || "Vendor User";
  const userAvatar = "profile.jpg"; // Default avatar since no avatar field in vendor user type

  return (
    <header className="">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          {breadcrumbs.length > 0 && (
            <nav className="flex items-center gap-1 text-xl">
              {" "}
              {/* Increased gap and text size */}
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <Icon name="ChevronRight" size={20} className="text-base-content" />}
                  <span
                    className={cn(
                      "transition-opacity text-base",
                      index === breadcrumbs.length - 1 ? "font-light" : "cursor-pointer font-light"
                    )}
                    style={{
                      opacity: index === breadcrumbs.length - 1 ? 1 : 0.6,
                    }}
                    onClick={() => {
                      if (index !== breadcrumbs.length - 1 && crumb.to) {
                        navigate({ to: crumb.to });
                      }
                    }}
                    onMouseEnter={(e) => index !== breadcrumbs.length - 1 && setOpacity(e, "0.8")}
                    onMouseLeave={(e) => index !== breadcrumbs.length - 1 && setOpacity(e, "0.6")}
                  >
                    {crumb.label}
                  </span>
                </React.Fragment>
              ))}
            </nav>
          )}

          {showBack && (
            <button
              onClick={() => onBackClick?.()}
              className="flex items-center gap-0.5 transition-opacity w-fit text-white opacity-60"
              onMouseEnter={(e) => setOpacity(e, "0.8")}
              onMouseLeave={(e) => setOpacity(e, "0.6")}
              type="button"
            >
              <Icon name="ChevronLeft" size={14} color="white" />
              <Icon name="ChevronLeft" size={14} color="white" style={{ marginLeft: "-10px" }} />
              <span className="text-[11px] font-medium">Back</span>
            </button>
          )}

          {greeting && <h1 className="text-base font-semibold text-primary-content-50">{greeting}</h1>}

          {subtitle && <p className="text-md text-primary-content-50">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2">
          {showNotification && (
            <div className="relative">
              <button
                className="relative p-2.5 rounded-lg hover:bg-base-3 transition-all group"
                type="button"
                onMouseEnter={() => setShowNotifPanel(true)}
                onMouseLeave={() => setShowNotifPanel(false)}
              >
                <Icon
                  name="Bell"
                  size={20}
                  className="text-body-content group-hover:text-base-content transition-colors"
                />
                <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-base-1 animate-pulse" />
              </button>

              {/* Notification Panel */}
              {showNotifPanel && (
                <div
                  className="absolute right-0 top-full mt-2 w-80 bg-base-1 rounded-xl shadow-lg border border-base-3 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                  onMouseEnter={() => setShowNotifPanel(true)}
                  onMouseLeave={() => setShowNotifPanel(false)}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Icon name="Bell" size={18} className="text-primary-600" />
                    <h3 className="font-semibold text-base-content">Notifications</h3>
                  </div>
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-base-3 flex items-center justify-center mb-3">
                      <Icon name="Bell" size={24} className="text-disabled-content" />
                    </div>
                    <p className="text-sm text-body-content">Your notifications will appear here</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
              <span className="text-primary-600 font-semibold text-sm">
                {userName.charAt(0)}
              </span>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
