import { cn, formatCurrencyINR } from "@/utils/helpers";

interface CurrencyDisplayProps {
  amount: number;
  className?: string;
  strikeThroughPrice?: number;
  strikeThroughClassName?: string;
  wrapperClassname?: string;
  isLoading?: boolean;
}

const CurrencyDisplay: React.FC<CurrencyDisplayProps> = (props) => {
  const {
    amount,
    className,
    strikeThroughPrice,
    strikeThroughClassName,
    wrapperClassname,
    isLoading = false,
  } = props;

  if (isLoading) {
    return (
      <div className={cn("flex items-center gap-1", wrapperClassname)}>
        <div className="shimmer h-5 w-20 rounded-lg" />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-1", wrapperClassname)}>
      {" "}
      <span className={cn(className)}> {formatCurrencyINR(amount)} </span>
      {strikeThroughPrice !== undefined && strikeThroughPrice > amount && (
        <span
          className={cn(
            className,
            "font-normal line-through opacity-70",
            strikeThroughClassName,
          )}
        >
          {" "}
          {formatCurrencyINR(strikeThroughPrice)}{" "}
        </span>
      )}
    </div>
  );
};

export default CurrencyDisplay;
