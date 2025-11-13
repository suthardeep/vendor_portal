import {
  Select,
  type CustomSelectProps,
  type SelectOption,
} from "@/components/base/Select";
import { StoreTypeEnum } from "@/features/category/types";

type StoreTypeSelectProps = Omit<CustomSelectProps, "options" | "value"> & {
  value: StoreTypeEnum;
};

const StoreTypeSelect: React.FC<StoreTypeSelectProps> = (props) => {
  const { value, ...rest } = props;
  const selected = storeTypeOptions.find((e) => e.value === value);
  return <Select options={storeTypeOptions} value={selected} {...rest} />;
};

export const storeTypeOptions: SelectOption<StoreTypeEnum>[] = [
  {
    label: "Restaurant",
    value: StoreTypeEnum.restaurant,
  },
  {
    label: "Super Market",
    value: StoreTypeEnum.super_market,
  },
];

export default StoreTypeSelect;
