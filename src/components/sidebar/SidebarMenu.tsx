import React from 'react';
import Icon from "@/components/base/Icon";
import { MenuItem } from './Sidebar';
import { cn } from '../../utils/helpers';
import { IconName } from '@/components/base/Icon';

interface SidebarMenuProps {
  menuItems: MenuItem[];
  expandedItems: string[];
  internalActivePath: string;
  onToggleExpand: (label: string) => void;
  onNavigate: (path: string) => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  menuItems,
  expandedItems = [],
  internalActivePath,
  onToggleExpand,
  onNavigate
}) => {
  const isActive = (path?: string) => {
    return path === internalActivePath;
  };

  const isParentActive = (item: MenuItem) => {
    if (item.path === internalActivePath) return true;
    return item.subItems?.some(sub => sub.path === internalActivePath) || false;
  };

  return (
    <nav className="sidebar-menu flex-1 overflow-y-auto py-1 px-3">
      {menuItems.map((item) => {
        const isItemActive = isParentActive(item);
        const isExpanded = expandedItems.includes(item.label);
        const hasSubItems = item.subItems && item.subItems.length > 0;

        return (
          <div key={item.label} className="menu-item-wrapper mb-0.5">
            <div
              className={cn(
                "menu-item flex items-center justify-between px-3 py-2 rounded-lg",
                "cursor-pointer transition-all duration-200",
                "hover:bg-base-200",
                isItemActive && "bg-neutral/10"
              )}
              onClick={() => {
                if (hasSubItems) {
                  onToggleExpand(item.label);
                  // Navigate to first child when expanding
                  if (!isExpanded && item.subItems && item.subItems.length > 0) {
                    onNavigate(item.subItems[0].path);
                  }
                } else if (item.path) {
                  onNavigate(item.path);
                }
              }}
            >
              <div className="menu-item-content flex items-center gap-2.5 flex-1 min-w-0">
                <Icon 
                  name={item.icon as IconName} 
                  size={18}
                  className={cn(
                    "transition-colors flex-shrink-0",
                   "text-base-content "
                  )}
                />
                <span className={cn(
                  "text-sm font-light leading-5 transition-colors truncate text-base-content"
                )}>
                  {item.label}
                </span>
                {item.badge && (
                  <span className="ml-auto px-2 py-0.5 text-xs font-semibold rounded-full bg-primary-100 text-primary-700 flex-shrink-0">
                    {item.badge}
                  </span>
                )}
              </div>
              {/* Show chevron for ALL items */}
              <Icon 
                name={hasSubItems ? "ChevronDown" : "ChevronRight"}
                size={16}
                className={cn(
                  "text-base-content opacity-40 flex-shrink-0 transition-transform duration-200 ml-2",
                  // Rotate down chevron when expanded
                  hasSubItems && isExpanded && "rotate-180",
                  // Keep right chevron always pointing right
                )}
              />
            </div>

            {/* Sub Items */}
            {hasSubItems && isExpanded && (
              <div className="sub-menu bg-base-200 rounded-lg py-1 mt-0.5 mb-0.5">
                {item.subItems!.map((subItem) => {
                  const isSubActive = isActive(subItem.path);
                  
                  return (
                    <div
                      key={subItem.label}
                      className={cn(
                        "sub-menu-item flex items-center gap-2.5 px-3 py-2 pl-10 rounded-md mx-1.5",
                        "cursor-pointer transition-all duration-200",
                        "hover:bg-base-100",
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate(subItem.path);
                      }}
                    >
                      {subItem.icon ? (
                        <Icon 
                          name={subItem.icon as IconName} 
                          size={16}
                          className={cn(
                            "transition-colors flex-shrink-0",
                            isSubActive ? "text-primary-600" : "text-base-content opacity-60"
                          )}
                        />
                      ) : (
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all",
                            isSubActive
                              ? "bg-primary-600 ring-4 ring-primary-100"
                              : "bg-base-content opacity-30"
                          )}
                        />
                      )}
                      <span className={cn(
                        "text-sm font-light leading-5 transition-colors truncate",
                        isSubActive ? "text-primary-600" : "text-base-content"
                      )}>
                        {subItem.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default SidebarMenu;