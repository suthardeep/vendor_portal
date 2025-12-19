import React, { useState } from 'react';
import Icon from "@/components/base/Icon";
import { cn } from '../../utils/helpers';
import { TokenUtil } from '@/utils/tokenUtil';
import { useNavigate } from '@tanstack/react-router';
import LogoutDialog from '../shared/LogoutDialog';

interface SidebarProfileProps {
  userName?: string;
  userRole?: string;
  userAvatar?: string;
  userExpanded: boolean;
  onUserExpand: (expanded: boolean) => void;
}

const SidebarProfile: React.FC<SidebarProfileProps> = ({
  userName = "Jeel Thumar",
  userRole = "Vendor",
  userAvatar,
  userExpanded,
  onUserExpand
}) => {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const navigate = useNavigate();



  const handleLogout = ()=>{
    TokenUtil.clearToken();
    navigate({to: "/login"})
  }

  const profileMenuItems = [
    { label: "My Profile", icon: "User", action: "profile" },
    { label: "Manage Warehouse", icon: "Home", action: "warehouse" },
    { label: "Change Password", icon: "Key", action: "password" },
    { label: "Logout", icon: "LogOut", action: "logout" , onClick: ()=> setIsLogoutDialogOpen(true)},
  ];

  return (
    <div className="sidebar-footer p-4 pt-2 relative">
      {/* Dropdown Menu - Positioned Above */}
      {userExpanded && (
        <div className="absolute bottom-full left-4 right-4 bg-base-2 rounded-sm shadow-lg py-2 z-50">
          {profileMenuItems.map((item, index) => (
            <div
              key={item.action}
              className={cn(
                "flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200 relative",
                "hover:bg-base-5",
                index !== profileMenuItems.length - 1 && "after:content-[''] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-px after:bg-base-content/20"
              )}
              onClick={(e) => {
                e.stopPropagation();
                item.onClick && item.onClick();
                console.log(`${item.action} clicked`);
                onUserExpand(false);
              }}
            >
              <Icon 
                name={item.icon as any}
                size={18}
                className="text-base-content opacity-60 flex-shrink-0"
              />
              <span className="text-sm font-normal text-base-content">
                {item.label}
              </span>
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
            <img 
              src={userAvatar} 
              alt={userName} 
              className="w-10 h-10 rounded-md object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
              <span className="text-primary-600 font-semibold text-sm">
                {userName.charAt(0)}
              </span>
            </div>
          )}
          <div className="user-details flex flex-col min-w-0 flex-1">
            <span className="text-sm font-medium text-base-content leading-5 truncate">
              {userName}
            </span>
            <span className="text-xs font-normal text-base-content leading-4 truncate opacity-60">
              {userRole}
            </span>
          </div>
        </div>
        <Icon 
          name="ChevronDown"
          size={16}
          className={cn(
            "text-base-content opacity-40 flex-shrink-0 transition-transform duration-200",
            userExpanded && "rotate-180"
          )}
        />
      </div>

      <LogoutDialog isOpen={isLogoutDialogOpen} close={()=> setIsLogoutDialogOpen(false)} />
    </div>
  );
};

export default SidebarProfile;