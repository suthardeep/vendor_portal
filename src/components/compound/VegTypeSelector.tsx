import Label from "@/components/base/Label";
import type { SelectOption } from "@/components/base/Select";
import { RestaurantProductTypeEnum } from "@/features/stores/all-stores/menu/types";
import { cn } from "@/utils/helpers";

const VegTypeSelector = (props: VegTypeSelectorProps) => {
  const { value, onChange, label = "Food type", disabled = false } = props;

  return (
    <div className="w-full">
      <Label>{label}</Label>
      <div className="mt-1 flex items-center gap-2">
        {TYPES.map((type) => {
          const isSelected = value === type.value;
          const isDisabled = disabled;

          const renderIcon = () => {
            const baseClass = isSelected
              ? symbolColorMap[type.value]
              : "bg-nl-500 dark:bg-nd-200";

            if (type.value === RestaurantProductTypeEnum.veg) {
              return <div className={cn("h-2 w-2 rounded-full", baseClass)} />;
            }

            if (type.value === RestaurantProductTypeEnum.egg) {
              return (
                <div
                  style={{
                    width: "13px",
                    height: "11px",
                    clipPath: "ellipse(35% 50% at 50% 50%)",
                  }}
                  className={cn(baseClass)}
                />
              );
            }

            return (
              <div
                style={{
                  width: "12px",
                  height: "10px",
                  clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                }}
                className={cn(baseClass)}
              />
            );
          };

          return (
            <div
              key={type.value}
              onClick={() => !isDisabled && onChange(type.value)}
              className={cn(
                "flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1.5 transition",
                isSelected
                  ? selectedBg[type.value]
                  : "bg-nl-50/50 hover:bg-nl-50 hover:dark:bg-nd-600 dark:bg-nd-700",
                isDisabled && "cursor-not-allowed opacity-60",
              )}
            >
              {renderIcon()}
              <span
                className={cn(
                  isSelected
                    ? textColorMap[type.value]
                    : "text-nl-600 dark:text-nd-200",
                  isSelected ? "font-semibold" : "font-normal",
                )}
              >
                {type.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VegTypeSelector;

type VegTypeSelectorProps = {
  value: RestaurantProductTypeEnum;
  onChange: (val: RestaurantProductTypeEnum) => void;
  label?: string;
  disabled?: boolean;
};

const TYPES: SelectOption<RestaurantProductTypeEnum>[] = [
  { label: "Veg", value: RestaurantProductTypeEnum.veg },
  { label: "Non-veg", value: RestaurantProductTypeEnum.nonVeg },
  { label: "Egg", value: RestaurantProductTypeEnum.egg },
];

const selectedBg = {
  [RestaurantProductTypeEnum.veg]: "bg-green-100 dark:bg-green-950",
  [RestaurantProductTypeEnum.nonVeg]: "bg-red-100 dark:bg-red-950",
  [RestaurantProductTypeEnum.egg]: "bg-yellow-100 dark:bg-yellow-950",
};

const textColorMap = {
  [RestaurantProductTypeEnum.nonVeg]: "text-red-800 dark:text-red-300",
  [RestaurantProductTypeEnum.veg]: "text-green-800 dark:text-green-500",
  [RestaurantProductTypeEnum.egg]: "text-yellow-800 dark:text-yellow-500",
};

const symbolColorMap = {
  [RestaurantProductTypeEnum.nonVeg]: "bg-red-800 dark:bg-red-300",
  [RestaurantProductTypeEnum.veg]: "bg-green-700 dark:bg-green-500",
  [RestaurantProductTypeEnum.egg]: "bg-yellow-800 dark:bg-yellow-500",
};
