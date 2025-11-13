import { NAV_ITEMS } from "@/constants/navItems";
import { useToggle } from "@/hooks/useToggle";
import { Menu } from "lucide-react";
import { IconButton } from "../base/IconButton";
import Sheet from "../compound/Sheet";
import Sidebar from "./sidebar/Sidebar";

const SidebarDrawer = () => {
  const { open, isOpen, close } = useToggle();
  return (
    <div>
      <div className="block lg:hidden">
        <IconButton
          icon={Menu}
          size={"sm"}
          onClick={open}
          iconClassName="size-4 m-0.5 shrink-0 text-nl-500 dark:text-nd-100 stroke-2"
        />
      </div>
      <Sheet isOpen={isOpen} close={close} title="">
        <Sidebar
          navItems={NAV_ITEMS}
          isMobileDrawer
          closeSidebarDrawer={close}
        />
      </Sheet>
    </div>
  );
};

export default SidebarDrawer;
