import { cn, formatCurrencyINR } from "@/utils/helpers";
import type { ReactNode } from "react";
import * as LucideIcons from "lucide-react";

interface InfoItemProps {
  label: string;
  value: ReactNode;
  classname?: string;
  trailingLabel?: ReactNode;
  isCurrency?: boolean;
  direction?: "vertical" | "horizontal";
  labelClassName?: string;
  valueClassName?: string;
  icon?: keyof typeof LucideIcons;
}

const InfoItem: React.FC<InfoItemProps> = (props) => {
  const {
    label,
    value,
    classname,
    trailingLabel,
    isCurrency = false,
    direction = "vertical",
    icon,
    labelClassName,
    valueClassName,
  } = props;

  const Icon = icon ? (LucideIcons[icon] as LucideIcons.LucideIcon) : null;

  return (
    <div
      className={cn(
        "flex gap-3",
        direction === "vertical"
          ? "flex-row items-start"
          : "flex-row items-center",
        classname,
      )}
    >
      {Icon && (
        <Icon
          className="text-base-3 dark:text-base-2 mt-0.5 size-5"
          strokeWidth={1.5}
        />
      )}
      <div className="flex flex-1 flex-col gap-y-1.5">
        <div className="flex items-center justify-between">
          <p className={cn("text-base-3 dark:text-base-2", labelClassName)}>
            {" "}
            {label}{" "}
          </p>
          {trailingLabel && trailingLabel}
        </div>
        {typeof value === "string" || typeof value === "number" ? (
          <p
            className={cn(
              "text-base-3 dark:text-neutral-content font-medium",
              valueClassName,
            )}
          >
            {isCurrency ? formatCurrencyINR(Number(value)) : value}{" "}
          </p>
        ) : (
          value
        )}
      </div>
    </div>
  );
};

export default InfoItem;
