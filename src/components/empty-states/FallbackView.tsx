import { cn } from "@/utils/helpers";
import type { ReactNode } from "react";

export interface FallbackViewProps {
  title: string;
  icon?: ReactNode;
  footer?: ReactNode;
  classname?: string;
}

const FallbackView: React.FC<FallbackViewProps> = (props) => {
  const { title, footer, icon, classname } = props;

  const Icon = icon ? icon : null;

  return (
    <div
      className={cn(
        "fall bg-neutral-content dark:bg-base-3 flex w-full flex-col gap-4 rounded-xl p-8",
        classname,
      )}
    >
      {/* {Icon && <Icon size={48} strokeWidth={1.5} />} */}
      <p className="text-base-3 dark:text-neutral-content text-center">
        {title || "No data found"}
      </p>
      {footer && footer}
    </div>
  );
};

export default FallbackView;
