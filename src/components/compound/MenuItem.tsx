import { cn } from "@/utils/helpers";
import * as LucideIcons from "lucide-react";
import type { ReactNode } from "react";
import { PopoverClose } from "./Popover";

interface MenuItemProps {
  children: ReactNode;
  onClick?: (e?: any) => void;
  startIcon?: keyof typeof LucideIcons;
  endIcon?: keyof typeof LucideIcons;
  disableClosePopoverOnClick?: boolean;
  classname?: string;
  selected?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = (props) => {
  const {
    children,
    onClick,
    endIcon,
    startIcon,
    disableClosePopoverOnClick = false,
    classname = "",
    selected = false,
  } = props;

  const StartIcon = startIcon
    ? (LucideIcons[startIcon] as LucideIcons.LucideIcon)
    : null;
  const EndIcon = endIcon
    ? (LucideIcons[endIcon] as LucideIcons.LucideIcon)
    : null;

  const content = (
    <div
      className={cn(
        selected
          ? "text-neutral dark:text-neutral-content bg-primary-100/30 dark:bg-primary-500/20"
          : "hover:bg-neutral-content/70 hover:dark:bg-base-3/70 text-base-3 dark:text-neutral-content",
        "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left !text-xs transition-colors",
        classname,
      )}
    >
      {StartIcon && <StartIcon className={cn(iconClassName)} />}
      <p className="text-inherit">{children}</p>
      {EndIcon && <EndIcon className={cn(iconClassName)} />}
    </div>
  );

  if (disableClosePopoverOnClick) {
    return <div>{content}</div>;
  }

  return (
    <PopoverClose onClick={onClick} asChild>
      {content}
    </PopoverClose>
  );
};

const iconClassName = `dark:text-neutral-content text-base-3 h-4 w-4 shrink-0 stroke-2`;

export default MenuItem;
