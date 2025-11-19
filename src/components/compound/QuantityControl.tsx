import { cn } from "@/utils/helpers";
import Icon from "../base/Icon";

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
        <span className="text-base-3 dark:text-base-2 text-sm">Quantity:</span>
      )}
      <Icon
        name={"Minus"}
        size={size}
        onClick={(e) => onDecrement(e)}
        className="text-base-3 dark:text-base-2 hover:bg-neutral-content dark:hover:bg-base-3"
      />
      <span
        className={cn(
          "text-neutral dark:text-neutral-content min-w-8 text-center font-semibold",
          size === "xs" && "min-w-3 text-sm",
          size === "sm" && "min-w-3 text-sm",
          size === "md" && "min-w-3 text-base",
          size === "lg" && "min-w-3 text-lg",
        )}
      >
        {quantity}
      </span>
      <Icon
        name={"Plus"}
        size={size}
        onClick={(e) => { if(!isMaxReached) onIncrement(e)}}
        className={cn(
          "text-base-content dark:text-base-2 hover:bg-neutral-content dark:hover:bg-base-3",
          "disabled:cursor-not-allowed disabled:opacity-50",
          isMaxReached ? "cursor-not-allowed text-base-3" : ""
        )}
      />
    </div>
  );
};

export default QuantityControl;
