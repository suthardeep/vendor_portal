import { cn } from "@/utils/helpers";
import type { ReactNode } from "react";
import Icon from "../base/Icon";

interface UploadImagePlaceholderProps {
  onClick: () => void;
  customIcon?: ReactNode;
  classname?: string;
  placeholder?: string;
}

const UploadImagePlaceholder: React.FC<UploadImagePlaceholderProps> = (
  props,
) => {
  const { onClick, classname, customIcon, placeholder = "" } = props;

  return (
    <div
      onClick={onClick}
      className={cn(
        "border-neutral-content dark:border-base-3 hover:bg-neutral-content/50 dark:hover:bg-base-3 flex h-32 w-full cursor-pointer flex-col items-center justify-center gap-y-2 rounded-lg border-2 border-dashed transition-all",
        classname,
      )}
    >
      {customIcon ? (
        customIcon
      ) : (
        <Icon name="ImageIcon" className="text-base-3 dark:text-base-2" />
      )}
      {placeholder && (
        <p className="text-base-3 dark:text-base-2 max-w-3/4 text-center">
          {placeholder || ""}
        </p>
      )}
    </div>
  );
};

export default UploadImagePlaceholder;
