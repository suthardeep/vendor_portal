import { cn } from "@/utils/helpers";
import * as LucideIcons from "lucide-react";
import type { ReactNode } from "react";

export interface FallbackViewProps {
  title: string;
  icon?: keyof typeof LucideIcons;
  footer?: ReactNode;
  classname?: string;
}

const FallbackView: React.FC<FallbackViewProps> = (props) => {
  const { title, footer, icon, classname } = props;

  const Icon = icon ? (LucideIcons[icon] as LucideIcons.LucideIcon) : null;

  return (
    <div
      className={cn(
        "fall bg-neutral-content dark:bg-base-3 flex w-full flex-col gap-4 rounded-xl p-8",
        classname,
      )}
    >
      {Icon && <Icon size={48} strokeWidth={1.5} />}
      <p className="text-base-3 dark:text-neutral-content text-center">
        {title || "No data found"}
      </p>
      {footer && footer}
    </div>
  );
};

export default FallbackView;
