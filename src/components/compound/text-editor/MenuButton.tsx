import { cn } from "@/utils/helpers";
import * as LucideIcons from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

interface MenuButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  disabled?: boolean;
  icon?: keyof typeof LucideIcons;
  label?: string;
  classname?: string;
}

export const MenuButton: React.FC<MenuButtonProps> = ({
  active,
  disabled,
  icon,
  label,
  className,
  ...props
}) => {
  const Icon = icon ? (LucideIcons[icon] as LucideIcons.LucideIcon) : null;

  return (
    <button
      {...props}
      disabled={disabled}
      type="button"
      className={cn(
        "flex items-center gap-1 rounded-lg p-2 text-sm transition",
        "dark:hover:bg-nd-500 hover:bg-gray-100",
        active ? "bg-pl-50/60 dark:bg-nd-500" : "bg-transparent",
        disabled
          ? "cursor-not-allowed opacity-40"
          : "cursor-pointer hover:shadow-sm",
        className,
      )}
    >
      {Icon && (
        <Icon
          size={14}
          className={cn(
            active
              ? "text-pl-500 dark:text-nd-50"
              : "text-nl-600 dark:text-nd-300",
          )}
        />
      )}
      {label && (
        <span
          className={cn(
            active
              ? "text-pl-500 dark:text-nd-50"
              : "text-nl-600 dark:text-nd-300",
          )}
        >
          {label}
        </span>
      )}
    </button>
  );
};
