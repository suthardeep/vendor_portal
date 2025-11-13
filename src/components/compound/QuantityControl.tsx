import { IconButton } from "@/components/base/IconButton";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/utils/helpers";

interface QuantityControlProps {
  quantity: number;
  onIncrement: ((e: React.MouseEvent) => void) | (() => void);
  onDecrement: ((e: React.MouseEvent) => void) | (() => void);
  maxQuantity?: number;
  size?: "xs" | "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const QuantityControl: React.FC<QuantityControlProps> = (props) => {
  const {
    quantity,
    onIncrement,
    onDecrement,
    maxQuantity = 5,
    size = "sm",
    showLabel = false,
    className,
  } = props;

  const isMaxReached = quantity >= maxQuantity;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showLabel && (
        <span className="text-nl-600 dark:text-nd-300 text-sm">Quantity:</span>
      )}
      <IconButton
        icon={Minus}
        size={size}
        onClick={(e) => onDecrement(e)}
        className="text-nl-600 dark:text-nd-300 hover:bg-nl-100 dark:hover:bg-nd-700"
      />
      <span
        className={cn(
          "text-nl-900 dark:text-nd-50 min-w-8 text-center font-semibold",
          size === "xs" && "min-w-3 text-sm",
          size === "sm" && "min-w-3 text-sm",
          size === "md" && "min-w-3 text-base",
          size === "lg" && "min-w-3 text-lg",
        )}
      >
        {quantity}
      </span>
      <IconButton
        icon={Plus}
        size={size}
        onClick={(e) => onIncrement(e)}
        disabled={isMaxReached}
        className={cn(
          "text-nl-600 dark:text-nd-300 hover:bg-nl-100 dark:hover:bg-nd-700",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
      />
    </div>
  );
};

export default QuantityControl;
