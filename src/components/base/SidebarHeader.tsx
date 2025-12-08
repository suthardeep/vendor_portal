import React from 'react';
import { cn } from '../../utils/helpers'; 

interface SidebarHeaderProps {
  logo: string;
  logoAlt?: string;
  userRole?: string;
  className?: string;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  logo,
  logoAlt = "Logo",
  userRole = "Vendor",
  className
}) => {
  return (
    <div className={cn(
      "sidebar-header flex items-center gap-3 px-5 py-2.5",
      className
    )}>
      <img 
        src={logo} 
        alt={logoAlt} 
        className="h-11.5 w-36.5 object-contain"
      />
      <span className="ml-auto text-sm font-medium px-2.5 py-1 rounded-sm bg-primary-50 text-primary-700">
        {userRole}
      </span>
    </div>
  );
};

export default SidebarHeader;