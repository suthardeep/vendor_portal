import React, { FC, JSX } from "react";
import Icon from "./Icon";
import { cn } from "../../utils/helpers";

type Breadcrumb = {
  label: string;
  onClick?: () => void;
};

interface HeaderProps {
  greeting?: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  showBack?: boolean;
  onBackClick?: () => void;
  userAvatar?: string;
  showNotification?: boolean;
}

const Header: FC<HeaderProps> = ({
  greeting,
  subtitle,
  breadcrumbs = [],
  showBack = false,
  onBackClick,
  userAvatar = "profile.jpg",
  showNotification = true,
}): JSX.Element => {
  const setOpacity = (e: React.MouseEvent<HTMLElement>, value: string) => {
    (e.currentTarget as HTMLElement).style.opacity = value;
  };

return (
    <header className="px-1">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">

          {breadcrumbs.length > 0 && (
            <nav className="flex items-center gap-1 text-xl"> {/* Increased gap and text size */}
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <Icon 
                      name="ChevronRight" 
                      size={20}  
                      className="text-base-content"
                    />
                  )}
                  <span
                    className={cn(
                      "transition-opacity text-base", 
                      index === breadcrumbs.length - 1 ? "font-light" : "cursor-pointer font-light"
                    )}
                    style={{
                      opacity: index === breadcrumbs.length - 1 ? 1 : 0.6,
                    }}
                    onClick={() => crumb.onClick?.()}
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

          {greeting && (
            <h1 className="text-base font-semibold text-primary-content-50">
              {greeting}
            </h1>
          )}

          {subtitle && (
            <p className="text-md text-primary-content-50">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">

          {showNotification && (
            <button
              className="transition-opacity opacity-60"
              onMouseEnter={(e) => setOpacity(e, "0.8")}
              onMouseLeave={(e) => setOpacity(e, "0.6")}
              type="button"
            >
              <Icon name="Bell" size={20}  className="text-base-1"  />
            </button>
          )}

          <img
            src={userAvatar}
            alt="User avatar"
            className="w-10 h-10 rounded-lg"
            style={{
              border: "2px solid rgba(255, 255, 255, 0.2)",
            }}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;