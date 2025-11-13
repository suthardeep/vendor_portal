import type { ReactNode } from "react";
import * as LucideIcons from "lucide-react";
import { cn, formatCurrencyINR } from "@/utils/helpers";

interface ListItemProps {
  label: string;
  value: ReactNode;
  startIcon?: keyof typeof LucideIcons;
  iconClassName?: string;
  classname?: string;
  labelClassname?: string;
  valueClassname?: string;
  isCurrency?: boolean;
}

export const ListItem: React.FC<ListItemProps> = (props) => {
  const {
    label,
    value,
    startIcon,
    classname,
    iconClassName,
    labelClassname,
    valueClassname,
    isCurrency,
  } = props;
  const StartIcon = startIcon
    ? (LucideIcons[startIcon] as LucideIcons.LucideIcon)
    : null;

  return (
    <div className={cn("flex items-center gap-x-2", classname)}>
      {StartIcon && (
        <StartIcon className={cn(iconClassName)} strokeWidth={1.6} size={16} />
      )}
      <p className={cn("text-nl-500 dark:text-nd-300", labelClassname)}>
        {" "}
        {label}:{" "}
      </p>
      {typeof value === "string" || typeof value === "number" ? (
        <p
          className={cn(
            "text-nl-700 dark:text-nd-100 font-medium",
            valueClassname,
          )}
        >
          {" "}
          {isCurrency ? formatCurrencyINR(Number(value)) : value}{" "}
        </p>
      ) : (
        value
      )}
    </div>
  );
};
