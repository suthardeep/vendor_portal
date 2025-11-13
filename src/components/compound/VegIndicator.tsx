import { RestaurantProductTypeEnum } from "@/features/stores/all-stores/menu/types";
import { cn } from "@/utils/helpers";

const VegIndicator: React.FC<VegIndicatorProps> = (props) => {
  const { type, variant = "with-text" } = props;

  const isSymbolOnly = variant === "symbol";

  return (
    <div
      className={cn(
        bgColorMap[type],
        isSymbolOnly ? "rounded-md p-1.5" : "rounded-lg px-2 py-1.5",
        "fall block w-fit gap-x-1",
      )}
    >
      {type === RestaurantProductTypeEnum.veg ? (
        <div className={cn("h-2 w-2 rounded-full", symbolColorMap[type])} />
      ) : type === RestaurantProductTypeEnum.egg ? (
        <div
          style={{
            width: "13px",
            height: "11px",
            clipPath: "ellipse(35% 50% at 50% 50%)",
          }}
          className={cn(symbolColorMap[type])}
        />
      ) : (
        <div
          style={{
            width: "12px",
            height: "10px",
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          }}
          className={cn(symbolColorMap[type])}
        />
      )}

      {variant === "with-text" && (
        <span className={cn("font-medium", textColorMap[type])}>
          {textMap[type]}
        </span>
      )}
    </div>
  );
};

export default VegIndicator;

interface VegIndicatorProps {
  type: RestaurantProductTypeEnum;
  variant?: "with-text" | "symbol";
}

const bgColorMap = {
  [RestaurantProductTypeEnum.nonVeg]: "bg-red-100 dark:bg-red-950",
  [RestaurantProductTypeEnum.veg]: "bg-green-200/60 dark:bg-green-950",
  [RestaurantProductTypeEnum.egg]: "bg-yellow-100 dark:bg-yellow-950",
};

const symbolColorMap = {
  [RestaurantProductTypeEnum.nonVeg]: "bg-red-800 dark:bg-red-300",
  [RestaurantProductTypeEnum.veg]: "bg-green-700 dark:bg-green-500",
  [RestaurantProductTypeEnum.egg]: "bg-yellow-800 dark:bg-yellow-500",
};

const textColorMap = {
  [RestaurantProductTypeEnum.nonVeg]: "text-red-800 dark:text-red-300",
  [RestaurantProductTypeEnum.veg]: "text-green-800 dark:text-green-500",
  [RestaurantProductTypeEnum.egg]: "text-yellow-800 dark:text-yellow-500",
};

const textMap = {
  [RestaurantProductTypeEnum.nonVeg]: "Non-Veg",
  [RestaurantProductTypeEnum.veg]: "Veg",
  [RestaurantProductTypeEnum.egg]: "Egg",
};
