import React from "react";
import { cn } from "@/utils/helpers";
import { Button } from "@/components/base/Button";
import Icon from "@/components/base/Icon";

export interface RegistrationBannerProps {
  onClose?: () => void;
  onNavigate?: () => void;
  className?: string;
}

const RegistrationBanner: React.FC<RegistrationBannerProps> = ({ onClose, onNavigate, className }) => {
  const handleBannerClick = () => {
    onNavigate?.();
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose?.();
  };

  return (
    <div
      className={cn(
        "relative w-full bg-white rounded-lg shadow-sm border border-gray-200",
        "flex items-center justify-between px-6 py-4",
        "cursor-pointer hover:shadow-md transition-shadow duration-200",
        className
      )}
      onClick={handleBannerClick}
    >
      <p className="text-gray-800 font-medium text-base pr-4">
        Please complete the registration process to gain access to the Aavak vendor platform.
      </p>

      <Button
        onClick={handleCloseClick}
        className="shrink-0 rounded-md bg-red-500 hover:bg-red-600 h-10 w-10 p-0!"
        aria-label="Close banner"
      >
        <Icon name="CircleArrowDown" size={23} className="rotate-[-135deg] text-white " />
      </Button>
    </div>
  );
};

export default RegistrationBanner;
