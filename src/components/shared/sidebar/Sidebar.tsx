import { useToggle } from "@/hooks/useToggle";
import { cn } from "@/utils/helpers";
import { useMatchRoute } from "@tanstack/react-router";
import { Bell, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { sidebarStateUtil } from "../utils/sidebarUtil";
import type { NavItemTypes } from "./NavItem";
import NavItem from "./NavItem";
import { Popover } from "@/components/compound/Popover";
import { IconButton } from "@/components/base/IconButton";
import NotificationPopover from "../NotificationPopover";
import ProfilePopover from "../ProfilePopover";
import { ProfileButton } from "../Header";

const Sidebar: React.FC<SidebarProps> = (props) => {
  const { navItems, isMobileDrawer, closeSidebarDrawer } = props;
  const matchRoute = useMatchRoute();
  const [isExpanded, setIsExpanded] = useState("");

  const initialCollapsed = sidebarStateUtil.getCollapsedState();
  const { isOpen, toggle, open } = useToggle(initialCollapsed !== false);

  const onNavClick = (label: string) => {
    if (!isOpen) {
      open();
      sidebarStateUtil.saveCollapsedState(!isOpen);
    }

    if (isExpanded === label) {
      setIsExpanded("");
    } else {
      setIsExpanded(label);
    }
  };

  useEffect(() => {
    const activeParent = navItems.find((parent) =>
      parent.children?.some(
        (child) =>
          "path" in child && matchRoute({ to: child.path, fuzzy: true }),
      ),
    )?.label;

    setIsExpanded(activeParent || "");
  }, [matchRoute, navItems]);

  useEffect(() => {
    if (!isOpen) {
      setIsExpanded("");
    }
  }, [isOpen]);

  const handleSidebarCollapseToggle = () => {
    toggle();
    setIsExpanded("");
    sidebarStateUtil.saveCollapsedState(!isOpen);

    if (!isOpen) {
      const activeParent = navItems.find((parent) =>
        parent.children?.some(
          (child) => "path" in child && matchRoute({ to: child.path }),
        ),
      )?.label;

      setIsExpanded(activeParent || "");
    }
  };

  return (
    <div
      className={cn(
        isMobileDrawer ? "w-full" : isOpen ? "w-64" : "w-[67px]",
        isMobileDrawer ? "" : "border-r",
        "border-r-nl-200 dark:border-r-nd-600 relative flex h-full shrink-0 flex-col px-3 py-1.5 transition-all duration-300 ease-in-out",
      )}
    >
      <div className="mb-1 flex h-10 shrink-0 items-center justify-between p-1 lg:h-14 lg:p-3">
        <h5 className="text-pl-600 dark:text-pd-200 font-bold">FB</h5>
        <div className={cn("flex items-center gap-x-2 lg:hidden")}>
          <Popover
            trigger={
              <IconButton
                icon={Bell}
                size={"sm"}
                iconClassName="size-4 m-0.5 shrink-0 text-nl-500 dark:text-nd-100 stroke-2"
              />
            }
          >
            <NotificationPopover />
          </Popover>
          <Popover trigger={<ProfileButton />}>
            <ProfilePopover onLogoutClick={open} />
          </Popover>
        </div>
      </div>
      <div className="no-scrollbar flex-1 space-y-2 overflow-x-hidden overflow-y-auto">
        {navItems?.map((item, index) => (
          <NavItem
            key={index}
            isExpanded={item.label === isExpanded}
            item={item}
            onClick={() => onNavClick(item.label)}
            isSidebarCollapsed={!isOpen}
            closeSidebarDrawer={closeSidebarDrawer}
          />
        ))}
      </div>

      {!isMobileDrawer && (
        <button
          onClick={handleSidebarCollapseToggle}
          className="border-nl-200 dark:bg-nd-900 dark:border-nd-500 fall hover:bg-nl-50 hover:dark:bg-nd-700 absolute top-1/2 -right-2.5 size-5 -translate-y-1/2 cursor-pointer rounded-full border bg-white transition-colors"
        >
          <ChevronRight
            size={16}
            className={cn(
              "dark:text-nd-300 text-nl-200 transition-transform",
              isOpen ? "-scale-x-100" : "scale-x-100",
              "text-nl-400",
            )}
          />
        </button>
      )}
    </div>
  );
};

export default Sidebar;

interface SidebarProps {
  navItems: NavItemTypes[];
  isMobileDrawer?: boolean;
  closeSidebarDrawer?: () => void;
}
