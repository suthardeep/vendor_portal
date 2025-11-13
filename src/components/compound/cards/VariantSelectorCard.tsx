import Checkbox from "@/components/base/Checkbox";
import Radio from "@/components/common-form-fields/Radio";
import { cn } from "@/utils/helpers";

interface VariantSelectorCardProps {
  children: React.ReactNode;
  onClick: () => void;
  isSelected: boolean;
  className?: string;
  disabled?: boolean;
  disabledReason?: string;
  showIndicator?: boolean;
  indicatorType?: "radio" | "checkbox";
}

const VariantSelectorCard: React.FC<VariantSelectorCardProps> = (props) => {
  const {
    children,
    isSelected,
    onClick,
    className,
    disabled = false,
    disabledReason,
    showIndicator = true,
    indicatorType = "radio",
  } = props;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full rounded-xl border-2 px-4 py-2.5 text-left transition-all duration-300",
        isSelected
          ? "border-pl-600 dark:border-pd-500 bg-pl-50 dark:bg-pd-700/10"
          : "border-nl-200 dark:border-nd-600 hover:border-nl-300 dark:hover:border-nd-500 dark:bg-nd-800 bg-white",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          {children}
          {/* Show disabled reason */}
          {disabled && disabledReason && (
            <p className="text-dl-500 dark:text-dd-400 mt-2 text-xs">
              {disabledReason}
            </p>
          )}
        </div>

        {/* Selection indicator */}
        {showIndicator && (
          <>
            {indicatorType === "radio" ? (
              <Radio checked={isSelected} size="sm" />
            ) : (
              <Checkbox checked={isSelected} size="sm" />
            )}
          </>
        )}
      </div>
    </button>
  );
};

export default VariantSelectorCard;
